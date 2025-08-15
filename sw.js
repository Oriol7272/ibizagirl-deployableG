// ============================
// BEACHGIRL.PICS SERVICE WORKER v1.4.0 - ULTRA CLEAN
// Garantiza Response válida SIEMPRE
// ============================

const CACHE_VERSION = '1.4.0';
const STATIC_CACHE = 'beachgirl-static-v' + CACHE_VERSION;
const DYNAMIC_CACHE = 'beachgirl-dynamic-v' + CACHE_VERSION;
const IMAGE_CACHE = 'beachgirl-images-v' + CACHE_VERSION;

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/main.html',
    '/main-script.js',
    '/content-data.js',
    '/styles.css',
    '/seo-enhancements.js',
    '/manifest.json'
];

const EXCLUDED_URLS = [
    'paypal.com',
    'paypalobjects.com',
    'google.com',
    'googletagmanager.com',
    'chrome-extension',
    'extension:'
];

// ============================
// INSTALACIÓN
// ============================

self.addEventListener('install', event => {
    console.log('🔧 SW Installing v' + CACHE_VERSION);
    
    event.waitUntil(
        caches.open(STATIC_CACHE).then(cache => {
            return cache.addAll(STATIC_ASSETS).catch(err => {
                console.warn('Cache addAll failed:', err);
                // Intentar cachear individualmente
                return Promise.all(
                    STATIC_ASSETS.map(url => 
                        cache.add(url).catch(e => console.warn('Failed to cache:', url, e))
                    )
                );
            });
        }).then(() => {
            console.log('✅ SW Installation complete');
            return self.skipWaiting();
        }).catch(error => {
            console.error('❌ SW Installation failed:', error);
        })
    );
});

// ============================
// ACTIVACIÓN
// ============================

self.addEventListener('activate', event => {
    console.log('🚀 SW Activating v' + CACHE_VERSION);
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheName.includes(CACHE_VERSION)) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ SW Activation complete');
            return self.clients.claim();
        })
    );
});

// ============================
// FUNCIONES DE CACHE - ULTRA SEGURAS
// ============================

async function safeCacheFirst(request) {
    try {
        // Intentar cache primero
        const cached = await caches.match(request);
        if (cached) {
            return cached;
        }
        
        // Si no hay cache, fetch
        const response = await fetch(request);
        if (response && response.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, response.clone()).catch(e => 
                console.warn('Cache put failed:', e)
            );
            return response;
        }
        
        // Si fetch falla, crear respuesta de error
        return createErrorResponse('Resource not found', 404);
        
    } catch (error) {
        console.warn('safeCacheFirst error:', error);
        // Intentar cache como último recurso
        const cached = await caches.match(request);
        if (cached) return cached;
        
        return createErrorResponse('Service unavailable', 503);
    }
}

async function safeNetworkFirst(request) {
    try {
        // Intentar network primero
        const response = await fetch(request);
        if (response && response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response.clone()).catch(e => 
                console.warn('Cache put failed:', e)
            );
            return response;
        }
        
        // Si network falla, intentar cache
        const cached = await caches.match(request);
        if (cached) return cached;
        
        // Si ambos fallan, error
        return createErrorResponse('Network error', 503);
        
    } catch (error) {
        console.warn('safeNetworkFirst error:', error);
        // Fallback a cache
        const cached = await caches.match(request);
        if (cached) return cached;
        
        return createErrorResponse('Service unavailable', 503);
    }
}

async function safeImageCache(request) {
    try {
        // Para imágenes - cache first con update en background
        const cached = await caches.match(request);
        
        if (cached) {
            // Update en background sin esperar
            fetch(request).then(response => {
                if (response && response.ok) {
                    caches.open(IMAGE_CACHE).then(cache => {
                        cache.put(request, response).catch(e => 
                            console.warn('Background cache update failed:', e)
                        );
                    });
                }
            }).catch(e => console.warn('Background fetch failed:', e));
            
            return cached;
        }
        
        // Si no hay cache, fetch
        const response = await fetch(request);
        if (response && response.ok) {
            const cache = await caches.open(IMAGE_CACHE);
            cache.put(request, response.clone()).catch(e => 
                console.warn('Cache put failed:', e)
            );
            return response;
        }
        
        return createErrorResponse('Image not found', 404);
        
    } catch (error) {
        console.warn('safeImageCache error:', error);
        return createErrorResponse('Image unavailable', 503);
    }
}

function createErrorResponse(message, status) {
    return new Response(message, {
        status: status,
        statusText: status === 404 ? 'Not Found' : 'Service Unavailable',
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-cache'
        }
    });
}

// ============================
// INTERCEPTAR REQUESTS - ULTRA SEGURO
// ============================

