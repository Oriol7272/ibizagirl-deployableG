/**
 * content-data-integration.js - Sistema integrado completo v5.1
 * Funcionalidades adicionales sin duplicaciones
 */
'use strict';

console.log('📦 Cargando módulo content-data-integration.js...');

// ============================
// SISTEMA DE BÚSQUEDA UNIFICADO
// ============================
class UnifiedSearchManager {
    constructor() {
        this.initializeSearch();
    }
    
    initializeSearch() {
        console.log('🔍 Sistema de búsqueda unificado inicializado');
    }
    
    searchAll(query) {
        const results = {
            photos: [],
            videos: [],
            total: 0
        };
        
        // Buscar en fotos públicas
        if (window.PublicContentManager) {
            const publicPhotos = window.PublicContentManager.search(query);
            results.photos = [...results.photos, ...publicPhotos.map(photo => ({
                path: photo,
                type: 'photo',
                isPremium: false,
                title: `Photo ${photo.split('/').pop()}`,
                price: 0
            }))];
        }
        
        // Buscar en fotos premium
        if (window.PremiumContentPart1) {
            const premiumPhotos1 = window.PremiumContentPart1.search(query);
            results.photos = [...results.photos, ...premiumPhotos1.map(photo => ({
                path: photo,
                type: 'photo',
                isPremium: true,
                title: `Premium Photo ${photo.split('/').pop()}`,
                price: 0.10
            }))];
        }
        
        // Buscar en videos
        if (window.VideoContentManager) {
            const videos = window.VideoContentManager.search ? window.VideoContentManager.search(query) : [];
            results.videos = [...results.videos, ...videos.map(video => ({
                ...video,
                type: 'video'
            }))];
        }
        
        results.total = results.photos.length + results.videos.length;
        
        return results;
    }
    
    getPopularSearches() {
        return ['bikini', 'summer', 'beach', 'premium', 'exclusive', 'new'];
    }
}

// ============================
// SISTEMA DE ESTADÍSTICAS
// ============================
class StatsManager {
    constructor() {
        this.stats = this.calculateStats();
        console.log('📊 Sistema de estadísticas inicializado');
    }
    
    calculateStats() {
        const stats = {
            totalPhotos: 0,
            totalVideos: 0,
            premiumPhotos: 0,
            premiumVideos: 0,
            freePhotos: 0,
            newContent: 0,
            lastUpdate: new Date().toISOString()
        };
        
        // Contar fotos públicas
        if (window.PublicContentManager) {
            const publicStats = window.PublicContentManager.getStats();
            stats.freePhotos = publicStats.total;
            stats.totalPhotos += publicStats.total;
        }
        
        // Contar fotos premium
        if (window.PremiumContentPart1) {
            const premiumStats1 = window.PremiumContentPart1.getStats();
            stats.premiumPhotos += premiumStats1.total;
            stats.totalPhotos += premiumStats1.total;
        }
        
        // Contar videos
        if (window.VideoContentManager) {
            const videoStats = window.VideoContentManager.getStats ? window.VideoContentManager.getStats() : { total: 0, premium: 0, new: 0 };
            stats.totalVideos = videoStats.total;
            stats.premiumVideos = videoStats.premium;
            stats.newContent += videoStats.new || 0;
        }
        
        return stats;
    }
    
    getStats() {
        return this.stats;
    }
    
    getDailyStats() {
        // Simular estadísticas diarias
        return {
            ...this.stats,
            dailyPhotos: Math.min(200, this.stats.totalPhotos),
            dailyVideos: Math.min(40, this.stats.totalVideos),
            newToday: Math.floor(this.stats.totalPhotos * 0.3) // 30% nuevo diario
        };
    }
}

// ============================
// SISTEMA DE CONTENIDO UNIFICADO
// ============================
class UnifiedContentManager {
    constructor() {
        this.initialized = false;
        this.init();
    }
    
