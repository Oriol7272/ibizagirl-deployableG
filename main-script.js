// ============================
// BeachGirl.pics Gallery Script v15.0.0 - COMPLETE EDITION FIXED
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
        ENVIRONMENT: 'production',
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
        PPV: 0.10
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

// Imagen fallback real (no SVG)
const FALLBACK_IMAGE = 'full/bikini.webp';

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
        monthly: '💳 €15/Mes',
        lifetime: '👑 Lifetime €100',
        
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
        // Core UI
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
        monthly: '💳 €15/Month',
        lifetime: '👑 Lifetime €100',
        
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
    // Evitar loop infinito de errores
    if (!img || img.dataset.fallbackUsed === 'true') {
        return;
    }
    
    img.dataset.fallbackUsed = 'true';
    state.failedLoads++;
    
    // Usar una imagen real como fallback
    const fallbackPath = FALLBACK_IMAGE;
    
    // Solo intentar el fallback si no es la misma imagen
    if (!img.src.includes(fallbackPath)) {
        img.src = fallbackPath;
        img.style.objectFit = 'cover';
        
        // Analytics de errores
        if (CONFIG.FEATURES.ANALYTICS) {
            trackEvent('image_error', {
                original_src: img.dataset.originalSrc || img.src,
                error_count: state.failedLoads
            });
        }
    } else {
        // Si el fallback también falla, poner un placeholder simple
        img.style.display = 'none';
        
        // Crear un div de placeholder
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 48px;
            border-radius: 12px;
        `;
        placeholder.innerHTML = '🌊';
        
        if (img.parentElement) {
            img.parentElement.appendChild(placeholder);
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
}// ============================
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
// PAYPAL INTEGRACIÓN COMPLETA - CORREGIDA
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
                        // CORRECCIÓN: Usar locale válido con guión
                        locale: state.language === 'es' ? 'es-ES' : 
                               state.language === 'en' ? 'en-US' :
                               state.language === 'de' ? 'de-DE' :
                               state.language === 'fr' ? 'fr-FR' :
                               state.language === 'it' ? 'it-IT' :
                               state.language === 'pt' ? 'pt-BR' : 'en-US',
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
                trackEvent('paypal_error', { type: 'button_error', error: err.toString() });
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
                        // CORRECCIÓN: Usar locale válido
                        locale: state.language === 'es' ? 'es-ES' : 
                               state.language === 'en' ? 'en-US' :
                               state.language === 'de' ? 'de-DE' :
                               state.language === 'fr' ? 'fr-FR' :
                               state.language === 'it' ? 'it-IT' :
                               state.language === 'pt' ? 'pt-BR' : 'en-US',
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
                trackEvent('paypal_pack_error', { error: err.toString() });
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
                        // CORRECCIÓN: Usar locale válido sin guión bajo
                        locale: state.language === 'es' ? 'es-ES' : 
                               state.language === 'en' ? 'en-US' :
                               state.language === 'de' ? 'de-DE' :
                               state.language === 'fr' ? 'fr-FR' :
                               state.language === 'it' ? 'it-IT' :
                               state.language === 'pt' ? 'pt-BR' : 'en-US',
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
            },
            
            onError: (err) => {
                console.error('PayPal PPV error:', err);
                trackEvent('paypal_ppv_error', { error: err.toString() });
                showNotification(TRANSLATIONS[state.language].payment_error, 'error');
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
    img.onerror = function() { handleImageError(this); };
    
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
        badge.className = 'new-badge';
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
        creditBtn.textContent = TRANSLATIONS[state.language].unlock_credit;
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
    item.dataset.type = 'video';
    if (isNew) item.classList.add('new-item');
    
    const wrapper = document.createElement('div');
    wrapper.className = 'content-wrapper';
    
    if (isUnlocked) {
        const videoEl = document.createElement('video');
        videoEl.className = 'content-video';
        videoEl.controls = true;
        videoEl.poster = FALLBACK_IMAGE;
        videoEl.preload = 'metadata';
        
        if (state.autoPlay) {
            videoEl.autoplay = true;
            videoEl.muted = true;
        }
        
        const source = document.createElement('source');
        source.src = videoPath;
        source.type = 'video/mp4';
        
        videoEl.appendChild(source);
        
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
        thumb.src = FALLBACK_IMAGE;
        thumb.alt = 'Video Premium ' + (index + 1);
        thumb.className = 'video-thumb';
        thumb.onerror = function() { handleImageError(this); };
        
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
        newBadge.className = 'new-badge';
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
}// ============================
// MODALES AVANZADOS
// ============================

function showVIPModal() {
    trackInteraction('vip_modal_open', 'header_button');
    
    const modal = document.getElementById('vipModal');
    if (modal) {
        modal.classList.add('active');
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
        modal.classList.add('active');
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
        
        modal.classList.add('active');
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
        modal.classList.remove('active');
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
        if (this.isOpen) {
            window.classList.add('active');
            this.showWelcomeMessage();
            this.markNotificationAsRead();
            trackInteraction('isabella_open', 'chat_bubble');
        } else {
            window.classList.remove('active');
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
        
        trackInteraction('carousel_scroll', direction > 0 ? 'right' : 'left');
    }
}

function openImageViewer(photoId, imagePath) {
    // Crear modal de visor de imágenes
    const viewer = document.createElement('div');
    viewer.className = 'image-viewer-modal';
    viewer.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10002;
        backdrop-filter: blur(5px);
    `;
    
    const container = document.createElement('div');
    container.style.cssText = `
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const img = document.createElement('img');
    img.src = imagePath;
    img.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        border-radius: 10px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
    `;
    
    closeBtn.onclick = () => {
        viewer.remove();
        trackInteraction('image_viewer_close', photoId);
    };
    
    viewer.onclick = (e) => {
        if (e.target === viewer) {
            viewer.remove();
            trackInteraction('image_viewer_close', photoId);
        }
    };
    
    container.appendChild(img);
    container.appendChild(closeBtn);
    viewer.appendChild(container);
    document.body.appendChild(viewer);
    
    // Animación de entrada
    viewer.style.opacity = '0';
    setTimeout(() => {
        viewer.style.transition = 'opacity 0.3s ease';
        viewer.style.opacity = '1';
    }, 10);
    
    trackEvent('image_viewer_open', { photo_id: photoId });
}

