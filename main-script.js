// ============================
// BeachGirl.pics Gallery Script v15.0.0 - COMPLETE EDITION
// PayPal + Todas las mejoras + Sistema completo
// ============================

'use strict';

// ============================
// CONFIGURACIÓN AVANZADA
// ============================

const CONFIG = {
    VERSION: '15.0.0',
    CONTENT: {
        DAILY_PHOTOS: 200,
        DAILY_VIDEOS: 40,
        NEW_PERCENTAGE: 0.3,
        TEASER_COUNT: 15,
        ITEMS_PER_PAGE: 50,
        LAZY_LOAD_THRESHOLD: '50px'
    },
    PAYPAL: {
        CLIENT_ID: 'AfQEdiielw5fm3wF08p9pcxwqR3gPz82YRNUTKY4A8WNG9AktiGsDNyr2i7BsjVzSwwpeCwR7Tt7DPq5',
        CURRENCY: 'EUR',
        ENVIRONMENT: 'production', // o 'sandbox' para pruebas
        STYLE: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal',
            tagline: false
        }
    },
    PRICES: {
        MONTHLY: 15,
        LIFETIME: 100,
        PACKS: { 
            starter: { credits: 10, price: 10, discount: 33 },
            bronze: { credits: 25, price: 20, discount: 50 },
            silver: { credits: 50, price: 35, discount: 65 },
            gold: { credits: 100, price: 60, discount: 70 }
        },
        PPV: 0.10 // Precio por contenido individual
    },
    ANIMATIONS: {
        DURATION: 300,
        EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',
        STAGGER: 50
    },
    FEATURES: {
        ANALYTICS: true,
        PUSH_NOTIFICATIONS: true,
        OFFLINE_MODE: true,
        AUTO_SAVE: true,
        ADVANCED_SEARCH: true
    }
};

// Imagen fallback optimizada
const FALLBACK_SVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDA0IiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2NjdlZWEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM3NjRiYTIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDA0IiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNnKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNDAlIiBmb250LXNpemU9IjQ4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfjYo8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2NSUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+QmVhY2hHaXJsLnBpY3M8L3RleHQ+PC9zdmc+';

// ============================
// ESTADO GLOBAL AVANZADO
// ============================

const state = {
    // Core state
    language: localStorage.getItem('language') || 'es',
    unlockedPhotos: new Set(JSON.parse(localStorage.getItem('unlockedPhotos') || '[]')),
    unlockedVideos: new Set(JSON.parse(localStorage.getItem('unlockedVideos') || '[]')),
    credits: parseInt(localStorage.getItem('credits') || '0'),
    isVIP: localStorage.getItem('isVIP') === 'true',
    vipExpiry: localStorage.getItem('vipExpiry'),
    
    // Content state
    dailyPhotos: [],
    dailyVideos: [],
    teaserItems: [],
    currentPage: 1,
    totalPages: 1,
    loadedItems: 0,
    
    // UI state
    initialized: false,
    currentModal: null,
    selectedPlan: 'lifetime',
    selectedPack: 'silver',
    selectedContent: null,
    isabellaOpen: false,
    
    // Features state
    offlineMode: false,
    notifications: JSON.parse(localStorage.getItem('notifications') || 'true'),
    autoPlay: JSON.parse(localStorage.getItem('autoPlay') || 'false'),
    qualityPreference: localStorage.getItem('qualityPreference') || 'hd',
    
    // Analytics state
    sessionStart: Date.now(),
    viewedContent: new Set(),
    interactions: 0,
    
    // Performance state
    imageLoadTimes: [],
    averageLoadTime: 0,
    failedLoads: 0
};

// ============================
// TRADUCCIONES COMPLETAS
// ============================

