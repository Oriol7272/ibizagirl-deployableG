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
            img.src = 'full/0456996c-b56e-42ef-9049-56b1a1ae2646.webp';
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
                    }, { once: true });
                }
                
                observer.unobserve(video);
            }
        });
    }, lazyVideoOptions);

    // Aplicar observers a elementos lazy
    document.querySelectorAll('img.lazy').forEach(img => imageObserver.observe(img));
    document.querySelectorAll('video.lazy').forEach(video => videoObserver.observe(video));
}

// Función para verificar soporte WEBP
function supportsWebP() {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
        return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
}

// ============================
// OPEN GRAPH DINÁMICO
// ============================

function updateOpenGraph(page = 'home', lang = 'es') {
    // Metas base
    const ogMetas = {
        'og:title': lang === 'es' ? 'BeachGirl.pics - Galería Premium Ibiza 2025' : lang === 'en' ? 'BeachGirl.pics - Premium Ibiza Gallery 2025' : lang === 'fr' ? 'BeachGirl.pics - Galerie Premium Ibiza 2025' : lang === 'de' ? 'BeachGirl.pics - Premium Ibiza Galerie 2025' : lang === 'it' ? 'BeachGirl.pics - Galleria Premium Ibiza 2025' : lang === 'pt' ? 'BeachGirl.pics - Galeria Premium Ibiza 2025' : 'BeachGirl.pics - Premium Ibiza Gallery 2025',
        'og:description': lang === 'es' ? 'Descubre 400+ fotos y 80+ videos HD de Ibiza actualizados diariamente. Contenido exclusivo del paraíso mediterráneo.' : lang === 'en' ? 'Discover 400+ photos and 80+ HD videos from Ibiza updated daily. Exclusive Mediterranean paradise content.' : lang === 'fr' ? 'Découvrez 400+ photos et 80+ vidéos HD d\'Ibiza mises à jour quotidiennement. Contenu exclusif du paradis méditerranéen.' : lang === 'de' ? 'Entdecken Sie 400+ Fotos und 80+ HD-Videos aus Ibiza, täglich aktualisiert. Exklusiver Inhalt aus dem mediterranen Paradies.' : lang === 'it' ? 'Scopri 400+ foto e 80+ video HD da Ibiza aggiornati quotidianamente. Contenuti esclusivi del paradiso mediterraneo.' : lang === 'pt' ? 'Descubra 400+ fotos e 80+ vídeos HD de Ibiza atualizados diariamente. Conteúdo exclusivo do paraíso mediterrâneo.' : 'Discover 400+ photos and 80+ HD videos from Ibiza updated daily. Exclusive Mediterranean paradise content.',
        'og:image': 'https://beachgirl.pics/full/0456996c-b56e-42ef-9049-56b1a1ae2646.webp',
        'og:url': window.location.href,
        'og:type': 'website',
        'og:site_name': 'BeachGirl.pics',
        'og:locale': lang === 'es' ? 'es_ES' : lang === 'en' ? 'en_US' : lang === 'fr' ? 'fr_FR' : lang === 'de' ? 'de_DE' : lang === 'it' ? 'it_IT' : lang === 'pt' ? 'pt_PT' : 'en_US',
    };

    // Actualizar o crear metas OG
    Object.entries(ogMetas).forEach(([property, content]) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    });

    // Twitter cards (compatibles con OG)
    const twitterMetas = {
        'twitter:card': 'summary_large_image',
        'twitter:title': ogMetas['og:title'],
        'twitter:description': ogMetas['og:description'],
        'twitter:image': ogMetas['og:image'],
    };

    Object.entries(twitterMetas).forEach(([name, content]) => {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', name);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    });
}

// ============================
// JSON-LD AVANZADO
// ============================

function injectAdvancedJSONLD() {
    const jsonLdScript = document.createElement('script');
    jsonLdScript.type = 'application/ld+json';
    jsonLdScript.innerHTML = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "BeachGirl.pics",
        "url": "https://beachgirl.pics",
        "description": "Galería premium de Ibiza con fotos y videos diarios del paraíso mediterráneo",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://beachgirl.pics/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        },
        "inLanguage": "es-ES",
        "image": {
            "@type": "ImageObject",
            "url": "https://beachgirl.pics/full/0456996c-b56e-42ef-9049-56b1a1ae2646.webp",
            "width": 1200,
            "height": 800
        },
        "sameAs": [
            "https://twitter.com/beachgirlpics",
            "https://instagram.com/beachgirlpics"
        ],
        "publisher": {
            "@type": "Organization",
            "name": "BeachGirl.pics",
            "logo": {
                "@type": "ImageObject",
                "url": "https://beachgirl.pics/full/0456996c-b56e-42ef-9049-56b1a1ae2646.webp"
            }
        }
    });
    document.head.appendChild(jsonLdScript);
}

// ============================
// REGISTRO SERVICE WORKER PWA
// ============================

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => {
                    console.log('✅ Service Worker registered', reg.scope);
                    if (reg.installing) {
                        console.log('Service worker installing');
                    } else if (reg.waiting) {
                        console.log('Service worker installed');
                    } else if (reg.active) {
                        console.log('Service worker active');
                    }
                })
                .catch(err => console.error('❌ Service Worker registration failed', err));
        });
    }
}

// ============================
// UPDATE APP (PWA INSTALL PROMPT)
// ============================

function updateApp() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        // Mostrar botón de instalación si es necesario
        const installBtn = document.querySelector('#install-btn');
        if (installBtn) {
            installBtn.style.display = 'block';
            installBtn.addEventListener('click', () => {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choice) => {
                    if (choice.outcome === 'accepted') {
                        console.log('User accepted PWA install');
                    }
                    deferredPrompt = null;
                });
            });
        }
    });
    
    window.addEventListener('appinstalled', () => {
        console.log('✅ PWA installed');
    });
}

// ============================
// BREADCRUMBS DINÁMICOS
// ============================

function updateBreadcrumbs(currentPage) {
    const breadcrumbContainer = document.querySelector('#breadcrumb');
    if (!breadcrumbContainer) return;

    const breadcrumbs = [
        { name: 'BeachGirl.pics', url: '/', position: 1 }
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
