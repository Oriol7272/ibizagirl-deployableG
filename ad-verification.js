// ============================
// AD VERIFICATION SYSTEM v3.0 - ULTRA COMPLETE
// Todas las redes: JuicyAds + EroAdvertising + ExoClick
// ============================

'use strict';

console.log('🎯 [Ad Networks] Sistema v3.0 ULTRA COMPLETE iniciado');
console.log('🌍 Environment: production');
console.log('🔧 Fixes: JuicyAds + EroAdvertising + ExoClick + Fallbacks');

// ============================
// CONFIGURACIÓN GLOBAL
// ============================

const AD_CONFIG = {
    version: '3.0',
    debug: true,
    forceVisible: true,
    networks: {
        juicyads: {
            enabled: true,
            zones: {
                header: '1099077',
                sidebar: '1099078', 
                footer: '1099079'
            },
            scriptUrl: 'https://poweredby.jads.co/js/jads.js',
            globalVar: 'adsbyjuicy'
        },
        exoclick: {
            enabled: true,
            zones: {
                header: '5696328',
                sidebar: '5696329',
                footer: '5696330'
            },
            scriptUrls: [
                'https://a.realsrv.com/ad-provider.js',
                'https://syndication.realsrv.com/splash.php',
                'https://ads.exoclick.com/ads_js.php'
            ],
            globalVar: 'ExoLoader'
        },
        eroads: {
            enabled: true,
            siteId: '2309173',
            scriptUrl: 'https://ads.eroads.com/ads_js.php',
            zones: {
                header: 'header-banner',
                sidebar: 'sidebar-ads',
                footer: 'footer-banner'
            }
        }
    },
    fallback: {
        enabled: true,
        placeholderContent: '🎯 Cargando anuncios...'
    }
};

// ============================
// ESTADO GLOBAL DE ANUNCIOS
// ============================

const adState = {
    initialized: false,
    networksLoaded: {
        juicyads: false,
        exoclick: false,
        eroads: false
    },
    containersCreated: new Set(),
    debugMode: AD_CONFIG.debug,
    loadAttempts: 0,
    maxAttempts: 3
};

// ============================
// UTILIDADES DE ANUNCIOS
// ============================

function logAd(message, type = 'info') {
    const emoji = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '🔧';
    console.log(`${emoji} [Ads] ${message}`);
}

function createAdContainer(id, innerHTML = '') {
    if (document.getElementById(id)) {
        logAd(`Container ${id} already exists`, 'warning');
        return document.getElementById(id);
    }
    
    const container = document.createElement('div');
    container.id = id;
    container.className = 'ad-container forced-visible';
    container.innerHTML = innerHTML;
    
    // Estilos forzados
    container.style.cssText = `
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        width: 100% !important;
        max-width: 800px !important;
        margin: 20px auto !important;
        padding: 15px !important;
        background: rgba(0, 119, 190, 0.1) !important;
        border: 1px solid rgba(127, 219, 255, 0.3) !important;
        border-radius: 12px !important;
        text-align: center !important;
        min-height: 100px !important;
    `;
    
    adState.containersCreated.add(id);
    logAd(`Container created: ${id}`, 'success');
    
    return container;
}

function insertAdContainer(containerId, targetSelector = '.stats-section') {
    const container = createAdContainer(containerId);
    const target = document.querySelector(targetSelector);
    
    if (target) {
        target.insertAdjacentElement('afterend', container);
        logAd(`Container ${containerId} inserted after ${targetSelector}`, 'success');
    } else {
        document.body.appendChild(container);
        logAd(`Container ${containerId} appended to body (fallback)`, 'warning');
    }
    
    return container;
}

function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }
        
        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                obs.disconnect();
                resolve(element);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
    });
}

// ============================
// JUICYADS IMPLEMENTATION
// ============================

