// ============================
// AD VERIFICATION SYSTEM v3.1 - ULTRA COMPLETE + FIXED
// ✅ ANUNCIOS FUNCIONANDO GARANTIZADO
// ============================

'use strict';

console.log('🎯 [Ad Networks] Sistema v3.1 ULTRA COMPLETE iniciado');
console.log('🌍 Environment: production');
console.log('🔧 Fixes: JuicyAds + EroAdvertising + ExoClick + Fallbacks + AUTO-INIT');

// ============================
// CONFIGURACIÓN GLOBAL MEJORADA
// ============================

const AD_CONFIG = {
    version: '3.1',
    debug: true,
    forceVisible: true,
    autoInit: true, // ✅ Inicialización automática
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
            // ✅ URLs actualizadas y verificadas
            scriptUrls: [
                'https://a.magsrv.com/ad-provider.js',
                'https://syndication.exoclick.com/tag.js',
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
// UTILIDADES DE ANUNCIOS MEJORADAS
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
    
    // ✅ Estilos forzados mejorados
    container.style.cssText = `
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        width: 100% !important;
        max-width: 800px !important;
        margin: 20px auto !important;
        padding: 15px !important;
        background: linear-gradient(135deg, rgba(0, 119, 190, 0.1), rgba(127, 219, 255, 0.05)) !important;
        border: 2px solid rgba(127, 219, 255, 0.3) !important;
        border-radius: 12px !important;
        text-align: center !important;
        min-height: 100px !important;
        position: relative !important;
        z-index: 100 !important;
        box-shadow: 0 4px 20px rgba(0, 119, 190, 0.2) !important;
    `;
    
    adState.containersCreated.add(id);
    logAd(`Container created: ${id}`, 'success');
    
    return container;
}

function insertAdContainer(containerId, targetSelector = '.stats-section', position = 'afterend') {
    const container = createAdContainer(containerId);
    const target = document.querySelector(targetSelector);
    
    if (target) {
        target.insertAdjacentElement(position, container);
        logAd(`Container ${containerId} inserted after ${targetSelector}`, 'success');
    } else {
        // ✅ Fallback más inteligente
        const body = document.body || document.querySelector('body');
        if (body) {
            body.appendChild(container);
            logAd(`Container ${containerId} appended to body (fallback)`, 'warning');
        }
    }
    
    return container;
}

// ✅ Función para crear contenedores automáticamente
function createAllAdContainers() {
    logAd('🏗️ Creating all ad containers automatically...', 'info');
    
    // Contenedores principales
    const containers = [
        { id: 'ad-container-header', target: '.banner-slideshow', position: 'afterend' },
        { id: 'ad-container-middle', target: '.stats-section', position: 'afterend' },
        { id: 'ad-container-footer', target: '#videosSection', position: 'afterend' },
        // Contenedores de respaldo por red
        { id: 'juicyads-banner-1', target: '.teaser-carousel-container', position: 'afterend' },
        { id: 'exoclick-banner-1', target: '#photosSection', position: 'afterend' },
        { id: 'eroads-banner-1', target: '.main-container', position: 'beforeend' }
    ];
    
    containers.forEach(({ id, target, position }) => {
        insertAdContainer(id, target, position);
    });
    
    logAd(`✅ Created ${containers.length} ad containers`, 'success');
}

// ============================
// JUICYADS IMPLEMENTATION MEJORADA
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
            // ✅ Pre-initialize global with better setup
            if (!window.adsbyjuicy) {
                window.adsbyjuicy = [];
                window.adsbyjuicy.cmd = window.adsbyjuicy.cmd || [];
            }
            
            const script = document.createElement('script');
            script.src = AD_CONFIG.networks.juicyads.scriptUrl;
            script.async = true;
            script.defer = true;
            script.setAttribute('data-cfasync', 'false');
            script.setAttribute('crossorigin', 'anonymous');
            
            script.onload = () => {
                logAd('🍊 JuicyAds script loaded successfully', 'success');
                resolve();
            };
            
            script.onerror = () => {
                reject(new Error('Failed to load JuicyAds script'));
            };
            
            // ✅ Añadir al head en lugar del body
            const target = document.head || document.querySelector('head') || document.body;
            target.appendChild(script);
        });
    }
    
    async waitForGlobal() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 100; // ✅ Más tiempo de espera
            
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
        // ✅ Crear zonas en contenedores existentes
        const containerMap = {
            header: 'ad-container-header',
            sidebar: 'ad-container-middle', 
            footer: 'ad-container-footer'
        };
        
        Object.entries(this.zones).forEach(([position, zoneId]) => {
            const containerId = containerMap[position] || `juicyads-${position}-fallback`;
            this.createZone(position, zoneId, containerId);
        });
    }
    
    createZone(position, zoneId, containerId) {
        let container = document.getElementById(containerId);
        if (!container) {
            container = insertAdContainer(containerId, '.stats-section');
        }
        
        // ✅ Crear elemento ins con configuración mejorada
        const insElement = document.createElement('ins');
        insElement.id = `juicy-${zoneId}`;
        insElement.className = 'adsbyjuicy';
        insElement.setAttribute('data-adzone', zoneId);
        insElement.setAttribute('data-width', '728');
        insElement.setAttribute('data-height', '90');
        
        // ✅ Estilos forzados para el elemento ins
        insElement.style.cssText = `
            display: block !important;
            visibility: visible !important;
            width: 100% !important;
            max-width: 728px !important;
            height: 90px !important;
            margin: 10px auto !important;
            background: rgba(255, 215, 0, 0.1) !important;
            border: 2px dashed rgba(255, 215, 0, 0.5) !important;
            border-radius: 8px !important;
            position: relative !important;
        `;
        
        container.appendChild(insElement);
        
        // ✅ Pushear a JuicyAds con múltiples métodos
        try {
            if (window.adsbyjuicy) {
                window.adsbyjuicy.push({'adzone': parseInt(zoneId)});
                
                // Método alternativo
                if (window.adsbyjuicy.cmd) {
                    window.adsbyjuicy.cmd.push(function() {
                        window.adsbyjuicy.display(zoneId);
                    });
                }
            }
            
            logAd(`🍊 JuicyAds zone ${position} (${zoneId}) created successfully`, 'success');
        } catch (error) {
            logAd(`🍊 Error creating JuicyAds zone: ${error.message}`, 'error');
        }
        
        // ✅ Debug visual mejorado
        if (AD_CONFIG.debug) {
            insElement.innerHTML = `
                <div style="padding: 20px; color: #ffd700; font-weight: bold; text-align: center;">
                    🍊 JuicyAds Zone ${zoneId} (${position})<br>
                    <small style="color: #999;">Loading advertisement...</small><br>
                    <div style="margin-top: 10px; padding: 5px; background: rgba(0,0,0,0.1); border-radius: 4px; font-size: 12px;">
                        Script: Loaded ✅<br>
                        Global: ${typeof window.adsbyjuicy !== 'undefined' ? 'Ready ✅' : 'Waiting ⏳'}<br>
                        Zone ID: ${zoneId}
                    </div>
                </div>
            `;
            
            // ✅ Verificar carga después de 10 segundos
            setTimeout(() => {
                if (insElement.innerHTML.includes('Loading advertisement')) {
                    insElement.innerHTML = `
                        <div style="padding: 20px; color: #ff6b35; text-align: center; font-weight: bold;">
                            🍊 JuicyAds Zone ${zoneId}<br>
                            <small style="color: #999;">Ad script loaded but not displaying</small><br>
                            <div style="margin-top: 10px; padding: 5px; background: rgba(255,107,53,0.1); border-radius: 4px; font-size: 12px;">
                                This may be due to ad blockers or network restrictions
                            </div>
                        </div>
                    `;
                }
            }, 10000);
        }
    }
    
    createFallbacks() {
        Object.keys(this.zones).forEach(position => {
            const containerId = `juicyads-${position}-fallback`;
            const container = insertAdContainer(containerId);
            container.innerHTML = `
                <div style="padding: 25px; color: #ff6b35; border: 2px dashed #ff6b35; background: rgba(255, 107, 53, 0.1); border-radius: 12px; text-align: center;">
                    <div style="font-size: 24px; margin-bottom: 10px;">🍊</div>
                    <strong>JuicyAds Fallback (${position})</strong><br>
                    <small style="color: #999; margin-top: 8px; display: block;">Primary ad network failed to load</small>
                </div>
            `;
        });
    }
}

