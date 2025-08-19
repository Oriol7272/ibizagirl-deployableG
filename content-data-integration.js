/**
 * content-data-integration.js - Content Integration & API Layer v2.0
 * Integra todos los módulos de contenido y proporciona API unificada
 */

'use strict';

console.log('🔗 Cargando módulo content-data-integration.js v2.0...');

// ============================
// UNIFIED CONTENT API
// ============================

class UnifiedContentAPI {
    constructor() {
        this.initialized = false;
        this.cache = new Map();
        this.subscribers = new Map();
        
        // Wait for all dependencies
        this.waitForDependencies().then(() => {
            this.initialize();
        });
    }
    
    async waitForDependencies() {
        const maxAttempts = 100;
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            if (window.BannerTeaserManager && 
                window.PublicContentManager && 
                window.VideoContentManager &&
                window.PremiumContentManager &&
                window.ArrayUtils &&
                window.TimeUtils) {
                console.log('✅ Todas las dependencias de contenido están listas');
                return true;
            }
            
            await new Promise(resolve => setTimeout(resolve, 50));
            attempts++;
        }
        
        console.warn('⚠️ Timeout esperando dependencias, inicializando con las disponibles');
        return false;
    }
    
    initialize() {
        this.initialized = true;
        
        // Setup daily rotation
        this.setupDailyRotation();
        
        // Cache initial content
        this.preloadContent();
        
        console.log('✅ UnifiedContentAPI inicializada');
        this.notifySubscribers('initialized');
    }
    
    setupDailyRotation() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const timeUntilMidnight = tomorrow.getTime() - now.getTime();
        
        // Rotate content at midnight
        setTimeout(() => {
            this.rotateContent();
            // Then every 24 hours
            setInterval(() => this.rotateContent(), 24 * 60 * 60 * 1000);
        }, timeUntilMidnight);
        
        console.log(`🔄 Rotación de contenido programada para ${tomorrow.toLocaleString()}`);
    }
    
    rotateContent() {
        console.log('🔄 Rotando contenido diario...');
        
        // Clear cache
        this.cache.clear();
        
        // Notify all managers to rotate
        if (window.BannerTeaserManager && window.BannerTeaserManager.rotateContent) {
            window.BannerTeaserManager.rotateContent();
        }
        
        if (window.VideoContentManager && window.VideoContentManager.rotateContent) {
            window.VideoContentManager.rotateContent();
        }
        
        if (window.PremiumContentManager && window.PremiumContentManager.rotateContent) {
            window.PremiumContentManager.rotateContent();
        }
        
        // Preload new content
        this.preloadContent();
        
        // Notify subscribers
        this.notifySubscribers('contentRotated');
        
        console.log('✅ Contenido rotado exitosamente');
    }
    
    preloadContent() {
        // Preload banners
        this.getBanners();
        
        // Preload public images
        this.getPublicImages(24);
        
        // Preload premium images
        this.getPremiumImages(24);
        
        // Preload videos
        this.getVideos(12);
        
        console.log('📦 Contenido precargado en cache');
    }
    
    // ============================
    // PUBLIC API METHODS
    // ============================
    
    getBanners(count = 6) {
        const cacheKey = `banners_${count}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        let banners = [];
        
        if (window.BannerTeaserManager) {
            banners = window.BannerTeaserManager.getBanners();
        } else if (window.BANNER_IMAGES) {
            banners = window.BANNER_IMAGES;
        }
        
        if (banners.length > count) {
            banners = banners.slice(0, count);
        }
        
        this.cache.set(cacheKey, banners);
        return banners;
    }
    
    getPublicImages(count = 24) {
        const cacheKey = `public_${count}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        let images = [];
        
        if (window.PublicContentManager) {
            images = window.PublicContentManager.getRandom(count);
        } else if (window.FULL_IMAGES_POOL) {
            images = window.ArrayUtils ? 
                window.ArrayUtils.getRandomItems(window.FULL_IMAGES_POOL, count) :
                window.FULL_IMAGES_POOL.slice(0, count);
        }
        
        this.cache.set(cacheKey, images);
        return images;
    }
    
    getPremiumImages(count = 24) {
        const cacheKey = `premium_${count}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        let images = [];
        
        if (window.PremiumContentManager) {
            images = window.PremiumContentManager.getRandom(count);
        } else if (window.UNCENSORED_IMAGES_POOL) {
            images = window.ArrayUtils ? 
                window.ArrayUtils.getRandomItems(window.UNCENSORED_IMAGES_POOL, count) :
                window.UNCENSORED_IMAGES_POOL.slice(0, count);
        }
        
        this.cache.set(cacheKey, images);
        return images;
    }
    
    getVideos(count = 12) {
        const cacheKey = `videos_${count}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        let videos = [];
        
        if (window.VideoContentManager) {
            videos = window.VideoContentManager.getRandom(count);
        } else if (window.UNCENSORED_VIDEOS_POOL) {
            videos = window.ArrayUtils ? 
                window.ArrayUtils.getRandomItems(window.UNCENSORED_VIDEOS_POOL, count) :
                window.UNCENSORED_VIDEOS_POOL.slice(0, count);
        }
        
        this.cache.set(cacheKey, videos);
        return videos;
    }
    
    getTeasers(count = 9) {
        const cacheKey = `teasers_${count}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        let teasers = [];
        
        if (window.BannerTeaserManager) {
            teasers = window.BannerTeaserManager.getTeasers();
        } else if (window.TEASER_IMAGES) {
            teasers = window.TEASER_IMAGES;
        }
        
        if (teasers.length > count) {
            teasers = teasers.slice(0, count);
        }
        
        this.cache.set(cacheKey, teasers);
        return teasers;
    }
    
    searchContent(query) {
        const results = {
            photos: [],
            videos: []
        };
        
        if (!query || query.length < 2) {
            return results;
        }
        
        // Search in public images
        if (window.PublicContentManager) {
            results.photos = window.PublicContentManager.search(query);
        }
        
        // Search in premium images
        if (window.PremiumContentManager) {
            const premiumResults = window.PremiumContentManager.search(query);
            results.photos.push(...premiumResults);
        }
        
        // Search in videos
        if (window.VideoContentManager) {
            results.videos = window.VideoContentManager.search(query);
        }
        
        return results;
    }
    
    getContentStats() {
        const stats = {
            publicImages: 0,
            premiumImages: 0,
            videos: 0,
            banners: 0,
            teasers: 0,
            lastUpdate: new Date().toISOString()
        };
        
        if (window.PublicContentManager) {
            const publicStats = window.PublicContentManager.getStats();
            stats.publicImages = publicStats.total;
        }
        
        if (window.PremiumContentManager) {
            const premiumStats = window.PremiumContentManager.getStats();
            stats.premiumImages = premiumStats.total;
        }
        
        if (window.VideoContentManager) {
            const videoStats = window.VideoContentManager.getStats();
            stats.videos = videoStats.total;
        }
        
        stats.banners = this.getBanners().length;
        stats.teasers = this.getTeasers().length;
        
        return stats;
    }
    
    // ============================
    // SUBSCRIPTION SYSTEM
    // ============================
    
    subscribe(event, callback) {
        if (!this.subscribers.has(event)) {
            this.subscribers.set(event, []);
        }
        this.subscribers.get(event).push(callback);
    }
    
    unsubscribe(event, callback) {
        if (this.subscribers.has(event)) {
            const callbacks = this.subscribers.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
    
    notifySubscribers(event, data = null) {
        if (this.subscribers.has(event)) {
            this.subscribers.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error en callback de subscriber:', error);
                }
            });
        }
    }
    
    // ============================
    // UTILITY METHODS
    // ============================
    
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Cache de contenido limpiado');
    }
    
    refreshContent() {
        this.clearCache();
        this.preloadContent();
        this.notifySubscribers('contentRefreshed');
        console.log('🔄 Contenido refrescado');
    }
    
    isInitialized() {
        return this.initialized;
    }
}

// ============================
// CONTENT VERIFICATION SYSTEM
// ============================

class ContentVerifier {
    static verifyImageExists(imagePath) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = imagePath;
        });
    }
    
    static verifyVideoExists(videoPath) {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.onloadedmetadata = () => resolve(true);
            video.onerror = () => resolve(false);
            video.src = videoPath;
        });
    }
    
    static async verifyContentPool(pool, type = 'image') {
        const verifier = type === 'image' ? this.verifyImageExists : this.verifyVideoExists;
        const results = await Promise.all(
            pool.map(async (path) => ({
                path,
                exists: await verifier(path)
            }))
        );
        
        const existing = results.filter(r => r.exists).map(r => r.path);
        const missing = results.filter(r => !r.exists).map(r => r.path);
        
        console.log(`📊 Verificación de ${type}s:`, {
            total: pool.length,
            existing: existing.length,
            missing: missing.length
        });
        
        if (missing.length > 0) {
            console.warn('⚠️ Archivos faltantes:', missing);
        }
        
        return existing;
    }
}

// ============================
// GLOBAL EXPORTS
// ============================

// Create global instance
window.ContentAPI = new UnifiedContentAPI();
window.ContentVerifier = ContentVerifier;

// Backward compatibility
window.UnifiedContentManager = window.ContentAPI;

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UnifiedContentAPI, ContentVerifier };
}

console.log('✅ Módulo content-data-integration.js cargado correctamente');
console.log('🔗 ContentAPI disponible globalmente como window.ContentAPI');