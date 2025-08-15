// ============================
// BeachGirl.pics Gallery Script v14.0.0
// Script principal con rutas corregidas
// ============================

'use strict';

// ============================
// VERIFICAR CARGA DE BASE DE DATOS
// ============================

if (typeof window.ALL_PHOTOS_POOL === 'undefined' || 
    typeof window.ALL_UNCENSORED_PHOTOS_POOL === 'undefined' || 
    typeof window.ALL_VIDEOS_POOL === 'undefined') {
    console.error('❌ ERROR: content-database.js no está cargado correctamente');
}

// ============================
// CONFIGURATION
// ============================

const CONFIG = {
    VERSION: '14.0.0',
    CONTENT: {
        DAILY_PHOTOS: 200,
        DAILY_VIDEOS: 40,
        NEW_PERCENTAGE: 0.3,  // 30% aparece como "nuevo"
        TEASER_COUNT: 15
    },
    PAYPAL: {
        CLIENT_ID: 'AfQEdiielw5fm3wF08p9pcxwqR3gPz82YRNUTKY4A8WNG9AktiGsDNyr2i7BsjVzSwwpeCwR7Tt7DPq5',
        CURRENCY: 'EUR'
    },
    PRICES: {
        MONTHLY: 15,
        LIFETIME: 100,
        PACKS: {
            10: 10,
            20: 15,
            50: 25,
            100: 50
        }
    },
    // Configuración de rutas - IMPORTANTE: sin /public/assets
    PATHS: {
        DEFAULT_IMAGE: 'full/bikini.jpg',  // Imagen por defecto si falla la carga
        DEFAULT_BANNER: 'full/bikbanner.jpg',
        DEFAULT_BANNER2: 'full/bikbanner2.jpg'
    }
};

// ============================
// STATE MANAGEMENT
// ============================

const state = {
    language: localStorage.getItem('language') || 'es',
    unlockedPhotos: new Set(JSON.parse(localStorage.getItem('unlockedPhotos') || '[]')),
    unlockedVideos: new Set(JSON.parse(localStorage.getItem('unlockedVideos') || '[]')),
    credits: parseInt(localStorage.getItem('credits') || '0'),
    isVIP: localStorage.getItem('isVIP') === 'true',
    dailyPhotos: [],
    dailyVideos: [],
    teaserItems: [],
    isabellaOpen: false,
    currentModal: null,
    selectedPlan: 'lifetime',
    selectedPack: null
};

// ============================
// MULTI-IDIOMA
// ============================

const TRANSLATIONS = {
    es: {
        welcome: 'Bienvenida al Paraíso 🌴',
        daily_content: '200+ fotos y 40+ videos actualizados DIARIAMENTE',
        unlock_all: '🔓 Desbloquear Todo',
        view_gallery: '📸 Ver Galería',
        loading: 'Cargando el paraíso...',
        subtitle: 'Contenido Exclusivo del Paraíso',
        teaser_title: '🔥 Vista Previa Exclusiva',
        photos_paradise: '📸 Fotos del Paraíso',
        new_today: '¡NUEVO HOY!',
        videos_exclusive: '🎬 Videos Exclusivos',
        fresh_content: '¡CONTENIDO FRESCO!',
        photos_today: '200 Fotos de Hoy',
        videos_hd: '40 Videos HD',
        total_views: '25.8M Vistas Totales',
        updates: '24/7 Actualizaciones',
        vip_unlimited: '👑 Acceso VIP Ilimitado',
        monthly: '📅 Mensual',
        lifetime: '♾️ Lifetime',
        megapack: '📦 MEGA PACKS -70%',
        isabella_title: 'Isabella - Tu Guía VIP',
        vip_info: '💎 VIP Info',
        news: '📅 Novedades',
        help: '❓ Ayuda',
        credits_available: 'Créditos Disponibles',
        unlock_credit: 'Desbloquear (1 crédito)',
        get_unlimited: 'Obtener Acceso Ilimitado',
        no_credits: 'Sin créditos suficientes',
        unlocked_success: '¡Contenido desbloqueado!',
        pack_purchased: '¡Pack comprado! +{credits} créditos',
        vip_activated: '¡VIP Activado! Acceso ilimitado'
    },
    en: {
        welcome: 'Welcome to Paradise 🌴',
        daily_content: '200+ photos and 40+ videos updated DAILY',
        unlock_all: '🔓 Unlock Everything',
        view_gallery: '📸 View Gallery',
        loading: 'Loading paradise...',
        subtitle: 'Exclusive Paradise Content',
        teaser_title: '🔥 Exclusive Preview',
        photos_paradise: '📸 Paradise Photos',
        new_today: 'NEW TODAY!',
        videos_exclusive: '🎬 Exclusive Videos',
        fresh_content: 'FRESH CONTENT!',
        photos_today: '200 Photos Today',
        videos_hd: '40 HD Videos',
        total_views: '25.8M Total Views',
        updates: '24/7 Updates',
        vip_unlimited: '👑 Unlimited VIP Access',
        monthly: '📅 Monthly',
        lifetime: '♾️ Lifetime',
        megapack: '📦 MEGA PACKS -70%',
        isabella_title: 'Isabella - Your VIP Guide',
        vip_info: '💎 VIP Info',
        news: '📅 News',
        help: '❓ Help',
        credits_available: 'Credits Available',
        unlock_credit: 'Unlock (1 credit)',
        get_unlimited: 'Get Unlimited Access',
        no_credits: 'Not enough credits',
        unlocked_success: 'Content unlocked!',
        pack_purchased: 'Pack purchased! +{credits} credits',
        vip_activated: 'VIP Activated! Unlimited access'
    }
};

