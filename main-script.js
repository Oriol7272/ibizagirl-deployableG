/**
 * main-script.js - IbizaGirl.pics v5.1.0 FIXED
 * Sistema principal integrado y corregido
 */
'use strict';

console.log('🚀 main-script.js v5.1.0 iniciando...');

// ============================
// VARIABLES GLOBALES
// ============================
let currentPage = 1;
let currentView = 'gallery';
let currentBannerIndex = 0;
let bannerInterval = null;
let isVIP = false;
let lightboxIndex = 0;
let lightboxImages = [];

// ============================
// DETECCIÓN VIP
// ============================
function checkVIPAccess() {
    const vipData = localStorage.getItem('vipAccess');
    if (vipData) {
        try {
            const access = JSON.parse(vipData);
            const now = new Date();
            const purchaseDate = new Date(access.purchaseDate);
            
            // Check if access is still valid
            if (access.type === 'lifetime') {
                isVIP = true;
                return true;
            }
            
            if (access.type === 'monthly') {
                const monthAgo = new Date(purchaseDate.getTime() + (30 * 24 * 60 * 60 * 1000));
                if (now < monthAgo) {
                    isVIP = true;
                    return true;
                }
            }
        } catch (e) {
            console.error('Error parsing VIP data:', e);
        }
    }
    
    isVIP = false;
    return false;
}

// ============================
// INICIALIZACIÓN
// ============================
async function initializeApp() {
    console.log('📱 Inicializando aplicación...');
    
    // Hide loading screen
    setTimeout(() => {
        const loading = document.getElementById('loadingScreen');
        if (loading) loading.style.display = 'none';
    }, 1500);
    
    // Check VIP status
    checkVIPAccess();
    
    // Setup navigation
    setupNavigation();
    
    // Setup banner rotation
    setupBannerRotation();
    
    // Load initial content
    loadInitialContent();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup lightbox
    setupLightbox();
    
    console.log('✅ Aplicación inicializada correctamente');
}

// ============================
// NAVEGACIÓN
// ============================
function setupNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.target.closest('.nav-btn').getAttribute('data-view');
            switchView(view);
        });
    });
}

function switchView(view) {
    console.log('🔄 Cambiando a vista:', view);
    
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');
    
    // Update views
    document.querySelectorAll('.content-view').forEach(viewEl => {
        viewEl.classList.remove('active');
    });
    document.getElementById(view + 'View').classList.add('active');
    
    currentView = view;
    
    // Load content for the view
    if (view === 'gallery') {
        loadGalleryContent();
    } else if (view === 'videos') {
        loadVideoContent();
    }
}

// ============================
// BANNER ROTATORIO
// ============================
function setupBannerRotation() {
    if (!window.BannerTeaserManager) {
        console.warn('⚠️ BannerTeaserManager no disponible');
        return;
    }
    
    const banners = window.BannerTeaserManager.getBanners();
    const bannerSlider = document.getElementById('banner-slider');
    const indicatorsContainer = document.getElementById('banner-indicators');
    
    if (!bannerSlider || !banners.length) {
        console.warn('⚠️ Banner slider no encontrado o sin banners');
        return;
    }
    
    // Create banner slides
    banners.forEach((banner, index) => {
        const slide = document.createElement('div');
        slide.className = `banner-slide ${index === 0 ? 'active' : ''}`;
        slide.style.backgroundImage = `url(${banner})`;
        bannerSlider.appendChild(slide);
        
        // Create indicator
        const indicator = document.createElement('div');
        indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => goToBanner(index));
        indicatorsContainer.appendChild(indicator);
    });
    
    // Auto rotation
    bannerInterval = setInterval(() => {
        nextBanner();
    }, 5000);
    
    console.log('🎠 Banner rotatorio configurado con', banners.length, 'imágenes');
}

