// main-script.js - Script Principal v5.0
(function() {
    'use strict';

    console.log('🎯 main-script.js v5.0 iniciando...');

    // Wait for real dependencies that actually exist
    async function waitForDependencies() {
        const maxAttempts = 50;
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            if (window.BannerTeaserManager && 
                window.PublicContentManager && 
                window.VideoContentManager &&
                window.EventManager) {
                console.log('✅ Todas las dependencias reales están listas');
                return true;
            }
            
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        console.error('❌ Timeout esperando dependencias reales');
        return false;
    }

    // Initialize main application
    async function initializeApp() {
        console.log('🚀 Inicializando aplicación principal...');
        
        const ready = await waitForDependencies();
        if (!ready) {
            console.error('❌ No se pudieron cargar las dependencias');
            return;
        }

        try {
            // Initialize UI components
            initializeUI();
            updateVIPStatus(); // Initialize VIP status display
            
            // Setup event handlers
            setupEventHandlers();
            
            // Load initial content
            loadInitialContent();
            
            // Hide loading screen
            hideLoadingScreen();
            
            console.log('✅ Aplicación inicializada correctamente');
        } catch (error) {
            console.error('❌ Error inicializando aplicación:', error);
            // Hide loading screen even on error
            hideLoadingScreen();
        }
    }

    // Initialize UI components
    function initializeUI() {
        console.log('🎨 Inicializando componentes UI...');
        
        // Initialize navigation
        setupNavigation();
        
        // Initialize modals
        setupModals();
        
        // Initialize lazy loading
        setupLazyLoading();
        
        // Initialize tooltips
        setupTooltips();
    }

    // Setup navigation
    function setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetView = e.currentTarget.getAttribute('data-view');
                if (targetView) {
                    showView(targetView);
                    
                    // Update active button
                    navButtons.forEach(b => b.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                }
            });
        });
    }
    
    // Show specific view
    function showView(viewName) {
        // Hide all views
        document.querySelectorAll('.content-view').forEach(view => {
            view.classList.remove('active');
        });
        
        // Show target view
        const targetView = document.getElementById(viewName + 'View');
        if (targetView) {
            targetView.classList.add('active');
            console.log(`📄 Vista ${viewName} activada`);
        }
    }

    // Setup modals
    function setupModals() {
        // Close modal on backdrop click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                closeModal(e.target);
            }
        });
        
        // Close button handlers
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                if (modal) closeModal(modal);
            });
        });
    }

    // Open modal
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    };

    // Close modal
    window.closeModal = function(modal) {
        if (typeof modal === 'string') {
            modal = document.getElementById(modal);
        }
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    };

    // Setup lazy loading
    function setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    // Setup tooltips
    function setupTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mouseleave', hideTooltip);
        });
    }

    // Show tooltip
    function showTooltip(e) {
        const text = e.target.getAttribute('data-tooltip');
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        
        document.body.appendChild(tooltip);
        
        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        
        e.target._tooltip = tooltip;
    }

    // Hide tooltip
    function hideTooltip(e) {
        if (e.target._tooltip) {
            e.target._tooltip.remove();
            delete e.target._tooltip;
        }
    }

    // Setup event handlers
    function setupEventHandlers() {
        console.log('📱 Configurando event handlers...');
        
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', handleSearch);
        }
        
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', handleFilter);
        });
        
        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', loadMoreContent);
        }
    }

    // Handle search
    function handleSearch(e) {
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            displaySearchResults([]);
            return;
        }
        
        if (window.searchContent) {
            const results = window.searchContent(query);
            displaySearchResults(results);
        }
    }

    // Display search results
    function displaySearchResults(results) {
        const resultsContainer = document.getElementById('searchResults');
        if (!resultsContainer) return;
        
        if (!results || (results.photos?.length === 0 && results.videos?.length === 0)) {
            resultsContainer.innerHTML = '<p class="no-results">No se encontraron resultados</p>';
            return;
        }
        
        let html = '';
        
        if (results.photos?.length > 0) {
            html += '<h3>Fotos</h3><div class="results-grid">';
            results.photos.slice(0, 6).forEach(photo => {
                html += createPhotoCard(photo);
            });
            html += '</div>';
        }
        
        if (results.videos?.length > 0) {
            html += '<h3>Videos</h3><div class="results-grid">';
            results.videos.slice(0, 6).forEach(video => {
                html += createVideoCard(video);
            });
            html += '</div>';
        }
        
        resultsContainer.innerHTML = html;
    }

    // Handle filter
    function handleFilter(e) {
        const filter = e.target.getAttribute('data-filter');
        
        // Update active filter
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Apply filter
        applyFilter(filter);
    }

    // Apply filter
    function applyFilter(filter) {
        console.log('Aplicando filtro:', filter);
        // Implementation depends on your content structure
    }

    // Load more content
    function loadMoreContent() {
        console.log('Cargando más contenido...');
        // Implementation for loading more content
    }

    // Load initial content
    function loadInitialContent() {
        console.log('📦 Cargando contenido inicial...');
        
        // Load public photos (teasers from "full" folder - NO blur, daily randomized)
        if (window.ContentAPI && window.ContentAPI.getPublicImages) {
            console.log('📸 Cargando fotos públicas...');
            let publicPhotos = window.ContentAPI.getPublicImages(24);
            
            // Apply daily randomization for teasers/banners from "full" folder
            publicPhotos = getDailyRandomImages(publicPhotos, 12);
            
            displayPhotos(publicPhotos);
        }
        
        // Load premium photos (from "uncensored" folder - blurred without access)
        if (window.ContentAPI && window.ContentAPI.getPremiumImages) {
            console.log('💎 Cargando fotos premium...');
            const premiumPhotos = window.ContentAPI.getPremiumImages(12);
            displayPremiumPhotos(premiumPhotos);
        }
        
        // Load videos (from "uncensored-videos" folder - always premium)
        if (window.ContentAPI && window.ContentAPI.getVideos) {
            console.log('🎬 Cargando videos...');
            const videos = window.ContentAPI.getVideos(6);
            displayVideos(videos);
        }
        
        // Load banner images with daily randomization from "full" folder
        if (window.ContentAPI && window.ContentAPI.getBanners) {
            console.log('🎠 Configurando banners...');
            let bannerImages = window.ContentAPI.getBanners();
            
            // Apply daily randomization for banners
            bannerImages = getDailyRandomImages(bannerImages, 6);
            
            setupBanner(bannerImages);
        }
        
        console.log('✅ Contenido inicial cargado completamente');
    }

    // Display photos
    function displayPhotos(photos) {
        console.log('📷 Mostrando fotos públicas:', photos.length);
        const container = document.getElementById('teaser-gallery');
        if (!container) {
            console.warn('⚠️ No se encontró container teaser-gallery');
            return;
        }
        
        container.innerHTML = photos.map(photo => createPhotoCard(photo, false)).join('');
    }

    // Display premium photos
    function displayPremiumPhotos(photos) {
        console.log('💎 Mostrando fotos premium:', photos.length);
        const container = document.getElementById('main-gallery');
        if (!container) {
            console.warn('⚠️ No se encontró container main-gallery');
            return;
        }
        
        container.innerHTML = photos.map(photo => createPhotoCard(photo, true)).join('');
    }

    // Display videos
    function displayVideos(videos) {
        console.log('🎥 Mostrando videos:', videos.length);
        const container = document.getElementById('video-gallery');
        if (!container) {
            console.warn('⚠️ No se encontró container video-gallery');
            return;
        }
        
        container.innerHTML = videos.map(video => createVideoCard(video)).join('');
    }

    // Enhanced VIP access system for purchase functionality
    function checkVIPAccess() {
        // Check lifetime access
        if (localStorage.getItem('ibiza_lifetime_access') === 'true') {
            return 'lifetime';
        }
        
        // Check monthly access
        const monthlyAccess = localStorage.getItem('ibiza_monthly_access');
        if (monthlyAccess) {
            const expiryTime = parseInt(monthlyAccess);
            if (Date.now() < expiryTime) {
                return 'monthly';
            } else {
                localStorage.removeItem('ibiza_monthly_access');
            }
        }
        
        // Check premium access (pay-per-view)
        const premiumAccess = localStorage.getItem('ibiza_premium_access');
        if (premiumAccess) {
            const accessTime = parseInt(premiumAccess);
            const oneDay = 24 * 60 * 60 * 1000; // 24 hours
            if (Date.now() - accessTime < oneDay) {
                return 'premium';
            } else {
                localStorage.removeItem('ibiza_premium_access');
            }
        }
        
        return null;
    }
    
    // Create photo card with proper blur system (NO blur for teasers from "full" folder)
    function createPhotoCard(photo, isPremium = false) {
        const vipAccess = checkVIPAccess();
        const hasAccess = vipAccess && (vipAccess === 'lifetime' || vipAccess === 'monthly' || vipAccess === 'premium');
        
        const imagePath = photo;
        
        // BLUR LOGIC: Only premium content (from "uncensored" folder) gets blurred, NOT teasers from "full"
        const isFromFullFolder = imagePath.includes('full/');
        const shouldBlur = isPremium && !hasAccess && !isFromFullFolder;
        const blurClass = shouldBlur ? 'premium-blur' : '';
        
        let overlayContent = '';
        
        if (isPremium && !hasAccess && !isFromFullFolder) {
            // Premium content from "uncensored" - show price overlay
            overlayContent = `
                <div class="premium-overlay" onclick="buyPremiumAccess()">
                    <div class="premium-badge">
                        <span class="price">€0.10</span>
                        <span class="unlock-text">Comprar Imagen</span>
                    </div>
                </div>
            `;
        } else if (isPremium && hasAccess && !isFromFullFolder) {
            // Premium content with access
            overlayContent = `
                <div class="vip-access-badge">
                    <span class="vip-icon">👑</span>
                    <span class="vip-text">PREMIUM</span>
                </div>
            `;
        }
        
        return `
            <div class="content-card photo-card">
                <div class="card-image">
                    <img src="${imagePath}" alt="Photo" class="${blurClass}" loading="lazy" />
                    ${overlayContent}
                </div>
                <div class="card-info">
                    <h4>${isPremium && !isFromFullFolder ? 'Premium Photo' : 'Teaser'}</h4>
                    ${isPremium && hasAccess && !isFromFullFolder ? '<p class="access-granted">✅ Acceso Premium</p>' : ''}
                </div>
            </div>
        `;
    }

    // Create video card (always premium, always from uncensored-videos)
    function createVideoCard(video) {
        const vipAccess = checkVIPAccess();
        const hasAccess = vipAccess && (vipAccess === 'lifetime' || vipAccess === 'monthly' || vipAccess === 'premium');
        
        const videoPath = video;
        
        let overlayContent = '';
        if (!hasAccess) {
            overlayContent = `
                <div class="premium-overlay" onclick="buyVideoAccess()">
                    <div class="premium-badge">
                        <span class="price">€0.30</span>
                        <span class="unlock-text">Comprar Video</span>
                    </div>
                    <div class="video-play-btn">▶</div>
                </div>
            `;
        } else {
            overlayContent = `
                <div class="vip-access-badge">
                    <span class="vip-icon">👑</span>
                    <span class="vip-text">PREMIUM</span>
                </div>
                <div class="video-play-btn functional" onclick="playVideo('${videoPath}')">▶</div>
            `;
        }
        
        return `
            <div class="content-card video-card">
                <div class="card-image">
                    <video class="${!hasAccess ? 'premium-blur' : ''}" preload="metadata">
                        <source src="${videoPath}" type="video/mp4">
                    </video>
                    ${overlayContent}
                    <div class="video-duration">2:30</div>
                </div>
                <div class="card-info">
                    <h4>Premium Video</h4>
                    ${hasAccess ? '<p class="access-granted">✅ Acceso Premium</p>' : ''}
                </div>
            </div>
        `;
    }
    
    // Purchase functions for PayPal integration
    function buyPremiumAccess() {
        showPricingView();
    }
    
    function buyVideoAccess() {
        showPricingView();
    }
    
    // Daily randomization system for teasers/banners (from "full" folder)
    function getDailyRandomImages(imageArray, count) {
        // Use date as seed for consistent daily randomization
        const today = new Date();
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        
        // Simple seeded random function
        function seededRandom(seed) {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        }
        
        // Shuffle array with daily seed
        const shuffled = [...imageArray];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(seededRandom(seed + i) * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        return shuffled.slice(0, count);
    }
    
    // Video player function
    function playVideo(videoPath) {
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="video-modal-content">
                <span class="video-close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <video controls autoplay style="width: 100%; max-width: 800px;">
                    <source src="${videoPath}" type="video/mp4">
                </video>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Show pricing view function
    function showPricingView() {
        showView('pricing');
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-view="pricing"]').classList.add('active');
    }
    
    // Make functions globally available
    window.buyPremiumAccess = buyPremiumAccess;
    window.buyVideoAccess = buyVideoAccess;
    window.playVideo = playVideo;
    window.showPricingView = showPricingView;

    // Setup banner
    function setupBanner(images) {
        console.log('🎠 Configurando banner con imágenes:', images);
        const banner = document.getElementById('banner-slider');
        if (!banner) {
            console.warn('⚠️ No se encontró elemento banner-slider');
            return;
        }
        
        if (!images || images.length === 0) {
            console.warn('⚠️ No hay imágenes para el banner');
            return;
        }
        
        let currentIndex = 0;
        
        function updateBanner() {
            // Las imágenes ya incluyen la ruta completa
            const imagePath = images[currentIndex];
            banner.style.backgroundImage = `url(${imagePath})`;
            banner.style.backgroundSize = 'cover';
            banner.style.backgroundPosition = 'center';
            currentIndex = (currentIndex + 1) % images.length;
        }
        
        // Actualizar inmediatamente
        updateBanner();
        
        // Configurar rotación automática cada 5 segundos
        setInterval(updateBanner, 5000);
        console.log('✅ Banner configurado con', images.length, 'imágenes');
    }

    // Hide loading screen
    function hideLoadingScreen() {
        console.log('🎯 Ocultando pantalla de loading...');
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
            console.log('✅ Pantalla de loading oculta');
        } else {
            console.warn('⚠️ No se encontró elemento loadingScreen');
        }
    }

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .content-section {
            display: none;
            animation: fadeIn 0.3s ease;
        }
        
        .content-section.active {
            display: block;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            align-items: center;
            justify-content: center;
        }
        
        .modal.show {
            display: flex;
        }
        
        .tooltip {
            position: absolute;
            background: #333;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 10001;
            pointer-events: none;
        }
        
        .content-card {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
            position: relative;
        }
        
        .content-card:hover {
            transform: translateY(-5px);
        }
        
        .badge-new {
            position: absolute;
            top: 10px;
            right: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: bold;
            z-index: 10;
        }
        
        .card-image {
            position: relative;
            padding-bottom: 60%;
            overflow: hidden;
        }
        
        .card-image img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: opacity 0.3s ease;
        }
        
        .card-image img.loaded {
            opacity: 1;
        }
        
        .duration {
            position: absolute;
            bottom: 10px;
            right: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
        }
        
        .card-info {
            padding: 15px;
        }
        
        .card-info h4 {
            margin: 0 0 5px 0;
            font-size: 16px;
            color: #333;
        }
        
        .card-info .model {
            margin: 0;
            font-size: 14px;
            color: #666;
        }
        
        .no-results {
            text-align: center;
            color: #999;
            padding: 40px;
        }
    `;
    document.head.appendChild(style);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }

    console.log('✅ main-script.js v5.0 cargado');

})();