// ============================
// FUNCIONES DE UTILIDAD
// ============================

function buildImagePath(path) {
    // Las rutas ya vienen con /full o /uncensored desde content-database.js
    // Solo quitar la barra inicial si existe
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return cleanPath;
}

function getDefaultImage() {
    return CONFIG.PATHS.DEFAULT_IMAGE;
}

function handleImageError(img, isVideo = false) {
    // Si falla la carga, usar imagen por defecto
    if (!img.dataset.defaultUsed) {
        img.dataset.defaultUsed = 'true';
        img.src = getDefaultImage();
        console.warn('Image load failed, using default:', img.src);
    }
}

// ============================
// FUNCIONES DE ROTACIÓN DIARIA
// ============================

function getDailyRotation(pool, count) {
    // Usar la fecha como semilla para que cambie cada día
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const seed = dateString.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    // Función de mezcla determinística basada en la semilla
    const shuffled = [...pool].sort((a, b) => {
        const aVal = a.split('').reduce((sum, char) => sum + char.charCodeAt(0), seed);
        const bVal = b.split('').reduce((sum, char) => sum + char.charCodeAt(0), seed);
        return (aVal * 9301 + 49297) % 233280 - (bVal * 9301 + 49297) % 233280;
    });
    
    return shuffled.slice(0, Math.min(count, pool.length));
}

// ============================
// FUNCIONES DE RENDERIZADO
// ============================

function renderPhotosProgressive(container, photos) {
    if (!container) return;
    
    container.innerHTML = '';
    let loadedCount = 0;
    
    photos.forEach((photo, index) => {
        setTimeout(() => {
            const isUnlocked = state.isVIP || state.unlockedPhotos.has(photo);
            const isNew = Math.random() < CONFIG.CONTENT.NEW_PERCENTAGE;
            const imagePath = buildImagePath(photo);
            
            const item = document.createElement('div');
            item.classList.add('content-item', isUnlocked ? 'unlocked' : 'locked');
            if (isNew) item.classList.add('new-item');
            
            // Crear estructura HTML
            item.innerHTML = `
                <div class="content-wrapper">
                    <img src="${imagePath}" 
                         alt="Foto Premium ${index + 1}" 
                         class="content-img" 
                         loading="lazy"
                         onerror="handleImageError(this)">
                    ${isNew ? '<span class="badge-new">NUEVO</span>' : ''}
                    ${!isUnlocked ? `
                        <div class="lock-overlay">
                            <div class="lock-content">
                                <div class="lock-icon">🔒</div>
                                <button class="unlock-btn" onclick="unlockContent('${photo}', 'photo')">
                                    <span class="unlock-text">${TRANSLATIONS[state.language].unlock_credit}</span>
                                    <span class="credit-cost">💎 1</span>
                                </button>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
            
            // Agregar manejador de error a la imagen
            const img = item.querySelector('img');
            img.addEventListener('error', function() {
                handleImageError(this);
            });
            
            container.appendChild(item);
            
            // Animación de entrada
            setTimeout(() => {
                item.classList.add('loaded');
            }, 50);
            
            loadedCount++;
            
        }, index * 30); // Carga progresiva
    });
}

