/**
 * content-data-integration.js - Sistema integrado completo v5.0
 * Integra videos y funcionalidades faltantes
 */
'use strict';

console.log('📦 Cargando módulo content-data-integration.js...');

// ============================
// VIDEOS PREMIUM MANAGER
// ============================
class VideoContentManager {
    constructor() {
        this.videos = this.generateVideoList();
        this.totalVideos = this.videos.length;
        console.log(`🎬 Gestor de videos inicializado con ${this.totalVideos} videos`);
    }
    
    generateVideoList() {
        const videoFiles = [
            'uncensored-videos/GK3wKGkNYhO4YyFDAg8x.mp4',
            'uncensored-videos/T6auQxu1yZKCGPqVJ7ue.mp4', 
            'uncensored-videos/r14kVENgyJthsXKP4ckJ.mp4',
            'uncensored-videos/zX53TSjhlQj4Gy76iK0H.mp4',
            'uncensored-videos/kfDFWczYHsZXjtwmMsP4.mp4',
            'uncensored-videos/M6TEA1f8hNdjol3Wi1se.mp4',
            'uncensored-videos/n4DaX8Nwj1glWI1Oe9vj.mp4',
            'uncensored-videos/XRCoUfkNLzwUepShH19v.mp4',
            'uncensored-videos/8yE2nxCwV2QcJsdXGf32.mp4',
            'uncensored-videos/0xXK6PxXSv6cpYxvI7HX.mp4',
            'uncensored-videos/beSTk3pKEdHZJSH7rwHs.mp4',
            'uncensored-videos/rWwDSNSYmt9jpPd2ngiI.mp4',
            'uncensored-videos/ZPPOJjpdigAhYYekcnPx.mp4',
            'uncensored-videos/nLejk9R1jPVuOpyrlrAN.mp4',
            'uncensored-videos/BA7Bvw9GHNCbsEKOruXh.mp4',
            'uncensored-videos/QGeTBD8xHjPvnqA72uiF.mp4',
            'uncensored-videos/f8FbeCjEOwLRvwIgfK8l.mp4',
            'uncensored-videos/Ocb0MqRnLH1pezhcgpHh.mp4',
            'uncensored-videos/ahLNYijoKI9YoYoGToLK.mp4',
            'uncensored-videos/8fQQnk9u7YAQQXDpfOW3.mp4',
            'uncensored-videos/G4XjXiZIHZZRsKwlDYCp.mp4',
            'uncensored-videos/Bg8z3Gk9SuxEAFGt1WBo.mp4',
            'uncensored-videos/fCE3ydur09Lbf0hxFHyD.mp4',
            'uncensored-videos/qEOel0dBNRP2ttJtVUcQ.mp4',
            'uncensored-videos/NTGWrlYi5RltnwhDSO6R.mp4',
            'uncensored-videos/MCZSxdyGPDN7E7Mkdj8F.mp4',
            'uncensored-videos/i1iPIEe7iIhancXwP05J.mp4',
            'uncensored-videos/iniuJRrZzzGp74LWfZYy.mp4',
            'uncensored-videos/UQGldJ8bdBrYyWDP0MEN.mp4',
            'uncensored-videos/0nF138CMxl1eGWUxaG2d.mp4',
            'uncensored-videos/fg2JqRBziuyvCFyjoaWE.mp4',
            'uncensored-videos/cXi2dPqHJJwsJWWnRm6J.mp4',
            'uncensored-videos/ymdZTKkujrU5ON7ZB66H.mp4',
            'uncensored-videos/UiQ8qKsHUJAvIIPFCLnz.mp4',
            'uncensored-videos/8qfK5e4NbCYglU2WfMQ6.mp4',
            'uncensored-videos/9weRZL3KvPUd3qNQz0Mt.mp4',
            'uncensored-videos/vhDZYiY0UkTLtmu7HrfF.mp4',
            'uncensored-videos/S7cVIsUsWJ1Nnf31dhTq.mp4',
            'uncensored-videos/W1vTYUeyTSl8Pvv72sPW.mp4',
            'uncensored-videos/8RF2trrwvytHFkimtzDE.mp4',
            'uncensored-videos/JswE4SwqdmsQfLef3PzC.mp4',
            'uncensored-videos/J2E8ciwOpkU0Jv79cdKj.mp4',
            'uncensored-videos/MkWQbiVWaJbShjipx4Kq.mp4',
            'uncensored-videos/ImHBnXCOaNfqltnBwcUh.mp4',
            'uncensored-videos/G4LILz0eqoh4m3YOZ2WK.mp4',
            'uncensored-videos/CzAtUvr9DPCv7JVMFNez.mp4',
            'uncensored-videos/1SZsGxjFfrA7diW05Yvj.mp4',
            'uncensored-videos/peTmHJhWF44gaz25ACCr.mp4',
            'uncensored-videos/7gBpFJiLzDH9s5ukalLs.mp4',
            'uncensored-videos/eXZcQY7SeVHjcgwv8hHn.mp4',
            'uncensored-videos/vF3JI0gM7nDGJAiKFb7S.mp4',
            'uncensored-videos/MaV4A0BTJiYg1UThuwHk.mp4',
            'uncensored-videos/Hn9Su6XHo4m7EGiR9f5S.mp4',
            'uncensored-videos/P6FrIUZnYN1l3N7AKjX0.mp4',
            'uncensored-videos/3W7GxdRyaPj0uAK9fD4I.mp4',
            'uncensored-videos/kAU1KdI09ffEf1fjCgPC.mp4',
            'uncensored-videos/raKwkNU85MId6acMS6a0.mp4',
            'uncensored-videos/XEW69wj2uK8Bu6NwHuce.mp4',
            'uncensored-videos/Jz7oLnRbSV732OCdu3u9.mp4',
            'uncensored-videos/oHEzllQyoJOrAZ5lnUdU.mp4',
            'uncensored-videos/3i61FDkL2wmF6RjQbZKR.mp4',
            'uncensored-videos/juHQDjTQ8HeFlLsuDhzS.mp4',
            'uncensored-videos/Nnb48ZgMp3tNboq4uXWb.mp4',
            'uncensored-videos/vJel6k1lAYlZxfEe5f1a.mp4',
            'uncensored-videos/1NYBqpy4q2GVCDCXmXDK.mp4',
            'uncensored-videos/ZaszI9a5huBi41yXZq2w.mp4',
            'uncensored-videos/99ACESTm9KLPGdLSh0J1.mp4',
            'uncensored-videos/ebNx2Mft0L7qtcGy2sUy.mp4',
            'uncensored-videos/gII1RvXkZk6Szauv9cDp.mp4',
            'uncensored-videos/PiMHNagAFVaFtqmYvimt.mp4',
            'uncensored-videos/RzI8s0b5kfP9tVnoGbAd.mp4',
            'uncensored-videos/VijVO7RT6KjdzwE1iFRi.mp4',
            'uncensored-videos/MOsBiYkWV6VFfK2P0Pxz.mp4',
            'uncensored-videos/hpGf0VPAwY3NrRbj9wd8.mp4',
            'uncensored-videos/N5TItomcAI6KvA7202Lz.mp4',
            'uncensored-videos/N6j12lQQ199vM8HTZw1O.mp4',
            'uncensored-videos/wtcVFSKn4McI9xahFEGr.mp4',
            'uncensored-videos/g9fe19vfWl138v5dqou2.mp4',
            'uncensored-videos/IES8pgSNhuVYlqcse2sm.mp4',
            'uncensored-videos/5qsmyiUv590ZBfrpct6G.mp4',
            'uncensored-videos/Z8C1oBoK0vERMZ2g8aD9.mp4',
            'uncensored-videos/rBSogUSRYAorst0XO7oy.mp4',
            'uncensored-videos/2FO1Ra6RDA8FjGWmDv8d.mp4'
        ];
        
        // Crear objetos de video con thumbnails (usando la primera imagen disponible como thumbnail)
        return videoFiles.map((video, index) => ({
            path: video,
            thumbnail: this.generateThumbnail(video),
            title: `Exclusive Video ${index + 1}`,
            duration: this.randomDuration(),
            isPremium: true,
            isNew: Math.random() > 0.7, // 30% son nuevos
            tags: ['premium', 'exclusive', 'hd'],
            price: 0.30
        }));
    }
    
