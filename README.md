# BeachGirl.pics - Premium Paradise Gallery

## 🌊 Descripción

BeachGirl.pics es una galería premium con más de 400 fotos y 80 videos HD actualizados diariamente. Sistema completo con rotación diaria de contenido, multiidioma, pagos con PayPal y chat bot Isabella.

## 🚀 Características

- **400+ Fotos diarias** - Rotación automática de contenido
- **80+ Videos HD** - Contenido premium en alta definición  
- **Sistema multiidioma** - 6 idiomas (ES, EN, DE, IT, FR, PT)
- **PayPal integrado** - Suscripciones VIP y packs
- **Chat bot Isabella** - Asistente virtual interactivo
- **PWA Ready** - Instalable como app
- **Lazy Loading** - Carga optimizada de contenido
- **SEO Optimizado** - Meta tags, Open Graph, JSON-LD

## 📁 Estructura de archivos

```
beachgirl-deployable/
├── index.html              # Landing page (verificación de edad)
├── main.html              # Galería principal
├── main-script.js         # Script principal (v15.0.0)
├── styles.css             # Estilos v3.0
├── seo-enhancements.js   # SEO y PWA v2.1.0
├── content-data.js        # Base de datos de contenido
├── sw.js                  # Service Worker v1.4.0
├── manifest.json          # PWA manifest
├── robots.txt             # SEO robots
├── sitemap.xml           # Sitemap SEO
├── favicon.ico           # Favicon del sitio
├── public/
│   └── assets/
│       ├── full/         # Imágenes principales (127 archivos)
│       ├── uncensored/   # 400+ fotos premium (641 archivos)
│       └── uncensored-videos/ # 80+ videos HD (70 archivos)
└── README.md
```

## 🔧 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/Oriol7272/beachgirl-deployable.git
```

2. Configura tu servidor web para servir los archivos estáticos

3. Actualiza el Client ID de PayPal en `main-script.js` (opcional, ya está configurado):
```javascript
PAYPAL: {
    CLIENT_ID: 'AfQEdiielw5fm3wF08p9pcxwqR3gPz82YRNUTKY4A8WNG9AktiGsDNyr2i7BsjVzSwwpeCwR7Tt7DPq5',
    // ...
}
```

## 💳 Configuración PayPal

El sistema incluye tres modalidades de pago:

- **VIP Mensual**: €15/mes - Acceso ilimitado
- **VIP Lifetime**: €100 - Acceso de por vida
- **Packs de créditos**: 10-100 items (€10-€60)

### Detalles de packs:
- **Starter Pack**: 10 créditos por €10 (33% descuento)
- **Bronze Pack**: 25 créditos por €20 (50% descuento)
- **Silver Pack**: 50 créditos por €35 (65% descuento)
- **Gold Pack**: 100 créditos por €60 (70% descuento)

## 🌍 Idiomas soportados

- 🇪🇸 Español
- 🇬🇧 English
- 🇩🇪 Deutsch
- 🇮🇹 Italiano
- 🇫🇷 Français
- 🇵🇹 Português

## 📊 Sistema de rotación

El contenido rota diariamente de forma automática:
- 200 fotos de un pool de 768 imágenes totales
- 40 videos de un pool de 70 videos HD
- 30% marcado como "nuevo" cada día
- Actualización diaria a las 3:00 AM

## 🚀 Despliegue

### Netlify/Vercel
1. Conecta tu repositorio
2. Build command: (vacío - archivos estáticos)
3. Publish directory: `/`

### Servidor tradicional
1. Sube todos los archivos vía FTP
2. Asegúrate de que los permisos sean 644 para archivos y 755 para carpetas

## 🔒 Seguridad

- Contenido protegido con blur hasta desbloqueo
- LocalStorage para guardar estado VIP
- PayPal SDK oficial para pagos seguros
- Verificación de edad obligatoria

## 📱 PWA Features

- Instalable en móviles
- Funciona offline (Service Worker)
- Actualización automática de contenido
- Push notifications ready

## 🐛 Debug

Accede a la consola del navegador y usa:

```javascript
// Ver estadísticas completas
galleryDebug.stats()

// Desbloquear todo (solo desarrollo)
galleryDebug.unlockAll()

// Añadir créditos (solo desarrollo)
galleryDebug.addCredits(100)

// Simular pago VIP (solo desarrollo)
galleryDebug.simulatePayment('vip', 'lifetime')

// Simular compra de créditos (solo desarrollo)
galleryDebug.simulatePayment('credits')

// Cambiar idioma
changeLanguage('en')

// Resetear todo
galleryDebug.resetAll()
```

## 🔄 Cambios en v15.0.0

### Correcciones aplicadas:
- ✅ Canvas Confetti actualizado a v1.9.3 (fix CDN 404)
- ✅ Versiones sincronizadas en todos los archivos
- ✅ PayPal locales corregidos (es-ES en lugar de es_ES)
- ✅ Manejo de errores mejorado para imágenes
- ✅ Sistema de fallback con placeholder visual
- ✅ Inicialización robusta con reintentos
- ✅ Analytics mejorado con tracking completo
- ✅ Isabella bot con mensajes contextuales
- ✅ Performance monitoring integrado

### Nuevas características:
- 🎯 Sistema de debug avanzado
- 📊 Analytics con Google Analytics 4
- 🔔 Notificaciones push (requiere VAPID keys)
- 💾 Auto-save de preferencias
- 🎨 Animaciones mejoradas con confetti
- 📱 Mejor soporte móvil

## 📄 Licencia

© 2025 BeachGirl.pics - Todos los derechos reservados

## 🤝 Soporte

Para soporte técnico o consultas comerciales:
- Web: https://beachgirl.pics
- Email: support@beachgirl.pics

## ⚠️ Troubleshooting

### PayPal no funciona:
1. Verifica que el Client ID sea correcto
2. Comprueba la consola para errores
3. Asegúrate de estar en producción (no sandbox)

### Imágenes no cargan:
1. Verifica las rutas en `content-data.js`
2. Comprueba permisos de archivos
3. Revisa la consola para errores 404

### Content no se muestra:
1. Ejecuta `galleryDebug.stats()` para verificar
2. Prueba `galleryDebug.unlockAll()` para debug
3. Verifica que `content-data.js` carga antes que `main-script.js`

---

**Nota**: Este es contenido para adultos (18+). Asegúrate de cumplir con las regulaciones locales.