    async init() {
        // Esperar a que todos los módulos estén listos
        let attempts = 0;
        while ((!window.PublicContentManager || !window.BannerTeaserManager) && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        this.initialized = true;
        console.log('🎯 Sistema de contenido unificado inicializado');
        
        // Emitir evento de inicialización completa
        if (window.EventManager) {
            window.EventManager.emit('contentReady', {
                timestamp: Date.now(),
                stats: this.getContentStats()
            });
        }
    }
    
    isReady() {
        return this.initialized;
    }
    
    getContentStats() {
        if (window.StatsManager) {
            return window.StatsManager.getDailyStats();
        }
        return null;
    }
    
    getDailyContent() {
        const content = {
            banners: [],
            teasers: [],
            photos: [],
            videos: []
        };
        
        if (window.BannerTeaserManager) {
            content.banners = window.BannerTeaserManager.getBanners();
            content.teasers = window.BannerTeaserManager.getTeasers();
        }
        
        if (window.PublicContentManager) {
            content.photos = window.PublicContentManager.getRandom(200);
        }
        
        if (window.VideoContentManager) {
            content.videos = window.VideoContentManager.getDailyVideos ? window.VideoContentManager.getDailyVideos(40) : [];
        }
        
        return content;
    }
    
    searchContent(query) {
        if (window.UnifiedSearchManager) {
            return window.UnifiedSearchManager.searchAll(query);
        }
        return { photos: [], videos: [], total: 0 };
    }
    
    getBannerImages() {
        if (window.BannerTeaserManager) {
            return window.BannerTeaserManager.getBanners().map(banner => ({
                url: banner,
                title: `Banner ${banner.split('/').pop()}`,
                type: 'banner'
            }));
        }
        return [];
    }
    
    getDailyPhotos() {
        const photos = [];
        
        if (window.PublicContentManager) {
            photos.push(...window.PublicContentManager.getAll().map(photo => ({
                path: photo,
                thumbnail: photo,
                title: `Photo ${photo.split('/').pop()}`,
                isPremium: false,
                isNew: Math.random() > 0.7,
                type: 'photo'
            })));
        }
        
        if (window.PremiumContentPart1) {
            photos.push(...window.PremiumContentPart1.getAll().slice(0, 100).map(photo => ({
                path: photo,
                thumbnail: photo,
                title: `Premium Photo ${photo.split('/').pop()}`,
                isPremium: true,
                isNew: Math.random() > 0.7,
                type: 'photo',
                price: 0.10
            })));
        }
        
        // Mezclar contenido diariamente
        if (window.ArrayUtils && window.TimeUtils) {
            const seed = window.TimeUtils.getDailySeed();
            return window.ArrayUtils.shuffleWithSeed(photos, seed);
        }
        
        return photos;
    }
    
    getDailyVideos() {
        if (window.VideoContentManager) {
            return window.VideoContentManager.getDailyVideos ? window.VideoContentManager.getDailyVideos(40) : window.VideoContentManager.getAll();
        }
        return [];
    }
}

// ============================
// EXPORTAR GLOBALMENTE (sin duplicar VideoContentManager)
// ============================
if (!window.UnifiedSearchManager) {
    window.UnifiedSearchManager = new UnifiedSearchManager();
}

if (!window.StatsManager) {
    window.StatsManager = new StatsManager();
}

if (!window.UnifiedContentManager) {
    window.UnifiedContentManager = new UnifiedContentManager();
}

// Funciones de compatibilidad
window.searchContent = function(query) {
    return window.UnifiedContentManager.searchContent(query);
};

window.getBannerImages = function() {
    return window.UnifiedContentManager.getBannerImages();
};

window.getDailyPhotos = function() {
    return window.UnifiedContentManager.getDailyPhotos();
};

window.getDailyVideos = function() {
    return window.UnifiedContentManager.getDailyVideos();
};

console.log('✅ Módulo content-data-integration.js cargado correctamente (sin duplicaciones)');
console.log('📊 Estadísticas del sistema:', {
    searchReady: !!window.UnifiedSearchManager,
    statsReady: !!window.StatsManager,
    contentReady: window.UnifiedContentManager.isReady()
});

// ============================
// SISTEMA DE BÚSQUEDA UNIFICADO
// ============================
class UnifiedSearchManager {
    constructor() {
        this.initializeSearch();
    }
    
    initializeSearch() {
        console.log('🔍 Sistema de búsqueda unificado inicializado');
    }
    
    searchAll(query) {
        const results = {
            photos: [],
            videos: [],
            total: 0
        };
        
        // Buscar en fotos públicas
        if (window.PublicContentManager) {
            const publicPhotos = window.PublicContentManager.search(query);
            results.photos = [...results.photos, ...publicPhotos.map(photo => ({
                path: photo,
                type: 'photo',
                isPremium: false,
                title: `Photo ${photo.split('/').pop()}`,
                price: 0
            }))];
        }
        
        // Buscar en fotos premium
        if (window.PremiumContentPart1) {
            const premiumPhotos1 = window.PremiumContentPart1.search(query);
            results.photos = [...results.photos, ...premiumPhotos1.map(photo => ({
                path: photo,
                type: 'photo',
                isPremium: true,
                title: `Premium Photo ${photo.split('/').pop()}`,
                price: 0.10
            }))];
        }
        
        // Buscar en videos
        if (window.VideoContentManager) {
            const videos = window.VideoContentManager.search(query);
            results.videos = [...results.videos, ...videos.map(video => ({
                ...video,
                type: 'video'
            }))];
        }
        
        results.total = results.photos.length + results.videos.length;
        
        return results;
    }
    
    getPopularSearches() {
        return ['bikini', 'summer', 'beach', 'premium', 'exclusive', 'new'];
    }
}

// ============================
// SISTEMA DE ESTADÍSTICAS
// ============================
class StatsManager {
    constructor() {
        this.stats = this.calculateStats();
        console.log('📊 Sistema de estadísticas inicializado');
    }
    
