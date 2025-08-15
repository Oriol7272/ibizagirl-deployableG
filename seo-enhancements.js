// ============================
// SEO ENHANCEMENTS v2.1.0 - BEACHGIRL.PICS
// Lazy Loading + Open Graph + JSON-LD + Performance
// Actualizado para usar content-data.js
// ============================

// ============================
// LAZY LOADING MEJORADO v2.0
// ============================

function setupAdvancedLazyLoading() {
    // Configuración más agresiva para mejor performance
    const lazyImageOptions = {
        root: null,
        rootMargin: '50px 0px', // Precargar antes de que sea visible
        threshold: 0.01
    };

    const lazyVideoOptions = {
        root: null,
        rootMargin: '100px 0px', // Videos necesitan más tiempo
        threshold: 0.1
    };

    // Observer para imágenes con soporte WEBP
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Soporte para WEBP con fallback
                if (supportsWebP()) {
                    const webpSrc = img.dataset.src?.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                    if (webpSrc && webpSrc !== img.dataset.src) {
                        // Intentar cargar WEBP primero
                        const webpImg = new Image();
                        webpImg.onload = () => {
                            img.src = webpSrc;
                            img.classList.remove('skeleton', 'lazy');
                            img.classList.add('loaded');
                        };
                        webpImg.onerror = () => {
                            // Fallback a formato original
                            loadOriginalImage(img);
                        };
                        webpImg.src = webpSrc;
                    } else {
                        loadOriginalImage(img);
                    }
                } else {
                    loadOriginalImage(img);
                }
                
                observer.unobserve(img);
            }
        });
    }, lazyImageOptions);

    // Función auxiliar para cargar imagen original
    function loadOriginalImage(img) {
        if (!img || !img.dataset || !img.dataset.src) {
            console.warn('Image element missing data-src attribute');
            return;
        }
        
        const tempImg = new Image();
        
        tempImg.onload = () => {
            img.src = img.dataset.src;
            img.classList.remove('skeleton', 'lazy');
            img.classList.add('loaded');
            delete img.dataset.src;
            
            // Track performance
            if (window.trackEvent) {
                window.trackEvent('image_loaded', {
                    src: img.src,
                    loading_method: 'lazy',
                    supports_webp: supportsWebP()
                });
            }
        };
        
        tempImg.onerror = () => {
            console.error('Failed to load image:', img.dataset.src);
            img.classList.remove('skeleton', 'lazy');
            img.classList.add('error');
            
            // Try fallback image - RUTA CORREGIDA
            img.src = 'full/bikini.webp';
        };
        
        tempImg.src = img.dataset.src;
    }

    // Observer para videos con preload optimizado
    const videoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                const source = video.querySelector('source[data-src]');
                
                if (source && source.dataset.src) {
                    source.src = source.dataset.src;
                    delete source.dataset.src;
                    video.load();
                    
                    video.addEventListener('loadedmetadata', () => {
                        video.classList.remove('skeleton', 'lazy');
                        video.classList.add('loaded');
                        
                        // Preload metadata para mejor UX
                        video.preload = 'metadata';
                        
                        // Performance tracking
                        if (window.trackEvent) {
                            window.trackEvent('video_loaded', {
                                src: source.src,
                                duration: video.duration,
                                loading_method: 'lazy'
                            });
                        }
                    }, { once: true });
                    
                    video.addEventListener('error', () => {
                        console.error('Failed to load video:', source.src);
                        video.classList.remove('skeleton', 'lazy');
                        video.classList.add('error');
                    }, { once: true });
                }
                
                observer.unobserve(video);
            }
        });
    }, lazyVideoOptions);

    // Aplicar observers
    document.querySelectorAll('img[data-src]').forEach(img => {
        img.classList.add('lazy');
        imageObserver.observe(img);
    });

    document.querySelectorAll('video[data-video-id]').forEach(video => {
        video.classList.add('lazy');
        videoObserver.observe(video);
    });

    // Progressive loading para crítico above-the-fold
    loadCriticalImages();
    
    return { imageObserver, videoObserver };
}

