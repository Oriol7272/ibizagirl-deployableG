<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Galería premium de Ibiza con 400+ fotos y 80+ videos HD actualizados diariamente. Contenido exclusivo del paraíso mediterráneo.">
    <meta name="keywords" content="Ibiza fotos, playas Ibiza, galería Ibiza 2025, videos HD Ibiza, paraíso mediterráneo, turismo España, Islas Baleares">
    <meta name="eroads_" content="5f8afe77e5b70fec960d89b314e045a4" />
    <title>🌊 BeachGirl.pics - Galería Premium Ibiza</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="manifest" href="/manifest.json">
    <link rel="canonical" href="https://beachgirl.pics/main.html">
    <script src="seo-enhancements.js" defer></script>
    <script src="main-script.js" defer></script>
</head>
<body>

    <!-- Loading Screen -->
    <div class="loading-screen">
        <div class="loading-content">
            <div class="loading-logo">🌊 BeachGirl.pics</div>
            <p>Cargando el paraíso...</p>
            <div class="loading-bar">
                <div class="loading-progress"></div>
            </div>
        </div>
    </div>

    <!-- Language Selector -->
    <div class="language-selector">
        <select id="language-select">
            <option value="es">🇪🇸 Español</option>
            <option value="en">🇬🇧 English</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="de">🇩🇪 Deutsch</option>
            <option value="it">🇮🇹 Italiano</option>
            <option value="pt">🇵🇹 Português</option>
        </select>
    </div>

    <!-- Header -->
    <header class="header">
        <div class="header-content">
            <div class="header-logo">🌊 BeachGirl.pics</div>
            <div class="header-buttons">
                <a href="#" class="btn btn-tertiary pack-btn">📦 MEGA PACKS -70%</a>
                <a href="#" class="btn btn-primary vip-btn">💳 €15/Mes</a>
                <a href="#" class="btn btn-secondary vip-btn">👑 Lifetime €100</a>
            </div>
        </div>
    </header>

    <!-- Banner -->
    <section class="banner">
        <h1 class="banner-title">Bienvenida al Paraíso 🌴</h1>
        <p class="banner-description">200+ fotos y 40+ videos actualizados DIARIAMENTE</p>
        <div class="banner-cta">
            <button class="btn btn-primary vip-btn">🔓 Desbloquear Todo</button>
            <button class="btn btn-secondary">📸 Ver Galería</button>
        </div>
    </section>

    <!-- Teaser Carousel -->
    <section class="teaser-carousel-container">
        <h2 class="section-title">🔥 Vista Previa Exclusiva - Mejores Fotos Ibiza</h2>
        <p class="banner-description">Explora una selección de nuestras mejores fotografías de Ibiza. Contenido premium del paraíso mediterráneo actualizado cada día.</p>
        <div class="teaser-carousel" id="teaser-carousel"></div>
    </section>

    <!-- Stats -->
    <section class="stats-section">
        <div class="stat-card">
            <div class="stat-icon">📸</div>
            <div class="stat-number">200</div>
            <div class="stat-label">Fotos de Hoy</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">🎬</div>
            <div class="stat-number">40</div>
            <div class="stat-label">Videos HD</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">👁️</div>
            <div class="stat-number">25.8M</div>
            <div class="stat-label">Vistas Totales</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">🔥</div>
            <div class="stat-number">24/7</div>
            <div class="stat-label">Actualizaciones</div>
        </div>
    </section>

    <!-- Photos Section -->
    <section>
        <div class="section-header">
            <h2 class="section-title">📸 Fotos del Paraíso</h2>
            <span class="section-subtitle">¡NUEVO HOY!</span>
        </div>
        <div class="content-grid" id="photos-grid"></div>
    </section>

    <!-- Videos Section -->
    <section>
        <div class="section-header">
            <h2 class="section-title">🎬 Videos Exclusivos</h2>
            <span class="section-subtitle">¡CONTENIDO FRESCO!</span>
        </div>
        <div class="content-grid" id="videos-grid"></div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-logo">BeachGirl.pics</div>
            <p class="footer-description">Tu destino diario para contenido exclusivo del paraíso mediterráneo. Actualizado 24/7 con las mejores fotos y videos.</p>
            <div class="footer-links">
                <div class="footer-column">
                    <h3>Enlaces Rápidos</h3>
                    <a href="#" class="footer-link">Fotos</a>
                    <a href="#" class="footer-link">Videos</a>
                    <a href="#" class="footer-link">Suscripción VIP</a>
                    <a href="#" class="footer-link">Mega Packs</a>
                </div>
                <div class="footer-column">
                    <h3>Soporte</h3>
                    <a href="/terms" class="footer-link">Términos de Servicio</a>
                    <a href="/privacy" class="footer-link">Política de Privacidad</a>
                    <a href="/contact" class="footer-link">Contacto</a>
                </div>
            </div>
            <p class="footer-copyright">© 2025 BeachGirl.pics - Todos los derechos reservados | 18+ Solo Adultos</p>
        </div>
    </footer>

    <!-- Credits Display -->
    <div class="credits-display" id="credits-display">
        <div class="credits-number" id="credits-number">0</div>
        <div class="credits-label">Créditos Disponibles</div>
    </div>

    <!-- Isabella Window -->
    <div class="isabella-window" id="isabella-window">
        <div class="isabella-header">
            <div class="isabella-avatar">💕</div>
            <h3 class="isabella-title">Isabella - Tu Guía VIP</h3>
            <span class="isabella-close">×</span>
        </div>
        <div class="isabella-messages" id="isabella-messages"></div>
        <div class="isabella-input">
            <textarea class="isabella-textarea" placeholder="Escribe un mensaje..."></textarea>
            <button class="isabella-send">➤</button>
        </div>
    </div>

    <!-- VIP Modal -->
    <div class="vip-modal" id="vip-modal">
        <div class="vip-content">
            <div class="vip-header">
                <h2 class="vip-title">👑 Acceso VIP Ilimitado</h2>
                <span class="vip-close">×</span>
            </div>
            <div class="vip-plans" id="vip-plans"></div>
        </div>
    </div>

    <!-- Packs Modal -->
    <div class="packs-modal" id="packs-modal">
        <div class="packs-content">
            <div class="packs-header">
                <h2 class="packs-title">📦 MEGA PACKS - Ahorra 70%</h2>
                <span class="packs-close">×</span>
            </div>
            <div class="packs-grid" id="packs-grid"></div>
        </div>
    </div>

    <!-- Unlock Modal -->
    <div class="unlock-modal" id="unlock-modal">
        <div class="unlock-content">
            <h2 class="unlock-title">🔓 Desbloquear Contenido</h2>
            <p class="unlock-description">Usa 1 crédito para desbloquear este contenido premium.</p>
            <div class="unlock-options">
                <button class="btn unlock-btn btn-primary unlock-credit">Desbloquear por €0.10</button>
                <button class="btn unlock-btn btn-secondary vip-btn">Obtener Acceso Ilimitado</button>
            </div>
        </div>
    </div>

    <!-- Notification Toast -->
    <div id="notification-toast" class="notification-toast"></div>

</body>
</html>