const TRANSLATIONS = {
    es: {
        // Core UI
        welcome: 'Bienvenida al Paraíso 🌴',
        daily_content: '200+ fotos y 40+ videos actualizados DIARIAMENTE',
        unlock_all: '🔓 Desbloquear Todo',
        view_gallery: '📸 Ver Galería',
        loading: 'Cargando el paraíso...',
        subtitle: 'Contenido Exclusivo del Paraíso',
        
        // Gallery
        preview_gallery: '🔥 Vista Previa Exclusiva',
        paradise_photos: '📸 Fotos del Paraíso',
        new_today: '¡NUEVO HOY!',
        exclusive_videos: '🎬 Videos Exclusivos',
        fresh_content: '¡CONTENIDO FRESCO!',
        
        // Stats
        photos_today: 'Fotos de Hoy',
        videos_hd: 'Videos HD',
        total_views: 'Vistas Totales',
        updates: 'Actualizaciones',
        always_fresh: 'SIEMPRE FRESCO',
        updated_at: 'Actualizado a las',
        today: 'hoy',
        
        // VIP & Plans
        vip_unlimited: '👑 Acceso VIP Ilimitado',
        plan_monthly: '📅 Mensual',
        plan_lifetime: '♾️ Lifetime',
        per_month: '/mes',
        save_yearly: '¡Ahorra €80 al año!',
        best_value: 'MEJOR VALOR',
        unlimited_access: 'Acceso ilimitado',
        all_content: 'Todo el contenido actual y futuro',
        priority_support: 'Soporte prioritario',
        exclusive_content: 'Contenido exclusivo VIP',
        no_ads: 'Sin publicidad',
        
        // Packs
        megapack: '📦 MEGA PACKS -70%',
        pack_selection: '📦 MEGA PACKS - Ahorra 70%',
        pack_starter: 'Starter Pack',
        pack_bronze: 'Bronze Pack',
        pack_silver: 'Silver Pack',
        pack_gold: 'Gold Pack',
        items: 'contenidos',
        save: 'Ahorra',
        
        // Credits & Unlock
        credits_available: 'Créditos Disponibles',
        unlock_credit: 'Desbloquear (1 crédito)',
        unlock_content: '🔓 Desbloquear Contenido',
        use_credit: 'Usa 1 crédito para desbloquear',
        no_credits: '¡Necesitas créditos! Compra un pack',
        unlocked_success: '¡Contenido desbloqueado! 🎉',
        vip_activated: '¡VIP Activado! Acceso ilimitado 👑',
        
        // Isabella Bot
        isabella_title: 'Isabella - Tu Guía VIP',
        vip_info: '💎 VIP Info',
        news: '📅 Novedades',
        help: '❓ Ayuda',
        
        // Navigation
        monthly: '📅 Mensual',
        lifetime: '👑 Lifetime',
        
        // Footer
        footer_desc: 'Tu destino diario para contenido exclusivo del paraíso mediterráneo.',
        quick_links: 'Enlaces Rápidos',
        photos: 'Fotos',
        videos: 'Videos',
        vip_subscription: 'Suscripción VIP',
        mega_packs: 'Mega Packs',
        support: 'Soporte',
        terms: 'Términos de Servicio',
        privacy: 'Política de Privacidad',
        contact: 'Contacto',
        copyright: '© 2025 BeachGirl.pics - Todos los derechos reservados | 18+ Solo Adultos',
        cookies: 'Este sitio utiliza cookies para mejorar tu experiencia',
        
        // Messages & Notifications
        payment_processing: 'Procesando pago...',
        payment_success: '¡Pago completado con éxito!',
        payment_error: 'Error en el pago. Inténtalo de nuevo.',
        offline_mode: 'Modo sin conexión activado',
        connection_restored: 'Conexión restaurada',
        content_updated: 'Nuevo contenido disponible',
        
        // Advanced features
        quality_hd: 'Calidad HD',
        quality_4k: 'Calidad 4K',
        autoplay: 'Reproducción automática',
        notifications: 'Notificaciones',
        advanced_search: 'Búsqueda avanzada',
        filter_by: 'Filtrar por',
        sort_by: 'Ordenar por',
        newest: 'Más nuevo',
        popular: 'Popular',
        random: 'Aleatorio'
    },
    en: {
        // Core UI (versión inglesa similar pero completa)
        welcome: 'Welcome to Paradise 🌴',
        daily_content: '200+ photos and 40+ videos updated DAILY',
        unlock_all: '🔓 Unlock Everything',
        view_gallery: '📸 View Gallery',
        loading: 'Loading paradise...',
        subtitle: 'Exclusive Paradise Content',
        
        // Gallery
        preview_gallery: '🔥 Exclusive Preview',
        paradise_photos: '📸 Paradise Photos',
        new_today: 'NEW TODAY!',
        exclusive_videos: '🎬 Exclusive Videos',
        fresh_content: 'FRESH CONTENT!',
        
        // Stats
        photos_today: 'Photos Today',
        videos_hd: 'HD Videos',
        total_views: 'Total Views',
        updates: 'Updates',
        always_fresh: 'ALWAYS FRESH',
        updated_at: 'Updated at',
        today: 'today',
        
        // VIP & Plans
        vip_unlimited: '👑 Unlimited VIP Access',
        plan_monthly: '📅 Monthly',
        plan_lifetime: '♾️ Lifetime',
        per_month: '/month',
        save_yearly: 'Save €80 per year!',
        best_value: 'BEST VALUE',
        unlimited_access: 'Unlimited access',
        all_content: 'All current and future content',
        priority_support: 'Priority support',
        exclusive_content: 'Exclusive VIP content',
        no_ads: 'No advertisements',
        
        // Packs
        megapack: '📦 MEGA PACKS -70%',
        pack_selection: '📦 MEGA PACKS - Save 70%',
        pack_starter: 'Starter Pack',
        pack_bronze: 'Bronze Pack',
        pack_silver: 'Silver Pack',
        pack_gold: 'Gold Pack',
        items: 'items',
        save: 'Save',
        
        // Credits & Unlock
        credits_available: 'Credits Available',
        unlock_credit: 'Unlock (1 credit)',
        unlock_content: '🔓 Unlock Content',
        use_credit: 'Use 1 credit to unlock',
        no_credits: 'You need credits! Buy a pack',
        unlocked_success: 'Content unlocked! 🎉',
        vip_activated: 'VIP Activated! Unlimited access 👑',
        
        // Isabella Bot
        isabella_title: 'Isabella - Your VIP Guide',
        vip_info: '💎 VIP Info',
        news: '📅 News',
        help: '❓ Help',
        
        // Navigation
        monthly: '📅 Monthly',
        lifetime: '👑 Lifetime',
        
        // Footer
        footer_desc: 'Your daily destination for exclusive Mediterranean paradise content.',
        quick_links: 'Quick Links',
        photos: 'Photos',
        videos: 'Videos',
        vip_subscription: 'VIP Subscription',
        mega_packs: 'Mega Packs',
        support: 'Support',
        terms: 'Terms of Service',
        privacy: 'Privacy Policy',
        contact: 'Contact',
        copyright: '© 2025 BeachGirl.pics - All rights reserved | 18+ Adults Only',
        cookies: 'This site uses cookies to improve your experience',
        
        // Messages & Notifications
        payment_processing: 'Processing payment...',
        payment_success: 'Payment completed successfully!',
        payment_error: 'Payment error. Please try again.',
        offline_mode: 'Offline mode activated',
        connection_restored: 'Connection restored',
        content_updated: 'New content available',
        
        // Advanced features
        quality_hd: 'HD Quality',
        quality_4k: '4K Quality',
        autoplay: 'Autoplay',
        notifications: 'Notifications',
        advanced_search: 'Advanced search',
        filter_by: 'Filter by',
        sort_by: 'Sort by',
        newest: 'Newest',
        popular: 'Popular',
        random: 'Random'
    }
    // Nota: Puedes añadir más idiomas (de, fr, it, pt) siguiendo la misma estructura
};