// Detectar soporte WEBP
function supportsWebP() {
    if (typeof supportsWebP.result === 'undefined') {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        supportsWebP.result = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return supportsWebP.result;
}

// Cargar imágenes críticas inmediatamente
function loadCriticalImages() {
    const criticalImages = document.querySelectorAll('.banner-slide img, .teaser-item img');
    criticalImages.forEach(img => {
        if (img.dataset.src) {
            const tempImg = new Image();
            tempImg.onload = () => {
                img.src = img.dataset.src;
                img.classList.remove('skeleton');
                delete img.dataset.src;
            };
            tempImg.src = img.dataset.src;
        }
    });
}

// ============================
// OPEN GRAPH DINÁMICO
// ============================

function updateOpenGraph(contentData = {}) {
    const lang = window.state?.currentLanguage || 'es';
    const trans = window.TRANSLATIONS?.[lang] || {};
    
    const defaultData = {
        title: trans.photos_seo_title || 'BeachGirl.pics - Galería Premium Paraíso | 400+ Fotos Diarias',
        description: trans.meta_description || 'Galería premium con 400+ fotos y 80+ videos HD actualizados diariamente.',
        image: 'https://beachgirl.pics/full/bikini.webp',
        url: window.location.href,
        type: 'website'
    };

    const data = { ...defaultData, ...contentData };

    // Actualizar meta tags existentes o crear nuevos
    const metaTags = [
        { property: 'og:title', content: data.title },
        { property: 'og:description', content: data.description },
        { property: 'og:image', content: data.image },
        { property: 'og:url', content: data.url },
        { property: 'og:type', content: data.type },
        { property: 'og:site_name', content: 'BeachGirl.pics' },
        { property: 'og:locale', content: lang === 'es' ? 'es_ES' : 
                                        lang === 'en' ? 'en_US' :
                                        lang === 'fr' ? 'fr_FR' :
                                        lang === 'de' ? 'de_DE' :
                                        lang === 'it' ? 'it_IT' :
                                        lang === 'pt' ? 'pt_PT' : 'es_ES' },
        { property: 'og:updated_time', content: new Date().toISOString() },
        
        // Twitter Cards
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@beachgirlpics' },
        { name: 'twitter:title', content: data.title },
        { name: 'twitter:description', content: data.description },
        { name: 'twitter:image', content: data.image },
        
        // Adicionales para mejor SEO
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Galería premium del paraíso - Fotos exclusivas mediterráneo' },
        
        // Para Pinterest
        { name: 'pinterest-rich-pin', content: 'true' },
        { name: 'pinterest:description', content: data.description }
    ];

    metaTags.forEach(tag => {
        let element = document.querySelector(`meta[${tag.property ? 'property' : 'name'}="${tag.property || tag.name}"]`);
        
        if (!element) {
            element = document.createElement('meta');
            if (tag.property) {
                element.setAttribute('property', tag.property);
            } else {
                element.setAttribute('name', tag.name);
            }
            document.head.appendChild(element);
        }
        
        element.setAttribute('content', tag.content);
    });

    // Actualizar canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
    }
    canonical.href = data.url;
}

// ============================
// JSON-LD AVANZADO
// ============================