function renderVideosProgressive(container, videos) {
    if (!container) return;
    
    container.innerHTML = '';
    let loadedCount = 0;
    
    videos.forEach((video, index) => {
        setTimeout(() => {
            const isUnlocked = state.isVIP || state.unlockedVideos.has(video);
            const isNew = Math.random() < CONFIG.CONTENT.NEW_PERCENTAGE;
            const videoPath = buildImagePath(video);
            // Para el thumbnail, usar la imagen por defecto ya que no tenemos thumbnails específicos
            const thumbnail = getDefaultImage();
            
            const item = document.createElement('div');
            item.classList.add('content-item', 'video-item', isUnlocked ? 'unlocked' : 'locked');
            if (isNew) item.classList.add('new-item');
            
            item.innerHTML = `
                <div class="content-wrapper">
                    ${isUnlocked ? `
                        <video class="content-video" 
                               controls 
                               poster="${thumbnail}"
                               preload="metadata">
                            <source src="${videoPath}" type="video/mp4">
                            Tu navegador no soporta videos HTML5.
                        </video>
                    ` : `
                        <img src="${thumbnail}" 
                             alt="Video Premium ${index + 1}" 
                             class="video-thumb"
                             onerror="handleImageError(this, true)">
                    `}
                    <div class="video-badge">
                        <span class="duration">HD</span>
                        <span class="quality">1080p</span>
                    </div>
                    ${isNew ? '<span class="badge-new">NUEVO</span>' : ''}
                    ${!isUnlocked ? `
                        <div class="lock-overlay">
                            <div class="lock-content">
                                <div class="play-icon">▶️</div>
                                <div class="lock-icon">🔒</div>
                                <button class="unlock-btn" onclick="unlockContent('${video}', 'video')">
                                    <span class="unlock-text">${TRANSLATIONS[state.language].unlock_credit}</span>
                                    <span class="credit-cost">💎 1</span>
                                </button>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
            
            // Agregar manejador de error a la imagen thumbnail
            const img = item.querySelector('img');
            if (img) {
                img.addEventListener('error', function() {
                    handleImageError(this, true);
                });
            }
            
            container.appendChild(item);
            
            // Animación de entrada
            setTimeout(() => {
                item.classList.add('loaded');
            }, 50);
            
            loadedCount++;
            
        }, index * 30);
    });
}

function renderTeaserCarousel() {
    const carousel = document.getElementById('teaserCarousel');
    if (!carousel) return;
    
    carousel.innerHTML = '';
    
    state.teaserItems.forEach((item, index) => {
        const imagePath = buildImagePath(item);
        const teaserItem = document.createElement('div');
        teaserItem.className = 'teaser-item';
        teaserItem.innerHTML = `
            <img src="${imagePath}" 
                 alt="Preview ${index + 1}" 
                 loading="lazy"
                 onerror="handleImageError(this)">
            <div class="teaser-overlay">
                <button onclick="showVIPModal()">Ver Completo</button>
            </div>
        `;
        
        // Agregar manejador de error
        const img = teaserItem.querySelector('img');
        img.addEventListener('error', function() {
            handleImageError(this);
        });
        
        carousel.appendChild(teaserItem);
    });
}

// ============================
// FUNCIONES DE DESBLOQUEO
// ============================

