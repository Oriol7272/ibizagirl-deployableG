// ============================
// SEO ENHANCEMENTS v2.1.0 - BEACHGIRL.PICS
// Fragmentos corregidos con las rutas correctas
// ============================

// LÍNEA 89 - En la función loadOriginalImage
tempImg.onerror = () => {
    console.error('Failed to load image:', img.dataset.src);
    img.classList.remove('skeleton', 'lazy');
    img.classList.add('error');
    
    // Try fallback image - RUTA CORREGIDA
    img.src = 'full/bikini.webp';  // <- Cambiado de 'public/assets/full/bikini.jpg'
};

// LÍNEA 207 - En la función updateOpenGraph
const defaultData = {
    title: trans.photos_seo_title || 'BeachGirl.pics - Galería Premium Paraíso | 400+ Fotos Diarias',
    description: trans.meta_description || 'Galería premium con 400+ fotos y 80+ videos HD actualizados diariamente.',
    image: 'https://beachgirl.pics/full/bikini.webp',  // <- Cambiado de '/public/assets/full/bikini.jpg'
    url: window.location.href,
    type: 'website'
};

// LÍNEA 480 - En la función injectAdvancedJSONLD - organizationSchema
const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://beachgirl.pics/#organization",
    "name": "BeachGirl.pics",
    "legalName": "BeachGirl.pics",
    "url": "https://beachgirl.pics/",
    "logo": {
        "@type": "ImageObject",
        "url": "https://beachgirl.pics/full/bikini.webp",  // <- Cambiado
        "width": 1200,
        "height": 630
    },
    "sameAs": [
        "https://instagram.com/beachgirl.pics",
        "https://tiktok.com/@beachgirl.pics",
        "https://twitter.com/beachgirlpics"
    ],
    "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": ["Spanish", "English", "French", "German", "Italian", "Portuguese"]
    }
};

// En imageGallerySchema también:
"primaryImageOfPage": {
    "@type": "ImageObject",
    "url": "https://beachgirl.pics/full/bikini.webp",  // <- Cambiado
    "caption": trans.seo_keywords?.primary || "Beach paradise gallery",
    "width": 1200,
    "height": 800
}

// En touristDestinationSchema:
const touristDestinationSchema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": "Paradise Beaches",
    "description": "Las mejores playas capturadas en nuestra galería premium",
    "url": "https://beachgirl.pics/",
    "image": "https://beachgirl.pics/full/bikbanner.webp",  // <- Cambiado
    // ... resto sin cambios
};
