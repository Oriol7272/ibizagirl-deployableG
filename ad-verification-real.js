// ============================
// REAL ADS SYSTEM v4.0 - ANUNCIOS REALES
// ✅ JuicyAds + ExoClick + EroAdvertising REALES
// ============================

'use strict';

console.log('🎯 [Real Ads] Sistema v4.0 con anuncios reales iniciado');
console.log('🌍 Redes: JuicyAds + ExoClick + EroAdvertising');

// ============================
// CONFIGURACIÓN DE ANUNCIOS REALES
// ============================

const REAL_ADS_CONFIG = {
    version: '4.0',
    debug: true,
    networks: {
        juicyads: {
            enabled: true,
            zones: {
                header: '1099077',
                content1: '1099078', 
                content2: '1099079',
                footer: '1099080',
                sidebar: '1099081'
            },
            scriptUrl: 'https://poweredby.jads.co/js/jads.js'
        },
        exoclick: {
            enabled: true,
            zones: {
                header: '5696328',
                content1: '5696329',
                content2: '5696330',
                footer: '5696331',
                sidebar: '5696332'
            },
            scriptUrls: [
                'https://a.magsrv.com/ad-provider.js',
                'https://syndication.exoclick.com/tag.js'
            ]
        },
        eroads: {
            enabled: true,
            siteId: '2309173',
            scriptUrl: 'https://ads.eroads.com/ads_js.php?site=2309173'
        }
    }
};

// ============================
// CLASE PRINCIPAL PARA ANUNCIOS REALES
// ============================

class RealAdsManager {
    constructor() {
        this.initialized = false;
        this.networksLoaded = {
            juicyads: false,
            exoclick: false,
            eroads: false
        };
        this.adContainers = new Map();
        this.fallbackEnabled = true;
    }

    async initialize() {
        if (this.initialized) return;
        
        console.log('🚀 Initializing Real Ads System...');
        
        try {
            // 1. Limpiar anuncios forzados anteriores
            this.cleanupForcedAds();
            
            // 2. Crear contenedores para anuncios reales
            this.createRealAdContainers();
            
            // 3. Inicializar redes publicitarias
            await this.initializeAdNetworks();
            
            // 4. Configurar verificación continua
            this.setupAdVerification();
            
            this.initialized = true;
            console.log('✅ Real Ads System initialized');
            
        } catch (error) {
            console.error('❌ Real Ads initialization failed:', error);
            this.createFallbackAds();
        }
    }
    
    cleanupForcedAds() {
        console.log('🧹 Cleaning up forced ads...');
        
        // Remover anuncios forzados
        const forcedAds = document.querySelectorAll('.forced-ad-container, [id*="forced-ad"], [id*="emergency-ad"]');
        forcedAds.forEach(ad => {
            ad.remove();
            console.log(`🗑️ Removed: ${ad.id}`);
        });
        
        // Remover estilos de anuncios forzados
        const forcedStyles = document.querySelectorAll('#forced-ads-styles, #emergency-ads-styles');
        forcedStyles.forEach(style => style.remove());
        
        console.log(`✅ Cleaned up ${forcedAds.length} forced ads`);
    }
    
    createRealAdContainers() {
        console.log('🏗️ Creating real ad containers...');
        
        const adPositions = [
            {
                id: 'real-ad-header',
                target: '.banner-slideshow',
                position: 'afterend',
                networks: ['juicyads', 'exoclick'],
                zones: { juicyads: 'header', exoclick: 'header' },
                size: '728x90',
                type: 'banner'
            },
            {
                id: 'real-ad-content-1',
                target: '.stats-section',
                position: 'afterend', 
                networks: ['juicyads', 'eroads'],
                zones: { juicyads: 'content1', eroads: 'content' },
                size: '728x90',
                type: 'banner'
            },
            {
                id: 'real-ad-content-2',
                target: '#photosSection',
                position: 'afterend',
                networks: ['exoclick', 'juicyads'],
                zones: { exoclick: 'content2', juicyads: 'content2' },
                size: '300x250',
                type: 'medium'
            },
            {
                id: 'real-ad-footer',
                target: '#videosSection',
                position: 'afterend',
                networks: ['juicyads', 'exoclick'],
                zones: { juicyads: 'footer', exoclick: 'footer' },
                size: '728x90',
                type: 'banner'
            },
            {
                id: 'real-ad-sidebar',
                target: '.teaser-carousel-container',
                position: 'afterend',
                networks: ['eroads', 'exoclick'],
                zones: { eroads: 'sidebar', exoclick: 'sidebar' },
                size: '300x600',
                type: 'skyscraper'
            }
        ];
        
        adPositions.forEach(config => {
            this.createSingleAdContainer(config);
        });
    }
    