// ============================
// DETECCIÓN DE RUTAS MEJORADA
// ============================

const PathDetector = {
    basePathFound: '',
    imageFormats: ['webp', 'jpg', 'jpeg', 'png'],
    
    buildPath(relativePath) {
        const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
        return cleanPath;
    },
    
    getOptimalImageFormat() {
        // Detectar soporte WEBP
        if (this.supportsWebP()) return 'webp';
        return 'jpg';
    },
    
    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
};

// ============================
// UTILIDADES AVANZADAS
// ============================

function handleImageError(img) {
    if (!img.dataset.fallbackUsed) {
        img.dataset.fallbackUsed = 'true';
        img.src = FALLBACK_SVG;
        img.style.objectFit = 'cover';
        state.failedLoads++;
        
        // Analytics de errores
        if (CONFIG.FEATURES.ANALYTICS) {
            trackEvent('image_error', {
                original_src: img.dataset.originalSrc || img.src,
                error_count: state.failedLoads
            });
        }
    }
}

function getDailyRotation(pool, count) {
    if (!pool || pool.length === 0) return [];
    
    const today = new Date();
    const dateString = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();
    const seed = dateString.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    const shuffled = [...pool].sort((a, b) => {
        const aVal = a.split('').reduce((sum, char) => sum + char.charCodeAt(0), seed);
        const bVal = b.split('').reduce((sum, char) => sum + char.charCodeAt(0), seed);
        return (aVal * 9301 + 49297) % 233280 - (bVal * 9301 + 49297) % 233280;
    });
    
    return shuffled.slice(0, Math.min(count, pool.length));
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================
// ANALYTICS Y TRACKING
// ============================

function trackEvent(eventName, data = {}) {
    if (!CONFIG.FEATURES.ANALYTICS) return;
    
    try {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                custom_parameter: JSON.stringify(data),
                session_id: state.sessionStart,
                user_type: state.isVIP ? 'vip' : 'free',
                ...data
            });
        }
        
        // Custom analytics
        const eventData = {
            event: eventName,
            timestamp: Date.now(),
            session: state.sessionStart,
            data: data,
            user_state: {
                isVIP: state.isVIP,
                credits: state.credits,
                language: state.language
            }
        };
        
        // Enviar a endpoint personalizado si existe
        if (window.customAnalytics) {
            window.customAnalytics.track(eventData);
        }
        
        console.log('📊 Event tracked:', eventName, data);
    } catch (error) {
        console.warn('Analytics error:', error);
    }
}

function trackContentView(contentId, type) {
    if (!state.viewedContent.has(contentId)) {
        state.viewedContent.add(contentId);
        trackEvent('content_view', {
            content_id: contentId,
            content_type: type,
            view_count: state.viewedContent.size
        });
    }
}

function trackInteraction(action, target) {
    state.interactions++;
    trackEvent('user_interaction', {
        action: action,
        target: target,
        total_interactions: state.interactions
    });
}

// ============================
// PAYPAL INTEGRACIÓN COMPLETA
// ============================

class PayPalManager {
    constructor() {
        this.isInitialized = false;
        this.activeButtons = new Set();
        this.pendingPayments = new Map();
    }
    
    async initialize() {
        if (this.isInitialized || typeof paypal === 'undefined') return;
        
        try {
            console.log('💳 Initializing PayPal SDK...');
            this.isInitialized = true;
            trackEvent('paypal_initialized');
        } catch (error) {
            console.error('PayPal initialization error:', error);
            trackEvent('paypal_error', { type: 'initialization', error: error.message });
        }
    }
    