self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Ignorar requests que no sean GET
    if (request.method !== 'GET') {
        return;
    }
    
    // Ignorar URLs excluidas
    if (EXCLUDED_URLS.some(excluded => url.href.includes(excluded))) {
        return;
    }
    
    // GARANTIZAR que siempre se retorna una Response
    event.respondWith(handleFetchSafely(request, url));
});

async function handleFetchSafely(request, url) {
    try {
        // Determinar estrategia basada en el tipo de request
        if (url.pathname.includes('.html') || 
            request.headers.get('accept')?.includes('text/html')) {
            return await safeNetworkFirst(request);
        }
        
        if (url.pathname.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i) ||
            url.pathname.includes('/full/') ||
            url.pathname.includes('/uncensored/') ||
            request.headers.get('accept')?.includes('image/')) {
            return await safeImageCache(request);
        }
        
        if (url.pathname.includes('.js') || 
            url.pathname.includes('.css') ||
            url.hostname === 'cdn.jsdelivr.net') {
            return await safeCacheFirst(request);
        }
        
        // Default: network first
        return await safeNetworkFirst(request);
        
    } catch (error) {
        console.error('🚨 handleFetchSafely critical error:', error);
        
        // ÚLTIMO RECURSO: siempre retornar una Response válida
        try {
            const cached = await caches.match(request);
            if (cached) return cached;
        } catch (cacheError) {
            console.error('Cache lookup failed:', cacheError);
        }
        
        // GARANTÍA FINAL: crear response básica
        return new Response('Service Worker Error: ' + error.message, {
            status: 503,
            statusText: 'Service Unavailable',
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-cache'
            }
        });
    }
}

// ============================
// MENSAJES DEL CLIENTE
// ============================

self.addEventListener('message', event => {
    try {
        if (event.data && event.data.type === 'SKIP_WAITING') {
            self.skipWaiting();
        }
        
        if (event.data && event.data.type === 'GET_VERSION') {
            if (event.ports && event.ports[0]) {
                event.ports[0].postMessage({
                    version: CACHE_VERSION,
                    caches: {
                        static: STATIC_CACHE,
                        dynamic: DYNAMIC_CACHE,
                        images: IMAGE_CACHE
                    }
                });
            }
        }
        
        if (event.data && event.data.type === 'CLEAR_CACHE') {
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            }).then(() => {
                if (event.ports && event.ports[0]) {
                    event.ports[0].postMessage({ success: true });
                }
            }).catch(error => {
                console.error('Clear cache failed:', error);
                if (event.ports && event.ports[0]) {
                    event.ports[0].postMessage({ success: false, error: error.message });
                }
            });
        }
    } catch (error) {
        console.error('Message handler error:', error);
    }
});

// ============================
// SINCRONIZACIÓN EN BACKGROUND
// ============================

self.addEventListener('sync', event => {
    console.log('📡 Background sync:', event.tag);
    
    if (event.tag === 'content-preload') {
        event.waitUntil(preloadContent());
    }
});

async function preloadContent() {
    try {
        console.log('🔄 Preloading content...');
        
        const imagesToPreload = [
            '/full/bikini.webp',
            '/full/bikbanner.webp',
            '/full/bikini3.webp'
        ];
        
        const cache = await caches.open(IMAGE_CACHE);
        
        for (const url of imagesToPreload) {
            try {
                const response = await fetch(url);
                if (response && response.ok) {
                    await cache.put(url, response);
                }
            } catch (err) {
                console.warn('Failed to preload:', url, err);
            }
        }
        
        console.log('✅ Content preloaded');
    } catch (error) {
        console.error('❌ Preload failed:', error);
    }
}

// ============================
// NOTIFICACIONES PUSH
// ============================

self.addEventListener('push', event => {
    try {
        if (!event.data) return;
        
        const data = event.data.json();
        
        const options = {
            body: data.body || 'Nuevo contenido disponible',
            icon: '/full/bikini.webp',
            badge: '/full/bikini.webp',
            image: data.image || '/full/bikbanner.webp',
            tag: 'beach-update',
            requireInteraction: false,
            data: {
                url: data.url || '/main.html'
            }
        };
        
        event.waitUntil(
            self.registration.showNotification(
                data.title || 'BeachGirl.pics',
                options
            )
        );
    } catch (error) {
        console.error('Push notification error:', error);
    }
});

self.addEventListener('notificationclick', event => {
    try {
        event.notification.close();
        
        if (event.action === 'view' || !event.action) {
            const urlToOpen = event.notification.data?.url || '/main.html';
            event.waitUntil(
                clients.openWindow('https://www.beachgirl.pics' + urlToOpen)
            );
        }
    } catch (error) {
        console.error('Notification click error:', error);
    }
});

console.log('🌊 BeachGirl.pics SW v' + CACHE_VERSION + ' loaded');
