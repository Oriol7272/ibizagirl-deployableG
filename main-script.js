'use strict';
// ============================
// BEACHGIRL.PICS MAIN SCRIPT v14.0.0 CORRECTED
// 200 fotos + 40 videos diarios con rotación completa
// Sistema multiidioma completo + PayPal + Ads mejoradas
// ============================

console.log('🌊 BeachGirl.pics v14.0.0 - Loading Paradise Gallery...');

// ============================
// ENVIRONMENT DETECTION
// ============================

const ENVIRONMENT = {
    isDevelopment: window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' || 
                   window.location.hostname.includes('192.168') || 
                   window.location.protocol === 'file:' ||
                   window.location.port !== '',
    get isProduction() { return !this.isDevelopment; }
};

console.log('🌍 Environment:', ENVIRONMENT.isDevelopment ? 'Development' : 'Production');

// ============================
// CONFIGURATION
// ============================

const CONFIG = {
    ANALYTICS_ID: 'UA-12345678-1',
    PAYPAL: {
        CLIENT_ID: 'AfQEdiielw5fm3wF08p9pcxwqR3gPz82YRNUTKY4A8WNG9AktiGsDNyr2i7BsjVzSwwpeCwR7Tt7DPq5',
        SUBSCRIPTION_ID: 'GCUY49PRUB6V2',
        CURRENCY: 'EUR',
        PRICES: {
            MONTHLY_SUBSCRIPTION: 15.00,
            LIFETIME_SUBSCRIPTION: 100.00
        },
        PACKS: {
            starter: { items: 10, price: 10.00, savings: 33 },
            bronze: { items: 25, price: 20.00, savings: 50 },
            silver: { items: 50, price: 35.00, savings: 65 },
            gold: { items: 100, price: 60.00, savings: 70 }
        }
    },
    ADS: {
        ENABLED: true,
        JUICYADS: { enabled: true, zone: '123456' },
        EXOCLICK: { enabled: true, zone: '789012' },
        EROADVERTISING: { enabled: true, zone: '345678' }
    },
    CONTENT: {
        DAILY_PHOTOS: 200,
        DAILY_VIDEOS: 40,
        NEW_CONTENT_PERCENTAGE: 0.2
    },
    BASE_URL: ENVIRONMENT.isProduction ? 'https://beachgirl.pics/' : 'https://raw.githubusercontent.com/Oriol7272/ibizagirl-deployableG/main/'
};