function goToBanner(index) {
    const slides = document.querySelectorAll('.banner-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(ind => ind.classList.remove('active'));
    
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    
    currentBannerIndex = index;
}

function nextBanner() {
    const slides = document.querySelectorAll('.banner-slide');
    currentBannerIndex = (currentBannerIndex + 1) % slides.length;
    goToBanner(currentBannerIndex);
}

// ============================
// CONTENIDO DE GALERÍA
// ============================
function loadInitialContent() {
    loadTeaserGallery();
    loadGalleryContent();
}

function loadTeaserGallery() {
    if (!window.BannerTeaserManager) return;
    
    const teasers = window.BannerTeaserManager.getTeasers();
    const teaserContainer = document.getElementById('teaser-gallery');
    
    if (!teaserContainer || !teasers.length) return;
    
    teaserContainer.innerHTML = teasers.map((teaser, index) => `
        <div class="teaser-item" data-src="${teaser}" onclick="openLightbox('${teaser}', ${index})">
            <img src="${teaser}" alt="Teaser ${index + 1}" loading="lazy">
            <div class="teaser-overlay">
                <div class="teaser-info">
                    <h4>Preview ${index + 1}</h4>
                    <p>Click para ampliar</p>
                </div>
            </div>
        </div>
    `).join('');
    
    console.log('✨ Teasers cargados:', teasers.length);
}

function loadGalleryContent(page = 1) {
    const galleryContainer = document.getElementById('main-gallery');
    if (!galleryContainer) return;
    
    let images = [];
    
    // Combine public and premium content based on VIP status
    if (window.PublicContentManager) {
        images = [...window.PublicContentManager.getAll()];
    }
    
    if (isVIP) {
        if (window.PremiumContentPart1) {
            images = [...images, ...window.PremiumContentPart1.getAll()];
        }
        if (window.PremiumContentPart2) {
            images = [...images, ...window.PremiumContentPart2.getAll()];
        }
    }
    
    // Shuffle and paginate
    if (window.ArrayUtils) {
        const seed = window.TimeUtils ? window.TimeUtils.getDailySeed() : Date.now();
        images = window.ArrayUtils.shuffleWithSeed(images, seed);
        const paginated = window.ArrayUtils.paginate(images, page, 24);
        displayGalleryImages(paginated.data);
        
        // Update load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = paginated.hasNext ? 'block' : 'none';
        }
    } else {
        displayGalleryImages(images.slice(0, 24));
    }
    
    console.log('🖼️ Galería cargada:', images.length, 'imágenes disponibles');
}

function displayGalleryImages(images) {
    const galleryContainer = document.getElementById('main-gallery');
    if (!galleryContainer) return;
    
    const imageHTML = images.map((img, index) => {
        const isPremium = img.includes('uncensored/') && !isVIP;
        const blurClass = isPremium ? 'premium-blur' : '';
        const overlayHTML = isPremium ? `
            <div class="premium-overlay">
                <div class="premium-badge">
                    <span class="price">€0.10</span>
                    <span class="unlock-text">Unlock to view</span>
                </div>
            </div>
        ` : '';
        
        return `
            <div class="gallery-item ${blurClass}" data-src="${img}" onclick="handleGalleryClick('${img}', ${index})">
                <img src="${img}" alt="Gallery Image ${index + 1}" loading="lazy">
                <div class="gallery-overlay">
                    <div class="gallery-info">
                        <h4>Image ${index + 1}</h4>
                        <p>${isPremium ? 'Premium Content' : 'Free Content'}</p>
                    </div>
                </div>
                ${overlayHTML}
            </div>
        `;
    }).join('');
    
    if (currentPage === 1) {
        galleryContainer.innerHTML = imageHTML;
    } else {
        galleryContainer.innerHTML += imageHTML;
    }
    
    lightboxImages = images;
}

function handleGalleryClick(imagePath, index) {
    if (imagePath.includes('uncensored/') && !isVIP) {
        // Show premium purchase modal
        showPremiumModal(imagePath);
    } else {
        // Open in lightbox
        openLightbox(imagePath, index);
    }
}

