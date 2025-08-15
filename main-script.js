// ============================
// BeachGirl.pics Gallery Script v14.3.0 - ULTRA CLEAN
// Sin líneas multi-string problemáticas
// ============================

'use strict';

// ============================
// CONFIGURACIÓN BÁSICA
// ============================

const CONFIG = {
    VERSION: '14.3.0',
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
        PACKS: { 10: 10, 25: 20, 50: 35, 100: 60 }
    }
};

// Imagen fallback simple - NO TOCAR
const FALLBACK_SVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzY2N2VlYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJlYWNoR2lybC5waWNzPC90ZXh0Pjwvc3ZnPg==';

// ============================
// ESTADO GLOBAL
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
    initialized: false
};

// ============================
// TRADUCCIONES
// ============================

const TRANSLATIONS = {
    es: {
        unlock_credit: 'Desbloquear (1 crédito)',
        no_credits: '¡Necesitas créditos! Compra un pack',
        unlocked_success: '¡Contenido desbloqueado! 🎉',
        vip_activated: '¡VIP Activado! Acceso ilimitado 👑'
    },
    en: {
        unlock_credit: 'Unlock (1 credit)',
        no_credits: 'You need credits! Buy a pack',
        unlocked_success: 'Content unlocked! 🎉',
        vip_activated: 'VIP Activated! Unlimited access 👑'
    }
};

// ============================
// DETECCIÓN DE RUTAS
// ============================

const PathDetector = {
    basePathFound: '',
    
    buildPath(relativePath) {
        const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
        return cleanPath;
    }
};

// ============================
// UTILIDADES
// ============================

function handleImageError(img) {
    if (!img.dataset.fallbackUsed) {
        img.dataset.fallbackUsed = 'true';
        img.src = FALLBACK_SVG;
        img.style.objectFit = 'cover';
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

// ============================
// FUNCIONES DE RENDERIZADO
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
                item.className = 'content-item ' + (isUnlocked ? 'unlocked' : 'locked');
                if (isNew) item.classList.add('new-item');
                
                const imgId = 'photo-' + index;
                
                // Crear HTML sin template literals problemáticos
                const wrapper = document.createElement('div');
                wrapper.className = 'content-wrapper';
                
                const img = document.createElement('img');
                img.id = imgId;
                img.src = imagePath;
                img.alt = 'Foto Premium ' + (index + 1);
                img.className = 'content-img';
                img.loading = 'lazy';
                img.onerror = function() { handleImageError(this); };
                
                wrapper.appendChild(img);
                
                if (isNew) {
                    const badge = document.createElement('span');
                    badge.className = 'badge-new';
                    badge.textContent = 'NUEVO';
                    wrapper.appendChild(badge);
                }
                
                if (!isUnlocked) {
                    const overlay = document.createElement('div');
                    overlay.className = 'lock-overlay';
                    
                    const content = document.createElement('div');
                    content.className = 'lock-content';
                    
                    const icon = document.createElement('div');
                    icon.className = 'lock-icon';
                    icon.textContent = '🔒';
                    
                    const btn = document.createElement('button');
                    btn.className = 'unlock-btn';
                    btn.onclick = function() { unlockContent(photo, 'photo'); };
                    
                    const text = document.createElement('span');
                    text.className = 'unlock-text';
                    text.textContent = TRANSLATIONS[state.language].unlock_credit;
                    
                    const cost = document.createElement('span');
                    cost.className = 'credit-cost';
                    cost.textContent = '💎 1';
                    
                    btn.appendChild(text);
                    btn.appendChild(cost);
                    content.appendChild(icon);
                    content.appendChild(btn);
                    overlay.appendChild(content);
                    wrapper.appendChild(overlay);
                }
                
                item.appendChild(wrapper);
                container.appendChild(item);
                
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
                item.className = 'content-item video-item ' + (isUnlocked ? 'unlocked' : 'locked');
                if (isNew) item.classList.add('new-item');
                
                const wrapper = document.createElement('div');
                wrapper.className = 'content-wrapper';
                
                if (isUnlocked) {
                    const video = document.createElement('video');
                    video.className = 'content-video';
                    video.controls = true;
                    video.poster = FALLBACK_SVG;
                    video.preload = 'metadata';
                    
                    const source = document.createElement('source');
                    source.src = videoPath;
                    source.type = 'video/mp4';
                    
                    video.appendChild(source);
                    video.appendChild(document.createTextNode('Tu navegador no soporta videos HTML5.'));
                    wrapper.appendChild(video);
                } else {
                    const img = document.createElement('img');
                    img.src = FALLBACK_SVG;
                    img.alt = 'Video Premium ' + (index + 1);
                    img.className = 'video-thumb';
                    wrapper.appendChild(img);
                }
                
                // Badge de video
                const badge = document.createElement('div');
                badge.className = 'video-badge';
                
                const duration = document.createElement('span');
                duration.className = 'duration';
                duration.textContent = 'HD';
                
                const quality = document.createElement('span');
                quality.className = 'quality';
                quality.textContent = '1080p';
                
                badge.appendChild(duration);
                badge.appendChild(quality);
                wrapper.appendChild(badge);
                
                if (isNew) {
                    const newBadge = document.createElement('span');
                    newBadge.className = 'badge-new';
                    newBadge.textContent = 'NUEVO';
                    wrapper.appendChild(newBadge);
                }
                
                if (!isUnlocked) {
                    const overlay = document.createElement('div');
                    overlay.className = 'lock-overlay';
                    
                    const content = document.createElement('div');
                    content.className = 'lock-content';
                    
                    const playIcon = document.createElement('div');
                    playIcon.className = 'play-icon';
                    playIcon.textContent = '▶️';
                    
                    const lockIcon = document.createElement('div');
                    lockIcon.className = 'lock-icon';
                    lockIcon.textContent = '🔒';
                    
                    const btn = document.createElement('button');
                    btn.className = 'unlock-btn';
                    btn.onclick = function() { unlockContent(video, 'video'); };
                    
                    const text = document.createElement('span');
                    text.className = 'unlock-text';
                    text.textContent = TRANSLATIONS[state.language].unlock_credit;
                    
                    const cost = document.createElement('span');
                    cost.className = 'credit-cost';
                    cost.textContent = '💎 1';
                    
                    btn.appendChild(text);
                    btn.appendChild(cost);
                    content.appendChild(playIcon);
                    content.appendChild(lockIcon);
                    content.appendChild(btn);
                    overlay.appendChild(content);
                    wrapper.appendChild(overlay);
                }
                
                item.appendChild(wrapper);
                container.appendChild(item);
                
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
        
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = 'Preview ' + (index + 1);
        img.loading = 'lazy';
        img.onerror = function() { handleImageError(this); };
        
        const overlay = document.createElement('div');
        overlay.className = 'teaser-overlay';
        
        const btn = document.createElement('button');
        btn.textContent = 'Ver Completo';
        btn.onclick = showVIPModal;
        
        overlay.appendChild(btn);
        teaserItem.appendChild(img);
        teaserItem.appendChild(overlay);
        carousel.appendChild(teaserItem);
    });
}

