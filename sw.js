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
    '/full/0456996c-b56e-42ef-9049-56b1a1ae2646.webp',
    '/full/0Tc8Vtd0mEIvNHZwYGBq.webp',
    '/full/0lySugcO4Pp4pEZKvz9U.webp',
    '/full/0nSaCJQxbVw4BDrhnhHO.webp',
    '/full/13TXvyRVZ7LtvAOx7kme.webp',
    '/full/18VQaczW5kdfdiqUVasH.webp'
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
// ESTRATEGIA DE CACHE
// ============================

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Ignorar peticiones a URLs excluidas
    if (EXCLUDED_URLS.some(excluded => url.pathname.startsWith(excluded) || url.hostname.includes(excluded))) {
        return event.respondWith(fetch(event.request));
    }

    // Network-only para PayPal
    if (url.hostname.includes('paypal')) {
        return event.respondWith(fetch(event.request));
    }

    // Cache-first para assets estáticos
    if (STATIC_ASSETS.includes(url.pathname) || EXTERNAL_SCRIPTS.includes(url.href)) {
        event.respondWith(
            caches.match(event.request).then(response => {
                return response || fetch(event.request).then(fetchResponse => {
                    if (fetchResponse.ok) {
                        caches.open(STATIC_CACHE).then(cache => cache.put(event.request, fetchResponse.clone()));
                    }
                    return fetchResponse;
                });
            })
        );
    } else if (url.pathname.endsWith('.webp') || url.pathname.endsWith('.jpg') || url.pathname.endsWith('.png')) {
        // Stale-while-revalidate para imágenes
        event.respondWith(staleWhileRevalidate(event.request));
    } else if (url.pathname.endsWith('.mp4') || url.pathname.endsWith('.webm')) {
        // Stale-while-revalidate para videos
        event.respondWith(staleWhileRevalidate(event.request));
    } else {
        // Network-first con fallback a cache para otros
        event.respondWith(
            fetch(event.request).then(response => {
                if (response.ok) {
                    caches.open(DYNAMIC_CACHE).then(cache => cache.put(event.request, response.clone()));
                }
                return response;
            }).catch(() => {
                return caches.match(event.request);
            })
        );
    }
});

// Función stale-while-revalidate con fallback mejorado
async function staleWhileRevalidate(request) {
    const cached = await caches.match(request);
    const fetchPromise = fetch(request).then(response => {
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            await cache.put(request, response.clone());
            return response;
        }
        throw new Error('Fetch failed');
    }).catch(() => {
        if (cached) return cached;
        return new Response('Offline - No cache available', { status: 503 });
    });

    return cached ? Promise.race([fetchPromise, Promise.resolve(cached)]) : fetchPromise;
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
            '/full/0456996c-b56e-42ef-9049-56b1a1ae2646.webp',
            '/full/0Tc8Vtd0mEIvNHZwYGBq.webp',
            '/full/0lySugcO4Pp4pEZKvz9U.webp'
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
    if (!event.data) return;
    
    const data = event.data.json();
    
    const options = {
        body: data.body || 'Nuevo contenido disponible en BeachGirl.pics',
        icon: '/full/0456996c-b56e-42ef-9049-56b1a1ae2646.webp',
        badge: '/full/0456996c-b56e-42ef-9049-56b1a1ae2646.webp',
        image: data.image || '/full/0Tc8Vtd0mEIvNHZwYGBq.webp',
        tag: 'beachgirl-update',
        requireInteraction: false,
        data: {
            url: data.url || '/main.html'
        },
        actions: [
            {
                action: 'view',
                title: 'Ver galería',
                icon: '/full/0456996c-b56e-42ef-9049-56b1a1ae2646.webp'
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
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'view' || !event.action) {
        const urlToOpen = event.notification.data?.url || '/main.html';
        event.waitUntil(
            clients.openWindow(`https://beachgirl.pics${urlToOpen}`)
        );
    }
});

console.log(`🌊 BeachGirl.pics Service Worker v${CACHE_VERSION} loaded successfully`);
