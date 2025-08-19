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
            
            // Setup event handlers
            setupEventHandlers();
            
            // Load initial content
            loadInitialContent();
            
            console.log('✅ Aplicación inicializada correctamente');
        } catch (error) {
            console.error('❌ Error inicializando aplicación:', error);
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
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavigation);
        });
    }

    // Handle navigation
    function handleNavigation(e) {
        e.preventDefault();
        const target = e.target.getAttribute('data-target');
        
        // Update active nav
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Show target section
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(target);
        if (targetSection) {
            targetSection.classList.add('active');
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
        
        // Load daily photos
        if (window.getDailyPhotos) {
            const photos = window.getDailyPhotos();
            displayPhotos(photos.slice(0, 12));
        }
        
        // Load daily videos
        if (window.getDailyVideos) {
            const videos = window.getDailyVideos();
            displayVideos(videos.slice(0, 6));
        }
        
        // Load banner images
        if (window.getBannerImages) {
            const bannerImages = window.getBannerImages();
            setupBanner(bannerImages);
        }
    }

    // Display photos
    function displayPhotos(photos) {
        const container = document.getElementById('photosGrid');
        if (!container) return;
        
        container.innerHTML = photos.map(photo => createPhotoCard(photo)).join('');
    }

    // Display videos
    function displayVideos(videos) {
        const container = document.getElementById('videosGrid');
        if (!container) return;
        
        container.innerHTML = videos.map(video => createVideoCard(video)).join('');
    }

    // Create photo card
    function createPhotoCard(photo) {
        return `
            <div class="content-card photo-card ${photo.isNew ? 'new' : ''}">
                ${photo.isNew ? '<span class="badge-new">NUEVO</span>' : ''}
                <div class="card-image">
                    <img data-src="${photo.thumbnail}" alt="${photo.title || 'Photo'}" />
                </div>
                <div class="card-info">
                    <h4>${photo.title || 'Sin título'}</h4>
                    ${photo.model ? `<p class="model">Modelo: ${photo.model}</p>` : ''}
                </div>
            </div>
        `;
    }

    // Create video card
    function createVideoCard(video) {
        return `
            <div class="content-card video-card ${video.isNew ? 'new' : ''}">
                ${video.isNew ? '<span class="badge-new">NUEVO</span>' : ''}
                <div class="card-image">
                    <img data-src="${video.thumbnail}" alt="${video.title || 'Video'}" />
                    <span class="duration">${video.duration || '00:00'}</span>
                </div>
                <div class="card-info">
                    <h4>${video.title || 'Sin título'}</h4>
                    ${video.model ? `<p class="model">Modelo: ${video.model}</p>` : ''}
                </div>
            </div>
        `;
    }

    // Setup banner
    function setupBanner(images) {
        const banner = document.getElementById('heroBanner');
        if (!banner || !images || images.length === 0) return;
        
        let currentIndex = 0;
        
        function updateBanner() {
            const image = images[currentIndex];
            banner.style.backgroundImage = `url(${image.url})`;
            currentIndex = (currentIndex + 1) % images.length;
        }
        
        updateBanner();
        setInterval(updateBanner, 5000);
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