    createSingleAdContainer(config) {
        const { id, target, position, networks, zones, size, type } = config;
        
        // Buscar elemento objetivo
        const targetElement = document.querySelector(target);
        if (!targetElement) {
            console.warn(`⚠️ Target not found: ${target}`);
            return;
        }
        
        // Crear contenedor principal
        const container = document.createElement('div');
        container.id = id;
        container.className = `real-ad-container ad-${type}`;
        container.setAttribute('data-size', size);
        container.setAttribute('data-networks', networks.join(','));
        
        // Estilos del contenedor
        container.style.cssText = `
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            width: 100% !important;
            max-width: 800px !important;
            margin: 20px auto !important;
            padding: 10px !important;
            text-align: center !important;
            position: relative !important;
            z-index: 100 !important;
            min-height: ${this.getMinHeight(size)} !important;
        `;
        
        // Crear slots para cada red
        networks.forEach((network, index) => {
            const slot = this.createAdSlot(network, zones[network], size, index);
            container.appendChild(slot);
        });
        
        // Insertar en DOM
        targetElement.insertAdjacentElement(position, container);
        this.adContainers.set(id, { container, config });
        
        console.log(`✅ Created real ad container: ${id} (${networks.join(', ')})`);
    }
    
    createAdSlot(network, zone, size, priority) {
        const slot = document.createElement('div');
        slot.className = `ad-slot ${network}-slot`;
        slot.id = `${network}-${zone}-${Date.now()}-${priority}`;
        slot.setAttribute('data-network', network);
        slot.setAttribute('data-zone', zone);
        slot.setAttribute('data-priority', priority);
        
        slot.style.cssText = `
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            width: 100% !important;
            margin: 5px auto !important;
            position: relative !important;
        `;
        
        // Contenido inicial de carga
        slot.innerHTML = `
            <div style="
                padding: 15px;
                background: linear-gradient(135deg, rgba(0,119,190,0.1), rgba(127,219,255,0.05));
                border: 2px dashed rgba(127,219,255,0.3);
                border-radius: 8px;
                color: #7fdbff;
                font-size: 14px;
                text-align: center;
            ">
                🎯 Cargando ${network.toUpperCase()} (${zone}) - ${size}<br>
                <small style="opacity: 0.7;">Inicializando red publicitaria...</small>
            </div>
        `;
        
        return slot;
    }
    
    getMinHeight(size) {
        const sizeMap = {
            '728x90': '90px',
            '300x250': '250px', 
            '300x600': '600px',
            '320x50': '50px',
            '468x60': '60px'
        };
        return sizeMap[size] || '90px';
    }
    
    async initializeAdNetworks() {
        console.log('🌐 Initializing ad networks...');
        
        // Inicializar en paralelo con timeouts
        const networkPromises = [
            this.initializeJuicyAds(),
            this.initializeExoClick(), 
            this.initializeEroAdvertising()
        ];
        
        // Esperar máximo 10 segundos por red
        const results = await Promise.allSettled(
            networkPromises.map(promise => 
                Promise.race([
                    promise,
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout')), 10000)
                    )
                ])
            )
        );
        
