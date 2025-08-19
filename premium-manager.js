/**
 * premium-manager.js - Unified Premium Content Manager v2.0
 * Gestor unificado de contenido premium
 */

'use strict';

console.log('💎 Cargando Premium Content Manager v2.0...');

class PremiumContentManager {
    constructor() {
        this.allPremiumImages = [];
        this.initialized = false;
        this.init();
    }
    
    async init() {
        // Wait for dependencies
        await this.waitForDependencies();
        
        // Combine all premium images
        this.allPremiumImages = [
            ...(window.PREMIUM_IMAGES_PART1 || []),
            ...(window.PREMIUM_IMAGES_PART2 || [])
        ];
        
        this.initialized = true;
        console.log(`💎 Premium Content Manager inicializado con ${this.allPremiumImages.length} imágenes premium`);
    }
    
    async waitForDependencies() {
        const maxAttempts = 50;
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            if (window.PREMIUM_IMAGES_PART1 && window.PREMIUM_IMAGES_PART2) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        console.warn('⚠️ Timeout esperando dependencias premium');
        return false;
    }
    
    getAll() {
        return this.allPremiumImages;
    }
    
    getRandom(count = 24) {
        if (window.ArrayUtils) {
            return window.ArrayUtils.getRandomItems(this.allPremiumImages, count);
        }
        return this.allPremiumImages.slice(0, count);
    }
    
    getByPage(page = 1, perPage = 24) {
        if (window.ArrayUtils) {
            return window.ArrayUtils.paginate(this.allPremiumImages, page, perPage);
        }
        
        const start = (page - 1) * perPage;
        const end = start + perPage;
        return this.allPremiumImages.slice(start, end);
    }
    
    search(query) {
        if (window.ArrayUtils) {
            return window.ArrayUtils.search(this.allPremiumImages, query);
        }
        
        const queryLower = query.toLowerCase();
        return this.allPremiumImages.filter(img => img.toLowerCase().includes(queryLower));
    }
    
    rotateContent() {
        if (window.TimeUtils && window.ArrayUtils) {
            const seed = window.TimeUtils.getDailySeed();
            this.allPremiumImages = window.ArrayUtils.shuffleWithSeed(this.allPremiumImages, seed);
            console.log('🔄 Contenido premium rotado');
        }
    }
    
    getStats() {
        return {
            total: this.allPremiumImages.length,
            part1: window.PREMIUM_IMAGES_PART1 ? window.PREMIUM_IMAGES_PART1.length : 0,
            part2: window.PREMIUM_IMAGES_PART2 ? window.PREMIUM_IMAGES_PART2.length : 0,
            path: 'uncensored/',
            format: '.webp'
        };
    }
}

// Export globally
window.PremiumContentManager = new PremiumContentManager();

console.log('✅ Premium Content Manager cargado correctamente');