class JuicyAdsManager {
    constructor() {
        this.loaded = false;
        this.zones = AD_CONFIG.networks.juicyads.zones;
        this.attempts = 0;
    }
    
    async initialize() {
        logAd('🍊 Initializing JuicyAds with ULTRA safety...', 'info');
        
        try {
            await this.loadScript();
            await this.waitForGlobal();
            this.createZones();
            this.loaded = true;
            adState.networksLoaded.juicyads = true;
            logAd('🍊 JuicyAds initialized successfully', 'success');
        } catch (error) {
            logAd(`🍊 JuicyAds initialization failed: ${error.message}`, 'error');
            this.createFallbacks();
        }
    }
    
    async loadScript() {
        return new Promise((resolve, reject) => {
            // Pre-initialize global
            window.adsbyjuicy = window.adsbyjuicy || [];
            
            const script = document.createElement('script');
            script.src = AD_CONFIG.networks.juicyads.scriptUrl;
            script.async = true;
            script.defer = true;
            script.setAttribute('data-cfasync', 'false');
            
            script.onload = () => {
                logAd('🍊 JuicyAds script loaded successfully', 'success');
                resolve();
            };
            
            script.onerror = () => {
                reject(new Error('Failed to load JuicyAds script'));
            };
            
            document.head.appendChild(script);
        });
    }
    
    async waitForGlobal() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50;
            
            const checkGlobal = () => {
                attempts++;
                if (window.adsbyjuicy && typeof window.adsbyjuicy.push === 'function') {
                    logAd('🍊 JuicyAds global confirmed ready', 'success');
                    resolve();
                } else if (attempts >= maxAttempts) {
                    reject(new Error('JuicyAds global not available'));
                } else {
                    setTimeout(checkGlobal, 100);
                }
            };
            
            checkGlobal();
        });
    }
    
    createZones() {
        Object.entries(this.zones).forEach(([position, zoneId]) => {
            this.createZone(position, zoneId);
        });
    }
    
    createZone(position, zoneId) {
        const containerId = `juicyads-${position}`;
        
        // Crear contenedor si no existe
        let container = document.getElementById(containerId);
        if (!container) {
            container = insertAdContainer(containerId, '.stats-section');
        }
        
        // Crear elemento ins
        const insElement = document.createElement('ins');
        insElement.id = `juicy-${zoneId}`;
        insElement.setAttribute('data-width', '728');
        insElement.setAttribute('data-height', '90');
        insElement.style.cssText = `
            display: block !important;
            visibility: visible !important;
            width: 100% !important;
            max-width: 728px !important;
            height: 90px !important;
            margin: 10px auto !important;
            background: rgba(255, 255, 255, 0.05) !important;
            border: 1px dashed rgba(255, 215, 0, 0.3) !important;
        `;
        
        container.appendChild(insElement);
        
        // Pushear a JuicyAds
        if (window.adsbyjuicy) {
            window.adsbyjuicy.push({'adzone': parseInt(zoneId)});
            logAd(`🍊 JuicyAds zone ${position} (${zoneId}) created successfully`, 'success');
        }
        
        // Debug visual
        if (AD_CONFIG.debug) {
            insElement.innerHTML = `
                <div style="padding: 20px; color: #ffd700; font-weight: bold;">
                    🍊 JuicyAds Zone ${zoneId} (${position})<br>
                    <small>Loading...</small>
                </div>
            `;
            
            // Verificar carga después de 5 segundos
            setTimeout(() => {
                if (insElement.innerHTML.includes('Loading')) {
                    insElement.innerHTML = `
                        <div style="padding: 20px; color: #ff6b35;">
                            🍊 JuicyAds Zone ${zoneId}<br>
                            <small>Ad not loaded - Check console</small>
                        </div>
                    `;
                }
            }, 5000);
        }
    }
    
    createFallbacks() {
        Object.keys(this.zones).forEach(position => {
            const containerId = `juicyads-${position}-fallback`;
            const container = insertAdContainer(containerId);
            container.innerHTML = `
                <div style="padding: 20px; color: #ff6b35; border: 2px dashed #ff6b35;">
                    🍊 JuicyAds Fallback (${position})<br>
                    <small>Primary ad network failed to load</small>
                </div>
            `;
        });
    }
}