    calculateStats() {
        const stats = {
            totalPhotos: 0,
            totalVideos: 0,
            premiumPhotos: 0,
            premiumVideos: 0,
            freePhotos: 0,
            newContent: 0,
            lastUpdate: new Date().toISOString()
        };
        
        // Contar fotos públicas
        if (window.PublicContentManager) {
            const publicStats = window.PublicContentManager.getStats();
            stats.freePhotos = publicStats.total;
            stats.totalPhotos += publicStats.total;
        }
        
        // Contar fotos premium
        if (window.PremiumContentPart1) {
            const premiumStats1 = window.PremiumContentPart1.getStats();
            stats.premiumPhotos += premiumStats1.total;
            stats.totalPhotos += premiumStats1.total;
        }
        
        // Contar videos
        if (window.VideoContentManager) {
            const videoStats = window.VideoContentManager.getStats();
            stats.totalVideos = videoStats.total;
            stats.premiumVideos = videoStats.premium;
            stats.newContent += videoStats.new;
        }
        
        return stats;
    }
    
    getStats() {
        return this.stats;
    }
    
    getDailyStats() {
        // Simular estadísticas diarias
        return {
            ...this.stats,
            dailyPhotos: Math.min(200, this.stats.totalPhotos),
            dailyVideos: Math.min(40, this.stats.totalVideos),
            newToday: Math.floor(this.stats.totalPhotos * 0.3) // 30% nuevo diario
        };
    }
}

// ============================
// SISTEMA DE CONTENIDO UNIFICADO
// ============================
class UnifiedContentManager {
    constructor() {
        this.initialized = false;
        this.init();
    }
    
    async init() {
        // Esperar a que todos los módulos estén listos
        while (!window.PublicContentManager || !window.BannerTeaserManager) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        this.initialized = true;
        console.log('🎯 Sistema de contenido unificado inicializado');
        
        // Emitir evento de inicialización completa
        if (window.EventManager) {
            window.EventManager.emit('contentReady', {
                timestamp: Date.now(),
                stats: this.getContentStats()
            });
        }
    }
    
    isReady() {
        return this.initialized;
    }
    
    getContentStats() {
        if (window.StatsManager) {
            return window.StatsManager.getDailyStats();
        }
        return null;
    }
    
    getDailyContent() {
        const content = {
            banners: [],
            teasers: [],
            photos: [],
            videos: []
        };
        
        if (window.BannerTeaserManager) {
            content.banners = window.BannerTeaserManager.getBanners();
            content.teasers = window.BannerTeaserManager.getTeasers();
        }
        
        if (window.PublicContentManager) {
            content.photos = window.PublicContentManager.getRandom(200);
        }
        
        if (window.VideoContentManager) {
            content.videos = window.VideoContentManager.getDailyVideos(40);
        }
        
        return content;
    }
    
    searchContent(query) {
        if (window.UnifiedSearchManager) {
            return window.UnifiedSearchManager.searchAll(query);
        }
        return { photos: [], videos: [], total: 0 };
    }
    
    getBannerImages() {
        if (window.BannerTeaserManager) {
            return window.BannerTeaserManager.getBanners().map(banner => ({
                url: banner,
                title: `Banner ${banner.split('/').pop()}`,
                type: 'banner'
            }));
        }
        return [];
    }
    
    getDailyPhotos() {
        const photos = [];
        
        if (window.PublicContentManager) {
            photos.push(...window.PublicContentManager.getAll().map(photo => ({
                path: photo,
                thumbnail: photo,
                title: `Photo ${photo.split('/').pop()}`,
                isPremium: false,
                isNew: Math.random() > 0.7,
                type: 'photo'
            })));
        }
        
        if (window.PremiumContentPart1) {
            photos.push(...window.PremiumContentPart1.getAll().slice(0, 100).map(photo => ({
                path: photo,
                thumbnail: photo,
                title: `Premium Photo ${photo.split('/').pop()}`,
                isPremium: true,
                isNew: Math.random() > 0.7,
                type: 'photo',
                price: 0.10
            })));
        }
        
        // Mezclar contenido diariamente
        if (window.ArrayUtils && window.TimeUtils) {
            const seed = window.TimeUtils.getDailySeed();
            return window.ArrayUtils.shuffleWithSeed(photos, seed);
        }
        
        return photos;
    }
    
    getDailyVideos() {
        if (window.VideoContentManager) {
            return window.VideoContentManager.getDailyVideos(40);
        }
        return [];
    }
}

// ============================
// EXPORTAR GLOBALMENTE
// ============================
window.VideoContentManager = new VideoContentManager();
window.UnifiedSearchManager = new UnifiedSearchManager();
window.StatsManager = new StatsManager();
window.UnifiedContentManager = new UnifiedContentManager();

// Funciones de compatibilidad
window.searchContent = function(query) {
    return window.UnifiedContentManager.searchContent(query);
};

window.getBannerImages = function() {
    return window.UnifiedContentManager.getBannerImages();
};

window.getDailyPhotos = function() {
    return window.UnifiedContentManager.getDailyPhotos();
};

window.getDailyVideos = function() {
    return window.UnifiedContentManager.getDailyVideos();
};

console.log('✅ Módulo content-data-integration.js cargado correctamente');
console.log('📊 Estadísticas del sistema:', {
    videos: window.VideoContentManager.getStats(),
    ready: window.UnifiedContentManager.isReady()
});