    createVIPButtons(container) {
        if (!container || container.hasChildNodes()) return;
        
        const buttonId = 'vip-' + Date.now();
        this.activeButtons.add(buttonId);
        
        return paypal.Buttons({
            style: {
                ...CONFIG.PAYPAL.STYLE,
                height: 45
            },
            
            createOrder: (data, actions) => {
                const plan = state.selectedPlan;
                const price = plan === 'monthly' ? CONFIG.PRICES.MONTHLY : CONFIG.PRICES.LIFETIME;
                
                trackEvent('paypal_order_create', {
                    plan: plan,
                    price: price,
                    currency: CONFIG.PAYPAL.CURRENCY
                });
                
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: price.toString(),
                            currency_code: CONFIG.PAYPAL.CURRENCY
                        },
                        description: `BeachGirl.pics VIP ${plan === 'monthly' ? 'Monthly' : 'Lifetime'} Access`,
                        custom_id: `vip_${plan}_${Date.now()}`
                    }],
                    application_context: {
                        brand_name: 'BeachGirl.pics',
                        locale: state.language === 'es' ? 'es_ES' : 'en_US',
                        user_action: 'PAY_NOW',
                        shipping_preference: 'NO_SHIPPING'
                    }
                });
            },
            
            onApprove: async (data, actions) => {
                try {
                    showNotification(TRANSLATIONS[state.language].payment_processing, 'info');
                    
                    const order = await actions.order.capture();
                    
                    trackEvent('paypal_payment_success', {
                        order_id: order.id,
                        plan: state.selectedPlan,
                        amount: order.purchase_units[0].amount.value
                    });
                    
                    await this.handleVIPActivation(state.selectedPlan, order);
                    
                    showNotification(TRANSLATIONS[state.language].payment_success, 'success');
                    closeModal();
                    
                    // Celebrar con confetti
                    if (typeof confetti === 'function') {
                        confetti({
                            particleCount: 200,
                            spread: 70,
                            origin: { y: 0.6 }
                        });
                    }
                    
                } catch (error) {
                    console.error('Payment approval error:', error);
                    trackEvent('paypal_payment_error', { error: error.message });
                    showNotification(TRANSLATIONS[state.language].payment_error, 'error');
                }
            },
            
            onError: (err) => {
                console.error('PayPal error:', err);
                trackEvent('paypal_error', { type: 'button_error', error: err });
                showNotification(TRANSLATIONS[state.language].payment_error, 'error');
            },
            
            onCancel: (data) => {
                trackEvent('paypal_payment_cancelled', { order_id: data.orderID });
                showNotification('Pago cancelado', 'info');
            }
            
        }).render(container);
    }
    
    createPackButtons(container) {
        if (!container || container.hasChildNodes()) return;
        
        const buttonId = 'pack-' + Date.now();
        this.activeButtons.add(buttonId);
        
        return paypal.Buttons({
            style: {
                ...CONFIG.PAYPAL.STYLE,
                height: 45
            },
            
            createOrder: (data, actions) => {
                const packData = CONFIG.PRICES.PACKS[state.selectedPack];
                
                trackEvent('paypal_pack_order_create', {
                    pack: state.selectedPack,
                    credits: packData.credits,
                    price: packData.price
                });
                
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: packData.price.toString(),
                            currency_code: CONFIG.PAYPAL.CURRENCY
                        },
                        description: `BeachGirl.pics ${packData.credits} Credits Pack`,
                        custom_id: `pack_${state.selectedPack}_${Date.now()}`
                    }],
                    application_context: {
                        brand_name: 'BeachGirl.pics',
                        locale: state.language === 'es' ? 'es_ES' : 'en_US',
                        user_action: 'PAY_NOW',
                        shipping_preference: 'NO_SHIPPING'
                    }
                });
            },
            
            onApprove: async (data, actions) => {
                try {
                    showNotification(TRANSLATIONS[state.language].payment_processing, 'info');
                    
                    const order = await actions.order.capture();
                    const packData = CONFIG.PRICES.PACKS[state.selectedPack];
                    
                    trackEvent('paypal_pack_payment_success', {
                        order_id: order.id,
                        pack: state.selectedPack,
                        credits: packData.credits,
                        amount: order.purchase_units[0].amount.value
                    });
                    
                    await this.handleCreditsActivation(packData.credits, order);
                    
                    showNotification(`+${packData.credits} ${TRANSLATIONS[state.language].credits_available}!`, 'success');
                    closeModal();
                    
                } catch (error) {
                    console.error('Pack payment error:', error);
                    trackEvent('paypal_pack_payment_error', { error: error.message });
                    showNotification(TRANSLATIONS[state.language].payment_error, 'error');
                }
            },
            
            onError: (err) => {
                console.error('PayPal pack error:', err);
                trackEvent('paypal_pack_error', { error: err });
                showNotification(TRANSLATIONS[state.language].payment_error, 'error');
            },
            
            onCancel: (data) => {
                trackEvent('paypal_pack_cancelled', { order_id: data.orderID });
                showNotification('Pago cancelado', 'info');
            }
            
        }).render(container);
    }
    
    createPPVButtons(container, contentId, price) {
        if (!container || container.hasChildNodes()) return;
        
        return paypal.Buttons({
            style: {
                ...CONFIG.PAYPAL.STYLE,
                height: 40,
                layout: 'horizontal'
            },
            
            createOrder: (data, actions) => {
                trackEvent('paypal_ppv_order_create', {
                    content_id: contentId,
                    price: price
                });
                
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: price.toString(),
                            currency_code: CONFIG.PAYPAL.CURRENCY
                        },
                        description: `BeachGirl.pics Premium Content`,
                        custom_id: `ppv_${contentId}_${Date.now()}`
                    }],
                    application_context: {
                        brand_name: 'BeachGirl.pics',
                        locale: state.language === 'es' ? 'es_ES' : 'en_US',
                        user_action: 'PAY_NOW',
                        shipping_preference: 'NO_SHIPPING'
                    }
                });
            },
            
            onApprove: async (data, actions) => {
                try {
                    const order = await actions.order.capture();
                    
                    trackEvent('paypal_ppv_payment_success', {
                        order_id: order.id,
                        content_id: contentId,
                        amount: price
                    });
                    
                    await this.handleContentUnlock(contentId);
                    
                    showNotification(TRANSLATIONS[state.language].unlocked_success, 'success');
                    closeModal();
                    
                } catch (error) {
                    console.error('PPV payment error:', error);
                    trackEvent('paypal_ppv_payment_error', { error: error.message });
                    showNotification(TRANSLATIONS[state.language].payment_error, 'error');
                }
            }
            
        }).render(container);
    }
    
    async handleVIPActivation(plan, orderData) {
        state.isVIP = true;
        localStorage.setItem('isVIP', 'true');
        
        if (plan === 'monthly') {
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + 30);
            localStorage.setItem('vipExpiry', expiry.toISOString());
        } else {
            localStorage.setItem('vipExpiry', 'lifetime');
        }
        
        // Guardar información del pago
        const paymentInfo = {
            orderId: orderData.id,
            plan: plan,
            activatedAt: new Date().toISOString(),
            amount: orderData.purchase_units[0].amount.value
        };
        localStorage.setItem('vipPaymentInfo', JSON.stringify(paymentInfo));
        
        // Reinicializar galería con acceso VIP
        await initializeGallery();
        
        // Activar notificaciones push si están disponibles
        if (CONFIG.FEATURES.PUSH_NOTIFICATIONS) {
            await requestNotificationPermission();
        }
    }
    
    async handleCreditsActivation(credits, orderData) {
        state.credits += credits;
        localStorage.setItem('credits', state.credits);
        
        // Guardar historial de compras
        const purchases = JSON.parse(localStorage.getItem('creditPurchases') || '[]');
        purchases.push({
            orderId: orderData.id,
            credits: credits,
            purchasedAt: new Date().toISOString(),
            amount: orderData.purchase_units[0].amount.value
        });
        localStorage.setItem('creditPurchases', JSON.stringify(purchases));
        
        updateCreditsDisplay();
    }
    
    async handleContentUnlock(contentId) {
        // Determinar tipo de contenido
        const isPhoto = contentId.includes('.webp') || contentId.includes('.jpg');
        
        if (isPhoto) {
            state.unlockedPhotos.add(contentId);
            localStorage.setItem('unlockedPhotos', JSON.stringify([...state.unlockedPhotos]));
        } else {
            state.unlockedVideos.add(contentId);
            localStorage.setItem('unlockedVideos', JSON.stringify([...state.unlockedVideos]));
        }
        
        // Reinicializar para mostrar contenido desbloqueado
        await initializeGallery();
    }
    
    cleanup() {
        this.activeButtons.clear();
        this.pendingPayments.clear();
    }
}