// ============================
// SISTEMA DE NOTIFICACIONES PUSH
// ============================

async function requestNotificationPermission() {
    if (!CONFIG.FEATURES.PUSH_NOTIFICATIONS || !('Notification' in window)) return;
    
    try {
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
            // Registrar para notificaciones push
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
                });
                
                // Enviar suscripción al servidor
                await sendSubscriptionToServer(subscription);
            }
            
            trackEvent('push_notifications_enabled');
        }
    } catch (error) {
        console.warn('Push notifications error:', error);
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

async function sendSubscriptionToServer(subscription) {
    // Implementar envío al servidor
    try {
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subscription: subscription,
                userId: state.sessionStart,
                language: state.language
            })
        });
        
        if (response.ok) {
            console.log('Subscription sent to server');
        }
    } catch (error) {
        console.warn('Failed to send subscription to server:', error);
    }
}

// ============================
// INICIALIZACIÓN PRINCIPAL
// ============================

async function initializeGallery() {
    if (!window.ALL_PHOTOS_POOL || !window.ALL_UNCENSORED_PHOTOS_POOL || !window.ALL_VIDEOS_POOL) {
        console.error('❌ Content database not loaded');
        showNotification('Error: Base de datos no cargada', 'error');
        return;
    }
    
    console.log('🌊 Initializing Gallery v' + CONFIG.VERSION);
    
    try {
        // Combinar todos los arrays de fotos
        const allPhotos = [...window.ALL_PHOTOS_POOL, ...window.ALL_UNCENSORED_PHOTOS_POOL];
        
        // Generar rotación diaria
        state.dailyPhotos = getDailyRotation(allPhotos, CONFIG.CONTENT.DAILY_PHOTOS);
        state.dailyVideos = getDailyRotation(window.ALL_VIDEOS_POOL, CONFIG.CONTENT.DAILY_VIDEOS);
        state.teaserItems = getDailyRotation(window.ALL_PHOTOS_POOL, CONFIG.CONTENT.TEASER_COUNT);
        
        // Calcular páginas totales
        state.totalPages = Math.ceil(state.dailyPhotos.length / CONFIG.CONTENT.ITEMS_PER_PAGE);
        
        // Renderizar contenido
        renderPhotosProgressive(document.getElementById('photosGrid'), state.dailyPhotos);
        renderVideosProgressive(document.getElementById('videosGrid'), state.dailyVideos);
        renderTeaserCarousel();
        
        // Actualizar UI
        updateCreditsDisplay();
        updateStatsDisplay();
        changeLanguage(state.language);
        
        // Verificar expiración VIP
        checkVIPExpiry();
        
        // Inicializar PayPal
        await paypalManager.initialize();
        
        state.initialized = true;
        
        trackEvent('gallery_initialized', {
            total_photos: allPhotos.length,
            total_videos: window.ALL_VIDEOS_POOL.length,
            daily_photos: state.dailyPhotos.length,
            daily_videos: state.dailyVideos.length,
            is_vip: state.isVIP,
            credits: state.credits
        });
        
        console.log(`✅ Gallery initialized successfully:
        - ${state.dailyPhotos.length} daily photos
        - ${state.dailyVideos.length} daily videos  
        - VIP: ${state.isVIP}
        - Credits: ${state.credits}
        - Total content: ${allPhotos.length + window.ALL_VIDEOS_POOL.length}`);
        
    } catch (error) {
        console.error('❌ Gallery initialization failed:', error);
        trackEvent('gallery_init_error', { error: error.message });
        showNotification('Error al inicializar la galería', 'error');
    }
}