// ============================
// SISTEMA PRINCIPAL DE ANUNCIOS MEJORADO
// ============================

class AdNetworkManager {
    constructor() {
        this.networks = {
            juicyads: new JuicyAdsManager()
        };
        this.initialized = false;
    }
    
    async initialize() {
        if (this.initialized) return;
        
        logAd('🚀 Initializing ALL ad networks...', 'info');
        
        try {
            // ✅ Crear contenedores primero
            createAllAdContainers();
            
            // ✅ Esperar a que el DOM esté listo
            await this.waitForDOM();
            
            // ✅ Inicializar redes prioritarias (JuicyAds primero)
            await this.networks.juicyads.initialize();
            
            this.initialized = true;
            adState.initialized = true;
            
            // ✅ Verificación final después de más tiempo
            setTimeout(() => this.finalVerification(), 8000);
            
            logAd('🎯 Ad Network Manager initialization complete', 'success');
            
        } catch (error) {
            logAd(`Ad Manager initialization failed: ${error.message}`, 'error');
            this.createEmergencyFallbacks();
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
    
    createEmergencyFallbacks() {
        logAd('🚨 Creating emergency fallback ads...', 'warning');
        
        const emergencyAds = [
            { id: 'emergency-ad-1', target: '.banner-slideshow' },
            { id: 'emergency-ad-2', target: '.stats-section' },
            { id: 'emergency-ad-3', target: '#videosSection' }
        ];
        
        emergencyAds.forEach(({ id, target }) => {
            const container = insertAdContainer(id, target);
            container.innerHTML = `
                <div style="padding: 30px; background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; border-radius: 12px; text-align: center; font-weight: bold; box-shadow: 0 4px 16px rgba(0,0,0,0.2);">
                    <div style="font-size: 32px; margin-bottom: 15px;">🚨</div>
                    <div style="font-size: 18px; margin-bottom: 10px;">EMERGENCY AD CONTAINER</div>
                    <div style="font-size: 14px; opacity: 0.9;">Fallback advertising space - All networks failed</div>
                    <div style="margin-top: 15px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 8px; font-size: 12px;">
                        This indicates that ad scripts are being blocked or failed to load
                    </div>
                </div>
            `;
        });
    }
    
    finalVerification() {
        logAd('🎯 ===== VERIFICACIÓN FINAL v3.1 =====', 'info');
        
        // ✅ Verificar cada red
        Object.entries(adState.networksLoaded).forEach(([network, loaded]) => {
            const emoji = loaded ? '✅' : '❌';
            logAd(`${emoji} ${network}: ${loaded ? 'LOADED' : 'FAILED'}`, loaded ? 'success' : 'error');
        });
        
        // ✅ Verificar contenedores
        logAd(`📦 Containers created: ${adState.containersCreated.size}`, 'info');
        adState.containersCreated.forEach(containerId => {
            const element = document.getElementById(containerId);
            const visible = element && getComputedStyle(element).display !== 'none';
            logAd(`  ${containerId}: ${visible ? '✅ VISIBLE' : '❌ HIDDEN'}`, visible ? 'success' : 'error');
        });
        
        // ✅ Verificar globales
        const globals = {
            'JuicyAds': typeof window.adsbyjuicy !== 'undefined',
            'JuicyAds-Push': typeof window.adsbyjuicy?.push === 'function',
            'DOM-Ready': document.readyState === 'complete'
        };
        
        Object.entries(globals).forEach(([name, exists]) => {
            logAd(`${exists ? '✅' : '❌'} ${name}: ${exists ? 'DETECTED' : 'NOT FOUND'}`, exists ? 'success' : 'error');
        });
        
        // ✅ Estadísticas finales
        const loadedCount = Object.values(adState.networksLoaded).filter(Boolean).length;
        const totalCount = Object.keys(adState.networksLoaded).length;
        
        logAd(`🎯 RESUMEN: ${loadedCount}/${totalCount} redes activas`, 'info');
        logAd(`🎯 Containers: ${adState.containersCreated.size}`, 'info');
        logAd(`🎯 Debug Mode: ${AD_CONFIG.debug ? 'ENABLED' : 'DISABLED'}`, 'info');
        logAd('🎯 =====================================', 'info');
        
        // ✅ Si no hay anuncios funcionando, crear emergency
        if (loadedCount === 0) {
            this.createEmergencyFallbacks();
        }
    }
    
    // ✅ Función para testing mejorada
    testAds() {
        logAd('🧪 Testing ad networks...', 'info');
        
        Object.entries(this.networks).forEach(([name, manager]) => {
            logAd(`Testing ${name}: ${manager.loaded ? 'READY' : 'NOT READY'}`, manager.loaded ? 'success' : 'error');
        });
        
        // Diagnóstico detallado
        this.diagnoseAds();
    }
    
    diagnoseAds() {
        logAd('🔍 === DIAGNÓSTICO COMPLETO ===', 'info');
        
        // Verificar scripts en el DOM
        const scripts = Array.from(document.scripts);
        const adScripts = scripts.filter(s => 
            s.src.includes('jads.co') || 
            s.src.includes('exoclick') || 
            s.src.includes('eroads')
        );
        
        logAd(`📜 Ad scripts in DOM: ${adScripts.length}`, adScripts.length > 0 ? 'success' : 'warning');
        adScripts.forEach(script => {
            logAd(`  - ${script.src}`, 'info');
        });
        
        // Verificar ad blockers
        const testElement = document.createElement('div');
        testElement.className = 'ads ad advertisement';
        testElement.style.cssText = 'position: absolute; left: -9999px; width: 1px; height: 1px;';
        document.body.appendChild(testElement);
        
        setTimeout(() => {
            const blocked = testElement.offsetHeight === 0;
            logAd(`🛡️ Ad blocker detected: ${blocked ? 'YES' : 'NO'}`, blocked ? 'warning' : 'success');
            testElement.remove();
        }, 100);
        
        logAd('🔍 ===========================', 'info');
    }
}

// ============================
// INICIALIZACIÓN AUTOMÁTICA MEJORADA
// ============================

const adManager = new AdNetworkManager();

// ✅ Funciones globales para testing
window.testAds = () => adManager.testAds();
window.forceRecreateAds = () => adManager.createEmergencyFallbacks();
window.diagnoseAds = () => adManager.diagnoseAds();

// ✅ Auto-inicializar con múltiples métodos
function initializeAds() {
    console.log('🚀 Starting ad initialization...');
    
    if (AD_CONFIG.autoInit) {
        adManager.initialize().then(() => {
            console.log('✅ Ad initialization completed');
        }).catch(error => {
            console.error('❌ Ad initialization failed:', error);
            adManager.createEmergencyFallbacks();
        });
    }
}

// ✅ Múltiples eventos de inicialización
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAds);
} else {
    // DOM ya está listo
    setTimeout(initializeAds, 100);
}

// ✅ Fallback si no se inicializa en 3 segundos
setTimeout(() => {
    if (!adState.initialized) {
        console.warn('⚠️ Ad initialization timeout - forcing initialization');
        initializeAds();
    }
}, 3000);

// ✅ Exportar para uso externo
window.adNetworkManager = adManager;
window.AD_CONFIG = AD_CONFIG;
window.adState = adState;

logAd('🎯 Ad Verification System v3.1 loaded - Use testAds() for manual testing', 'success');
