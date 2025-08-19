# Configuración de Auto-Deploy Vercel 🚀

## ✅ Archivos de configuración creados:

### 1. **vercel.json** - Configuración principal de Vercel
- Framework: Static site
- Routes configuradas para /gallery, /premium, /videos, /subscription  
- Headers de seguridad y cache optimizados
- Auto-alias habilitado

### 2. **.github/workflows/vercel.yml** - GitHub Actions para deployment
- Trigger automático en push a main branch
- Deployment via Vercel CLI
- Requiere secrets en GitHub: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID

### 3. **.vercel/project.json** - Configuración del proyecto
- Framework: static
- Install command: yarn install
- Sin build command (sitio estático)

### 4. **package.json** - Metadatos del proyecto
- Framework: "static" declarado explícitamente
- Scripts de dev y start configurados

## 🔧 Pasos para configurar auto-deploy en Vercel:

### Opción A: Conexión automática (recomendada)
1. Ve a [vercel.com](https://vercel.com) 
2. Conecta tu cuenta GitHub
3. Importa el repositorio de ibizagirl.pics
4. Vercel detectará automáticamente que es un sitio estático
5. Cada push a main triggereará deployment automático

### Opción B: Configuración manual
1. En Vercel Dashboard → Settings → Git
2. Verificar que esté conectado al repo correcto
3. Branch de producción: `main`
4. Auto-deployments: Enabled
5. Framework preset: Other/Static

## 🐛 Si no funciona el auto-deploy:

### Verificar en Vercel:
- **Dashboard** → Tu proyecto → **Settings** → **Git**
- Confirmar que el repositorio está conectado
- Verificar que "Auto-deployments" está habilitado
- Branch de producción debe ser `main`

### Verificar en GitHub:
- **Settings** → **Webhooks** 
- Debe haber un webhook de Vercel activo
- URL debe apuntar a `api.vercel.com`

### GitHub Actions (si usas la opción B):
- **Settings** → **Secrets and variables** → **Actions**
- Agregar secrets:
  - `VERCEL_TOKEN`: Token de tu cuenta Vercel
  - `VERCEL_ORG_ID`: ID de tu organización
  - `VERCEL_PROJECT_ID`: ID del proyecto

## ✅ Verificación de funcionamiento:

1. Haz un cambio pequeño en cualquier archivo
2. Usa "Save to GitHub"
3. Ve a tu dashboard de Vercel
4. Deberías ver un nuevo deployment iniciándose automáticamente
5. El deployment debería completarse en 1-2 minutos

## 📊 El sitio incluye:

- ✅ Google Analytics: G-DBXYNPBSPY
- ✅ PayPal integrado para pagos
- ✅ PWA con service worker
- ✅ 4 redes publicitarias configuradas
- ✅ Sistema de precios: €0.10, €0.80 bundle, €9.99 VIP
- ✅ 100 imágenes premium optimizadas
- ✅ Video thumbnails funcionando

---

**Si sigues teniendo problemas, el issue probablemente está en la configuración de Vercel, no en el código.** 🌴