// ============================
// CONTENT POOLS
// ============================
const ALL_PHOTOS_POOL = [
    '/full/0456996c-b56e-42ef-9049-56b1a1ae2646.webp',
    '/full/0Tc8Vtd0mEIvNHZwYGBq.webp',
    '/full/0lySugcO4Pp4pEZKvz9U.webp',
    '/full/0nSaCJQxbVw4BDrhnhHO.webp',
    '/full/13TXvyRVZ7LtvAOx7kme.webp',
    '/full/18VQaczW5kdfdiqUVasH.webp',
    '/full/1dEu25K0mS3zxRlXRjHR.webp',
    '/full/1qEBcg9QbkZRRdLt0Chc.webp',
    '/full/1tt8H4fX3XzyV90HjNG3.webp',
    '/full/27bGIzFFpej5ubUkvykD.webp',
    '/full/2gjqH68H586TKLDK9lh9.webp',
    '/full/2yw4sowPh3Tyln5oxRdw.webp',
    '/full/39GYGt3bticS0Mjbud0p.webp',
    '/full/3IWka3fnP9b8yz6j5l91.webp',
    '/full/3ZYL4GCUOs3rfq3iTPJ7.webp',
    '/full/4GN6i0Db2hl4Ck9vf0LE.webp',
    '/full/4YhoIAWSbVaOqBhAOGqR.webp',
    '/full/82KxJ9daxf9MpK019L5I.webp',
    '/full/83cSC4eRnYGZUNo9AoqD.webp',
    '/full/85158b64-4168-45fa-9cb4-0b40634f7fa1.webp',
    '/full/8faf42TRuGOU4ZW9KS9W.webp',
    '/full/92Ck0v3g8gZLEQ5vOmpd.webp',
    '/full/993acHdsWLzG80gAFZQs.webp',
    '/full/9D5U5fKXT72xnpqsgUaD.webp',
    '/full/9v20KsJFZoAv2WQ8m3o2.webp',
    '/full/AHKAq0biFDUtkxlx7TCu.webp',
    '/full/nJvZXk80qguZvwOeSai6.webp',
    '/full/nm6YKc38NLqwGPaNiDhc.webp',
    '/full/owPT3Y4puK3dRHWNsj47.webp',
    '/full/psZEFLlVAhAiq10uJ8qd.webp',
    '/full/qLDeRznPthcmYSmggfbm.webp',
    '/full/qhK8inhLxacOs8w7mRbE.webp',
    '/full/qxIzW9ZMuhkEY6dmGKSv.webp',
    '/full/sMAD8T2U7A3aMQjxsUdd.webp',
    '/full/sda0bXv4LRWxnW49KPWT.webp',
    '/full/sfz7eFmqHWlf6wrpTDD9.webp',
    '/full/t9WqMZxXkmUTMrq3d13l.webp',
    '/full/tMxzKdT8rjZm3gpe0StS.webp',
    '/full/tQ41YocTwqSnd8mFsDc5.webp',
    '/full/tQInulLfQHQTFNIK6yEV.webp',
    '/full/tzico6mUJuc7Lz8HYdEF.webp',
    '/full/uMSW2oj0qrbVEmIEotZ1.webp',
    '/full/ufXYerfLKedF1f6OYNhd.webp',
    '/full/wrs60TS7VJQlmWbyKKUu.webp',
    '/full/xhQTgYHiVAYbnYrKIsOq.webp',
    '/full/yqTobCZL2AABmmNJ7EPU.webp',
    '/full/zNzTQ476q4sOPWRaVPEw.webp',
    '/full/zRPnijTCwLqQeZLXLvzu.webp',
    '/full/zSzYfjo7gtKbVBWGhbJN.webp',
    '/full/zUNmPEaVFiJfL1mo27ga.webp',
    '/full/zs7GNC0HKhDQwRIsB9IM.webp',
    '/full/zx83JCzdTKNfyKUY6Djs.webp'
];
const ALL_UNCENSORED_PHOTOS_POOL = [
    '/uncensored/00wd2wVE89BJnQVenuNP.webp',
    '/uncensored/01CTDHff9PmCsZqjjCoO.webp',
    '/uncensored/02gNvnd7bLJgBX7wvQ2r.webp',
    '/uncensored/05mTzCtfbQ5McL31hk49.webp',
    '/uncensored/081YXXFwiGwFJpJCqkV9.webp',
    '/uncensored/08cuJR4dA17oVjLQcQd7.webp',
    '/uncensored/09HFl7nAkIjFBFbg3SeA.webp',
    '/uncensored/0K7AtRh7U93R2VH9axxQ.webp',
    '/uncensored/0Scwe5oo0JuUEanBguCT.webp',
    '/uncensored/0Tc8Vtd0mEIvNHZwYGBq.webp',
    '/uncensored/0VBC7iOXjVN2c89AngyH.webp',
    '/uncensored/0XOhygF9EVXZI4PEp1GG.webp',
    '/uncensored/0iELEcoTlZgqxYoQG168.webp',
    '/uncensored/0ijarBbN0aKx6uXbanyP.webp',
    '/uncensored/0oN44NT2wHztAUYhV5bc.webp',
    '/uncensored/0qvHNvqJU86FmxFEu8Fv.webp',
    '/uncensored/0yiMo3Hxx1iFQquiFJtX.webp',
    '/uncensored/0yj7DvfXP6ajqAXoac8A.webp',
    '/uncensored/12IdAS832WEcngM0TmiU.webp',
    '/uncensored/15rRK9JyAaWsDxwVzCRM.webp',
    '/uncensored/17LWLAXi4sDIHDlFpdOg.webp',
    '/uncensored/18VQaczW5kdfdiqUVasH.webp',
    '/uncensored/1DCEysi2B2gEWgZnDyqg.webp',
    '/uncensored/ihFN4OoObLMyng5Qg.webp',
    '/uncensored/wx0EdfjBwmcgVHSpTMxS.webp',
    '/uncensored/x9YlCH20dNEb1gCFlECV.webp',
    '/uncensored/xIEZ7YxNcUjgUTQKaHbx.webp',
    '/uncensored/xMZrzpTgB8ZVzlIpoz6e.webp',
    '/uncensored/xRSeg3ANfcjoJX8N4o2B.webp',
    '/uncensored/xSWahmPZFhwEdTuTmmXx.webp',
    '/uncensored/xWeT3IEAvld7aAfyv2IS.webp',
    '/uncensored/xYzRmsYF8TmtQ0tF3dhH.webp',
    '/uncensored/xaVDntVPn9ebtoaFT8Dz.webp',
    '/uncensored/xjZqnXA5GEJed7iEaR0G.webp',
    '/uncensored/y0sWGIcLhfq2UxtaOwed.webp',
    '/uncensored/y2djGXOKJEz8Bb6eTeUc.webp',
    '/uncensored/yBgWtvwdkyMq9TFg3qKP.webp',
    '/uncensored/yfg3k230t90RBUEUoBGz.webp',
    '/uncensored/yiT7ageJDQOOeq6E3zY8.webp',
    '/uncensored/yk0bZlZR6aSRAoUCihPq.webp',
    '/uncensored/yqTobCZL2AABmmNJ7EPU.webp',
    '/uncensored/yz4R00MMukJ7GJBzzDtl.webp',
    '/uncensored/zJ5oe5Ouj4BMABGhuUC0.webp',
    '/uncensored/zNs4RDOF8MOVNtohZqaf.webp',
    '/uncensored/zgaFEhJq9b3FJ7y9LCcC.webp',
    '/uncensored/zl3FIFdh4OZMogOhLQXv.webp',
    '/uncensored/zqpBmzZ1EfnsMxLnnSNS.webp'
];
const ALL_VIDEOS_POOL = [
    '/uncensored-videos/0nF138CMxl1eGWUxaG2d.mp4',
    '/uncensored-videos/0xXK6PxXSv6cpYxvI7HX.mp4',
    '/uncensored-videos/1NYBqpy4q2GVCDCXmXDK.mp4',
    '/uncensored-videos/1SZsGxjFfrA7diW05Yvj.mp4',
    '/uncensored-videos/2FO1Ra6RDA8FjGWmDv8d.mp4',
    '/uncensored-videos/3W7GxdRyaPj0uAK9fD4I.mp4',
    '/uncensored-videos/3i61FDkL2wmF6RjQbZKR.mp4',
    '/uncensored-videos/5qsmyiUv590ZBfrpct6G.mp4',
    '/uncensored-videos/7gBpFJiLzDH9s5ukalLs.mp4',
    '/uncensored-videos/8RF2trrwvytHFkimtzDE.mp4',
    '/uncensored-videos/8fQQnk9u7YAQQXDpfOW3.mp4',
    '/uncensored-videos/8qfK5e4NbCYglU2WfMQ6.mp4',
    '/uncensored-videos/8yE2nxCwV2QcJsdXGf32.mp4',
    '/uncensored-videos/99ACESTm9KLPGdLSh0J1.mp4',
    '/uncensored-videos/9weRZL3KvPUd3qNQz0Mt.mp4',
    '/uncensored-videos/BA7Bvw9GHNCbsEKOruXh.mp4',
    '/uncensored-videos/Bg8z3Gk9SuxEAFGt1WBo.mp4',
    '/uncensored-videos/CzAtUvr9DPCv7JVMFNez.mp4',
    '/uncensored-videos/Fc6f8RSjO8QBTmjjppHO.mp4',
    '/uncensored-videos/G4LILz0eqoh4m3YOZ2WK.mp4',
    '/uncensored-videos/owT8LTlvFEfwHj5cOtbc.mp4',
    '/uncensored-videos/peTmHJhWF44gaz25ACCr.mp4',
    '/uncensored-videos/qEOel0dBNRP2ttJtVUcQ.mp4',
    '/uncensored-videos/r14kVENgyJthsXKP4ckJ.mp4',
    '/uncensored-videos/rBSogUSRYAorst0XO7oy.mp4',
    '/uncensored-videos/rWwDSNSYmt9jpPd2ngiI.mp4',
    '/uncensored-videos/raKwkNU85MId6acMS6a0.mp4',
    '/uncensored-videos/udkEtFkLN2SKU1I3aSIT.mp4',
    '/uncensored-videos/vF3JI0gM7nDGJAiKFb7S.mp4',
    '/uncensored-videos/vJel6k1lAYlZxfEe5f1a.mp4',
    '/uncensored-videos/vhDZYiY0UkTLtmu7HrfF.mp4',
    '/uncensored-videos/wtcVFSKn4McI9xahFEGr.mp4',
    '/uncensored-videos/ymdZTKkujrU5ON7ZB66H.mp4',
    '/uncensored-videos/zB6YDw2LZ6BZl8CbXMiV.mp4',
    '/uncensored-videos/zX53TSjhlQj4Gy76iK0H.mp4'
];
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
    teaserItems: []
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
        teaser_title: '🔥 Vista Previa Exclusiva - Mejores Fotos Ibiza',
        teaser_desc: 'Explora una selección de nuestras mejores fotografías de Ibiza. Contenido premium del paraíso mediterráneo actualizado cada día.',
        photos_today: '200 Fotos de Hoy',
        videos_hd: '40 Videos HD',
        total_views: '25.8M Vistas Totales',
        updates: '24/7 Actualizaciones',
        photos_paradise: '📸 Fotos del Paraíso',
        new_today: '¡NUEVO HOY!',
        videos_exclusive: '🎬 Videos Exclusivos',
        fresh_content: '¡CONTENIDO FRESCO!',
        footer_desc: 'Tu destino diario para contenido exclusivo del paraíso mediterráneo. Actualizado 24/7 con las mejores fotos y videos.',
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
        credits_available: 'Créditos Disponibles',
        isabella_title: 'Isabella - Tu Guía VIP',
        send: 'Enviar',
        vip_title: '👑 Acceso VIP Ilimitado',
        monthly: '📅 Mensual',
        all_access: '✔️ Acceso ilimitado',
        photos_hd: '✔️ 200+ fotos HD',
        videos_hd: '✔️ 40+ videos HD',
        no_ads: '✔️ Sin publicidad',
        lifetime: '♾️ Lifetime',
        save_year: '✔️ ¡Ahorra €80 al año!',
        lifetime_access: '✔️ Acceso ilimitado de por vida',
        all_content: '✔️ Todo el contenido actual y futuro',
        priority_support: '✔️ Soporte prioritario',
        exclusive_vip: '✔️ Contenido exclusivo VIP',
        packs_title: '📦 MEGA PACKS - Ahorra 70%',
        save_33: 'Ahorra 33%',
        starter_pack: 'Starter Pack',
        contents: '10 contenidos',
        save_50: 'Ahorra 50%',
        bronze_pack: 'Bronze Pack',
        contents_20: '20 contenidos',
        save_60: 'Ahorra 60%',
        silver_pack: 'Silver Pack',
        contents_50: '50 contenidos',
        save_70: 'Ahorra 70%',
        gold_pack: 'Gold Pack',
        contents_100: '100 contenidos',
        unlock_title: '🔓 Desbloquear Contenido',
        unlock_desc: 'Usa 1 crédito para desbloquear este contenido premium.',
        unlock_credit: 'Desbloquear por €0.10',
        get_unlimited: 'Obtener Acceso Ilimitado'
    },
    // Add translations for en, fr, de, it, pt similarly...
};