function injectAdvancedJSONLD() {
    const lang = window.state?.currentLanguage || 'es';
    const trans = window.TRANSLATIONS?.[lang] || {};
    
    // Obtener información del contenido si está disponible
    let totalPhotos = 400;
    let totalVideos = 80;
    
    if (window.ALL_PHOTOS_POOL && window.ALL_UNCENSORED_PHOTOS_POOL && window.ALL_VIDEOS_POOL) {
        totalPhotos = (window.ALL_PHOTOS_POOL?.length || 0) + 
                     (window.ALL_UNCENSORED_PHOTOS_POOL?.length || 0);
        totalVideos = window.ALL_VIDEOS_POOL?.length || 0;
    }
    
    // Schema principal del sitio web
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://beachgirl.pics/#website",
        "name": "BeachGirl.pics",
        "alternateName": ["Galería Paraíso", "Beach Photos", "Paradise Gallery"],
        "description": trans.meta_description || "Galería premium con contenido exclusivo",
        "url": "https://beachgirl.pics/",
        "inLanguage": lang === 'es' ? 'es-ES' : 
                      lang === 'en' ? 'en-US' :
                      lang === 'fr' ? 'fr-FR' :
                      lang === 'de' ? 'de-DE' :
                      lang === 'it' ? 'it-IT' :
                      lang === 'pt' ? 'pt-PT' : 'es-ES',
        "isAccessibleForFree": false,
        "datePublished": "2025-01-15T00:00:00+01:00",
        "dateModified": new Date().toISOString(),
        "publisher": {
            "@type": "Organization",
            "@id": "https://beachgirl.pics/#organization"
        },
        "potentialAction": [
            {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "https://beachgirl.pics/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
            },
            {
                "@type": "ViewAction",
                "target": "https://beachgirl.pics/main.html",
                "name": "Ver Galería Premium"
            }
        ]
    };

    // Schema de la organización
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://beachgirl.pics/#organization",
        "name": "BeachGirl.pics",
        "legalName": "BeachGirl.pics",
        "url": "https://beachgirl.pics/",
        "logo": {
            "@type": "ImageObject",
            "url": "https://beachgirl.pics/full/bikini.webp",
            "width": 1200,
            "height": 630
        },
        "sameAs": [
            "https://instagram.com/beachgirl.pics",
            "https://tiktok.com/@beachgirl.pics",
            "https://twitter.com/beachgirlpics"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": ["Spanish", "English", "French", "German", "Italian", "Portuguese"]
        }
    };

    // Schema de galería de imágenes con datos actualizados
    const imageGallerySchema = {
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        "@id": "https://beachgirl.pics/main.html#gallery",
        "name": trans.photos_seo_title || "Galería de Fotos del Paraíso",
        "description": trans.gallery_description || "Colección exclusiva de fotos del paraíso",
        "url": "https://beachgirl.pics/main.html",
        "mainEntity": {
            "@type": "WebPage",
            "@id": "https://beachgirl.pics/main.html#webpage",
            "name": trans.photos_seo_title || "Fotos del Paraíso",
            "description": trans.gallery_description || "Galería premium",
            "primaryImageOfPage": {
                "@type": "ImageObject",
                "url": "https://beachgirl.pics/full/bikini.webp",
                "caption": trans.seo_keywords?.primary || "Beach paradise gallery",
                "width": 1200,
                "height": 800
            }
        },
        "numberOfItems": totalPhotos + totalVideos,
        "contentLocation": {
            "@type": "Place",
            "name": "Mediterranean Paradise",
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": "39.5696",
                "longitude": "2.6502"
            },
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "ES",
                "addressRegion": "Islas Baleares"
            }
        },
        "dateModified": new Date().toISOString(),
        "inLanguage": lang === 'es' ? 'es-ES' : 
                      lang === 'en' ? 'en-US' :
                      lang === 'fr' ? 'fr-FR' :
                      lang === 'de' ? 'de-DE' :
                      lang === 'it' ? 'it-IT' :
                      lang === 'pt' ? 'pt-PT' : 'es-ES',
        "keywords": trans.seo_keywords?.primary || "beach photos gallery",
        "author": {
            "@type": "Organization",
            "@id": "https://beachgirl.pics/#organization"
        },
        "publisher": {
            "@type": "Organization",
            "@id": "https://beachgirl.pics/#organization"
        }
    };

    // Schema de destino turístico
    const touristDestinationSchema = {
        "@context": "https://schema.org",
        "@type": "TouristDestination",
        "name": "Paradise Beaches",
        "description": "Las mejores playas capturadas en nuestra galería premium",
        "url": "https://beachgirl.pics/",
        "image": "https://beachgirl.pics/full/bikbanner.webp",
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "39.5696",
            "longitude": "2.6502"
        },
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "ES",
            "addressRegion": "Mediterranean"
        },
        "touristType": ["Beach Lover", "Photography Enthusiast", "Nature Lover"],
        "includesAttraction": [
            {
                "@type": "TouristAttraction",
                "name": "Paradise Beach",
                "description": "Una de las playas más hermosas"
            },
            {
                "@type": "TouristAttraction", 
                "name": "Sunset Cove",
                "description": "Famosa por sus increíbles atardeceres"
            }
        ]
    };

    // Schema de producto/servicio
    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Galería Premium BeachGirl",
        "description": "Servicio de galería fotográfica premium con contenido exclusivo",
        "provider": {
            "@type": "Organization",
            "@id": "https://beachgirl.pics/#organization"
        },
        "areaServed": {
            "@type": "Place",
            "name": "Worldwide"
        },
        "audience": {
            "@type": "Audience",
            "audienceType": "Adults 18+"
        },
        "offers": [
            {
                "@type": "Offer",
                "name": "VIP Lifetime Access",
                "description": "Acceso de por vida a toda la galería premium",
                "price": "100",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock",
                "validFrom": "2025-01-15"
            },
            {
                "@type": "Offer",
                "name": "VIP Monthly Access",
                "description": "Acceso mensual a toda la galería premium",
                "price": "15",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock",
                "validFrom": "2025-01-15"
            }
        ]
    };

    // Inyectar todos los schemas
    const schemas = [
        websiteSchema,
        organizationSchema,
        imageGallerySchema,
        touristDestinationSchema,
        serviceSchema
    ];

    schemas.forEach((schema, index) => {
        let scriptTag = document.getElementById(`jsonld-schema-${index}`);
        if (!scriptTag) {
            scriptTag = document.createElement('script');
            scriptTag.type = 'application/ld+json';
            scriptTag.id = `jsonld-schema-${index}`;
            document.head.appendChild(scriptTag);
        }
        scriptTag.textContent = JSON.stringify(schema, null, 2);
    });

    console.log('✅ Advanced JSON-LD schemas injected with content data');
}