// ============================
// EXOCLICK IMPLEMENTATION
// ============================

class ExoClickManager {
    constructor() {
        this.loaded = false;
        this.zones = AD_CONFIG.networks.exoclick.zones;
        this.scripts = AD_CONFIG.networks.exoclick.scriptUrls;
    }
    
    async initialize() {
        logAd('🔵 Initializing ExoClick with multiple fallbacks...', 'info');
        
        try {
            await this.loadScript();
            this.createZones();
            this.loaded = true;
            adState.networksLoaded.exoclick = true;
            logAd('🔵 ExoClick initialized successfully', 'success');
        } catch (error) {
            logAd(`🔵 ExoClick initialization failed: ${error.message}`, 'error');
            this.createFallbacks();
        }
    }
    
    async loadScript() {
        for (let i = 0; i < this.scripts.length; i++) {
            try {
                await this.tryLoadScript(this.scripts[i], i + 1);
                return;
            } catch (error) {
                logAd(`🔵 ExoClick URL ${i + 1} failed: ${error.message}`, 'warning');
                if (i === this.scripts.length - 1) throw error;
            }
        }
    }
    
    async tryLoadScript(url, attempt) {
        return new Promise((resolve, reject) => {
            logAd(`🔵 Trying ExoClick URL ${attempt}/${this.scripts.length}: ${url}`);
            
            const script = document.createElement('script');
            script.src = url;
            script.async = true;
            
            script.onload = () => {
                logAd(`🔵 ExoClick loaded successfully from URL ${attempt}`, 'success');
                resolve();
            };
            
            script.onerror = () => {
                reject(new Error(`Failed to load from ${url}`));
            };
            
            document.head.appendChild(script);
        });
    }
    
    createZones() {
        Object.entries(this.zones).forEach(([position, zoneId]) => {
            this.createZone(position, zoneId);
        });
    }
    
    createZone(position, zoneId) {
        const containerId = `exoclick-${position}`;
        
        let container = document.getElementById(containerId);
        if (!container) {
            container = insertAdContainer(containerId, '.teaser-carousel-container');
        }
        
        // Crear script directo de ExoClick
        const script = document.createElement('script');
        script.innerHTML = `
            if (typeof ExoLoader !== 'undefined') {
                ExoLoader.serve({"zoneid":${zoneId}});
            } else {
                console.log('🔵 ExoClick direct implementation for zone ${zoneId}');
            }
        `;
        
        container.appendChild(script);
        
        // Debug visual
        if (AD_CONFIG.debug) {
            const debugDiv = document.createElement('div');
            debugDiv.style.cssText = `
                padding: 20px;
                color: #00a8cc;
                font-weight: bold;
                background: rgba(0, 168, 204, 0.1);
                border: 1px dashed #00a8cc;
                margin: 10px 0;
            `;
            debugDiv.innerHTML = `
                🔵 ExoClick Zone ${zoneId} (${position})<br>
                <small>Direct implementation loaded</small>
            `;
            container.appendChild(debugDiv);
        }
        
        logAd(`🔵 ExoClick zone ${position} (${zoneId}) created`, 'success');
    }
    
    createFallbacks() {
        Object.keys(this.zones).forEach(position => {
            const containerId = `exoclick-${position}-fallback`;
            const container = insertAdContainer(containerId);
            container.innerHTML = `
                <div style="padding: 20px; color: #00a8cc; border: 2px dashed #00a8cc;">
                    🔵 ExoClick Fallback (${position})<br>
                    <small>Alternative ad placement</small>
                </div>
            `;
        });
    }
}

