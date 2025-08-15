// ============================
// DIAGNOSTIC SCRIPT - BeachGirl.pics
// Detecta automáticamente la estructura de archivos
// ============================

console.log('%c🔍 DIAGNÓSTICO BEACHGIRL.PICS', 'color: #667eea; font-size: 20px; font-weight: bold');
console.log('=====================================\n');

// 1. Información del entorno
console.log('📍 ENTORNO:');
console.log('   URL actual:', window.location.href);
console.log('   Hostname:', window.location.hostname);
console.log('   Pathname:', window.location.pathname);
console.log('   Protocolo:', window.location.protocol);

// 2. Verificar content-database.js
console.log('\n📦 CONTENT DATABASE:');
if (typeof window.ALL_PHOTOS_POOL !== 'undefined') {
    console.log(`   ✅ Fotos /full: ${window.ALL_PHOTOS_POOL.length} archivos`);
    console.log(`      Ejemplo: ${window.ALL_PHOTOS_POOL[0]}`);
} else {
    console.log('   ❌ ALL_PHOTOS_POOL no encontrado');
}

if (typeof window.ALL_UNCENSORED_PHOTOS_POOL !== 'undefined') {
    console.log(`   ✅ Fotos /uncensored: ${window.ALL_UNCENSORED_PHOTOS_POOL.length} archivos`);
    console.log(`      Ejemplo: ${window.ALL_UNCENSORED_PHOTOS_POOL[0]}`);
} else {
    console.log('   ❌ ALL_UNCENSORED_PHOTOS_POOL no encontrado');
}

if (typeof window.ALL_VIDEOS_POOL !== 'undefined') {
    console.log(`   ✅ Videos: ${window.ALL_VIDEOS_POOL.length} archivos`);
    console.log(`      Ejemplo: ${window.ALL_VIDEOS_POOL[0]}`);
} else {
    console.log('   ❌ ALL_VIDEOS_POOL no encontrado');
}

// 3. Probar diferentes rutas para las imágenes
console.log('\n🔎 PROBANDO RUTAS DE IMÁGENES:');

async function testImagePaths() {
    // Tomar una imagen de ejemplo de cada pool
    const testImages = [
        { name: 'Imagen de /full', path: window.ALL_PHOTOS_POOL?.[0] },
        { name: 'Imagen de /uncensored', path: window.ALL_UNCENSORED_PHOTOS_POOL?.[0] },
        { name: 'Banner principal', path: '/full/bikbanner.jpg' }
    ];
    
    for (const testImg of testImages) {
        if (!testImg.path) continue;
        
        console.log(`\n   Testing: ${testImg.name}`);
        console.log(`   Archivo: ${testImg.path}`);
        
        // Diferentes variaciones de ruta a probar
        const variations = [
            testImg.path,                                    // Original
            testImg.path.substring(1),                       // Sin / inicial
            `/public/assets${testImg.path}`,                 // Con /public/assets
            `public/assets${testImg.path}`,                  // Sin / inicial
            `/beachgirl-deployable${testImg.path}`,         // Con nombre repo
            `/ibizagirl-deployable2${testImg.path}`,        // Otro posible nombre
            `https://raw.githubusercontent.com/Oriol7272/beachgirl-deployable/main${testImg.path}`,
            `https://raw.githubusercontent.com/Oriol7272/ibizagirl-deployable2/main${testImg.path}`
        ];
        
        let found = false;
        
        for (const variant of variations) {
            try {
                const response = await fetch(variant, { method: 'HEAD' });
                if (response.ok) {
                    console.log(`      ✅ FUNCIONA: ${variant}`);
                    found = true;
                    break;
                }
            } catch (e) {
                // Silently continue
            }
        }
        
        if (!found) {
            console.log(`      ❌ No se encontró ruta funcional`);
        }
    }
}

// 4. Verificar archivos específicos importantes
console.log('\n📁 ARCHIVOS IMPORTANTES:');

async function checkImportantFiles() {
    const files = [
        'index.html',
        'main.html',
        'content-database.js',
        'main-script.js',
        'styles.css',
        'manifest.json',
        'full/bikini.jpg',
        'full/bikbanner.jpg',
        'uncensored/00wd2wVE89BJnQVenuNP.webp'
    ];
    
    for (const file of files) {
        try {
            const response = await fetch(file, { method: 'HEAD' });
            if (response.ok) {
                console.log(`   ✅ ${file}`);
            } else {
                console.log(`   ❌ ${file} (404)`);
            }
        } catch (e) {
            console.log(`   ❌ ${file} (Error)`);
        }
    }
}

// 5. Generar solución
async function generateSolution() {
    console.log('\n💡 SOLUCIÓN RECOMENDADA:');
    console.log('=====================================');
    
    // Detectar si es GitHub Pages
    if (window.location.hostname.includes('github.io')) {
        console.log('⚠️  Estás usando GitHub Pages');
        console.log('   Las rutas pueden necesitar el nombre del repositorio');
        
        const pathname = window.location.pathname;
        const repoName = pathname.split('/')[1];
        
        if (repoName) {
            console.log(`   Nombre del repo detectado: ${repoName}`);
            console.log(`   Las rutas deberían empezar con: /${repoName}/`);
        }
    }
    
    console.log('\n📝 PASOS A SEGUIR:');
    console.log('1. Verifica que las carpetas /full, /uncensored y /uncensored-videos');
    console.log('   estén en la RAÍZ del repositorio (no dentro de /public/assets)');
    console.log('2. Asegúrate de que los nombres de archivo coincidan exactamente');
    console.log('3. Si usas GitHub Pages, puede que necesites ajustar las rutas');
    console.log('4. Revisa que todos los archivos estén subidos correctamente');
}

// 6. Ejecutar todo el diagnóstico
async function runCompleteDiagnostic() {
    await testImagePaths();
    await checkImportantFiles();
    await generateSolution();
    
    console.log('\n=====================================');
    console.log('%c✅ DIAGNÓSTICO COMPLETADO', 'color: #4CAF50; font-size: 16px; font-weight: bold');
    console.log('=====================================\n');
    
    console.log('💡 TIP: Si las imágenes no cargan:');
    console.log('   1. Copia la ruta que SÍ funciona del diagnóstico');
    console.log('   2. Actualiza content-database.js con esa estructura');
    console.log('   3. O mueve los archivos a donde los está buscando');
}

// Ejecutar automáticamente
runCompleteDiagnostic();

// Hacer disponible para uso manual
window.diagnostic = {
    run: runCompleteDiagnostic,
    testPaths: testImagePaths,
    checkFiles: checkImportantFiles
};