// Instancia global de PayPal Manager
const paypalManager = new PayPalManager();

// ============================
// RENDERIZADO AVANZADO
// ============================

function renderPhotosProgressive(container, photos) {
    if (!container || !photos) return;
    
    container.innerHTML = '<div class="loading-message">' + TRANSLATIONS[state.language].loading + '</div>';
    
    setTimeout(() => {
        container.innerHTML = '';
        
        photos.forEach((photo, index) => {
            setTimeout(() => {
                const isUnlocked = state.isVIP || state.unlockedPhotos.has(photo);
                const isNew = Math.random() < CONFIG.CONTENT.NEW_PERCENTAGE;
                const imagePath = PathDetector.buildPath(photo);
                
                const item = createPhotoItem(photo, index, isUnlocked, isNew, imagePath);
                container.appendChild(item);
                
                // Intersection Observer para lazy loading
                if ('IntersectionObserver' in window) {
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const img = entry.target.querySelector('img');
                                if (img && img.dataset.src) {
                                    loadImageWithPerformanceTracking(img);
                                }
                                observer.unobserve(entry.target);
                            }
                        });
                    }, { rootMargin: CONFIG.CONTENT.LAZY_LOAD_THRESHOLD });
                    
                    observer.observe(item);
                }
                
                // Animación de entrada
                setTimeout(() => {
                    item.classList.add('loaded');
                }, 50);
                
            }, index * CONFIG.ANIMATIONS.STAGGER);
        });
    }, 100);
}

function createPhotoItem(photo, index, isUnlocked, isNew, imagePath) {
    const item = document.createElement('div');
    item.className = 'content-item ' + (isUnlocked ? 'unlocked' : 'locked');
    if (isNew) item.classList.add('new-item');
    
    const wrapper = document.createElement('div');
    wrapper.className = 'content-wrapper';
    
    const img = document.createElement('img');
    img.dataset.src = imagePath; // Para lazy loading
    img.alt = 'Foto Premium ' + (index + 1);
    img.className = 'content-img';
    img.loading = 'lazy';
    
    // Click handler para tracking y vista
    img.addEventListener('click', () => {
        trackContentView(photo, 'photo');
        trackInteraction('photo_click', photo);
        
        if (isUnlocked) {
            openImageViewer(photo, imagePath);
        } else {
            showUnlockModal(photo, 'photo');
        }
    });
    
    wrapper.appendChild(img);
    
    if (isNew) {
        const badge = document.createElement('span');
        badge.className = 'badge-new';
        badge.textContent = TRANSLATIONS[state.language].new_today;
        wrapper.appendChild(badge);
    }
    
    if (!isUnlocked) {
        const overlay = createLockOverlay(photo, 'photo');
        wrapper.appendChild(overlay);
    }
    
    item.appendChild(wrapper);
    return item;
}

function createLockOverlay(contentId, type) {
    const overlay = document.createElement('div');
    overlay.className = 'lock-overlay';
    
    const content = document.createElement('div');
    content.className = 'lock-content';
    
    const icon = document.createElement('div');
    icon.className = 'lock-icon';
    icon.textContent = '🔒';
    
    const btnContainer = document.createElement('div');
    btnContainer.className = 'unlock-buttons';
    
    // Botón con créditos
    if (state.credits > 0) {
        const creditBtn = document.createElement('button');
        creditBtn.className = 'unlock-btn credit-btn';
        creditBtn.onclick = function() { unlockContent(contentId, type); };
        
        const text = document.createElement('span');
        text.textContent = TRANSLATIONS[state.language].unlock_credit;
        
        const cost = document.createElement('span');
        cost.className = 'credit-cost';
        cost.textContent = '💎 1';
        
        creditBtn.appendChild(text);
        creditBtn.appendChild(cost);
        btnContainer.appendChild(creditBtn);
    }
    
    // Botón PPV PayPal
    const ppvBtn = document.createElement('button');
    ppvBtn.className = 'unlock-btn ppv-btn';
    ppvBtn.onclick = function() { showPPVModal(contentId, type); };
    ppvBtn.textContent = `💳 €${CONFIG.PRICES.PPV}`;
    
    btnContainer.appendChild(ppvBtn);
    
    content.appendChild(icon);
    content.appendChild(btnContainer);
    overlay.appendChild(content);
    
    return overlay;
}

function loadImageWithPerformanceTracking(img) {
    if (!img.dataset.src) return;
    
    const startTime = performance.now();
    
    const tempImg = new Image();
    tempImg.onload = () => {
        const loadTime = performance.now() - startTime;
        state.imageLoadTimes.push(loadTime);
        state.averageLoadTime = state.imageLoadTimes.reduce((a, b) => a + b, 0) / state.imageLoadTimes.length;
        
        img.src = img.dataset.src;
        img.classList.add('loaded');
        delete img.dataset.src;
        
        trackEvent('image_loaded', {
            load_time: loadTime,
            average_load_time: state.averageLoadTime
        });
    };
    
    tempImg.onerror = () => {
        handleImageError(img);
    };
    
    tempImg.src = img.dataset.src;
}

