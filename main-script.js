// ============================
// BeachGirl.pics Gallery Script v14.1.0
// Con detección automática de rutas
// ============================

'use strict';

// ============================
// DETECCIÓN AUTOMÁTICA DE RUTAS
// ============================

const PathDetector = {
    basePathFound: null,
    checkedPaths: new Set(),
    
    async detectBasePath() {
        console.log('🔍 Detectando estructura de archivos...');
        
        // Posibles estructuras de carpetas
        const possiblePaths = [
            '', // Raíz
            '/public/assets',
            'public/assets',
            '/beachgirl-pics', // Por si es GitHub Pages
            '/ibizagirl-deployable2' // Nombre del repo en GitHub
        ];
        
        // Imagen de prueba que sabemos que existe
        const testImage = '/full/bikini.jpg';
        
        for (const basePath of possiblePaths) {
            const testUrl = basePath + testImage;
            
            if (this.checkedPaths.has(testUrl)) continue;
            this.checkedPaths.add(testUrl);
            
            try {
                const response = await fetch(testUrl, { method: 'HEAD' });
                if (response.ok) {
                    this.basePathFound = basePath;
                    console.log(`✅ Ruta base encontrada: ${basePath || '(raíz)'}`);
                    return basePath;
                }
            } catch (e) {
                // Continuar probando
            }
        }
        
        console.warn('⚠️ No se encontró ruta base, usando rutas por defecto');
        return '';
    },
    
    buildPath(relativePath) {
        // Quitar / inicial si existe
        const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
        
        // Si ya detectamos la ruta base, usarla
        if (this.basePathFound !== null) {
            return this.basePathFound ? `${this.basePathFound}/${cleanPath}` : cleanPath;
        }
        
        // Si no, devolver la ruta limpia
        return cleanPath;
    }
};

// ============================
// CONFIGURATION
// ============================

const CONFIG = {
    VERSION: '14.1.0',
    CONTENT: {
        DAILY_PHOTOS: 200,
        DAILY_VIDEOS: 40,
        NEW_PERCENTAGE: 0.3,
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
    FALLBACK_IMAGE: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzY2N2VlYSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+MiiBCZWFjaEdpcmwucGljczwvdGV4dD4KPC9zdmc+'
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
    selectedPack: null,
    initialized: false
};

// ============================
// TRANSLATIONS
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
        credits_available: 'Créditos Disponibles',
        unlock_credit: 'Desbloquear (1 crédito)',
        no_credits: '¡Necesitas créditos! Compra un pack',
        unlocked_success: '¡Contenido desbloqueado! 🎉',
        vip_activated: '¡VIP Activado! Acceso ilimitado 👑'
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
        credits_available: 'Credits Available',
        unlock_credit: 'Unlock (1 credit)',
        no_credits: 'You need credits! Buy a pack',
        unlocked_success: 'Content unlocked! 🎉',
        vip_activated: 'VIP Activated! Unlimited access 👑'
    }
};

// ============================
// UTILIDADES
// ============================

function handleImageError(img) {
    console.warn('Error cargando imagen:', img.src);
    
    // Usar imagen fallback SVG
    if (!img.dataset.fallbackUsed) {
        img.dataset.fallbackUsed = 'true';
        img.src = CONFIG.FALLBACK_IMAGE;
        img.style.objectFit = 'cover';
    }
}

function getDailyRotation(pool, count) {
    if (!pool || pool.length === 0) return [];
    
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const seed = dateString.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    const shuffled = [...pool].sort((a, b) => {
        const aVal = a.split('').reduce((sum, char) => sum + char.charCodeAt(0), seed);
        const bVal = b.split('').reduce((sum, char) => sum + char.charCodeAt(0), seed);
        return (aVal * 9301 + 49297) % 233280 - (bVal * 9301 + 49297) % 233280;
    });
    
    return shuffled.slice(0, Math.min(count, pool.length));
}

// ============================
// RENDERIZADO
// ============================

