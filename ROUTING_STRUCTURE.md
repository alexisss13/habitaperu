# Estructura de Routing con i18n

## 📋 Cambios Realizados

Se movieron los archivos de la página principal dentro de `app/[locale]/` para que funcionen con el sistema de internacionalización.

## 🏗️ Estructura Actual

```
app/
├── [locale]/                          # Rutas con soporte i18n
│   ├── layout.tsx                     # Provider de next-intl
│   ├── page.tsx                       # Página principal (/)
│   ├── home-client.tsx                # Router de dispositivo
│   ├── home-client-desktop.tsx        # Vista desktop
│   └── home-client-mobile.tsx         # Vista mobile
│
├── (auth)/                            # Rutas de autenticación
│   ├── login/
│   └── register/
│
├── admin/                             # Panel de administración
│   ├── dashboard/
│   ├── users/
│   ├── properties/
│   ├── contracts/
│   ├── payments/
│   └── settings/
│
├── landlord/                          # Dashboard arrendador
│   └── dashboard/
│
├── tenant/                            # Dashboard inquilino
│   └── dashboard/
│
├── propiedades/                       # Listado de propiedades
│   ├── page.tsx
│   └── [id]/
│
├── publicar/                          # Publicar propiedad
│   └── page.tsx
│
├── api/                               # API routes
│   ├── auth/
│   └── properties/
│
├── layout.tsx                         # Layout raíz
├── globals.css                        # Estilos globales
└── favicon.ico                        # Favicon
```

## 🔄 Cómo Funciona el Routing

### 1. Usuario Accede a `/`

```
Usuario → http://localhost:3000/
         ↓
Middleware detecta idioma del navegador
         ↓
Redirige internamente a /[locale]
         ↓
[locale] = 'es' (español por defecto)
         ↓
Renderiza app/[locale]/page.tsx
         ↓
URL visible: http://localhost:3000/
```

### 2. Usuario Cambia a Inglés

```
Usuario hace click en Language Switcher
         ↓
Selecciona "English (United States)"
         ↓
router.push('/en')
         ↓
Middleware detecta locale 'en'
         ↓
Carga messages/en.json
         ↓
Renderiza app/[locale]/page.tsx con traducciones en inglés
         ↓
URL visible: http://localhost:3000/en
```

### 3. Usuario Navega a Propiedades

```
Usuario hace click en "Ver todas las propiedades"
         ↓
Link href="/propiedades"
         ↓
Middleware NO intercepta (ruta fuera de [locale])
         ↓
Renderiza app/propiedades/page.tsx
         ↓
URL visible: http://localhost:3000/propiedades
```

## 🎯 Rutas con i18n vs Sin i18n

### Con i18n (dentro de [locale])
```
/              → Página principal (español)
/en            → Página principal (inglés)
/pt            → Página principal (portugués)
/fr            → Página principal (francés)
```

### Sin i18n (fuera de [locale])
```
/propiedades           → Listado de propiedades
/propiedades/123       → Detalle de propiedad
/admin/dashboard       → Dashboard admin
/login                 → Login
/register              → Registro
/publicar              → Publicar propiedad
```

## 📝 Próximos Pasos para i18n Completo

Para que TODAS las rutas soporten i18n, necesitarías mover cada carpeta dentro de `[locale]`:

```
app/
└── [locale]/
    ├── page.tsx                    # /
    ├── propiedades/
    │   ├── page.tsx                # /propiedades
    │   └── [id]/
    │       └── page.tsx            # /propiedades/123
    ├── admin/
    │   └── dashboard/
    │       └── page.tsx            # /admin/dashboard
    ├── login/
    │   └── page.tsx                # /login
    └── ...
```

Entonces las URLs serían:
```
/propiedades           → Español
/en/propiedades        → Inglés
/pt/propiedades        → Portugués

/admin/dashboard       → Español
/en/admin/dashboard    → Inglés
/pt/admin/dashboard    → Portugués
```

## 🔧 Configuración del Middleware

El middleware intercepta TODAS las rutas excepto:
- `/api/*` - API routes
- `/_next/*` - Next.js internals
- `/_vercel/*` - Vercel internals
- Archivos estáticos (`.png`, `.jpg`, etc.)

```typescript
// middleware.ts
export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/(es|en|pt|fr|de|it|ja|ko|zh)/:path*'
  ]
}
```

## ✅ Estado Actual

- ✅ Página principal (`/`) funciona con i18n
- ✅ Language switcher funciona
- ✅ Routing automático funciona
- ✅ Persistencia en localStorage funciona
- ⏳ Otras rutas aún no tienen i18n (funcionan solo en español)

## 🚀 Cómo Probar

1. **Acceder a la página principal:**
   ```
   http://localhost:3000/
   ```
   Debería cargar correctamente en español

2. **Cambiar a inglés:**
   - Click en icono 🌐
   - Seleccionar "English (United States)"
   - URL cambia a `http://localhost:3000/en`
   - Contenido en inglés (cuando esté traducido)

3. **Volver a español:**
   - Click en icono 🌐
   - Seleccionar "Español (Perú)"
   - URL cambia a `http://localhost:3000/`
   - Contenido en español

## 🐛 Troubleshooting

### Problema: 404 en `/`
**Solución:** Verificar que `app/[locale]/page.tsx` existe

### Problema: No cambia el idioma
**Solución:** Verificar que `middleware.ts` está en la raíz del proyecto

### Problema: Error en build
**Solución:** Verificar que todos los archivos JSON de mensajes existen

---

**Actualizado:** Mayo 2026  
**Estado:** ✅ Funcionando  
**Build:** ✅ Exitoso