        results.forEach((result, index) => {
            const networks = ['juicyads', 'exoclick', 'eroads'];
            const network = networks[index];
            
            if (result.status === 'fulfilled') {
                console.log(`✅ ${network} initialized successfully`);
                this.networksLoaded[network] = true;
            } else {
                console.warn(`⚠️ ${network} failed:`, result.reason?.message);
                this.createNetworkFallback(network);
            }
        });
    }
    
    async initializeJuicyAds() {
        console.log('🍊 Initializing JuicyAds...');
        
        try {
            // Preparar global
            window.adsbyjuicy = window.adsbyjuicy || [];
            window.adsbyjuicy.cmd = window.adsbyjuicy.cmd || [];
            
            // Cargar script
            await this.loadScript(REAL_ADS_CONFIG.networks.juicyads.scriptUrl);
            
            // Esperar a que esté listo
            await this.waitForGlobal('adsbyjuicy');
            
            // Crear anuncios JuicyAds
            this.createJuicyAdsUnits();
            
            console.log('✅ JuicyAds ready');
            
        } catch (error) {
            console.error('❌ JuicyAds failed:', error);
            throw error;
        }
    }
    
    async initializeExoClick() {
        console.log('🔵 Initializing ExoClick...');
        
        try {
            const urls = REAL_ADS_CONFIG.networks.exoclick.scriptUrls;
            let loaded = false;
            
            for (const url of urls) {
                try {
                    await this.loadScript(url);
                    loaded = true;
                    break;
                } catch (e) {
                    console.warn(`⚠️ ExoClick URL failed: ${url}`);
                }
            }
            
            if (!loaded) throw new Error('All ExoClick URLs failed');
            
            // Crear anuncios ExoClick
            this.createExoClickUnits();
            
            console.log('✅ ExoClick ready');
            
        } catch (error) {
            console.error('❌ ExoClick failed:', error);
            throw error;
        }
    }
    
    async initializeEroAdvertising() {
        console.log('🟢 Initializing EroAdvertising...');
        
        try {
            await this.loadScript(REAL_ADS_CONFIG.networks.eroads.scriptUrl);
            
            // Crear anuncios EroAdvertising
            this.createEroAdsUnits();
            
            console.log('✅ EroAdvertising ready');
            
        } catch (error) {
            console.error('❌ EroAdvertising failed:', error);
            throw error;
        }
    }
    
    createJuicyAdsUnits() {
        const zones = REAL_ADS_CONFIG.networks.juicyads.zones;
        
        Object.entries(zones).forEach(([position, zoneId]) => {
            const slots = document.querySelectorAll(`.juicyads-slot[data-zone="${position}"]`);
            
            slots.forEach(slot => {
                // Crear elemento ins
                const ins = document.createElement('ins');
                ins.className = 'adsbyjuicy';
                ins.setAttribute('data-adzone', zoneId);
                ins.setAttribute('data-width', '728');
                ins.setAttribute('data-height', '90');
                
                ins.style.cssText = `
                    display: block !important;
                    visibility: visible !important;
                    width: 100% !important;
                    margin: 0 auto !important;
                `;
                
                // Reemplazar contenido del slot
                slot.innerHTML = '';
                slot.appendChild(ins);
                
                // Activar zona
                if (window.adsbyjuicy) {
                    window.adsbyjuicy.push({'adzone': parseInt(zoneId)});
                }
                
                console.log(`🍊 JuicyAds unit created: ${position} (${zoneId})`);
            });
        });
    }
    
    createExoClickUnits() {
        const zones = REAL_ADS_CONFIG.networks.exoclick.zones;
        
        Object.entries(zones).forEach(([position, zoneId]) => {
            const slots = document.querySelectorAll(`.exoclick-slot[data-zone="${position}"]`);
            
            slots.forEach(slot => {
                // Crear script de ExoClick
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.innerHTML = `
                    (function() {
                        var exoOptions = {
                            "zoneid": ${zoneId},
                            "width": "728",
                            "height": "90"
                        };
                        
                        var s = document.createElement('script');
                        s.type = 'text/javascript';
                        s.async = true;
                        s.src = 'https://a.magsrv.com/ad-provider.js';
                        
                        s.onload = function() {
                            if (typeof ExoLoader !== 'undefined') {
                                ExoLoader.serve(exoOptions);
                            }
                        };
                        
                        document.head.appendChild(s);
                    })();
                `;
                
                // Reemplazar contenido del slot
                slot.innerHTML = '';
                slot.appendChild(script);
                
                console.log(`🔵 ExoClick unit created: ${position} (${zoneId})`);
            });
        });
    }
    
    createEroAdsUnits() {
        const siteId = REAL_ADS_CONFIG.networks.eroads.siteId;
        
        const slots = document.querySelectorAll('.eroads-slot');
        slots.forEach((slot, index) => {
            // Crear contenedor EroAdvertising
            const eroDiv = document.createElement('div');
            eroDiv.id = `eroads-${siteId}-${index}`;
            
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.innerHTML = `
                (function() {
                    var eroOptions = {
                        "site": "${siteId}",
                        "size": "728x90"
                    };
                    
                    var s = document.createElement('script');
                    s.type = 'text/javascript';
                    s.async = true;
                    s.src = 'https://ads.eroads.com/ads_js.php?site=${siteId}';
                    document.head.appendChild(s);
                })();
            `;
            
            // Reemplazar contenido del slot
            slot.innerHTML = '';
            slot.appendChild(eroDiv);
            slot.appendChild(script);
            
            console.log(`🟢 EroAdvertising unit created: ${siteId}`);
        });
    }
    
    createNetworkFallback(network) {
        console.log(`🔄 Creating fallback for ${network}...`);
        
        const slots = document.querySelectorAll(`.${network}-slot`);
        slots.forEach(slot => {
            slot.innerHTML = `
                <div style="
                    padding: 20px;
                    background: linear-gradient(135deg, #ff6b35, #f7931e);
                    color: white;
                    border-radius: 10px;
                    text-align: center;
                    font-weight: bold;
                ">
                    <div style="font-size: 18px; margin-bottom: 10px;">
                        🎯 ${network.toUpperCase()} SPACE
                    </div>
                    <div style="font-size: 14px; opacity: 0.9;">
                        Network unavailable - Fallback active
                    </div>
                </div>
            `;
        });
    }
    
    async loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.async = true;
            script.defer = true;
            script.crossOrigin = 'anonymous';
            
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load: ${url}`));
            
            document.head.appendChild(script);
        });
    }
    
    async waitForGlobal(globalName, timeout = 5000) {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = timeout / 100;
            
            const check = () => {
                attempts++;
                if (window[globalName]) {
                    resolve();
                } else if (attempts >= maxAttempts) {
                    reject(new Error(`Global ${globalName} not available`));
                } else {
                    setTimeout(check, 100);
                }
            };
            
            check();
        });
    }
    
    setupAdVerification() {
        console.log('🔍 Setting up ad verification...');
        
        // Verificar cada 30 segundos
        setInterval(() => {
            this.verifyAds();
        }, 30000);
        
        // Verificar cuando la página vuelve a ser visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                setTimeout(() => this.verifyAds(), 2000);
            }
        });
    }
    
    verifyAds() {
        const containers = document.querySelectorAll('.real-ad-container');
        containers.forEach(container => {
            // Forzar visibilidad
            container.style.display = 'block';
            container.style.visibility = 'visible';
            container.style.opacity = '1';
        });
    }
    
    createFallbackAds() {
        console.log('🚨 Creating fallback ads...');
        
        // Si todo falla, crear anuncios de emergencia
        if (window.emergencyAds) {
            window.emergencyAds();
        }
    }
    
    // Funciones de testing
    test() {
        console.log('🧪 Testing Real Ads System...');
        console.log('Networks loaded:', this.networksLoaded);
        console.log('Containers:', this.adContainers.size);
        
        const realContainers = document.querySelectorAll('.real-ad-container');
        console.log(`📊 Found ${realContainers.length} real ad containers`);
        
        realContainers.forEach(container => {
            const style = getComputedStyle(container);
            console.log(`${container.id}:`, {
                display: style.display,
                visibility: style.visibility,
                opacity: style.opacity
            });
        });
    }
}

// ============================
// INICIALIZACIÓN AUTOMÁTICA
// ============================

const realAdsManager = new RealAdsManager();

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => realAdsManager.initialize(), 1000);
    });
} else {
    setTimeout(() => realAdsManager.initialize(), 1000);
}

// ============================
// EXPORTAR FUNCIONES GLOBALES
// ============================

window.realAdsManager = realAdsManager;
window.testRealAds = () => realAdsManager.test();
window.verifyRealAds = () => realAdsManager.verifyAds();

console.log('🎯 Real Ads System v4.0 loaded - Use testRealAds()');