function updateStatsDisplay() {
    const elements = {
        photoCount: document.getElementById('photoCount'),
        videoCount: document.getElementById('videoCount'),
        totalViews: document.getElementById('totalViews'),
        updateHour: document.getElementById('updateHour')
    };
    
    if (elements.photoCount) {
        elements.photoCount.textContent = state.dailyPhotos.length;
    }
    
    if (elements.videoCount) {
        elements.videoCount.textContent = state.dailyVideos.length;
    }
    
    if (elements.totalViews) {
        // Generar número realista basado en el día
        const baseViews = 25800000;
        const dailyIncrease = Math.floor(Math.random() * 150000) + 50000;
        const todayViews = baseViews + dailyIncrease;
        elements.totalViews.textContent = (todayViews / 1000000).toFixed(1) + 'M';
    }
    
    if (elements.updateHour) {
        elements.updateHour.textContent = '3:00 AM';
    }
}

function checkVIPExpiry() {
    const vipExpiry = localStorage.getItem('vipExpiry');
    if (vipExpiry && vipExpiry !== 'lifetime') {
        const expiryDate = new Date(vipExpiry);
        if (expiryDate < new Date()) {
            state.isVIP = false;
            localStorage.setItem('isVIP', 'false');
            localStorage.removeItem('vipExpiry');
            showNotification('Tu suscripción VIP ha expirado', 'info');
            trackEvent('vip_expired');
        }
    }
}

// ============================
// EVENT LISTENERS Y INICIALIZACIÓN
// ============================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 DOM Content Loaded - Starting initialization...');
    
    try {
        // Ocultar pantalla de carga con efecto
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 1500);
        
        // Inicializar galería principal
        await initializeGallery();
        
        // Configurar slideshow del banner
        setupBannerSlideshow();
        
        // Configurar Isabella con tips periódicos
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% probabilidad cada 2 minutos
                isabella.showRandomTip();
            }
        }, 120000);
        
        // Solicitar permisos de notificación si es VIP
        if (state.isVIP && CONFIG.FEATURES.PUSH_NOTIFICATIONS) {
            setTimeout(() => requestNotificationPermission(), 3000);
        }
        
        // Track session start
        trackEvent('session_start', {
            is_vip: state.isVIP,
            credits: state.credits,
            language: state.language,
            user_agent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        });
        
        console.log('✅ Full application initialized successfully');
        
    } catch (error) {
        console.error('❌ Application initialization failed:', error);
        trackEvent('app_init_error', { error: error.message });
        showNotification('Error al cargar la aplicación', 'error');
    }
});

function setupBannerSlideshow() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.banner-slide');
    
    if (slides.length > 1) {
        setInterval(() => {
            slides[currentSlide]?.classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide]?.classList.add('active');
        }, 5000);
    }
}

// Cleanup al cerrar la página
window.addEventListener('beforeunload', () => {
    const sessionDuration = Date.now() - state.sessionStart;
    
    trackEvent('session_end', {
        duration: sessionDuration,
        interactions: state.interactions,
        viewed_content: state.viewedContent.size,
        average_load_time: state.averageLoadTime,
        failed_loads: state.failedLoads
    });
    
    // Cleanup PayPal
    paypalManager.cleanup();
});

// ============================
// EXPORTAR FUNCIONES GLOBALES
// ============================

// Funciones principales
window.handleImageError = handleImageError;
window.changeLanguage = changeLanguage;
window.showVIPModal = showVIPModal;
window.showPackModal = showPackModal;
window.closeModal = closeModal;
window.unlockContent = unlockContent;
window.selectPlan = selectPlan;
window.selectPack = selectPack;
window.scrollCarousel = scrollCarousel;

// Isabella Bot
window.toggleIsabella = () => isabella.toggle();
window.isabellaAction = (action) => isabella.handleAction(action);

// Estado y configuración
window.state = state;
window.CONFIG = CONFIG;
window.TRANSLATIONS = TRANSLATIONS;
window.paypalManager = paypalManager;
window.isabella = isabella;