function renderVideosProgressive(container, videos) {
    if (!container || !videos) return;
    
    container.innerHTML = '<div class="loading-message">' + TRANSLATIONS[state.language].loading + '</div>';
    
    setTimeout(() => {
        container.innerHTML = '';
        
        videos.forEach((video, index) => {
            setTimeout(() => {
                const isUnlocked = state.isVIP || state.unlockedVideos.has(video);
                const isNew = Math.random() < CONFIG.CONTENT.NEW_PERCENTAGE;
                const videoPath = PathDetector.buildPath(video);
                
                const item = createVideoItem(video, index, isUnlocked, isNew, videoPath);
                container.appendChild(item);
                
                setTimeout(() => {
                    item.classList.add('loaded');
                }, 50);
                
            }, index * CONFIG.ANIMATIONS.STAGGER);
        });
    }, 100);
}

function createVideoItem(video, index, isUnlocked, isNew, videoPath) {
    const item = document.createElement('div');
    item.className = 'content-item video-item ' + (isUnlocked ? 'unlocked' : 'locked');
    if (isNew) item.classList.add('new-item');
    
    const wrapper = document.createElement('div');
    wrapper.className = 'content-wrapper';
    
    if (isUnlocked) {
        const videoEl = document.createElement('video');
        videoEl.className = 'content-video';
        videoEl.controls = true;
        videoEl.poster = FALLBACK_SVG;
        videoEl.preload = 'metadata';
        
        if (state.autoPlay) {
            videoEl.autoplay = true;
            videoEl.muted = true; // Required for autoplay
        }
        
        const source = document.createElement('source');
        source.src = videoPath;
        source.type = 'video/mp4';
        
        videoEl.appendChild(source);
        
        // Event listeners para analytics
        videoEl.addEventListener('play', () => {
            trackContentView(video, 'video');
            trackEvent('video_play', { video_id: video });
        });
        
        videoEl.addEventListener('ended', () => {
            trackEvent('video_complete', { video_id: video });
        });
        
        wrapper.appendChild(videoEl);
    } else {
        const thumb = document.createElement('img');
        thumb.src = FALLBACK_SVG;
        thumb.alt = 'Video Premium ' + (index + 1);
        thumb.className = 'video-thumb';
        
        thumb.addEventListener('click', () => {
            trackInteraction('video_thumb_click', video);
            showUnlockModal(video, 'video');
        });
        
        wrapper.appendChild(thumb);
    }
    
    // Video badge
    const badge = document.createElement('div');
    badge.className = 'video-badge';
    
    const duration = document.createElement('span');
    duration.textContent = 'HD';
    
    const quality = document.createElement('span');
    quality.textContent = state.qualityPreference.toUpperCase();
    
    badge.appendChild(duration);
    badge.appendChild(quality);
    wrapper.appendChild(badge);
    
    if (isNew) {
        const newBadge = document.createElement('span');
        newBadge.className = 'badge-new';
        newBadge.textContent = TRANSLATIONS[state.language].new_today;
        wrapper.appendChild(newBadge);
    }
    
    if (!isUnlocked) {
        const overlay = createLockOverlay(video, 'video');
        wrapper.appendChild(overlay);
    }
    
    item.appendChild(wrapper);
    return item;
}

function renderTeaserCarousel() {
    const carousel = document.getElementById('teaserCarousel');
    if (!carousel) return;
    
    carousel.innerHTML = '';
    
    state.teaserItems.forEach((item, index) => {
        const imagePath = PathDetector.buildPath(item);
        const teaserItem = document.createElement('div');
        teaserItem.className = 'teaser-item';
        
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = 'Preview ' + (index + 1);
        img.loading = 'lazy';
        img.onerror = function() { handleImageError(this); };
        
        const overlay = document.createElement('div');
        overlay.className = 'teaser-overlay';
        
        const btn = document.createElement('button');
        btn.textContent = TRANSLATIONS[state.language].view_gallery;
        btn.onclick = () => {
            trackInteraction('teaser_click', item);
            showVIPModal();
        };
        
        overlay.appendChild(btn);
        teaserItem.appendChild(img);
        teaserItem.appendChild(overlay);
        carousel.appendChild(teaserItem);
    });
}

// ============================
// MODALES AVANZADOS
// ============================

function showVIPModal() {
    trackInteraction('vip_modal_open', 'header_button');
    
    const modal = document.getElementById('vipModal');
    if (modal) {
        modal.style.display = 'flex';
        state.currentModal = 'vip';
        
        // Inicializar PayPal después de mostrar el modal
        setTimeout(async () => {
            await paypalManager.initialize();
            const container = document.getElementById('paypal-button-container-vip');
            if (container) {
                container.innerHTML = ''; // Limpiar contenedor
                paypalManager.createVIPButtons(container);
            }
        }, 100);
    }
}

function showPackModal() {
    trackInteraction('pack_modal_open', 'header_button');
    
    const modal = document.getElementById('packModal');
    if (modal) {
        modal.style.display = 'flex';
        state.currentModal = 'pack';
        
        // Inicializar PayPal después de mostrar el modal
        setTimeout(async () => {
            await paypalManager.initialize();
            const container = document.getElementById('paypal-button-container-pack');
            if (container) {
                container.innerHTML = ''; // Limpiar contenedor
                paypalManager.createPackButtons(container);
            }
        }, 100);
    }
}

function showPPVModal(contentId, type) {
    trackInteraction('ppv_modal_open', contentId);
    
    state.selectedContent = { id: contentId, type: type };
    
    const modal = document.getElementById('ppvModal');
    if (modal) {
        // Actualizar información del modal
        const title = document.getElementById('ppvTitle');
        if (title) {
            title.textContent = TRANSLATIONS[state.language].unlock_content;
        }
        
        const price = document.getElementById('ppvPrice');
        if (price) {
            price.textContent = '€' + CONFIG.PRICES.PPV.toFixed(2);
        }
        
        modal.style.display = 'flex';
        state.currentModal = 'ppv';
        
        // Inicializar PayPal PPV
        setTimeout(async () => {
            await paypalManager.initialize();
            const container = document.getElementById('paypal-button-container-ppv');
            if (container) {
                container.innerHTML = ''; // Limpiar contenedor
                paypalManager.createPPVButtons(container, contentId, CONFIG.PRICES.PPV);
            }
        }, 100);
    }
}

