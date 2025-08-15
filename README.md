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
├── index.html              # Landing page
├── main.html              # Galería principal
├── main-script.js         # Script principal (14.0.0)
├── styles.css             # Estilos v2.0
├── seo-enhancements.js   # SEO y PWA v2.0.0
├── sw.js                  # Service Worker v1.3.0
├── manifest.json          # PWA manifest
├── robots.txt             # SEO robots
├── sitemap.xml           # Sitemap SEO
├── .DS_Store             # Mac metadata
├── public/
│   └── assets/
│       ├── full/         # Imágenes principales
│       │   ├── bikini.jpg
│       │   ├── bikini3.jpg
│       │   ├── bikini5.jpg
│       │   ├── backbikini.jpg
│       │   ├── bikbanner.jpg
│       │   └── bikbanner2.jpg
│       ├── uncensored/   # 400+ fotos premium
│       └── uncensored-videos/ # 80+ videos HD
└── README.md
```

## 🔧 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/Oriol7272/beachgirl-deployable.git
```

2. Configura tu servidor web para servir los archivos estáticos

3. Actualiza el Client ID de PayPal en `main-script.js`:
```javascript
PAYPAL: {
    CLIENT_ID: 'TU_CLIENT_ID_AQUI',
    // ...
}
```

## 💳 Configuración PayPal

El sistema incluye tres modalidades de pago:

- **VIP Mensual**: €15/mes - Acceso ilimitado
- **VIP Lifetime**: €100 - Acceso de por vida
- **Packs de créditos**: 10-100 items (€10-€50)

## 🌍 Idiomas soportados

- 🇪🇸 Español
- 🇬🇧 English
- 🇩🇪 Deutsch
- 🇮🇹 Italiano
- 🇫🇷 Français
- 🇵🇹 Português

## 📊 Sistema de rotación

El contenido rota diariamente de forma automática:
- 200 fotos de un pool de 400+
- 40 videos de un pool de 80+
- 30% marcado como "nuevo" cada día

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

## 📱 PWA Features

- Instalable en móviles
- Funciona offline (Service Worker)
- Actualización automática de contenido
- Push notifications ready

## 🐛 Debug

Accede a la consola del navegador y usa:

```javascript
galleryDebug.contentStats()  // Ver estadísticas
galleryDebug.unlockAll()     // Desbloquear todo (dev)
galleryDebug.addCredits(100) // Añadir créditos (dev)
galleryDebug.setLanguage('en') // Cambiar idioma
```

## 📄 Licencia

© 2025 BeachGirl.pics - Todos los derechos reservados

## 🤝 Soporte

Para soporte técnico o consultas comerciales:
- Web: https://beachgirl.pics
- Email: support@beachgirl.pics

---

**Nota**: Este es contenido para adultos (18+). Asegúrate de cumplir con las regulaciones locales.
