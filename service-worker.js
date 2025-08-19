/**
 * service-worker.js
 * Service Worker para Progressive Web App
 * IbizaGirl.pics - Versión 2.0.0
 */

const CACHE_NAME = 'ibizagirl-v2.0.0';
const DYNAMIC_CACHE = 'ibizagirl-dynamic-v2.0.0';
const IMAGE_CACHE = 'ibizagirl-images-v2.0.0';
const VIDEO_CACHE = 'ibizagirl-videos-v2.0.0';

// Recursos esenciales para funcionamiento offline
const CORE_ASSETS = [
    '/',
    '/index.html',
    '/main.html',
    '/styles.css',
    '/main-script.js',
    '/manifest.json',
    '/content-data1.js',
    '/content-data2.js',
    '/content-data3.js',
    '/content-data4.js',
    '/content-data5.js',
    '/content-data6.js',
    '/content-data-integration.js'
];

// Patrones de archivos
const FILE_PATTERNS = {
    images: /\.(webp|jpg|jpeg|png|gif|svg)$/i,
    videos: /\.(mp4|webm|mov)$/i,
    styles: /\.(css)$/i,
    scripts: /\.(js)$/i,
    fonts: /\.(woff|woff2|ttf|otf)$/i
};

// Límites de caché
const CACHE_LIMITS = {
    images: 200,  // 200 fotos diarias
    videos: 40,   // 40 videos diarios
    dynamic: 50
};

// URLs que no deben cachearse
const NO_CACHE_PATTERNS = [
    /\/api\//,
    /\/admin/,
    /paypal/,
    /juicyads/,
    /exoclick/,
    /\.json$/,
    /socket\.io/
];

// ============================
// INSTALACIÓN
// ============================
self.addEventListener('install', event => {
    console.log('[SW] Instalando Service Worker v2.0.0...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Cacheando recursos esenciales...');
                return Promise.allSettled(
                    CORE_ASSETS.map(url => 
                        cache.add(url)
                            .catch(err => console.warn(`[SW] Error cacheando ${url}:`, err))
                    )
                );
            })
            .then(() => {
                console.log('[SW] ✅ Instalación completada');
                return self.skipWaiting();
            })
    );
});

// ============================
// ACTIVACIÓN
// ============================
self.addEventListener('activate', event => {
    console.log('[SW] Activando Service Worker v2.0.0...');
    
    const cacheWhitelist = [CACHE_NAME, DYNAMIC_CACHE, IMAGE_CACHE, VIDEO_CACHE];
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (!cacheWhitelist.includes(cacheName)) {
                            console.log('[SW] Eliminando caché antiguo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[SW] ✅ Activación completada');
                return self.clients.claim();
            })
    );
});

// ============================
// FETCH - ESTRATEGIA INTELIGENTE
// ============================
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Ignorar peticiones que no sean GET
    if (request.method !== 'GET') return;
    
    // Ignorar URLs externas (PayPal, ads, etc.)
    if (!url.origin.includes('ibizagirl') && 
        !url.origin.includes('localhost') && 
        !url.origin.includes('127.0.0.1')) {
        return;
    }
    
    // Verificar si debe evitarse el caché
    const shouldAvoidCache = NO_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
    if (shouldAvoidCache) {
        event.respondWith(fetch(request));
        return;
    }
    
    // Determinar estrategia según tipo de archivo
    if (FILE_PATTERNS.images.test(url.pathname)) {
        event.respondWith(handleImageRequest(request));
    } else if (FILE_PATTERNS.videos.test(url.pathname)) {
        event.respondWith(handleVideoRequest(request));
    } else if (FILE_PATTERNS.scripts.test(url.pathname) || FILE_PATTERNS.styles.test(url.pathname)) {
        event.respondWith(handleStaticAsset(request));
    } else {
        event.respondWith(handleDynamicRequest(request));
    }
});

// ============================
// ESTRATEGIAS DE CACHÉ
// ============================

// Manejar imágenes - Cache First con actualización en background
async function handleImageRequest(request) {
    const cache = await caches.open(IMAGE_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
        // Actualizar en background
        fetch(request).then(response => {
            if (response && response.status === 200) {
                cache.put(request, response.clone());
                // Limpiar caché si excede el límite
                trimCache(IMAGE_CACHE, CACHE_LIMITS.images);
            }
        }).catch(() => {});
        
        return cached;
    }
    
    try {
        const response = await fetch(request);
        if (response && response.status === 200) {
            cache.put(request, response.clone());
            trimCache(IMAGE_CACHE, CACHE_LIMITS.images);
        }
        return response;
    } catch (error) {
        // Retornar imagen placeholder si existe
        return caches.match('/full/placeholder.webp').catch(() => 
            new Response('Image not available', { status: 404 })
        );
    }
}