function renderPhotosProgressive(container, photos) {
    if (!container || !photos) return;
    
    container.innerHTML = '<div class="loading-message">Cargando fotos...</div>';
    
    setTimeout(() => {
        container.innerHTML = '';
        
        photos.forEach((photo, index) => {
            setTimeout(() => {
                const isUnlocked = state.isVIP || state.unlockedPhotos.has(photo);
                const isNew = Math.random() < CONFIG.CONTENT.NEW_PERCENTAGE;
                const imagePath = PathDetector.buildPath(photo);
                
                const item = document.createElement('div');
                item.classList.add('content-item', isUnlocked ? 'unlocked' : 'locked');
                if (isNew) item.classList.add('new-item');
                
                const imgId = `photo-${index}`;
                
                item.innerHTML = `
                    <div class="content-wrapper">
                        <img id="${imgId}"
                             src="${imagePath}" 
                             alt="Foto Premium ${index + 1}" 
                             class="content-img" 
                             loading="lazy">
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
                
                container.appendChild(item);
                
                // Agregar manejador de error después
                const img = document.getElementById(imgId);
                if (img) {
                    img.onerror = function() { handleImageError(this); };
                }
                
                // Animación de entrada
                setTimeout(() => {
                    item.classList.add('loaded');
                }, 50);
                
            }, index * 30);
        });
    }, 100);
}

function renderVideosProgressive(container, videos) {
    if (!container || !videos) return;
    
    container.innerHTML = '<div class="loading-message">Cargando videos...</div>';
    
    setTimeout(() => {
        container.innerHTML = '';
        
        videos.forEach((video, index) => {
            setTimeout(() => {
                const isUnlocked = state.isVIP || state.unlockedVideos.has(video);
                const isNew = Math.random() < CONFIG.CONTENT.NEW_PERCENTAGE;
                const videoPath = PathDetector.buildPath(video);
                
                const item = document.createElement('div');
                item.classList.add('content-item', 'video-item', isUnlocked ? 'unlocked' : 'locked');
                if (isNew) item.classList.add('new-item');
                
                const imgId = `video-thumb-${index}`;
                
                item.innerHTML = `
                    <div class="content-wrapper">
                        ${isUnlocked ? `
                            <video class="content-video" 
                                   controls 
                                   poster="${CONFIG.FALLBACK_IMAGE}"
                                   preload="metadata">
                                <source src="${videoPath}" type="video/mp4">
                                Tu navegador no soporta videos HTML5.
                            </video>
                        ` : `
                            <img id="${imgId}"
                                 src="${CONFIG.FALLBACK_IMAGE}" 
                                 alt="Video Premium ${index + 1}" 
                                 class="video-thumb">
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
                
                container.appendChild(item);
                
                // Animación de entrada
                setTimeout(() => {
                    item.classList.add('loaded');
                }, 50);
                
            }, index * 30);
        });
    }, 100);
}

function renderTeaserCarousel() {
    const carousel = document.getElementById('teaserCarousel');
    if (!carousel) return;
    
    carousel.innerHTML = '';
    
    state.teaserItems.forEach((item, index) => {
        const imagePath = PathDetector.buildPath(item);
        const teaserItem = document.createElement('div');
        teaserItem.className = 'teaser-item';
        
        const imgId = `teaser-${index}`;
        
        teaserItem.innerHTML = `
            <img id="${imgId}"
                 src="${imagePath}" 
                 alt="Preview ${index + 1}" 
                 loading="lazy">
            <div class="teaser-overlay">
                <button onclick="showVIPModal()">Ver Completo</button>
            </div>
        `;
        
        carousel.appendChild(teaserItem);
        
        // Agregar manejador de error
        setTimeout(() => {
            const img = document.getElementById(imgId);
            if (img) {
                img.onerror = function() { handleImageError(this); };
            }
        }, 100);
    });
}

// ============================
// FUNCIONES DE DESBLOQUEO
// ============================

function unlockContent(item, type) {
    if (state.credits < 1) {
        showNotification(TRANSLATIONS[state.language].no_credits, 'error');
        showPackModal();
        return;
    }
    
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
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-icon">
            ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
        </span>
        <span class="notification-text">${message}</span>
    `;
    document.body.appendChild(notification);
    
    // Agregar estilos inline si no existen
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
                max-width: 300px;
            }
            .notification.show { transform: translateX(0); }
            .notification.success {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            .notification.error {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
            }
            .notification.info {
                background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
                color: white;
            }
            .loading-message {
                text-align: center;
                padding: 40px;
                color: #666;
                font-size: 18px;
            }
            .content-item.loaded {
                animation: fadeIn 0.5s ease;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================
// FUNCIONES UI
// ============================

function updateCreditsDisplay() {
    const creditsNumber = document.getElementById('creditsNumber');
    if (creditsNumber) {
        creditsNumber.textContent = state.credits;
    }
}

function changeLanguage(lang) {
    state.language = lang;
    localStorage.setItem('language', lang);
    
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.dataset.translate;
        el.textContent = TRANSLATIONS[lang]?.[key] || TRANSLATIONS['es'][key] || key;
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
        initializePayPal();
    }
}

function showPackModal() {
    const modal = document.getElementById('packModal');
    if (modal) {
        modal.style.display = 'flex';
        state.currentModal = 'pack';
        initializePayPal();
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
    const card = document.getElementById(plan + 'Plan');
    if (card) card.classList.add('selected');
}

function selectPack(credits) {
    state.selectedPack = credits;
    document.querySelectorAll('.pack-card').forEach(card => {
        card.classList.remove('selected');
    });
    if (event?.currentTarget) {
        event.currentTarget.classList.add('selected');
    }
}

// ============================
// PAYPAL
// ============================

function initializePayPal() {
    if (typeof paypal === 'undefined') return;
    
    const vipContainer = document.getElementById('paypal-button-container-vip');
    if (vipContainer && !vipContainer.hasChildNodes()) {
        paypal.Buttons({
            createOrder: (data, actions) => {
                const price = state.selectedPlan === 'monthly' ? CONFIG.PRICES.MONTHLY : CONFIG.PRICES.LIFETIME;
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: price.toString(),
                            currency_code: CONFIG.PAYPAL.CURRENCY
                        }
                    }]
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then(() => {
                    activateVIP(state.selectedPlan);
                    showNotification(TRANSLATIONS[state.language].vip_activated, 'success');
                    closeModal();
                });
            }
        }).render('#paypal-button-container-vip');
    }
    
    const packContainer = document.getElementById('paypal-button-container-pack');
    if (packContainer && !packContainer.hasChildNodes()) {
        paypal.Buttons({
            createOrder: (data, actions) => {
                if (!state.selectedPack) return;
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: CONFIG.PRICES.PACKS[state.selectedPack].toString(),
                            currency_code: CONFIG.PAYPAL.CURRENCY
                        }
                    }]
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then(() => {
                    addCredits(state.selectedPack);
                    showNotification(`+${state.selectedPack} créditos añadidos!`, 'success');
                    closeModal();
                });
            }
        }).render('#paypal-button-container-pack');
    }
}

function activateVIP(plan) {
    state.isVIP = true;
    localStorage.setItem('isVIP', 'true');
    
    if (plan === 'monthly') {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 30);
        localStorage.setItem('vipExpiry', expiry.toISOString());
    } else {
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
// ISABELLA BOT
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
            message = '💎 ¡Hazte VIP y desbloquea TODO! Solo €15/mes o €100 lifetime.';
            setTimeout(() => showVIPModal(), 1000);
            break;
        case 'daily':
            message = `📅 Hoy tenemos ${CONFIG.CONTENT.DAILY_PHOTOS} fotos y ${CONFIG.CONTENT.DAILY_VIDEOS} videos nuevos!`;
            break;
        case 'help':
            message = '❓ Compra créditos o hazte VIP para desbloquear contenido.';
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

async function initializeGallery() {
    if (!window.ALL_PHOTOS_POOL || !window.ALL_UNCENSORED_PHOTOS_POOL || !window.ALL_VIDEOS_POOL) {
        console.error('❌ Content database not loaded');
        showNotification('Error: Base de datos no cargada', 'error');
        return;
    }
    
    // Detectar rutas solo la primera vez
    if (!state.initialized) {
        await PathDetector.detectBasePath();
        state.initialized = true;
    }
    
    const allPhotos = [...window.ALL_PHOTOS_POOL, ...window.ALL_UNCENSORED_PHOTOS_POOL];
    
    state.dailyPhotos = getDailyRotation(allPhotos, CONFIG.CONTENT.DAILY_PHOTOS);
    state.dailyVideos = getDailyRotation(window.ALL_VIDEOS_POOL, CONFIG.CONTENT.DAILY_VIDEOS);
    state.teaserItems = getDailyRotation(window.ALL_PHOTOS_POOL, CONFIG.CONTENT.TEASER_COUNT);
    
    renderPhotosProgressive(document.getElementById('photosGrid'), state.dailyPhotos);
    renderVideosProgressive(document.getElementById('videosGrid'), state.dailyVideos);
    renderTeaserCarousel();
    
    updateCreditsDisplay();
    changeLanguage(state.language);
    
    console.log(`✅ Galería inicializada:
    - ${state.dailyPhotos.length} fotos del día
    - ${state.dailyVideos.length} videos del día
    - Ruta base: ${PathDetector.basePathFound || 'default'}
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
            slides[currentSlide]?.classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide]?.classList.add('active');
        }, 5000);
    }
});

// ============================
// EXPORTAR FUNCIONES
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
window.moveCarousel = (dir) => {
    const carousel = document.getElementById('teaserCarousel');
    if (carousel) carousel.scrollBy({ left: 300 * dir, behavior: 'smooth' });
};
window.loadMorePhotos = () => {
    showNotification('Hazte VIP para ver todas las fotos', 'info');
    showVIPModal();
};
window.loadMoreVideos = () => {
    showNotification('Hazte VIP para ver todos los videos', 'info');
    showVIPModal();
};
window.subscribeNewsletter = (e) => {
    e.preventDefault();
    showNotification('¡Suscrito! 📧', 'success');
    e.target.reset();
};

// ============================
// DEBUG
// ============================

window.galleryDebug = {
    stats: () => ({
        totalPhotos: window.ALL_PHOTOS_POOL?.length + window.ALL_UNCENSORED_PHOTOS_POOL?.length,
        totalVideos: window.ALL_VIDEOS_POOL?.length,
        dailyPhotos: state.dailyPhotos.length,
        dailyVideos: state.dailyVideos.length,
        basePath: PathDetector.basePathFound,
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
        console.log(`✅ ${num} créditos añadidos`);
    },
    testPath: async () => {
        await PathDetector.detectBasePath();
    },
    reset: () => {
        localStorage.clear();
        location.reload();
    }
};

console.log(`
🌊 ===============================================
   BeachGirl.pics Gallery v${CONFIG.VERSION}
   
   📊 Contenido disponible:
   • ${window.ALL_PHOTOS_POOL?.length || 0} fotos en /full
   • ${window.ALL_UNCENSORED_PHOTOS_POOL?.length || 0} fotos en /uncensored  
   • ${window.ALL_VIDEOS_POOL?.length || 0} videos HD
   
   🛠️ Debug: galleryDebug
   • galleryDebug.stats() - Estadísticas
   • galleryDebug.unlockAll() - Desbloquear todo
   • galleryDebug.addCredits(100) - Añadir créditos
   • galleryDebug.testPath() - Probar rutas
   • galleryDebug.reset() - Resetear todo
   
🌊 ===============================================
`);
