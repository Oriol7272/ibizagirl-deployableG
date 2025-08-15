// ============================
// BeachGirl.pics Gallery Script v14.2.1 - FIXED
// Corregido error de sintaxis en línea 91
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
        
        // Ya no hay carpeta public/assets, todo está en la raíz
        const possiblePaths = [
            '' // Raíz - las carpetas están directamente aquí
        ];
        
        // Imagen de prueba que sabemos que existe (ahora es .webp)
        const testImage = '/full/bikini.webp';
        
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
        
        // Si no encuentra nada, asumimos que las carpetas están en la raíz
        console.log('✅ Usando rutas por defecto (raíz)');
        this.basePathFound = '';
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
    VERSION: '14.2.1', // Incrementada versión
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
            25: 20,
            50: 35,
            100: 60
        }
    },
    // FIXED: Imagen fallback como base64 válida de una línea
    FALLBACK_IMAGE: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzY2N2VlYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+MiyBCZWFjaEdpcmwucGljczwvdGV4dD48L3N2Zz4='
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
    selectedPack: 50, // Default silver pack
    initialized: false
};

// Exponer state globalmente para depuración
window.state = state;

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
        preview_gallery: '🔥 Vista Previa Exclusiva',
        paradise_photos: '📸 Fotos del Paraíso',
        new_today: '¡NUEVO HOY!',
        exclusive_videos: '🎬 Videos Exclusivos',
        fresh_content: '¡CONTENIDO FRESCO!',
        photos_today: 'Fotos de Hoy',
        videos_hd: 'Videos HD',
        total_views: 'Vistas Totales',
        updates: 'Actualizaciones',
        always_fresh: 'SIEMPRE FRESCO',
        vip_unlimited: '👑 Acceso VIP Ilimitado',
        plan_monthly: '📅 Mensual',
        plan_lifetime: '♾️ Lifetime',
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
        preview_gallery: '🔥 Exclusive Preview',
        paradise_photos: '📸 Paradise Photos',
        new_today: 'NEW TODAY!',
        exclusive_videos: '🎬 Exclusive Videos',
        fresh_content: 'FRESH CONTENT!',
        photos_today: 'Photos Today',
        videos_hd: 'HD Videos',
        total_views: 'Total Views',
        updates: 'Updates',
        always_fresh: 'ALWAYS FRESH',
        vip_unlimited: '👑 Unlimited VIP Access',
        plan_monthly: '📅 Monthly',
        plan_lifetime: '♾️ Lifetime',
        megapack: '📦 MEGA PACKS -70%',
        credits_available: 'Credits Available',
        unlock_credit: 'Unlock (1 credit)',
        no_credits: 'You need credits! Buy a pack',
        unlocked_success: 'Content unlocked! 🎉',
        vip_activated: 'VIP Activated! Unlimited access 👑'
    }
};