// Manejar videos - Network First con fallback a caché
async function handleVideoRequest(request) {
    try {
        const response = await fetch(request);
        if (response && response.status === 200) {
            const cache = await caches.open(VIDEO_CACHE);
            cache.put(request, response.clone());
            trimCache(VIDEO_CACHE, CACHE_LIMITS.videos);
        }
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        if (cached) return cached;
        
        return new Response('Video not available', { status: 404 });
    }
}

// Manejar recursos estáticos (CSS, JS) - Stale While Revalidate
async function handleStaticAsset(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    
    const fetchPromise = fetch(request).then(response => {
        if (response && response.status === 200) {
            cache.put(request, response.clone());
        }
        return response;
    }).catch(() => cached);
    
    return cached || fetchPromise;
}

// Manejar peticiones dinámicas - Network First
async function handleDynamicRequest(request) {
    try {
        const response = await fetch(request);
        
        // Cachear solo respuestas exitosas de páginas HTML
        if (response && response.status === 200 && 
            request.headers.get('accept').includes('text/html')) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response.clone());
            trimCache(DYNAMIC_CACHE, CACHE_LIMITS.dynamic);
        }
        
        return response;
    } catch (error) {
        // Intentar servir desde caché
        const cached = await caches.match(request);
        if (cached) return cached;
        
        // Si es una página HTML, servir main.html como fallback
        if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/main.html');
        }
        
        return new Response('Network error', { status: 503 });
    }
}

// ============================
// UTILIDADES
// ============================

// Limpiar caché cuando excede el límite
async function trimCache(cacheName, maxItems) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    if (keys.length > maxItems) {
        const keysToDelete = keys.slice(0, keys.length - maxItems);
        await Promise.all(
            keysToDelete.map(key => cache.delete(key))
        );
        console.log(`[SW] Limpiado ${keysToDelete.length} items de ${cacheName}`);
    }
}

// ============================
// SINCRONIZACIÓN EN BACKGROUND
// ============================
self.addEventListener('sync', event => {
    console.log('[SW] Sincronización en background:', event.tag);
    
    if (event.tag === 'sync-content') {
        event.waitUntil(
            syncContent()
        );
    }
});

// Sincronizar contenido nuevo
async function syncContent() {
    try {
        // Actualizar recursos esenciales
        const cache = await caches.open(CACHE_NAME);
        const updates = await Promise.all(
            CORE_ASSETS.map(async url => {
                const response = await fetch(url);
                if (response && response.status === 200) {
                    await cache.put(url, response);
                    return url;
                }
                return null;
            })
        );
        
        const updatedCount = updates.filter(u => u !== null).length;
        console.log(`[SW] ✅ Actualizados ${updatedCount} recursos`);
        
        // Notificar a los clientes
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'CONTENT_SYNCED',
                updatedCount
            });
        });
        
    } catch (error) {
        console.error('[SW] Error en sincronización:', error);
    }
}

// ============================
// MENSAJES DEL CLIENTE
// ============================
self.addEventListener('message', event => {
    console.log('[SW] Mensaje recibido:', event.data);
    
    switch(event.data.type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'CLEAR_CACHE':
            clearAllCaches().then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;
            
        case 'CACHE_URLS':
            cacheUrls(event.data.urls).then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;
    }
});

// Limpiar todos los cachés
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('[SW] ✅ Todos los cachés limpiados');
}

// Cachear URLs específicas
async function cacheUrls(urls) {
    const cache = await caches.open(DYNAMIC_CACHE);
    await Promise.all(
        urls.map(url => 
            fetch(url).then(response => {
                if (response && response.status === 200) {
                    return cache.put(url, response);
                }
            }).catch(err => console.warn(`[SW] Error cacheando ${url}:`, err))
        )
    );
    console.log(`[SW] ✅ Cacheadas ${urls.length} URLs`);
}

// ============================
// NOTIFICACIONES PUSH
// ============================
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'New content available!',
        icon: '/full/bikini.webp',
        badge: '/full/bikini.webp',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'View Gallery',
                icon: '/full/bikini.webp'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/full/bikini.webp'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('IbizaGirl.pics', options)
    );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/main.html#gallery')
        );
    }
});

console.log('[SW] Service Worker v2.0.0 cargado');
