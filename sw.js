// ============================
// BEACHGIRL.PICS SERVICE WORKER v1.3.1 - FIXED
// Corregido error de Response undefined
// ============================

const CACHE_VERSION = '1.3.1';
const CACHE_NAME = `beachgirl-v${CACHE_VERSION}`;
const STATIC_CACHE = `beachgirl-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = `beachgirl-dynamic-v${CACHE_VERSION}`;
const IMAGE_CACHE = `beachgirl-images-v${CACHE_VERSION}`;

// Archivos críticos para cachear
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/main.html',
    '/main-script.js',
    '/seo-enhancements.js',
    '/manifest.json',
    
    // Imágenes críticas para SEO (ahora .webp)
    '/full/bikini.webp',
    '/full/bikbanner.webp',
    '/full/bikbanner2.webp',
    '/full/backbikini.webp',
    '/full/bikini3.webp',
    '/full/bikini5.webp'
];

// External scripts to cache
const EXTERNAL_SCRIPTS = [
    'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
];

// URLs que no deben cachearse
const EXCLUDED_URLS = [
    '/uncensored/',
    '/uncensored-videos/',
    '/admin',
    'chrome-extension://',
    'extension://',
    'paypal.com',
    'paypalobjects.com'
];

// ============================
// INSTALACIÓN DEL SERVICE WORKER
// ============================

self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Installing version', CACHE_VERSION);
    
    event.waitUntil(
        Promise.all([
            // Cache static assets
            caches.open(STATIC_CACHE).then(cache => {
                console.log('📦 Service Worker: Caching static assets...');
                return Promise.all(
                    STATIC_ASSETS.map(url => {
                        return cache.add(url).catch(err => {
                            console.warn(`Failed to cache ${url}:`, err);
                        });
                    })
                );
            }),
            // Cache external scripts
            caches.open(STATIC_CACHE).then(cache => {
                return Promise.all(
                    EXTERNAL_SCRIPTS.map(url => {
                        return fetch(url)
                            .then(response => {
                                if (response.ok) {
                                    return cache.put(url, response);
                                }
                            })
                            .catch(err => {
                                console.warn(`Failed to cache external script ${url}:`, err);
                            });
                    })
                );
            })
        ]).then(() => {
            console.log('✅ Service Worker: Installation complete');
            return self.skipWaiting();
        }).catch(error => {
            console.error('❌ Service Worker: Installation failed', error);
        })
    );
});

// ============================
// ACTIVACIÓN DEL SERVICE WORKER
// ============================

self.addEventListener('activate', event => {
    console.log('🚀 Service Worker: Activating version', CACHE_VERSION);
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            // Limpiar caches antiguos
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheName.includes(CACHE_VERSION)) {
                        console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker: Activation complete');
            return self.clients.claim();
        })
    );
});

// ============================
// ESTRATEGIAS DE CACHE - FIXED
// ============================

// Estrategia: Cache First con timeout - FIXED
async function cacheFirstWithTimeout(request, timeout = 3000) {
    try {
        const cachePromise = caches.match(request);
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Cache timeout')), timeout)
        );
        
        const cached = await Promise.race([cachePromise, timeoutPromise]);
        if (cached) {
            return cached;
        }
    } catch (error) {
        console.log('Cache timeout, fetching from network');
    }
    
    try {
        const response = await fetch(request);
        if (response && response.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, response.clone());
            return response;
        }
        // Si la respuesta no es válida, intentar desde cache
        const fallbackCache = await caches.match(request);
        if (fallbackCache) return fallbackCache;
        
        // Último recurso: crear respuesta de error
        return new Response('Resource not found', {
            status: 404,
            statusText: 'Not Found'
        });
    } catch (error) {
        console.error('Network fetch failed:', error);
        const fallbackCache = await caches.match(request);
        if (fallbackCache) return fallbackCache;
        
        return new Response('Network error', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Estrategia: Network First con fallback - FIXED
async function networkFirstWithFallback(request) {
    try {
        const response = await fetch(request);
        if (response && response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response.clone());
            return response;
        }
        throw new Error('Network response not ok');
    } catch (error) {
        console.log('Network failed, trying cache:', error.message);
        const cached = await caches.match(request);
        if (cached) {
            return cached;
        }
        
        // Fallback para páginas HTML
        if (request.headers.get('accept')?.includes('text/html')) {
            const indexFallback = await caches.match('/index.html');
            if (indexFallback) return indexFallback;
        }
        
        // Fallback para imágenes
        if (request.headers.get('accept')?.includes('image/')) {
            return new Response('', {
                status: 404,
                statusText: 'Image not found'
            });
        }
        
        // Error genérico
        return new Response('Resource not available', {
            status: 404,
            statusText: 'Not Found'
        });
    }
}

// Estrategia: Stale While Revalidate - FIXED
async function staleWhileRevalidate(request) {
    const cached = await caches.match(request);
    
    // Fetch en background para actualizar cache
    const fetchPromise = fetch(request).then(response => {
        if (response && response.ok) {
            caches.open(IMAGE_CACHE).then(cache => {
                cache.put(request, response.clone());
            });
        }
        return response;
    }).catch(error => {
        console.log('Background fetch failed:', error);
        return cached; // Devolver cached si fetch falla
    });
    
    // Devolver cached inmediatamente si existe, sino esperar al fetch
    if (cached) {
        // Ejecutar fetch en background
        fetchPromise;
        return cached;
    }
    
    // Si no hay cache, esperar al fetch
    try {
        const response = await fetchPromise;
        if (response && response.ok) {
            return response;
        }
        throw new Error('Fetch failed');
    } catch (error) {
        return new Response('Image not available', {
            status: 404,
            statusText: 'Not Found',
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

// ============================
// INTERCEPTAR REQUESTS - FIXED
// ============================

self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Ignorar URLs excluidas
    if (EXCLUDED_URLS.some(excludedUrl => url.href.includes(excludedUrl))) {
        return;
    }
    
    // Ignorar requests que no sean GET
    if (request.method !== 'GET') {
        return;
    }
    
    // Ignorar chrome-extension y extension requests
    if (url.protocol === 'chrome-extension:' || url.protocol === 'extension:') {
        return;
    }
    
    // FIXED: Asegurar que siempre se retorna una Response válida
    event.respondWith(handleFetch(request, url));
});

async function handleFetch(request, url) {
    try {
        // Para HTML - Network First
        if (request.headers.get('accept')?.includes('text/html')) {
            return await networkFirstWithFallback(request);
        }
        
        // Para imágenes - Stale While Revalidate
        if (request.headers.get('accept')?.includes('image/') || 
            url.pathname.includes('/full/') ||
            url.pathname.includes('/uncensored/') ||
            url.pathname.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) {
            return await staleWhileRevalidate(request);
        }
        
        // Para JavaScript/CSS - Cache First con timeout
        if (url.pathname.includes('.js') || 
            url.pathname.includes('.css') ||
            url.hostname === 'cdn.jsdelivr.net') {
            return await cacheFirstWithTimeout(request);
        }
        
        // Para PayPal y APIs externas - Network Only
        if (url.hostname.includes('paypal') || 
            url.hostname !== self.location.hostname) {
            return await fetch(request);
        }
        
        // Default: Network First
        return await networkFirstWithFallback(request);
        
    } catch (error) {
        console.error('🚨 Service Worker: Fetch error for', url.href, error);
        
        // FIXED: Siempre retornar una Response válida
        return new Response('Service Worker error occurred', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

// ============================
// MENSAJES DEL CLIENTE
// ============================

self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({
            version: CACHE_VERSION,
            caches: {
                static: STATIC_CACHE,
                dynamic: DYNAMIC_CACHE,
                images: IMAGE_CACHE
            }
        });
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
        }).then(() => {
            if (event.ports[0]) {
                event.ports[0].postMessage({ success: true });
            }
        });
    }
});

// ============================
// SINCRONIZACIÓN EN BACKGROUND
// ============================

self.addEventListener('sync', event => {
    console.log('📡 Background sync triggered:', event.tag);
    
    if (event.tag === 'content-preload') {
        event.waitUntil(preloadContent());
    }
});

// Función para precargar contenido
async function preloadContent() {
    try {
        console.log('🔄 Service Worker: Preloading content...');
        
        const imagesToPreload = [
            '/full/bikini.webp',
            '/full/bikbanner.webp',
            '/full/bikini3.webp'
        ];
        
        const cache = await caches.open(IMAGE_CACHE);
        
        await Promise.all(
            imagesToPreload.map(async url => {
                try {
                    const response = await fetch(url);
                    if (response && response.ok) {
                        await cache.put(url, response);
                    }
                } catch (err) {
                    console.warn(`Failed to preload ${url}:`, err);
                }
            })
        );
        
        console.log('✅ Service Worker: Content preloaded');
    } catch (error) {
        console.error('❌ Service Worker: Preload failed', error);
    }
}

// ============================
// NOTIFICACIONES PUSH (Preparado para futuro)
// ============================

self.addEventListener('push', event => {
    if (!event.data) return;
    
    try {
        const data = event.data.json();
        
        const options = {
            body: data.body || 'Nuevo contenido disponible en BeachGirl.pics',
            icon: '/full/bikini.webp',
            badge: '/full/bikini.webp',
            image: data.image || '/full/bikbanner.webp',
            tag: 'beach-update',
            requireInteraction: false,
            data: {
                url: data.url || '/main.html'
            },
            actions: [
                {
                    action: 'view',
                    title: 'Ver galería',
                    icon: '/full/bikini.webp'
                },
                {
                    action: 'close',
                    title: 'Cerrar'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(
                data.title || 'BeachGirl.pics - Nuevo contenido',
                options
            )
        );
    } catch (error) {
        console.error('Push notification error:', error);
    }
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'view' || !event.action) {
        const urlToOpen = event.notification.data?.url || '/main.html';
        event.waitUntil(
            clients.openWindow(`https://www.beachgirl.pics${urlToOpen}`)
        );
    }
});

console.log(`🌊 BeachGirl.pics Service Worker v${CACHE_VERSION} loaded successfully`);