// Funciones de utilidad
window.trackEvent = trackEvent;
window.showNotification = showNotification;
window.openImageViewer = openImageViewer;

// ============================
// DEBUG Y HERRAMIENTAS DE DESARROLLO
// ============================

window.galleryDebug = {
    version: CONFIG.VERSION,
    
    stats: () => ({
        version: CONFIG.VERSION,
        totalPhotos: (window.ALL_PHOTOS_POOL?.length || 0) + (window.ALL_UNCENSORED_PHOTOS_POOL?.length || 0),
        totalVideos: window.ALL_VIDEOS_POOL?.length || 0,
        dailyPhotos: state.dailyPhotos.length,
        dailyVideos: state.dailyVideos.length,
        credits: state.credits,
        isVIP: state.isVIP,
        unlockedPhotos: state.unlockedPhotos.size,
        unlockedVideos: state.unlockedVideos.size,
        sessionDuration: Date.now() - state.sessionStart,
        interactions: state.interactions,
        viewedContent: state.viewedContent.size,
        averageLoadTime: state.averageLoadTime + 'ms',
        failedLoads: state.failedLoads
    }),
    
    unlockAll: () => {
        state.isVIP = true;
        localStorage.setItem('isVIP', 'true');
        localStorage.setItem('vipExpiry', 'lifetime');
        initializeGallery();
        showNotification('🎉 Debug: Todo desbloqueado', 'success');
        console.log('✅ Debug: Todo desbloqueado');
    },
    
    addCredits: (num = 100) => {
        state.credits += parseInt(num);
        localStorage.setItem('credits', state.credits);
        updateCreditsDisplay();
        showNotification(`🎉 Debug: +${num} créditos añadidos`, 'success');
        console.log(`✅ Debug: ${num} créditos añadidos`);
    },
    
    simulatePayment: (type = 'vip', plan = 'lifetime') => {
        if (type === 'vip') {
            paypalManager.handleVIPActivation(plan, { 
                id: 'DEBUG_' + Date.now(),
                purchase_units: [{ amount: { value: plan === 'monthly' ? '15' : '100' } }]
            });
            showNotification('🎉 Debug: VIP activado', 'success');
        } else if (type === 'credits') {
            paypalManager.handleCreditsActivation(50, {
                id: 'DEBUG_' + Date.now(),
                purchase_units: [{ amount: { value: '35' } }]
            });
            showNotification('🎉 Debug: 50 créditos añadidos', 'success');
        }
    },
    
    resetAll: () => {
        if (confirm('¿Resetear todo el estado de la aplicación?')) {
            localStorage.clear();
            location.reload();
        }
    }
};

// Debug PayPal locale issues
window.debugPayPal = {
    testLocales: function() {
        const validLocales = [
            'en-US', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 'pt-BR',
            'en-GB', 'en-AU', 'en-CA', 'es-MX', 'es-AR', 'fr-CA'
        ];
        
        console.log('Valid PayPal locales:', validLocales);
        console.log('Current language:', state.language);
        console.log('Current locale would be:', state.language === 'es' ? 'es-ES' : 'en-US');
        
        return validLocales;
    },
    
    checkSDK: function() {
        if (typeof paypal !== 'undefined') {
            console.log('✅ PayPal SDK loaded');
            console.log('PayPal version:', paypal.version);
            return true;
        } else {
            console.error('❌ PayPal SDK not loaded');
            return false;
        }
    }
};

// Mensaje de bienvenida en consola
console.log(`
🌊 ===============================================
   BeachGirl.pics Gallery v${CONFIG.VERSION}
   COMPLETE EDITION with PayPal Integration
   
   📊 Estadísticas:
   • ${(window.ALL_PHOTOS_POOL?.length || 0) + (window.ALL_UNCENSORED_PHOTOS_POOL?.length || 0)} fotos totales
   • ${window.ALL_VIDEOS_POOL?.length || 0} videos HD
   • ${state.dailyPhotos.length} fotos del día
   • ${state.dailyVideos.length} videos del día
   
   🛠️ Debug: galleryDebug
   • galleryDebug.stats() - Estadísticas completas
   • galleryDebug.unlockAll() - Desbloquear todo
   • galleryDebug.addCredits(100) - Añadir créditos
   • galleryDebug.simulatePayment('vip') - Simular pago VIP
   • galleryDebug.resetAll() - Resetear todo
   
   💳 PayPal: Configurado y listo
   🤖 Isabella: Bot activo
   📊 Analytics: Habilitado
   🔔 Notificaciones: Disponibles
   
🌊 ===============================================
`);