// ============================
// PWA SERVICE WORKER REGISTRATION
// ============================

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker registered:', registration);
                    
                    // Manejar actualizaciones
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // Nueva versión disponible
                                showUpdateNotification();
                            }
                        });
                    });
                    
                    // Sincronización en background
                    if ('sync' in registration) {
                        registration.sync.register('content-preload').catch(err => {
                            console.log('Background sync registration failed:', err);
                        });
                    }
                })
                .catch(error => {
                    console.error('❌ Service Worker registration failed:', error);
                });
        });
    }
}

function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <div class="update-content">
            <span>🆕 Nueva versión disponible</span>
            <button onclick="updateApp()" class="update-btn">Actualizar</button>
            <button onclick="this.parentElement.parentElement.remove()" class="close-btn">×</button>
        </div>
    `;
    document.body.appendChild(notification);
}

function updateApp() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
            if (registration && registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
            }
        });
    }
}

// ============================
// BREADCRUMBS DINÁMICOS
// ============================

function updateBreadcrumbs(currentPage = '') {
    const breadcrumbContainer = document.querySelector('.breadcrumb');
    if (!breadcrumbContainer) return;

    const lang = window.state?.currentLanguage || 'es';
    const trans = window.TRANSLATIONS?.[lang] || {};
    const breadcrumbs = [
        { name: 'Inicio', url: '/', position: 1 }
    ];

    if (currentPage === 'gallery') {
        breadcrumbs.push({ 
            name: trans.photos_seo_title || 'Galería Premium', 
            url: '/main.html', 
            position: 2 
        });
    }

    const breadcrumbHTML = breadcrumbs.map(crumb => `
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            ${crumb.url ? 
                `<a itemprop="item" href="${crumb.url}"><span itemprop="name">${crumb.name}</span></a>` :
                `<span itemprop="name">${crumb.name}</span>`
            }
            <meta itemprop="position" content="${crumb.position}">
        </li>
    `).join('');

    breadcrumbContainer.innerHTML = breadcrumbHTML;
}

// ============================
// PERFORMANCE MONITORING
// ============================

function initPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
        // LCP (Largest Contentful Paint)
        try {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                if (window.trackEvent) {
                    window.trackEvent('lcp_measured', { 
                        value: lastEntry.startTime,
                        element: lastEntry.element?.tagName 
                    });
                }
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.log('LCP observer not supported');
        }

        // FID (First Input Delay)
        try {
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (window.trackEvent) {
                        window.trackEvent('fid_measured', { 
                            value: entry.processingStart - entry.startTime,
                            name: entry.name
                        });
                    }
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            console.log('FID observer not supported');
        }

        // CLS (Cumulative Layout Shift)
        try {
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
            
            // Report CLS when page is hidden
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden' && window.trackEvent) {
                    window.trackEvent('cls_measured', { value: clsValue });
                }
            });
        } catch (e) {
            console.log('CLS observer not supported');
        }
    }
}

// ============================
// CONTENT STATS DISPLAY
// ============================

function displayContentStats() {
    if (!window.ALL_PHOTOS_POOL && !window.ALL_UNCENSORED_PHOTOS_POOL && !window.ALL_VIDEOS_POOL) return;
    
    const totalPhotos = (window.ALL_PHOTOS_POOL?.length || 0) + 
                       (window.ALL_UNCENSORED_PHOTOS_POOL?.length || 0);
    const totalVideos = window.ALL_VIDEOS_POOL?.length || 0;
    
    console.log(`📊 SEO Content Stats:
    - Total Photos: ${totalPhotos}
    - Total Videos: ${totalVideos}
    - Total Content: ${totalPhotos + totalVideos}`);
}

// ============================
// INICIALIZACIÓN GLOBAL
// ============================

function initializeSEOEnhancements() {
    console.log('🚀 Initializing SEO Enhancements v2.1.0...');
    
    // Lazy loading avanzado
    setupAdvancedLazyLoading();
    
    // Open Graph dinámico
    updateOpenGraph();
    
    // JSON-LD avanzado con datos del contenido
    injectAdvancedJSONLD();
    
    // Service Worker PWA
    registerServiceWorker();
    
    // Breadcrumbs
    updateBreadcrumbs('gallery');
    
    // Performance monitoring
    initPerformanceMonitoring();
    
    // Display content stats
    displayContentStats();
    
    console.log('✅ SEO Enhancements initialized');
}

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSEOEnhancements);
} else {
    // Esperar un momento para asegurar que content-data.js esté cargado
    setTimeout(initializeSEOEnhancements, 100);
}

// Exponer funciones globales
window.updateOpenGraph = updateOpenGraph;
window.updateBreadcrumbs = updateBreadcrumbs;
window.updateApp = updateApp;
window.initializeSEOEnhancements = initializeSEOEnhancements;
window.setupAdvancedLazyLoading = setupAdvancedLazyLoading;
