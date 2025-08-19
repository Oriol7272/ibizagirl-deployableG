/**
 * language-manager.js - Multi-language Support v2.0
 * Sistema de soporte multi-idioma
 */

'use strict';

console.log('🌍 Cargando Language Manager v2.0...');

class LanguageManager {
    constructor() {
        this.currentLanguage = this.detectLanguage();
        this.translations = {
            es: {
                // Header & Navigation
                siteTitle: 'IbizaGirl.pics',
                siteTagline: 'Galería Premium Paradise',
                navGallery: 'Galería',
                navVideos: 'Videos',
                navPremium: 'Premium',
                
                // Content Sections
                galleryTitle: '🌴 Colección Galería Paradise',
                gallerySubtitle: '200 Fotos Nuevas Diarias - ¡30% Marcadas como NUEVAS!',
                videosTitle: '🎬 Colección Videos Premium',
                videosSubtitle: '40 Videos Nuevos Diarios!',
                pricingTitle: '💎 Desbloquea Acceso Premium',
                pricingSubtitle: 'Obtén acceso instantáneo a todo el contenido',
                
                // Highlights
                highlightsTitle: '✨ Lo Destacado de Hoy',
                
                // Pricing Plans
                ppvTitle: 'Pago por Vista',
                ppvPrice: '€0.99',
                ppvPeriod: 'por artículo',
                monthlyTitle: 'Acceso Mensual',
                monthlyPrice: '€9.99',
                monthlyPeriod: 'por mes',
                lifetimeTitle: 'Acceso de Por Vida',
                lifetimePrice: '€49.99',
                lifetimePeriod: 'una sola vez',
                mostPopular: 'Más Popular',
                
                // Features
                feature1: '✓ Foto o video individual',
                feature2: '✓ Acceso instantáneo',
                feature3: '✓ Calidad HD',
                feature4: '✓ Descarga habilitada',
                feature5: '✓ Pago seguro PayPal',
                feature6: '✓ Sin suscripción necesaria',
                feature7: '✓ Todas las 200 fotos diarias',
                feature8: '✓ Todos los 40 videos diarios',
                feature9: '✓ 30% contenido nuevo diario',
                feature10: '✓ Actualizaciones prioritarias',
                feature11: '✓ Descargas HD',
                feature12: '✓ Acceso para siempre',
                feature13: '✓ Todo el contenido actual',
                feature14: '✓ Todas las actualizaciones futuras',
                feature15: '✓ Soporte prioritario',
                feature16: '✓ Bonos exclusivos',
                
                // Buttons & Actions
                loadMore: 'Cargar Más Contenido',
                unlock: 'Desbloquear',
                processing: 'Procesando Pago',
                redirecting: 'Redirigiendo a PayPal...',
                
                // Trust & Security
                securePayment: '🔒 Procesamiento de Pago Seguro por PayPal',
                
                // Footer
                privacy: 'Política de Privacidad',
                terms: 'Términos de Servicio',
                contact: 'Contacto',
                dmca: 'DMCA',
                copyright: '© 2025 IbizaGirl.pics - Todos los Derechos Reservados',
                footerNote: 'Contenido actualizado diariamente a las 00:00 UTC',
                
                // Loading
                loadingContent: 'Cargando Contenido Paradise...'
            },
            en: {
                // Header & Navigation
                siteTitle: 'IbizaGirl.pics',
                siteTagline: 'Premium Paradise Gallery',
                navGallery: 'Gallery',
                navVideos: 'Videos',
                navPremium: 'Premium',
                
                // Content Sections
                galleryTitle: '🌴 Paradise Gallery Collection',
                gallerySubtitle: '200 New Photos Daily - 30% Marked as NEW!',
                videosTitle: '🎬 Premium Video Collection',
                videosSubtitle: '40 New Videos Daily!',
                pricingTitle: '💎 Unlock Premium Access',
                pricingSubtitle: 'Get instant access to all content',
                
                // Highlights
                highlightsTitle: '✨ Today\'s Highlights',
                
                // Pricing Plans
                ppvTitle: 'Pay Per View',
                ppvPrice: '€0.99',
                ppvPeriod: 'per item',
                monthlyTitle: 'Monthly Access',
                monthlyPrice: '€9.99',
                monthlyPeriod: 'per month',
                lifetimeTitle: 'Lifetime Access',
                lifetimePrice: '€49.99',
                lifetimePeriod: 'one time',
                mostPopular: 'Most Popular',
                
                // Features
                feature1: '✓ Single photo or video',
                feature2: '✓ Instant access',
                feature3: '✓ HD quality',
                feature4: '✓ Download enabled',
                feature5: '✓ PayPal secure payment',
                feature6: '✓ No subscription needed',
                feature7: '✓ All 200 daily photos',
                feature8: '✓ All 40 daily videos',
                feature9: '✓ 30% new content daily',
                feature10: '✓ Priority updates',
                feature11: '✓ HD downloads',
                feature12: '✓ Forever access',
                feature13: '✓ All current content',
                feature14: '✓ All future updates',
                feature15: '✓ Priority support',
                feature16: '✓ Exclusive bonuses',
                
                // Buttons & Actions
                loadMore: 'Load More Content',
                unlock: 'Unlock',
                processing: 'Processing Payment',
                redirecting: 'Redirecting to PayPal...',
                
                // Trust & Security
                securePayment: '🔒 Secure Payment Processing by PayPal',
                
                // Footer
                privacy: 'Privacy Policy',
                terms: 'Terms of Service',
                contact: 'Contact',
                dmca: 'DMCA',
                copyright: '© 2025 IbizaGirl.pics - All Rights Reserved',
                footerNote: 'Content updated daily at 00:00 UTC',
                
                // Loading
                loadingContent: 'Loading Paradise Content...'
            },
            fr: {
                // Header & Navigation
                siteTitle: 'IbizaGirl.pics',
                siteTagline: 'Galerie Premium Paradise',
                navGallery: 'Galerie',
                navVideos: 'Vidéos',
                navPremium: 'Premium',
                
                // Content Sections
                galleryTitle: '🌴 Collection Galerie Paradise',
                gallerySubtitle: '200 Nouvelles Photos Quotidiennes - 30% Marquées comme NOUVELLES!',
                videosTitle: '🎬 Collection Vidéos Premium',
                videosSubtitle: '40 Nouvelles Vidéos Quotidiennes!',
                pricingTitle: '💎 Débloquer l\'Accès Premium',
                pricingSubtitle: 'Obtenez un accès instantané à tout le contenu',
                
                // Highlights
                highlightsTitle: '✨ Les Points Forts d\'Aujourd\'hui',
                
                // Pricing Plans
                ppvTitle: 'Paiement à la Vue',
                ppvPrice: '€0.99',
                ppvPeriod: 'par article',
                monthlyTitle: 'Accès Mensuel',
                monthlyPrice: '€9.99',
                monthlyPeriod: 'par mois',
                lifetimeTitle: 'Accès à Vie',
                lifetimePrice: '€49.99',
                lifetimePeriod: 'une seule fois',
                mostPopular: 'Le Plus Populaire',
                
                // Features
                feature1: '✓ Photo ou vidéo unique',
                feature2: '✓ Accès instantané',
                feature3: '✓ Qualité HD',
                feature4: '✓ Téléchargement activé',
                feature5: '✓ Paiement sécurisé PayPal',
                feature6: '✓ Aucun abonnement nécessaire',
                feature7: '✓ Toutes les 200 photos quotidiennes',
                feature8: '✓ Toutes les 40 vidéos quotidiennes',
                feature9: '✓ 30% nouveau contenu quotidien',
                feature10: '✓ Mises à jour prioritaires',
                feature11: '✓ Téléchargements HD',
                feature12: '✓ Accès à vie',
                feature13: '✓ Tout le contenu actuel',
                feature14: '✓ Toutes les mises à jour futures',
                feature15: '✓ Support prioritaire',
                feature16: '✓ Bonus exclusifs',
                
                // Buttons & Actions
                loadMore: 'Charger Plus de Contenu',
                unlock: 'Débloquer',
                processing: 'Traitement du Paiement',
                redirecting: 'Redirection vers PayPal...',
                
                // Trust & Security
                securePayment: '🔒 Traitement de Paiement Sécurisé par PayPal',
                
                // Footer
                privacy: 'Politique de Confidentialité',
                terms: 'Conditions de Service',
                contact: 'Contact',
                dmca: 'DMCA',
                copyright: '© 2025 IbizaGirl.pics - Tous Droits Réservés',
                footerNote: 'Contenu mis à jour quotidiennement à 00:00 UTC',
                
                // Loading
                loadingContent: 'Chargement du Contenu Paradise...'
            }
        };
        
        this.init();
    }
    