function showUnlockModal(contentId, type) {
    if (state.credits > 0) {
        // Si tiene créditos, desbloquear directamente
        unlockContent(contentId, type);
    } else {
        // Si no tiene créditos, mostrar modal PPV
        showPPVModal(contentId, type);
    }
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    
    // Limpiar botones PayPal activos
    paypalManager.cleanup();
    
    state.currentModal = null;
    state.selectedContent = null;
    
    trackInteraction('modal_close', state.currentModal || 'unknown');
}

function selectPlan(plan) {
    state.selectedPlan = plan;
    localStorage.setItem('selectedPlan', plan);
    
    document.querySelectorAll('.plan-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('selected');
    }
    
    trackInteraction('plan_select', plan);
}

function selectPack(pack) {
    state.selectedPack = pack;
    localStorage.setItem('selectedPack', pack);
    
    document.querySelectorAll('.pack-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('selected');
    }
    
    trackInteraction('pack_select', pack);
}

// ============================
// FUNCIONES PRINCIPALES MEJORADAS
// ============================

function unlockContent(item, type) {
    if (state.credits < 1) {
        showNotification(TRANSLATIONS[state.language].no_credits, 'error');
        showPackModal();
        return;
    }
    
    trackInteraction('content_unlock', `${type}_${item}`);
    
    state.credits -= 1;
    localStorage.setItem('credits', state.credits);
    
    if (type === 'photo') {
        state.unlockedPhotos.add(item);
        localStorage.setItem('unlockedPhotos', JSON.stringify([...state.unlockedPhotos]));
    } else {
        state.unlockedVideos.add(item);
        localStorage.setItem('unlockedVideos', JSON.stringify([...state.unlockedVideos]));
    }
    
    updateCreditsDisplay();
    initializeGallery();
    
    showNotification(TRANSLATIONS[state.language].unlocked_success, 'success');
    
    // Celebración con confetti
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
    
    trackEvent('content_unlocked', {
        content_id: item,
        content_type: type,
        method: 'credits',
        remaining_credits: state.credits
    });
}