// Exponer translations globalmente
window.TRANSLATIONS = TRANSLATIONS;

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
                color: #999;
                font-size: 18px;
            }
            .content-item.loaded {
                animation: fadeIn 0.5s ease;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .content-wrapper {
                position: relative;
                width: 100%;
                height: 100%;
            }
            .content-img, .content-video, .video-thumb {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .badge-new {
                position: absolute;
                top: 10px;
                left: 10px;
                background: linear-gradient(135deg, #00ff88, #4ade80);
                color: #001f3f;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 700;
                z-index: 2;
            }
            .video-badge {
                position: absolute;
                bottom: 10px;
                right: 10px;
                display: flex;
                gap: 5px;
                z-index: 2;
            }
            .video-badge span {
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 3px 8px;
                border-radius: 5px;
                font-size: 0.75rem;
                font-weight: 600;
            }
            .lock-overlay {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(3px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 3;
            }
            .lock-content {
                text-align: center;
            }
            .lock-icon, .play-icon {
                font-size: 2.5rem;
                margin-bottom: 10px;
            }
            .unlock-btn {
                background: linear-gradient(135deg, #ffd700, #ff6b35);
                color: #001f3f;
                border: none;
                padding: 10px 20px;
                border-radius: 25px;
                font-weight: 700;
                cursor: pointer;
                transition: transform 0.3s ease;
            }
            .unlock-btn:hover {
                transform: scale(1.05);
            }
            .unlock-text {
                margin-right: 5px;
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
    const creditsDisplay = document.getElementById('creditsDisplay');
    
    if (creditsNumber) {
        creditsNumber.textContent = state.credits;
    }
    
    if (creditsDisplay && state.credits > 0) {
        creditsDisplay.classList.add('active');
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
    event?.currentTarget?.classList.add('selected');
}

function selectPack(pack) {
    // Mapear el nombre del pack al número de créditos
    const packMap = {
        'starter': 10,
        'bronze': 25,
        'silver': 50,
        'gold': 100
    };
    
    state.selectedPack = packMap[pack] || 50;
    
    document.querySelectorAll('.pack-card').forEach(card => {
        card.classList.remove('selected');
    });
    event?.currentTarget?.classList.add('selected');
}

// ============================
// PAYPAL
// ============================

function initializePayPal() {
    if (typeof paypal === 'undefined') return;
    
    const vipContainer = document.getElementById('paypal-button-container-vip');
    if (vipContainer && !vipContainer.hasChildNodes() && state.currentModal === 'vip') {
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
    if (packContainer && !packContainer.hasChildNodes() && state.currentModal === 'pack') {
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
        
        // Si es la primera vez que se abre, mostrar mensaje de bienvenida
        if (state.isabellaOpen) {
            const messages = document.getElementById('isabellaMessages');
            if (messages && messages.children.length === 0) {
                const welcomeDiv = document.createElement('div');
                welcomeDiv.className = 'isabella-message';
                welcomeDiv.innerHTML = '<span class="message-avatar">💕</span><span>¡Hola! Soy Isabella, tu guía VIP. ¿En qué puedo ayudarte?</span>';
                messages.appendChild(welcomeDiv);
            }
        }
    }
}

function isabellaAction(action) {
    const messages = document.getElementById('isabellaMessages');
    if (!messages) return;
    
    let message = '';
    switch(action) {
        case 'vip':
            message = '💎 ¡Hazte VIP y desbloquea TODO! Solo €15/mes o €100 lifetime. Acceso ilimitado a todo el contenido actual y futuro.';
            setTimeout(() => showVIPModal(), 1000);
            break;
        case 'daily':
            message = `📅 Hoy tenemos ${CONFIG.CONTENT.DAILY_PHOTOS} fotos y ${CONFIG.CONTENT.DAILY_VIDEOS} videos nuevos! Actualizamos contenido todos los días a las 3:00 AM.`;
            break;
        case 'help':
            message = '❓ Puedes comprar créditos para desbloquear contenido individual (1 crédito = 1 contenido) o hacerte VIP para acceso ilimitado. ¿Qué prefieres?';
            break;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'isabella-message';
    messageDiv.innerHTML = `<span class="message-avatar">💕</span><span>${message}</span>`;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

// ============================
// SCROLL CAROUSEL
// ============================

function scrollCarousel(direction) {
    const carousel = document.getElementById('teaserCarousel');
    if (carousel) {
        const scrollAmount = 300;
        carousel.scrollBy({
            left: scrollAmount * direction,
            behavior: 'smooth'
        });
    }
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
    
    // Actualizar contadores
    const photoCount = document.getElementById('photoCount');
    const videoCount = document.getElementById('videoCount');
    
    if (photoCount) photoCount.textContent = state.dailyPhotos.length;
    if (videoCount) videoCount.textContent = state.dailyVideos.length;
    
    console.log(`✅ Galería inicializada:
    - ${state.dailyPhotos.length} fotos del día
    - ${state.dailyVideos.length} videos del día
    - Ruta base: ${PathDetector.basePathFound || 'raíz'}
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
    
    // Verificar expiración VIP mensual
    const vipExpiry = localStorage.getItem('vipExpiry');
    if (vipExpiry && vipExpiry !== 'lifetime') {
        const expiryDate = new Date(vipExpiry);
        if (expiryDate < new Date()) {
            state.isVIP = false;
            localStorage.setItem('isVIP', 'false');
            localStorage.removeItem('vipExpiry');
            showNotification('Tu suscripción VIP ha expirado', 'info');
        }
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
window.scrollCarousel = scrollCarousel;

// ============================
// DEBUG
// ============================

window.galleryDebug = {
    stats: () => ({
        totalPhotos: (window.ALL_PHOTOS_POOL?.length || 0) + (window.ALL_UNCENSORED_PHOTOS_POOL?.length || 0),
        totalVideos: window.ALL_VIDEOS_POOL?.length || 0,
        dailyPhotos: state.dailyPhotos.length,
        dailyVideos: state.dailyVideos.length,
        basePath: PathDetector.basePathFound,
        credits: state.credits,
        isVIP: state.isVIP,
        unlockedPhotos: state.unlockedPhotos.size,
        unlockedVideos: state.unlockedVideos.size
    }),
    unlockAll: () => {
        state.isVIP = true;
        localStorage.setItem('isVIP', 'true');
        localStorage.setItem('vipExpiry', 'lifetime');
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
