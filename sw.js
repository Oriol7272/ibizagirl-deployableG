// ============================
// BEACHGIRL.PICS SERVICE WORKER v1.3.0
// PWA + Performance + SEO Optimized
// ============================

const CACHE_VERSION = '1.3.0';
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
    
    // Imágenes críticas para SEO
    '/full/bikini.jpg',
    '/full/bikbanner.jpg',
    '/full/bikbanner2.jpg',
    '/full/backbikini.jpg',
    '/full/bikini3.jpg',
    '/full/bikini5.jpg'
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
};

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
};

// ============================
// ESTRATEGIAS DE CACHE
// ============================

// Estrategia: Cache First con timeout
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
    
    const response = await fetch(request);
    if (response.ok) {
        const cache = await caches.open(STATIC_CACHE);
        cache.put(request, response.clone());
    }
    return response;
}

// Estrategia: Network First con fallback
async function networkFirstWithFallback(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        if (cached) return cached;
        
        return new Response('Offline fallback content', {
            status: 200,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

// Estrategia: Stale While Revalidate
async function staleWhileRevalidate(request) {
    const cached = await caches.match(request);
    const fetchPromise = fetch(request).then(response => {
        if (response.ok) {
            const cache = caches.open(DYNAMIC_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    }).catch(() => cached);
    
    return cached || fetchPromise;
}

// ============================
// FETCH HANDLER
// ============================

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Skip non-HTTP requests
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
    
    // Skip excluded URLs
    if (EXCLUDED_URLS.some(excluded => url.pathname.startsWith(excluded))) {
        return event.respondWith(fetch(event.request));
    }
    
    event.respondWith(
        (async () => {
            // Para imágenes - Stale While Revalidate
            if (event.request.headers.get('accept')?.includes('image/') || 
                url.pathname.includes('/full/') || 
                url.pathname.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) {
                return await staleWhileRevalidate(event.request);
            }
            
            // Para videos - Stale While Revalidate
            if (event.request.headers.get('accept')?.includes('video/') || url.pathname.includes('/uncensored-videos/')) {
                return await staleWhileRevalidate(event.request);
            }
            
            // Para JavaScript/CSS - Cache First con timeout
            if (url.pathname.includes('.js') || 
                url.pathname.includes('.css') ||
                url.hostname === 'cdn.jsdelivr.net') {
                return await cacheFirstWithTimeout(event.request);
            }
            
            // Para PayPal y APIs externas - Network Only
            if (url.hostname.includes('paypal') || 
                url.hostname !== location.hostname) {
                return await fetch(event.request);
            }
            
            // Default: Network First
            return await networkFirstWithFallback(event.request);
        })()
    );
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
            '/full/bikini.jpg',
            '/full/bikbanner.jpg',
            '/full/bikini3.jpg'
        ];
        
        const cache = await caches.open(IMAGE_CACHE);
        
        await Promise.all(
            imagesToPreload.map(async url => {
                try {
                    const response = await fetch(url);
                    if (response.ok) {
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