// ============================
// FUNCIONES PRINCIPALES
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
    
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

function showNotification(message, type) {
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
    
    notification.appendChild(icon);
    notification.appendChild(text);
    document.body.appendChild(notification);
    
    // Agregar estilos si no existen
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = '.notification{position:fixed;top:20px;right:20px;background:white;padding:15px 20px;border-radius:10px;box-shadow:0 5px 20px rgba(0,0,0,0.2);display:flex;align-items:center;gap:10px;z-index:10000;transform:translateX(400px);transition:transform 0.3s ease;max-width:300px}.notification.show{transform:translateX(0)}.notification.success{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white}.notification.error{background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%);color:white}.notification.info{background:linear-gradient(135deg,#89f7fe 0%,#66a6ff 100%);color:white}.loading-message{text-align:center;padding:40px;color:#999;font-size:18px}.content-item.loaded{animation:fadeIn 0.5s ease}@keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.content-wrapper{position:relative;width:100%;height:100%}.content-img,.content-video,.video-thumb{width:100%;height:100%;object-fit:cover}.badge-new{position:absolute;top:10px;left:10px;background:linear-gradient(135deg,#00ff88,#4ade80);color:#001f3f;padding:4px 12px;border-radius:20px;font-size:0.8rem;font-weight:700;z-index:2}.video-badge{position:absolute;bottom:10px;right:10px;display:flex;gap:5px;z-index:2}.video-badge span{background:rgba(0,0,0,0.8);color:white;padding:3px 8px;border-radius:5px;font-size:0.75rem;font-weight:600}.lock-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;z-index:3}.lock-content{text-align:center}.lock-icon,.play-icon{font-size:2.5rem;margin-bottom:10px}.unlock-btn{background:linear-gradient(135deg,#ffd700,#ff6b35);color:#001f3f;border:none;padding:10px 20px;border-radius:25px;font-weight:700;cursor:pointer;transition:transform 0.3s ease}.unlock-btn:hover{transform:scale(1.05)}.unlock-text{margin-right:5px}';
        document.head.appendChild(style);
    }
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

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
        const translations = TRANSLATIONS[lang] || TRANSLATIONS['es'];
        if (translations[key]) {
            el.textContent = translations[key];
        }
    });
}

