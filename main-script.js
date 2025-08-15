// ============================
// BeachGirl.pics Gallery Script v14.0.0
// Script principal que importa la base de datos de contenido
// ============================

'use strict';

// ============================
// VERIFICAR CARGA DE BASE DE DATOS
// ============================

// Verificar que content-database.js está cargado
if (typeof window.ALL_PHOTOS_POOL === 'undefined' || 
    typeof window.ALL_UNCENSORED_PHOTOS_POOL === 'undefined' || 
    typeof window.ALL_VIDEOS_POOL === 'undefined') {
    console.error('❌ ERROR: content-database.js no está cargado correctamente');
    console.error('Asegúrate de que content-database.js se carga ANTES de main-script.js');
}

// ============================
// CONFIGURATION
// ============================

const CONFIG = {
    VERSION: '14.0.0',
    CONTENT: {
        DAILY_PHOTOS: 200,
        DAILY_VIDEOS: 40,
        NEW_PERCENTAGE: 0.3,
        TEASER_COUNT: 15
    },
    PAYPAL: {
        CLIENT_ID: 'AfQEdiielw5fm3wF08p9pcxwqR3gPz82YRNUTKY4A8WNG9AktiGsDNyr2i7BsjVzSwwpeCwR7Tt7DPq5',
        CURRENCY: 'EUR',
        SUBSCRIPTION_ID: 'YOUR_SUBSCRIPTION_PLAN_ID'
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
    CREDITS: {
        COST_PER_UNLOCK: 1,
        VALUE_PER_CREDIT: 0.10
    }
};

// Environment detection
const ENVIRONMENT = {
    isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    baseURL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 
        'https://beachgirl.pics/' : 'https://raw.githubusercontent.com/Oriol7272/ibizagirl-deployable2/main/'
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
    currentModal: null
};

// ============================
// MULTI-IDIOMA
// ============================

const TRANSLATIONS = {
    es: {
        // Textos principales
        welcome: 'Bienvenida al Paraíso 🌴',
        daily_content: '200+ fotos y 40+ videos actualizados DIARIAMENTE',
        unlock_all: '🔓 Desbloquear Todo',
        view_gallery: '📸 Ver Galería',
        loading: 'Cargando el paraíso...',
        subtitle: 'Contenido Exclusivo del Paraíso',
        
        // Secciones
        teaser_title: '🔥 Vista Previa Exclusiva',
        photos_paradise: '📸 Fotos del Paraíso',
        new_today: '¡NUEVO HOY!',
        videos_exclusive: '🎬 Videos Exclusivos',
        fresh_content: '¡CONTENIDO FRESCO!',
        
        // Estadísticas
        photos_today: '200 Fotos de Hoy',
        videos_hd: '40 Videos HD',
        total_views: '25.8M Vistas Totales',
        updates: '24/7 Actualizaciones',
        
        // VIP y Packs
        vip_title: '👑 Acceso VIP Ilimitado',
        vip_unlimited: '👑 Acceso VIP Ilimitado',
        monthly: '📅 Mensual',
        lifetime: '♾️ Lifetime',
        megapack: '📦 MEGA PACKS -70%',
        
        // Isabella Bot
        isabella_title: 'Isabella - Tu Guía VIP',
        vip_info: '💎 VIP Info',
        news: '📅 Novedades',
        help: '❓ Ayuda',
        
        // Footer
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
        
        // Créditos
        credits_available: 'Créditos Disponibles',
        unlock_credit: 'Desbloquear por 1 crédito',
        get_unlimited: 'Obtener Acceso Ilimitado'
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
        vip_title: '👑 Unlimited VIP Access',
        vip_unlimited: '👑 Unlimited VIP Access',
        monthly: '📅 Monthly',
        lifetime: '♾️ Lifetime',
        megapack: '📦 MEGA PACKS -70%',
        isabella_title: 'Isabella - Your VIP Guide',
        vip_info: '💎 VIP Info',
        news: '📅 News',
        help: '❓ Help',
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
        credits_available: 'Credits Available',
        unlock_credit: 'Unlock for 1 credit',
        get_unlimited: 'Get Unlimited Access'
    }
    // Agregar más idiomas: de, it, fr, pt...
};

// ============================
// FUNCIONES PRINCIPALES
// ============================

// Cambiar idioma
function changeLanguage(lang) {
    state.language = lang;
    localStorage.setItem('language', lang);
    
    // Actualizar todos los textos
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.dataset.translate;
        el.textContent = TRANSLATIONS[lang][key] || TRANSLATIONS['es'][key] || key;
    });
    
    // Actualizar meta tags si existe la función
    if (typeof updateOpenGraph === 'function') {
        updateOpenGraph('gallery', lang);
    }
}

