'use strict';
// ============================
// SEO ENHANCEMENTS v2.0.0 - CORRECTED
// Lazy Loading + Open Graph + JSON-LD + Performance
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
            
            // Try fallback image
            img.src = 'public/assets/full/0456996c-b56e-42ef-9049-56b1a1ae2646.webp';
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

    // Apply observers to all lazy elements
    document.querySelectorAll('img.lazy').forEach(img => imageObserver.observe(img));
    document.querySelectorAll('video.lazy').forEach(video => videoObserver.observe(video));
}

function supportsWebP() {
    const elem = document.createElement('canvas');
    if (!!(elem.getContext && elem.getContext('2d'))) {
        return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
    }
    return false;
}

// ============================
// OPEN GRAPH DINÁMICO
// ============================

function updateOpenGraph() {
    const lang = window.state?.currentLanguage || 'es';
    const trans = TRANSLATIONS[lang];
    const ogTags = {
        'og:title': trans.photos_seo_title || 'Galería Premium Ibiza',
        'og:description': trans.gallery_description,
        'og:image': CONFIG.BASE_URL + 'public/assets/full/0456996c-b56e-42ef-9049-56b1a1ae2646.webp',
        'og:url': window.location.href,
        'og:type': 'website',
        'og:locale': lang === 'es' ? 'es_ES' : lang === 'en' ? 'en_US' : lang === 'de' ? 'de_DE' : lang === 'it' ? 'it_IT' : 'fr_FR',
        'og:site_name': 'BeachGirl.pics - Paradise Gallery'
    };

    Object.entries(ogTags).forEach(([key, value]) => {
        let meta = document.querySelector(`meta[property="${key}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', key);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', value);
    });
}

// ============================
// JSON-LD AVANZADO
// ============================

function injectAdvancedJSONLD() {
    const jsonLD = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "BeachGirl.pics",
        "url": "https://beachgirl.pics",
        "description": "Galería premium de Ibiza con contenido diario actualizado",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "{search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLD);
    document.head.appendChild(script);
}

// ============================
// SERVICE WORKER PARA PWA
// ============================

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => {
                console.log('✅ Service Worker registered', reg);
                reg.addEventListener('updatefound', () => {
                    const installingWorker = reg.installing;
                    installingWorker.addEventListener('statechange', () => {
                        if (installingWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                console.log('New content is available; please refresh.');
                            } else {
                                console.log('Content is cached for offline use.');
                            }
                        }
                    });
                });
            })
            .catch(err => console.error('Service Worker registration failed:', err));
    }
}

function updateApp() {
    navigator.serviceWorker.getRegistration().then(registration => {
        if (registration && registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
        }
    });
}

// ============================
// BREADCRUMBS DINÁMICOS
// ============================

function updateBreadcrumbs(currentPage = 'gallery') {
    const breadcrumbContainer = document.querySelector('.breadcrumb');
    if (!breadcrumbContainer) return;

    const lang = window.state?.currentLanguage || 'es';
    const trans = TRANSLATIONS[lang];
    const breadcrumbs = [
        { name: 'Inicio', url: '/', position: 1 }
    ];

    if (currentPage === 'gallery') {
        breadcrumbs.push({ 
            name: trans.photos_seo_title || 'Galería Premium Ibiza', 
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
// INICIALIZACIÓN GLOBAL
// ============================

function initializeSEOEnhancements() {
    console.log('🚀 Initializing SEO Enhancements v2.0.0...');
    
    // Lazy loading avanzado
    setupAdvancedLazyLoading();
    
    // Open Graph dinámico
    updateOpenGraph();
    
    // JSON-LD avanzado
    injectAdvancedJSONLD();
    
    // Service Worker PWA
    registerServiceWorker();
    
    // Breadcrumbs
    updateBreadcrumbs('gallery');
    
    // Performance monitoring
    initPerformanceMonitoring();
    
    console.log('✅ SEO Enhancements initialized');
}

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSEOEnhancements);
} else {
    initializeSEOEnhancements();
}

// Exponer funciones globales
window.updateOpenGraph = updateOpenGraph;
window.updateBreadcrumbs = updateBreadcrumbs;
window.updateApp = updateApp;
window.initializeSEOEnhancements = initializeSEOEnhancements;