// ============================
// MODALES
// ============================

function showVIPModal() {
    const modal = document.getElementById('vipModal');
    if (modal) {
        modal.style.display = 'flex';
        initializePayPal('vip');
    }
}

function showPackModal() {
    const modal = document.getElementById('packModal');
    if (modal) {
        modal.style.display = 'flex';
        initializePayPal('pack');
    }
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function selectPlan(plan) {
    state.selectedPlan = plan;
    document.querySelectorAll('.plan-card').forEach(card => {
        card.classList.remove('selected');
    });
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('selected');
    }
}

function selectPack(pack) {
    const packMap = { 'starter': 10, 'bronze': 25, 'silver': 50, 'gold': 100 };
    state.selectedPack = packMap[pack] || 50;
    
    document.querySelectorAll('.pack-card').forEach(card => {
        card.classList.remove('selected');
    });
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('selected');
    }
}

// ============================
// PAYPAL
// ============================

function initializePayPal(type) {
    if (typeof paypal === 'undefined') return;
    
    if (type === 'vip') {
        const container = document.getElementById('paypal-button-container-vip');
        if (container && !container.hasChildNodes()) {
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
    } else if (type === 'pack') {
        const container = document.getElementById('paypal-button-container-pack');
        if (container && !container.hasChildNodes()) {
            paypal.Buttons({
                createOrder: (data, actions) => {
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
                        showNotification('+' + state.selectedPack + ' créditos añadidos!', 'success');
                        closeModal();
                    });
                }
            }).render('#paypal-button-container-pack');
        }
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
        const isOpen = window.style.display === 'block';
        window.style.display = isOpen ? 'none' : 'block';
        
        if (!isOpen) {
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
            message = '💎 ¡Hazte VIP y desbloquea TODO! Solo €15/mes o €100 lifetime.';
            setTimeout(() => showVIPModal(), 1000);
            break;
        case 'daily':
            message = '📅 Hoy tenemos ' + CONFIG.CONTENT.DAILY_PHOTOS + ' fotos y ' + CONFIG.CONTENT.DAILY_VIDEOS + ' videos nuevos!';
            break;
        case 'help':
            message = '❓ Puedes comprar créditos o hacerte VIP para acceso ilimitado.';
            break;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'isabella-message';
    messageDiv.innerHTML = '<span class="message-avatar">💕</span><span>' + message + '</span>';
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

function scrollCarousel(direction) {
    const carousel = document.getElementById('teaserCarousel');
    if (carousel) {
        carousel.scrollBy({
            left: 300 * direction,
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
    
    const allPhotos = [...window.ALL_PHOTOS_POOL, ...window.ALL_UNCENSORED_PHOTOS_POOL];
    
    state.dailyPhotos = getDailyRotation(allPhotos, CONFIG.CONTENT.DAILY_PHOTOS);
    state.dailyVideos = getDailyRotation(window.ALL_VIDEOS_POOL, CONFIG.CONTENT.DAILY_VIDEOS);
    state.teaserItems = getDailyRotation(window.ALL_PHOTOS_POOL, CONFIG.CONTENT.TEASER_COUNT);
    
    renderPhotosProgressive(document.getElementById('photosGrid'), state.dailyPhotos);
    renderVideosProgressive(document.getElementById('videosGrid'), state.dailyVideos);
    renderTeaserCarousel();
    
    updateCreditsDisplay();
    changeLanguage(state.language);
    
    const photoCount = document.getElementById('photoCount');
    const videoCount = document.getElementById('videoCount');
    
    if (photoCount) photoCount.textContent = state.dailyPhotos.length;
    if (videoCount) videoCount.textContent = state.dailyVideos.length;
    
    console.log('✅ Galería inicializada v' + CONFIG.VERSION);
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
    
    // Verificar expiración VIP
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
window.scrollCarousel = scrollCarousel;
window.state = state;
window.TRANSLATIONS = TRANSLATIONS;

// ============================
// DEBUG
// ============================

window.galleryDebug = {
    stats: () => ({
        version: CONFIG.VERSION,
        totalPhotos: (window.ALL_PHOTOS_POOL?.length || 0) + (window.ALL_UNCENSORED_PHOTOS_POOL?.length || 0),
        totalVideos: window.ALL_VIDEOS_POOL?.length || 0,
        dailyPhotos: state.dailyPhotos.length,
        dailyVideos: state.dailyVideos.length,
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
        console.log('✅ ' + num + ' créditos añadidos');
    },
    reset: () => {
        localStorage.clear();
        location.reload();
    }
};

console.log('🌊 BeachGirl.pics Gallery v' + CONFIG.VERSION + ' loaded successfully');