// ============================
// EROADVERTISING IMPLEMENTATION
// ============================

class EroAdvertisingManager {
    constructor() {
        this.loaded = false;
        this.siteId = AD_CONFIG.networks.eroads.siteId;
    }
    
    async initialize() {
        logAd('🟢 Initializing EroAdvertising...', 'info');
        
        try {
            await this.loadScript();
            this.createZones();
            this.loaded = true;
            adState.networksLoaded.eroads = true;
            logAd('🟢 EroAdvertising initialized successfully', 'success');
        } catch (error) {
            logAd(`🟢 EroAdvertising initialization failed: ${error.message}`, 'error');
            this.createFallbacks();
        }
    }
    
    async loadScript() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `${AD_CONFIG.networks.eroads.scriptUrl}?site=${this.siteId}`;
            script.async = true;
            
            script.onload = () => {
                logAd('🟢 EroAdvertising script loaded', 'success');
                resolve();
            };
            
            script.onerror = () => {
                reject(new Error('Failed to load EroAdvertising script'));
            };
            
            document.head.appendChild(script);
        });
    }
    
    createZones() {
        Object.entries(AD_CONFIG.networks.eroads.zones).forEach(([position, zoneClass]) => {
            this.createZone(position, zoneClass);
        });
    }
    
    createZone(position, zoneClass) {
        const containerId = `eroads-${position}`;
        
        let container = document.getElementById(containerId);
        if (!container) {
            container = insertAdContainer(containerId, '.banner-slideshow');
        }
        
        // Crear div para EroAdvertising
        const adDiv = document.createElement('div');
        adDiv.className = zoneClass;
        adDiv.setAttribute('data-site-id', this.siteId);
        adDiv.style.cssText = `
            display: block !important;
            visibility: visible !important;
            width: 100% !important;
            min-height: 100px !important;
            margin: 10px auto !important;
        `;
        
        container.appendChild(adDiv);
        
        // Debug visual
        if (AD_CONFIG.debug) {
            adDiv.innerHTML = `
                <div style="padding: 20px; color: #22c55e; background: rgba(34, 197, 94, 0.1); border: 1px dashed #22c55e;">
                    🟢 EroAdvertising Zone (${position})<br>
                    <small>Site ID: ${this.siteId}</small>
                </div>
            `;
        }
        
        logAd(`🟢 EroAdvertising zone ${position} created`, 'success');
    }
    
    createFallbacks() {
        Object.keys(AD_CONFIG.networks.eroads.zones).forEach(position => {
            const containerId = `eroads-${position}-fallback`;
            const container = insertAdContainer(containerId);
            container.innerHTML = `
                <div style="padding: 20px; color: #22c55e; border: 2px dashed #22c55e;">
                    🟢 EroAdvertising Fallback (${position})<br>
                    <small>Backup ad placement</small>
                </div>
            `;
        });
    }
}

// ============================
// SISTEMA PRINCIPAL DE ANUNCIOS
// ============================

class AdNetworkManager {
    constructor() {
        this.networks = {
            juicyads: new JuicyAdsManager(),
            exoclick: new ExoClickManager(),
            eroads: new EroAdvertisingManager()
        };
        this.initialized = false;
    }
    
    async initialize() {
        if (this.initialized) return;
        
        logAd('🚀 Initializing ALL ad networks...', 'info');
        
        try {
            // Esperar a que el DOM esté listo
            await this.waitForDOM();
            
            // Inicializar todas las redes en paralelo
            const initPromises = Object.entries(this.networks).map(async ([name, manager]) => {
                try {
                    await manager.initialize();
                    logAd(`Network ${name} initialized successfully`, 'success');
                } catch (error) {
                    logAd(`Network ${name} failed: ${error.message}`, 'error');
                }
            });
            
            await Promise.allSettled(initPromises);
            
            this.initialized = true;
            adState.initialized = true;
            
            // Verificación final
            setTimeout(() => this.finalVerification(), 5000);
            
            logAd('🎯 Ad Network Manager initialization complete', 'success');
            
        } catch (error) {
            logAd(`Ad Manager initialization failed: ${error.message}`, 'error');
        }
    }
    