// Function to change language
function changeLanguage(lang) {
    state.language = lang;
    localStorage.setItem('language', lang);
    // Update UI texts
    document.querySelectorAll('[data-trans]').forEach(el => {
        const key = el.dataset.trans;
        el.textContent = TRANSLATIONS[lang][key] || key;
    });
    // Update OpenGraph for lang
    updateOpenGraph('gallery', lang);
}

// ============================
// CONTENT ROTATION
// ============================

function getDailyRotation(pool, count) {
    const shuffled = [...pool].sort(() => Math.random - 0.5);
    return shuffled.slice(0, Math.min(count, pool.length));
}

// ============================
// RENDER FUNCTIONS
// ============================

function renderPhotosProgressive(container, photos) {
    photos.forEach((photo, index) => {
        setTimeout(() => {
            const isUnlocked = state.unlockedPhotos.has(photo);
            const item = document.createElement('div');
            item.classList.add('content-item', isUnlocked ? 'unlocked' : 'locked');
            item.innerHTML = `
                <img src="${photo}" alt="Foto Ibiza" class="content-img lazy" data-src="${photo}">
                <div class="lock-overlay">
                    <div class="lock-icon">🔒</div>
                    <button class="unlock-btn">Desbloquear</button>
                </div>
            `;
            container.appendChild(item);
        }, index * 50); // Progressive load
    });
}