function unlockContent(item, type) {
    // Verificar créditos
    if (state.credits < 1) {
        showNotification(TRANSLATIONS[state.language].no_credits, 'error');
        showPackModal();
        return;
    }
    
    // Descontar crédito
    state.credits -= 1;
    localStorage.setItem('credits', state.credits);
    
    // Marcar como desbloqueado
    if (type === 'photo') {
        state.unlockedPhotos.add(item);
        localStorage.setItem('unlockedPhotos', JSON.stringify([...state.unlockedPhotos]));
    } else {
        state.unlockedVideos.add(item);
        localStorage.setItem('unlockedVideos', JSON.stringify([...state.unlockedVideos]));
    }
    
    // Actualizar UI
    updateCreditsDisplay();
    initializeGallery();
    
    // Notificación y celebración
    showNotification(TRANSLATIONS[state.language].unlocked_success, 'success');
    celebrateUnlock();
}

function celebrateUnlock() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

// ============================
// NOTIFICACIONES
// ============================

function showNotification(message, type = 'info') {
    // Remover notificación existente si hay
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-icon">
            ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
        </span>
        <span class="notification-text">${message}</span>
    `;
    document.body.appendChild(notification);
    
    // Agregar estilos si no existen
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification.success {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            .notification.error {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
            }
            .notification-icon {
                font-size: 20px;
            }
            .pulse {
                animation: pulse 0.5s ease;
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ============================
// PAYPAL INTEGRATION
// ============================

function initializePayPal() {
    if (typeof paypal === 'undefined') {
        console.warn('PayPal SDK not loaded');
        return;
    }
    
    // Botón para VIP
    const vipContainer = document.getElementById('paypal-button-container-vip');
    if (vipContainer && !vipContainer.hasChildNodes()) {
        paypal.Buttons({
            createOrder: function(data, actions) {
                const price = state.selectedPlan === 'monthly' ? CONFIG.PRICES.MONTHLY : CONFIG.PRICES.LIFETIME;
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: price.toString(),
                            currency_code: CONFIG.PAYPAL.CURRENCY
                        },
                        description: state.selectedPlan === 'monthly' ? 'VIP Mensual' : 'VIP Lifetime'
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    activateVIP(state.selectedPlan);
                    showNotification(TRANSLATIONS[state.language].vip_activated, 'success');
                    closeModal();
                });
            },
            onError: function(err) {
                console.error('PayPal Error:', err);
                showNotification('Error al procesar el pago', 'error');
            }
        }).render('#paypal-button-container-vip');
    }
    
    // Botón para Packs
    const packContainer = document.getElementById('paypal-button-container-pack');
    if (packContainer && !packContainer.hasChildNodes()) {
        paypal.Buttons({
            createOrder: function(data, actions) {
                if (!state.selectedPack) {
                    showNotification('Selecciona un pack primero', 'error');
                    return;
                }
                
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: CONFIG.PRICES.PACKS[state.selectedPack].toString(),
                            currency_code: CONFIG.PAYPAL.CURRENCY
                        },
                        description: `Pack de ${state.selectedPack} créditos`
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    addCredits(state.selectedPack);
                    const message = TRANSLATIONS[state.language].pack_purchased.replace('{credits}', state.selectedPack);
                    showNotification(message, 'success');
                    closeModal();
                });
            },
            onError: function(err) {
                console.error('PayPal Error:', err);
                showNotification('Error al procesar el pago', 'error');
            }
        }).render('#paypal-button-container-pack');
    }
}

function activateVIP(plan) {
    state.isVIP = true;
    localStorage.setItem('isVIP', 'true');
    
    if (plan === 'monthly') {
        // Guardar fecha de expiración (30 días)
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 30);
        localStorage.setItem('vipExpiry', expiry.toISOString());
    } else {
        // Lifetime no expira
        localStorage.setItem('vipExpiry', 'lifetime');
    }
    
    initializeGallery();
    celebrateUnlock();
}

function addCredits(amount) {
    state.credits += parseInt(amount);
    localStorage.setItem('credits', state.credits);
    updateCreditsDisplay();
}

// ============================
// UI FUNCTIONS
// ============================

function updateCreditsDisplay() {
    const creditsNumber = document.getElementById('creditsNumber');
    if (creditsNumber) {
        creditsNumber.textContent = state.credits;
        creditsNumber.classList.add('pulse');
        setTimeout(() => {
            creditsNumber.classList.remove('pulse');
        }, 500);
    }
}

function changeLanguage(lang) {
    state.language = lang;
    localStorage.setItem('language', lang);
    
    // Actualizar todos los textos
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.dataset.translate;
        el.textContent = TRANSLATIONS[lang][key] || TRANSLATIONS['es'][key] || key;
    });
}

// ============================
// MODALES
// ============================

function showVIPModal() {
    const modal = document.getElementById('vipModal');
    if (modal) {
        modal.style.display = 'flex';
        state.currentModal = 'vip';
        setTimeout(() => initializePayPal(), 100);
    }
}

function showPackModal() {
    const modal = document.getElementById('packModal');
    if (modal) {
        modal.style.display = 'flex';
        state.currentModal = 'pack';
        setTimeout(() => initializePayPal(), 100);
    }
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    state.currentModal = null;
}

function selectPlan(plan) {
    state.selectedPlan = plan;
    document.querySelectorAll('.plan-card').forEach(card => {
        card.classList.remove('selected');
    });
    const planCard = document.getElementById(plan + 'Plan');
    if (planCard) {
        planCard.classList.add('selected');
    }
}

function selectPack(credits) {
    state.selectedPack = credits;
    document.querySelectorAll('.pack-card').forEach(card => {
        card.classList.remove('selected');
    });
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('selected');
    }
}

// ============================
// ISABELLA CHAT BOT
// ============================

function toggleIsabella() {
    const window = document.getElementById('isabellaWindow');
    if (window) {
        state.isabellaOpen = !state.isabellaOpen;
        window.style.display = state.isabellaOpen ? 'block' : 'none';
    }
}

function isabellaAction(action) {
    const messages = document.getElementById('isabellaMessages');
    if (!messages) return;
    
    let message = '';
    
    switch(action) {
        case 'vip':
            message = '💎 ¡Hazte VIP y desbloquea TODO! Solo €15/mes o €100 lifetime. Más de 400 fotos y 80 videos HD te esperan.';
            setTimeout(() => showVIPModal(), 1000);
            break;
        case 'daily':
            message = `📅 Hoy tenemos ${CONFIG.CONTENT.DAILY_PHOTOS} fotos nuevas y ${CONFIG.CONTENT.DAILY_VIDEOS} videos HD. ¡El contenido cambia cada día!`;
            break;
        case 'help':
            message = '❓ Puedes comprar créditos para desbloquear contenido o hacerte VIP para acceso ilimitado. ¿Qué prefieres?';
            break;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'isabella-message';
    messageDiv.innerHTML = `<span class="message-avatar">💕</span><span>${message}</span>`;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

// ============================
// INICIALIZACIÓN
// ============================

function initializeGallery() {
    // Verificar arrays
    if (!window.ALL_PHOTOS_POOL || !window.ALL_UNCENSORED_PHOTOS_POOL || !window.ALL_VIDEOS_POOL) {
        console.error('❌ Content database not loaded');
        return;
    }
    
    // Combinar todas las fotos
    const allPhotos = [...window.ALL_PHOTOS_POOL, ...window.ALL_UNCENSORED_PHOTOS_POOL];
    
    // Obtener rotación diaria (cambia cada día)
    state.dailyPhotos = getDailyRotation(allPhotos, CONFIG.CONTENT.DAILY_PHOTOS);
    state.dailyVideos = getDailyRotation(window.ALL_VIDEOS_POOL, CONFIG.CONTENT.DAILY_VIDEOS);
    state.teaserItems = getDailyRotation(window.ALL_PHOTOS_POOL, CONFIG.CONTENT.TEASER_COUNT);
    
    // Renderizar contenido
    renderPhotosProgressive(document.getElementById('photosGrid'), state.dailyPhotos);
    renderVideosProgressive(document.getElementById('videosGrid'), state.dailyVideos);
    renderTeaserCarousel();
    
    // Actualizar UI
    updateCreditsDisplay();
    changeLanguage(state.language);
    
    // Actualizar imágenes del banner con rutas correctas
    const bannerImages = document.querySelectorAll('.banner-slide img');
    if (bannerImages[0]) bannerImages[0].src = CONFIG.PATHS.DEFAULT_BANNER;
    if (bannerImages[1]) bannerImages[1].src = CONFIG.PATHS.DEFAULT_BANNER2;
    
    console.log(`✅ Galería inicializada:
    - ${state.dailyPhotos.length} fotos del día
    - ${state.dailyVideos.length} videos del día
    - ${state.teaserItems.length} items en carousel
    - Idioma: ${state.language}
    - VIP: ${state.isVIP}
    - Créditos: ${state.credits}`);
}

// ============================
// EVENT LISTENERS
// ============================

document.addEventListener('DOMContentLoaded', () => {
    // Ocultar pantalla de carga
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1500);
    
    // Inicializar galería
    initializeGallery();
    
    // Banner slideshow
    let currentSlide = 0;
    const slides = document.querySelectorAll('.banner-slide');
    if (slides.length > 1) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }
    
    // Carousel controls
    window.moveCarousel = (direction) => {
        const carousel = document.getElementById('teaserCarousel');
        if (carousel) {
            const scrollAmount = 300 * direction;
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };
    
    // Load more functions
    window.loadMorePhotos = () => {
        showNotification('Hazte VIP para ver todo el contenido', 'info');
        showVIPModal();
    };
    
    window.loadMoreVideos = () => {
        showNotification('Hazte VIP para ver todos los videos', 'info');
        showVIPModal();
    };
    
    // Newsletter
    window.subscribeNewsletter = (e) => {
        e.preventDefault();
        showNotification('¡Suscrito! Te avisaremos de las novedades', 'success');
        e.target.reset();
    };
});

// ============================
// EXPORTAR FUNCIONES GLOBALES
// ============================

window.handleImageError = handleImageError;
window.changeLanguage = changeLanguage;
window.showVIPModal = showVIPModal;
window.showPackModal = showPackModal;
window.closeModal = closeModal;
window.toggleIsabella = toggleIsabella;
window.isabellaAction = isabellaAction;
window.unlockContent = unlockContent;
window.selectPlan = selectPlan;
window.selectPack = selectPack;

// ============================
// DEBUG TOOLS
// ============================

const galleryDebug = {
    stats: () => ({
        totalPhotos: window.ALL_PHOTOS_POOL?.length + window.ALL_UNCENSORED_PHOTOS_POOL?.length,
        totalVideos: window.ALL_VIDEOS_POOL?.length,
        dailyPhotos: state.dailyPhotos.length,
        dailyVideos: state.dailyVideos.length,
        unlockedPhotos: state.unlockedPhotos.size,
        unlockedVideos: state.unlockedVideos.size,
        credits: state.credits,
        isVIP: state.isVIP
    }),
    unlockAll: () => {
        state.isVIP = true;
        localStorage.setItem('isVIP', 'true');
        initializeGallery();
        console.log('✅ Todo desbloqueado');
    },
    addCredits: (num) => {
        addCredits(num);
        console.log(`✅ ${num} créditos añadidos. Total: ${state.credits}`);
    },
    resetDaily: () => {
        localStorage.removeItem('lastRotation');
        location.reload();
    },
    testRotation: () => {
        console.log('Fotos de hoy:', state.dailyPhotos);
        console.log('Videos de hoy:', state.dailyVideos);
    }
};

window.galleryDebug = galleryDebug;

console.log(`
🌊 ===============================================
   BeachGirl.pics Gallery v${CONFIG.VERSION}
   
   📊 Contenido cargado:
   • ${window.ALL_PHOTOS_POOL?.length || 0} fotos en /full
   • ${window.ALL_UNCENSORED_PHOTOS_POOL?.length || 0} fotos en /uncensored  
   • ${window.ALL_VIDEOS_POOL?.length || 0} videos HD
   
   📅 Rotación diaria:
   • ${CONFIG.CONTENT.DAILY_PHOTOS} fotos por día
   • ${CONFIG.CONTENT.DAILY_VIDEOS} videos por día
   • ${CONFIG.CONTENT.NEW_PERCENTAGE * 100}% aparece como nuevo
   
   🛠️ Debug: galleryDebug
   • galleryDebug.stats() - Ver estadísticas
   • galleryDebug.unlockAll() - Desbloquear todo
   • galleryDebug.addCredits(100) - Añadir créditos
   • galleryDebug.testRotation() - Ver rotación actual
   
🌊 ===============================================
`);