    async waitForDOM() {
        if (document.readyState === 'complete') return;
        
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }
    
    finalVerification() {
        logAd('🎯 ===== VERIFICACIÓN FINAL v3.0 =====', 'info');
        
        // Verificar cada red
        Object.entries(adState.networksLoaded).forEach(([network, loaded]) => {
            const emoji = loaded ? '✅' : '❌';
            logAd(`${emoji} ${network}: ${loaded ? 'LOADED' : 'FAILED'}`, loaded ? 'success' : 'error');
        });
        
        // Verificar contenedores
        logAd(`📦 Containers created: ${adState.containersCreated.size}`, 'info');
        adState.containersCreated.forEach(containerId => {
            const element = document.getElementById(containerId);
            const visible = element && getComputedStyle(element).display !== 'none';
            logAd(`  ${containerId}: ${visible ? '✅ VISIBLE' : '❌ HIDDEN'}`, visible ? 'success' : 'error');
        });
        
        // Verificar globales
        const globals = {
            'JuicyAds': typeof window.adsbyjuicy !== 'undefined',
            'ExoClick': typeof window.ExoLoader !== 'undefined',
            'EroAdvertising': document.querySelector('[data-site-id]') !== null
        };
        
        Object.entries(globals).forEach(([name, exists]) => {
            logAd(`${exists ? '✅' : '❌'} ${name}: ${exists ? 'DETECTED' : 'NOT FOUND'}`, exists ? 'success' : 'error');
        });
        
        // Estadísticas finales
        const loadedCount = Object.values(adState.networksLoaded).filter(Boolean).length;
        const totalCount = Object.keys(adState.networksLoaded).length;
        
        logAd(`🎯 RESUMEN: ${loadedCount}/${totalCount} redes activas`, 'info');
        logAd(`🎯 Containers: ${adState.containersCreated.size}`, 'info');
        logAd(`🎯 Debug Mode: ${AD_CONFIG.debug ? 'ENABLED' : 'DISABLED'}`, 'info');
        logAd('🎯 =====================================', 'info');
    }
    
    // Función para testing
    testAds() {
        logAd('🧪 Testing ad networks...', 'info');
        
        Object.entries(this.networks).forEach(([name, manager]) => {
            logAd(`Testing ${name}: ${manager.loaded ? 'READY' : 'NOT READY'}`, manager.loaded ? 'success' : 'error');
        });
        
        // Forzar recreación de anuncios
        this.forceRecreateAds();
    }
    
    forceRecreateAds() {
        logAd('🔄 Force recreating all ads...', 'info');
        
        // Limpiar contenedores existentes
        adState.containersCreated.forEach(containerId => {
            const element = document.getElementById(containerId);
            if (element) element.remove();
        });
        adState.containersCreated.clear();
        
        // Reinicializar
        setTimeout(() => {
            Object.values(this.networks).forEach(manager => {
                if (manager.loaded) {
                    manager.createZones();
                } else {
                    manager.createFallbacks();
                }
            });
        }, 1000);
    }
}

// ============================
// INICIALIZACIÓN AUTOMÁTICA
// ============================

const adManager = new AdNetworkManager();

// Función global para testing
window.testAds = () => adManager.testAds();
window.forceRecreateAds = () => adManager.forceRecreateAds();

// Auto-inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => adManager.initialize(), 1000);
    });
} else {
    setTimeout(() => adManager.initialize(), 1000);
}

// Exportar para uso externo
window.adNetworkManager = adManager;
window.AD_CONFIG = AD_CONFIG;
window.adState = adState;

logAd('🎯 Ad Verification System v3.0 loaded - Use testAds() for manual testing', 'success');