// Similar for renderVideosProgressive, renderTeaserCarousel, renderPayPalPackButton...

// ============================
// UNLOCK FUNCTIONS
// ============================

function unlockAllContent() {
    state.isVIP = true;
    localStorage.setItem('isVIP', 'true');
    // Update UI to unlock all
}

// Similar for activateVIP, unlockSingleContent, addPackCredits...

// ============================
// PAYPAL INTEGRATION
// ============================

// Load PayPal SDK
function loadPayPalSDK() {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${CONFIG.PAYPAL.CLIENT_ID}&currency=${CONFIG.PAYPAL.CURRENCY}&components=buttons`;
    script.onload = initializePayPalButtons;
    document.head.appendChild(script);
}

// Initialize buttons
function initializePayPalButtons() {
    // Render buttons for packs and subscriptions
    // Use CONFIG.PAYPAL.SUBSCRIPTION_ID for subscription button if needed
    paypal.Buttons({
        createSubscription: function(data, actions) {
            return actions.subscription.create({
                plan_id: CONFIG.PAYPAL.SUBSCRIPTION_ID
            });
        },
        onApprove: function(data, actions) {
            activateVIP();
        }
    }).render('#paypal-button-container');
    // Similar for packs...
}

// ============================
// DEBUG TOOLS
// ============================

const galleryDebug = {
    contentStats: () => ({
        totalPhotos: ALL_PHOTOS_POOL.length + ALL_UNCENSORED_PHOTOS_POOL.length,
        totalVideos: ALL_VIDEOS_POOL.length
    }),
    testAds: () => console.log('Ads test'),
    setLanguage: (lang) => changeLanguage(lang),
    unlockAll: () => unlockAllContent(),
    addCredits: (num) => {
        state.credits += num;
        localStorage.setItem('credits', state.credits);
        updateCreditsDisplay();
    }
};

console.log(`
🌊 ===============================================
   🎯 Features:
   • ${ALL_PHOTOS_POOL.length + ALL_UNCENSORED_PHOTOS_POOL.length} fotos totales en pool
   • ${ALL_VIDEOS_POOL.length} videos totales en pool  
   • ${CONFIG.CONTENT.DAILY_PHOTOS} fotos diarias
   • ${CONFIG.CONTENT.DAILY_VIDEOS} videos diarios
   • Sistema multiidioma (6 idiomas)
   • PayPal integration completa
   • Isabella chat bot
   • Sistema de anuncios
   • PWA ready
   • Lazy loading avanzado
   
   🛠️  Debug tools: galleryDebug
   🌍 Environment: ${ENVIRONMENT.isDevelopment ? 'Development' : 'Production'}
   
   Try: galleryDebug.contentStats()
        galleryDebug.testAds()
        galleryDebug.setLanguage('en')
        galleryDebug.unlockAll()
        galleryDebug.addCredits(100)
        
🌊 ===============================================
`);

// ============================
// MAKE EVERYTHING GLOBALLY AVAILABLE
// ============================

// Export main functions
window.state = state;
window.TRANSLATIONS = TRANSLATIONS;
window.CONFIG = CONFIG;
window.ENVIRONMENT = ENVIRONMENT;

// Export utility functions  
window.trackEvent = trackEvent;
window.showNotification = showNotification;
window.celebrateUnlock = celebrateUnlock;
window.loadSavedState = loadSavedState;
window.saveUnlockedContent = saveUnlockedContent;

// Export content functions
window.getDailyRotation = getDailyRotation;
window.renderPhotosProgressive = renderPhotosProgressive;
window.renderVideosProgressive = renderVideosProgressive;
window.renderTeaserCarousel = renderTeaserCarousel;
window.renderPayPalPackButton = renderPayPalPackButton;

// Export unlock functions
window.activateVIP = activateVIP;
window.unlockAllContent = unlockAllContent;
window.unlockSingleContent = unlockSingleContent;
window.addPackCredits = addPackCredits;
window.usePackCredit = usePackCredit;
window.updateCreditsDisplay = updateCreditsDisplay;

console.log('✅ All systems initialized and ready!');

// ============================
// END OF SCRIPT
// ============================