    detectLanguage() {
        // Check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && this.isValidLanguage(urlLang)) {
            return urlLang;
        }
        
        // Check localStorage
        const storedLang = localStorage.getItem('ibizagirl_language');
        if (storedLang && this.isValidLanguage(storedLang)) {
            return storedLang;
        }
        
        // Check browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const shortLang = browserLang.split('-')[0];
        if (this.isValidLanguage(shortLang)) {
            return shortLang;
        }
        
        // Default to Spanish
        return 'es';
    }
    
    isValidLanguage(lang) {
        return ['es', 'en', 'fr'].includes(lang);
    }
    
    init() {
        this.createLanguageSelector();
        this.updateContent();
        console.log(`🌍 Language Manager inicializado en idioma: ${this.currentLanguage}`);
    }
    
    createLanguageSelector() {
        const selector = document.createElement('div');
        selector.className = 'language-selector';
        selector.innerHTML = `
            <div class="language-dropdown">
                <button class="language-btn" id="language-btn">
                    <span class="flag-icon">${this.getFlagEmoji(this.currentLanguage)}</span>
                    <span class="lang-code">${this.currentLanguage.toUpperCase()}</span>
                    <span class="dropdown-arrow">▼</span>
                </button>
                <div class="language-options" id="language-options">
                    <button class="language-option" data-lang="es">
                        <span class="flag-icon">🇪🇸</span>
                        <span>Español</span>
                    </button>
                    <button class="language-option" data-lang="en">
                        <span class="flag-icon">🇬🇧</span>
                        <span>English</span>
                    </button>
                    <button class="language-option" data-lang="fr">
                        <span class="flag-icon">🇫🇷</span>
                        <span>Français</span>
                    </button>
                </div>
            </div>
        `;
        
        // Add to header
        const headerContainer = document.querySelector('.header-container');
        if (headerContainer) {
            headerContainer.appendChild(selector);
        }
        
        this.setupLanguageEvents();
    }
    
    setupLanguageEvents() {
        const langBtn = document.getElementById('language-btn');
        const langOptions = document.getElementById('language-options');
        
        if (langBtn && langOptions) {
            langBtn.addEventListener('click', () => {
                langOptions.classList.toggle('show');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.language-selector')) {
                    langOptions.classList.remove('show');
                }
            });
            
            // Language option clicks
            langOptions.addEventListener('click', (e) => {
                const option = e.target.closest('.language-option');
                if (option) {
                    const newLang = option.dataset.lang;
                    this.changeLanguage(newLang);
                    langOptions.classList.remove('show');
                }
            });
        }
    }
    
    getFlagEmoji(lang) {
        const flags = {
            es: '🇪🇸',
            en: '🇬🇧', 
            fr: '🇫🇷'
        };
        return flags[lang] || '🇪🇸';
    }
    
    changeLanguage(newLang) {
        if (!this.isValidLanguage(newLang) || newLang === this.currentLanguage) {
            return;
        }
        
        this.currentLanguage = newLang;
        
        // Save to localStorage
        localStorage.setItem('ibizagirl_language', newLang);
        
        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('lang', newLang);
        window.history.replaceState({}, '', url);
        
        // Update content
        this.updateContent();
        
        // Update language button
        const langBtn = document.getElementById('language-btn');
        if (langBtn) {
            langBtn.innerHTML = `
                <span class="flag-icon">${this.getFlagEmoji(newLang)}</span>
                <span class="lang-code">${newLang.toUpperCase()}</span>
                <span class="dropdown-arrow">▼</span>
            `;
        }
        
        // Emit language change event
        const event = new CustomEvent('languageChanged', {
            detail: { language: newLang }
        });
        document.dispatchEvent(event);
        
        console.log(`🌍 Idioma cambiado a: ${newLang}`);
    }
    
    updateContent() {
        const t = this.translations[this.currentLanguage];
        
        // Update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            if (t[key]) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = t[key];
                } else {
                    element.textContent = t[key];
                }
            }
        });
        
        // Update specific elements by ID or class
        this.updateElementById('site-title', t.siteTitle);
        this.updateElementById('site-tagline', t.siteTagline);
        this.updateElementByClass('section-subtitle', t.gallerySubtitle);
        
        // Update loading text
        const loadingText = document.querySelector('.loader-container p');
        if (loadingText) {
            loadingText.textContent = t.loadingContent;
        }
    }
    
    updateElementById(id, text) {
        const element = document.getElementById(id);
        if (element && text) {
            element.textContent = text;
        }
    }
    
    updateElementByClass(className, text) {
        const element = document.querySelector(`.${className}`);
        if (element && text) {
            element.textContent = text;
        }
    }
    
    translate(key) {
        return this.translations[this.currentLanguage]?.[key] || key;
    }
    
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    getSupportedLanguages() {
        return Object.keys(this.translations);
    }
}

// Export globally
window.LanguageManager = new LanguageManager();

console.log('✅ Language Manager cargado correctamente');