// Rotación diaria de contenido
function getDailyRotation(pool, count) {
    const today = new Date().toDateString();
    const seed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    // Mezclar usando seed del día
    const shuffled = [...pool].sort((a, b) => {
        const aVal = a.split('').reduce((sum, char) => sum + char.charCodeAt(0), seed);
        const bVal = b.split('').reduce((sum, char) => sum + char.charCodeAt(0), seed);
        return aVal - bVal;
    });
    
    return shuffled.slice(0, Math.min(count, pool.length));
}

// Renderizar fotos progresivamente
function renderPhotosProgressive(container, photos) {
    if (!container) return;
    
    container.innerHTML = '';
    
    photos.forEach((photo, index) => {
        setTimeout(() => {
            const isUnlocked = state.isVIP || state.unlockedPhotos.has(photo);
            const item = document.createElement('div');
            item.classList.add('content-item', isUnlocked ? 'unlocked' : 'locked');
            
            item.innerHTML = `
                <img src="${photo}" alt="Foto Premium" class="content-img lazy" loading="lazy">
                ${!isUnlocked ? `
                    <div class="lock-overlay">
                        <div class="lock-icon">🔒</div>
                        <button class="unlock-btn" onclick="unlockContent('${photo}', 'photo')">
                            ${TRANSLATIONS[state.language].unlock_credit}
                        </button>
                    </div>
                ` : ''}
                ${Math.random() < CONFIG.CONTENT.NEW_PERCENTAGE ? '<span class="new-badge">NEW</span>' : ''}
            `;
            
            container.appendChild(item);
        }, index * 50); // Carga progresiva
    });
}

// Renderizar videos progresivamente
function renderVideosProgressive(container, videos) {
    if (!container) return;
    
    container.innerHTML = '';
    
    videos.forEach((video, index) => {
        setTimeout(() => {
            const isUnlocked = state.isVIP || state.unlockedVideos.has(video);
            const item = document.createElement('div');
            item.classList.add('content-item', 'video-item', isUnlocked ? 'unlocked' : 'locked');
            
            item.innerHTML = `
                <video class="content-video" ${isUnlocked ? 'controls' : ''} poster="${video.replace('.mp4', '_thumb.jpg')}">
                    ${isUnlocked ? `<source src="${video}" type="video/mp4">` : ''}
                </video>
                ${!isUnlocked ? `
                    <div class="lock-overlay">
                        <div class="lock-icon">🔒</div>
                        <button class="unlock-btn" onclick="unlockContent('${video}', 'video')">
                            ${TRANSLATIONS[state.language].unlock_credit}
                        </button>
                    </div>
                ` : ''}
                <div class="video-duration">HD</div>
                ${Math.random() < CONFIG.CONTENT.NEW_PERCENTAGE ? '<span class="new-badge">NEW</span>' : ''}
            `;
            
            container.appendChild(item);
        }, index * 50);
    });
}

// Desbloquear contenido
function unlockContent(item, type) {
    if (state.credits < CONFIG.CREDITS.COST_PER_UNLOCK) {
        showPackModal();
        return;
    }
    
    // Descontar crédito
    state.credits -= CONFIG.CREDITS.COST_PER_UNLOCK;
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
    initializeGallery(); // Recargar galería
    
    // Celebrar
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

// Actualizar display de créditos
function updateCreditsDisplay() {
    const creditsNumber = document.getElementById('creditsNumber');
    if (creditsNumber) {
        creditsNumber.textContent = state.credits;
    }
}

// Mostrar modal VIP
function showVIPModal() {
    const modal = document.getElementById('vipModal');
    if (modal) {
        modal.style.display = 'flex';
        state.currentModal = 'vip';
    }
}

// Mostrar modal de packs
function showPackModal() {
    const modal = document.getElementById('packModal');
    if (modal) {
        modal.style.display = 'flex';
        state.currentModal = 'pack';
    }
}

// Cerrar modal
function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    state.currentModal = null;
}