function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification ' + type;
    
    const icon = document.createElement('span');
    icon.className = 'notification-icon';
    icon.textContent = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    
    const text = document.createElement('span');
    text.className = 'notification-text';
    text.textContent = message;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.textContent = '×';
    closeBtn.onclick = () => notification.remove();
    
    notification.appendChild(icon);
    notification.appendChild(text);
    notification.appendChild(closeBtn);
    document.body.appendChild(notification);
    
    // Agregar estilos mejorados si no existen
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
        .notification{position:fixed;top:20px;right:20px;background:white;padding:15px 20px;border-radius:15px;box-shadow:0 10px 30px rgba(0,0,0,0.2);display:flex;align-items:center;gap:15px;z-index:10001;transform:translateX(400px);transition:all 0.3s cubic-bezier(0.4,0,0.2,1);max-width:350px;border-left:4px solid #ccc}
        .notification.show{transform:translateX(0)}
        .notification.success{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;border-left-color:#4ade80}
        .notification.error{background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%);color:white;border-left-color:#ef4444}
        .notification.info{background:linear-gradient(135deg,#89f7fe 0%,#66a6ff 100%);color:white;border-left-color:#3b82f6}
        .notification-close{background:rgba(255,255,255,0.2);border:none;color:inherit;width:24px;height:24px;border-radius:50%;cursor:pointer;font-size:16px;line-height:1;transition:background 0.2s}
        .notification-close:hover{background:rgba(255,255,255,0.3)}
        .loading-message{text-align:center;padding:40px;color:#999;font-size:18px}
        .content-item.loaded{animation:fadeInUp 0.6s cubic-bezier(0.4,0,0.2,1) forwards}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        .content-wrapper{position:relative;width:100%;height:100%;overflow:hidden;border-radius:12px}
        .content-img,.content-video,.video-thumb{width:100%;height:100%;object-fit:cover;transition:transform 0.3s ease}
        .content-item:hover .content-img{transform:scale(1.05)}
        .badge-new{position:absolute;top:10px;left:10px;background:linear-gradient(135deg,#00ff88,#4ade80);color:#001f3f;padding:4px 12px;border-radius:20px;font-size:0.8rem;font-weight:700;z-index:2;animation:pulse 2s infinite}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        .video-badge{position:absolute;bottom:10px;right:10px;display:flex;gap:5px;z-index:2}
        .video-badge span{background:rgba(0,0,0,0.8);color:white;padding:3px 8px;border-radius:5px;font-size:0.75rem;font-weight:600;backdrop-filter:blur(5px)}
        .lock-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.75);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;z-index:3;transition:background 0.3s ease}
        .content-item:hover .lock-overlay{background:rgba(0,0,0,0.85)}
        .lock-content{text-align:center;color:white}
        .lock-icon{font-size:3rem;margin-bottom:15px;animation:lockFloat 2s ease-in-out infinite}
        @keyframes lockFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        .unlock-buttons{display:flex;flex-direction:column;gap:10px}
        .unlock-btn{background:linear-gradient(135deg,#ffd700,#ff6b35);color:#001f3f;border:none;padding:12px 20px;border-radius:25px;font-weight:700;cursor:pointer;transition:all 0.3s ease;font-size:0.9rem;min-width:140px}
        .unlock-btn:hover{transform:translateY(-2px);box-shadow:0 5px 15px rgba(255,215,0,0.4)}
        .credit-btn{background:linear-gradient(135deg,#4ade80,#22c55e)}
        .ppv-btn{background:linear-gradient(135deg,#3b82f6,#1d4ed8)}
        .unlock-text{margin-right:5px}
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto-hide después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function updateCreditsDisplay() {
    const creditsNumber = document.getElementById('creditsNumber');
    const creditsDisplay = document.getElementById('creditsDisplay');
    
    if (creditsNumber) {
        creditsNumber.textContent = state.credits;
        
        // Animación cuando cambian los créditos
        creditsNumber.style.transform = 'scale(1.2)';
        setTimeout(() => {
            creditsNumber.style.transform = 'scale(1)';
        }, 200);
    }
    
    if (creditsDisplay) {
        if (state.credits > 0) {
            creditsDisplay.classList.add('active');
        } else {
            creditsDisplay.classList.remove('active');
        }
    }
}

function changeLanguage(lang) {
    const oldLang = state.language;
    state.language = lang;
    localStorage.setItem('language', lang);
    
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.dataset.translate;
        const translations = TRANSLATIONS[lang] || TRANSLATIONS['es'];
        if (translations[key]) {
            el.textContent = translations[key];
        }
    });
    
    // Actualizar selector de idioma
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = lang;
    }
    
    trackEvent('language_change', { from: oldLang, to: lang });
}

// ============================
// ISABELLA BOT MEJORADA
// ============================

class IsabellaBot {
    constructor() {
        this.messages = [];
        this.isOpen = false;
        this.lastInteraction = Date.now();
    }
    
    toggle() {
        const window = document.getElementById('isabellaWindow');
        if (!window) return;
        
        this.isOpen = !this.isOpen;
        window.style.display = this.isOpen ? 'block' : 'none';
        
        if (this.isOpen) {
            this.showWelcomeMessage();
            this.markNotificationAsRead();
            trackInteraction('isabella_open', 'chat_bubble');
        } else {
            trackInteraction('isabella_close', 'chat_bubble');
        }
    }
    
    showWelcomeMessage() {
        const messagesContainer = document.getElementById('isabellaMessages');
        if (!messagesContainer || messagesContainer.children.length > 0) return;
        
        const welcomeMessages = [
            `¡Hola! Soy Isabella, tu guía VIP personal 💕`,
            `Tienes ${state.credits} créditos disponibles`,
            state.isVIP ? '👑 ¡Eres VIP! Disfruta del acceso ilimitado' : '💎 ¿Te interesa ser VIP? Te explico los beneficios'
        ];
        
        welcomeMessages.forEach((message, index) => {
            setTimeout(() => {
                this.addMessage(message, 'isabella');
            }, index * 800);
        });
    }
    
    addMessage(text, sender = 'isabella') {
        const messagesContainer = document.getElementById('isabellaMessages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `isabella-message ${sender}`;
        
        if (sender === 'isabella') {
            const avatar = document.createElement('span');
            avatar.className = 'message-avatar';
            avatar.textContent = '💕';
            messageDiv.appendChild(avatar);
        }
        
        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        messageDiv.appendChild(textSpan);
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Animación de escritura
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 100);
        
        this.messages.push({ text, sender, timestamp: Date.now() });
    }
    
    handleAction(action) {
        trackInteraction('isabella_action', action);
        
        let responses = [];
        
        switch(action) {
            case 'vip':
                responses = [
                    '💎 ¡El VIP es increíble! Te doy todos los detalles:',
                    `• Acceso ILIMITADO a ${state.dailyPhotos.length + state.dailyVideos.length}+ contenidos`,
                    '• Sin restricciones ni esperas',
                    '• Contenido exclusivo solo para VIPs',
                    '• Solo €15/mes o €100 lifetime (¡ahorras €80!)',
                    '¿Te animo a probarlo? 😉'
                ];
                setTimeout(() => showVIPModal(), 2000);
                break;
                
            case 'daily':
                responses = [
                    `📅 ¡Hoy tenemos contenido fresco!`,
                    `🔥 ${state.dailyPhotos.length} fotos nuevas`,
                    `🎬 ${state.dailyVideos.length} videos HD`,
                    '⏰ Actualizamos todos los días a las 3:00 AM',
                    '🌟 ¡Siempre hay algo nuevo que descubrir!'
                ];
                break;
                
            case 'help':
                responses = [
                    '❓ ¡Estoy aquí para ayudarte!',
                    '💎 Puedes usar créditos (1 crédito = 1 contenido)',
                    '👑 O ser VIP para acceso ilimitado',
                    '💳 PayPal para pagos seguros',
                    '🔒 Todo el contenido es premium y exclusivo',
                    '¿Hay algo específico que te gustaría saber?'
                ];
                break;
                
            default:
                responses = ['¿En qué más puedo ayudarte? 😊'];
        }
        
        responses.forEach((response, index) => {
            setTimeout(() => {
                this.addMessage(response, 'isabella');
            }, index * 1000);
        });
    }
    
    markNotificationAsRead() {
        const notification = document.querySelector('.isabella-notification');
        if (notification) {
            notification.style.display = 'none';
        }
    }
    
    showRandomTip() {
        if (this.isOpen) return;
        
        const tips = [
            '💡 ¿Sabías que los VIPs tienen acceso a contenido exclusivo?',
            '🎯 Consejo: Los packs de créditos tienen hasta 70% de descuento',
            '⭐ Nuevo contenido cada día a las 3:00 AM',
            '🔥 El pack Silver es el más popular (50 créditos por €35)'
        ];
        
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        showNotification(randomTip, 'info');
    }
}

const isabella = new IsabellaBot();

// ============================
// FUNCIONES ADICIONALES
// ============================

function scrollCarousel(direction) {
    const carousel = document.getElementById('teaserCarousel');
    if (carousel) {
        const scrollAmount = 300;
        carousel.scrollBy({
            left: scrollAmount * direction,
            behavior: 'smooth'
        });
        
        trackInteraction('carousel_scroll', direction