// ============================
// CONTENIDO DE VIDEOS
// ============================
function loadVideoContent(page = 1) {
    if (!window.VideoContentManager) {
        console.warn('⚠️ VideoContentManager no disponible');
        return;
    }
    
    const videos = window.VideoContentManager.getAll();
    const videoContainer = document.getElementById('video-gallery');
    
    if (!videoContainer) return;
    
    const videoHTML = videos.slice(0, 12).map((video, index) => {
        const isPremium = !isVIP;
        const blurClass = isPremium ? 'premium-blur' : '';
        
        return `
            <div class="video-item ${blurClass}" data-src="${video}" onclick="handleVideoClick('${video}', ${index})">
                <img src="${video}" alt="Video ${index + 1}" class="video-thumbnail" loading="lazy">
                <div class="video-duration">2:45</div>
                <div class="video-play-btn">▶</div>
                ${isPremium ? `
                    <div class="premium-overlay">
                        <div class="premium-badge">
                            <span class="price">€0.30</span>
                            <span class="unlock-text">Unlock Video</span>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
    
    videoContainer.innerHTML = videoHTML;
    console.log('🎬 Videos cargados:', videos.length);
}

function handleVideoClick(videoPath, index) {
    if (!isVIP) {
        showPremiumModal(videoPath, 'video');
    } else {
        // Play video logic here
        console.log('Playing video:', videoPath);
    }
}

// ============================
// MODAL PREMIUM
// ============================
function showPremiumModal(contentPath, type = 'image') {
    const price = type === 'video' ? '€0.30' : '€0.10';
    
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="this.closest('.modal').remove()">&times;</span>
            <h2>Premium Content</h2>
            <p>This ${type} requires a premium purchase.</p>
            <div class="premium-options">
                <div class="option">
                    <h3>Single Purchase</h3>
                    <div class="price-large">${price}</div>
                    <button class="premium-btn" onclick="purchaseContent('${contentPath}', '${type}')">
                        Buy Now
                    </button>
                </div>
                <div class="option recommended">
                    <h3>Full Access</h3>
                    <div class="price-large">€9.99/month</div>
                    <button class="premium-btn" onclick="window.location.hash='pricing'">
                        Get Full Access
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// ============================
// LIGHTBOX
// ============================
function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('show')) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    prevImage();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
            }
        }
    });
}

function openLightbox(imagePath, index = 0) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    if (!lightbox || !lightboxImg) return;
    
    lightboxImg.src = imagePath;
    lightboxIndex = index;
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function prevImage() {
    if (lightboxImages.length > 0) {
        lightboxIndex = lightboxIndex > 0 ? lightboxIndex - 1 : lightboxImages.length - 1;
        const lightboxImg = document.getElementById('lightbox-img');
        if (lightboxImg) {
            lightboxImg.src = lightboxImages[lightboxIndex];
        }
    }
}

function nextImage() {
    if (lightboxImages.length > 0) {
        lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
        const lightboxImg = document.getElementById('lightbox-img');
        if (lightboxImg) {
            lightboxImg.src = lightboxImages[lightboxIndex];
        }
    }
}

// ============================
// EVENT LISTENERS
// ============================
function setupEventListeners() {
    // Load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            currentPage++;
            loadGalleryContent(currentPage);
        });
    }
    
    // Hash change for deep linking
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (['gallery', 'videos', 'pricing'].includes(hash)) {
            switchView(hash);
        }
    });
    
    // Check initial hash
    const initialHash = window.location.hash.substring(1);
    if (['gallery', 'videos', 'pricing'].includes(initialHash)) {
        switchView(initialHash);
    }
}

// ============================
// UTILIDADES
// ============================
function formatPrice(price) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
    }).format(price);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ============================
// FUNCIONES GLOBALES PARA HTML
// ============================
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.prevImage = prevImage;
window.nextImage = nextImage;
window.navigateLightbox = function(direction) {
    direction === 'prev' ? prevImage() : nextImage();
};

// ============================
// INICIALIZACIÓN AUTOMÁTICA
// ============================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// ============================
// CSS DINÁMICO
// ============================
const dynamicStyles = `
    .premium-blur {
        filter: blur(10px);
        position: relative;
    }
    
    .premium-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
    }
    
    .premium-badge {
        background: linear-gradient(45deg, #ff1493, #ff69b4);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        text-align: center;
        cursor: pointer;
        transition: transform 0.3s ease;
    }
    
    .premium-badge:hover {
        transform: scale(1.1);
    }
    
    .premium-badge .price {
        display: block;
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 5px;
    }
    
    .premium-badge .unlock-text {
        display: block;
        font-size: 0.9rem;
        opacity: 0.9;
    }
    
    .lightbox.show {
        display: flex;
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);

console.log('✅ main-script.js v5.1.0 cargado y listo');