// Isabella Chat Bot
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
            message = '💎 ¡Hazte VIP y desbloquea TODO el contenido! Solo €15/mes o €100 lifetime. ¡Más de 400 fotos y 80 videos te esperan!';
            setTimeout(() => showVIPModal(), 1000);
            break;
        case 'daily':
            message = '📅 ¡Hoy tenemos 200 fotos nuevas y 40 videos HD frescos! El contenido se actualiza cada día a las 00:00.';
            break;
        case 'help':
            message = '❓ Puedes comprar créditos para desbloquear contenido individual o hacerte VIP para acceso ilimitado. ¿Necesitas algo más?';
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
    // Verificar que los arrays estén cargados
    if (typeof window.ALL_PHOTOS_POOL === 'undefined') {
        console.error('❌ Error: content-database.js no está cargado');
        return;
    }
    
    // Combinar fotos de ambas carpetas
    const allPhotos = [...window.ALL_PHOTOS_POOL, ...window.ALL_UNCENSORED_PHOTOS_POOL];
    
    // Obtener rotación diaria
    state.dailyPhotos = getDailyRotation(allPhotos, CONFIG.CONTENT.DAILY_PHOTOS);
    state.dailyVideos = getDailyRotation(window.ALL_VIDEOS_POOL, CONFIG.CONTENT.DAILY_VIDEOS);
    state.teaserItems = getDailyRotation(allPhotos, CONFIG.CONTENT.TEASER_COUNT);
    
    // Renderizar contenido
    renderPhotosProgressive(document.getElementById('photosGrid'), state.dailyPhotos);
    renderVideosProgressive(document.getElementById('videosGrid'), state.dailyVideos);
    
    // Actualizar créditos
    updateCreditsDisplay();
    
    // Cargar idioma
    changeLanguage(state.language);
    
    console.log(`✅ Galería inicializada:
    - ${state.dailyPhotos.length} fotos del día
    - ${state.dailyVideos.length} videos del día
    - Idioma: ${state.language}
    - VIP: ${state.isVIP}
    - Créditos: ${state.credits}`);
}

// ============================
// EVENTOS Y CARGA INICIAL
// ============================

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Ocultar pantalla de carga después de 2 segundos
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }, 2000);
    
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
    
    // Cerrar modales al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });
});

// ============================
// EXPORTAR FUNCIONES GLOBALES
// ============================

// Hacer funciones disponibles globalmente
window.changeLanguage = changeLanguage;
window.showVIPModal = showVIPModal;
window.showPackModal = showPackModal;
window.closeModal = closeModal;
window.toggleIsabella = toggleIsabella;
window.isabellaAction = isabellaAction;
window.unlockContent = unlockContent;
window.selectPlan = (plan) => console.log('Plan seleccionado:', plan);

// ============================
// DEBUG TOOLS
// ============================

const galleryDebug = {
    contentStats: () => ({
        totalPhotos: window.ALL_PHOTOS_POOL?.length + window.ALL_UNCENSORED_PHOTOS_POOL?.length || 0,
        totalVideos: window.ALL_VIDEOS_POOL?.length || 0,
        dailyPhotos: state.dailyPhotos.length,
        dailyVideos: state.dailyVideos.length
    }),
    unlockAll: () => {
        state.isVIP = true;
        localStorage.setItem('isVIP', 'true');
        initializeGallery();
        console.log('✅ Todo desbloqueado');
    },
    addCredits: (num) => {
        state.credits += num;
        localStorage.setItem('credits', state.credits);
        updateCreditsDisplay();
        console.log(`✅ ${num} créditos añadidos. Total: ${state.credits}`);
    },
    resetAll: () => {
        localStorage.clear();
        location.reload();
    }
};

window.galleryDebug = galleryDebug;

console.log(`
🌊 ===============================================
   BeachGirl.pics Gallery v${CONFIG.VERSION}
   
   📊 Contenido disponible:
   • ${window.ALL_PHOTOS_POOL?.length || 0} fotos en /full
   • ${window.ALL_UNCENSORED_PHOTOS_POOL?.length || 0} fotos en /uncensored  
   • ${window.ALL_VIDEOS_POOL?.length || 0} videos HD
   
   🛠️ Debug tools: galleryDebug
   • galleryDebug.contentStats() - Ver estadísticas
   • galleryDebug.unlockAll() - Desbloquear todo
   • galleryDebug.addCredits(100) - Añadir créditos
   • galleryDebug.resetAll() - Resetear todo
   
🌊 ===============================================
`);