    generateThumbnail(videoPath) {
        // Usar una imagen de la carpeta full como thumbnail
        if (window.FULL_IMAGES_POOL && window.FULL_IMAGES_POOL.length > 0) {
            const randomIndex = Math.floor(Math.random() * window.FULL_IMAGES_POOL.length);
            return window.FULL_IMAGES_POOL[randomIndex];
        }
        return 'full/bikini.webp'; // fallback
    }
    
    randomDuration() {
        const minutes = Math.floor(Math.random() * 10) + 2; // 2-12 minutos
        const seconds = Math.floor(Math.random() * 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    getAll() {
        return this.videos;
    }
    
    getDailyVideos(count = 40) {
        if (window.ArrayUtils && window.TimeUtils) {
            const seed = window.TimeUtils.getDailySeed();
            const shuffled = window.ArrayUtils.shuffleWithSeed(this.videos, seed);
            return shuffled.slice(0, count);
        }
        return this.videos.slice(0, count);
    }
    
    getRandom(count = 10) {
        if (window.ArrayUtils) {
            return window.ArrayUtils.getRandomItems(this.videos, count);
        }
        return this.videos.slice(0, count);
    }
    
    search(query) {
        const queryLower = query.toLowerCase();
        return this.videos.filter(video => 
            video.title.toLowerCase().includes(queryLower) ||
            video.tags.some(tag => tag.toLowerCase().includes(queryLower))
        );
    }
    
    getByPage(page = 1, perPage = 12) {
        if (window.ArrayUtils) {
            return window.ArrayUtils.paginate(this.videos, page, perPage);
        }
        
        const start = (page - 1) * perPage;
        const end = start + perPage;
        return this.videos.slice(start, end);
    }
    
    getStats() {
        return {
            total: this.totalVideos,
            premium: this.videos.filter(v => v.isPremium).length,
            new: this.videos.filter(v => v.isNew).length,
            totalDuration: this.videos.length * 5 // aproximado
        };
    }
}

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