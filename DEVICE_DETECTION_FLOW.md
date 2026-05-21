# Flujo de Detección de Dispositivos - Diagrama Visual

## 🔄 Flujo Completo del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    USUARIO ACCEDE A LA PÁGINA                   │
│                         https://habita.pe                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  SERVER COMPONENT (page.tsx)                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  async function getProperties() {                         │  │
│  │    const properties = await prisma.property.findMany()    │  │
│  │    return properties                                      │  │
│  │  }                                                        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  • Obtiene datos de PostgreSQL (Neon)                           │
│  • Procesa datos en el servidor                                 │
│  • No expone lógica al cliente                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              CLIENT COMPONENT (home-client.tsx)                  │
│                    🎯 ROUTER COMPONENT                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  'use client'                                             │  │
│  │                                                           │  │
│  │  const { isMobile, isDesktop, isLoading } =              │  │
│  │    useDeviceDetection()                                  │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│           HOOK: useDeviceDetection (Client-Side)                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  DETECCIÓN MULTI-FACTOR:                                  │  │
│  │                                                           │  │
│  │  1️⃣ User Agent Check                                      │  │
│  │     /android|iphone|ipad|mobile/i.test(userAgent)        │  │
│  │                                                           │  │
│  │  2️⃣ Screen Width Check                                    │  │
│  │     window.innerWidth < 768                              │  │
│  │                                                           │  │
│  │  3️⃣ Touch Capability Check                                │  │
│  │     'ontouchstart' in window                             │  │
│  │                                                           │  │
│  │  ➡️ RESULTADO: Si 2 de 3 = true → MOBILE                 │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
         isLoading = true          isLoading = false
                │                         │
                ▼                         ▼
┌──────────────────────────┐    ┌────────────────────┐
│   LOADING STATE          │    │  DEVICE DETECTED   │
│                          │    │                    │
│  ┌────────────────────┐  │    │  isMobile?         │
│  │   ┌──────────┐     │  │    │    │               │
│  │   │    H     │     │  │    │    ├─ true         │
│  │   └──────────┘     │  │    │    │               │
│  │   Cargando...      │  │    │    └─ false        │
│  │   ▓▓▓░░░░░░░       │  │    │                    │
│  └────────────────────┘  │    └────────┬───────────┘
│                          │             │
│  • Logo animado          │             │
│  • Barra de progreso     │             │
│  • Colores oficiales     │             │
└──────────────────────────┘             │
                                         │
                    ┌────────────────────┴────────────────────┐
                    │                                         │
              isMobile = true                          isMobile = false
                    │                                         │
                    ▼                                         ▼
┌─────────────────────────────────────┐  ┌─────────────────────────────────────┐
│   MOBILE VIEW                       │  │   DESKTOP VIEW                      │
│   (home-client-mobile.tsx)          │  │   (home-client-desktop.tsx)         │
│                                     │  │                                     │
│  ┌───────────────────────────────┐  │  │  ┌───────────────────────────────┐  │
│  │  📱 MOBILE HEADER (Fixed)     │  │  │  │  🖥️ ANNOUNCEMENT BAR          │  │
│  │  ┌─────────────────────────┐  │  │  │  │  ✓ Verificadas ✓ Seguros    │  │
│  │  │ Habita Perú        👤  │  │  │  │  └───────────────────────────────┘  │
│  │  └─────────────────────────┘  │  │  │                                     │
│  └───────────────────────────────┘  │  │  ┌───────────────────────────────┐  │
│                                     │  │  │  🎨 HERO SECTION              │  │
│  ┌───────────────────────────────┐  │  │  │  • Título grande              │  │
│  │  📋 CONTENT AREA              │  │  │  │  • Búsqueda intuitiva         │  │
│  │                               │  │  │  │  • 4 filtros rápidos          │  │
│  │  • Lista de propiedades       │  │  │  │  • Imagen hero grande         │  │
│  │  • Tarjetas optimizadas       │  │  │  └───────────────────────────────┘  │
│  │  • Touch-friendly             │  │  │                                     │
│  │  • Swipe gestures             │  │  │  ┌───────────────────────────────┐  │
│  │                               │  │  │  │  🏠 PROPIEDADES DESTACADAS    │  │
│  └───────────────────────────────┘  │  │  │  • Grid responsive            │  │
│                                     │  │  │  • Filtros por categoría      │  │
│  ┌───────────────────────────────┐  │  │  │  • Tarjetas con hover         │  │
│  │  🔽 BOTTOM NAVIGATION         │  │  │  └───────────────────────────────┘  │
│  │  ┌─────┬─────┬─────┬─────┐   │  │  │                                     │
│  │  │ 🏠  │ 🔍  │ ❤️  │ 👤  │   │  │  │  ┌───────────────────────────────┐  │
│  │  │Inicio│Buscar│Fav│Perfil│   │  │  │  │  📋 CÓMO FUNCIONA (3 pasos)   │  │
│  │  └─────┴─────┴─────┴─────┘   │  │  │  └───────────────────────────────┘  │
│  └───────────────────────────────┘  │  │                                     │
│                                     │  │  ┌───────────────────────────────┐  │
│  CARACTERÍSTICAS:                   │  │  │  ⭐ POR QUÉ ELEGIR (4 features)│  │
│  • App-like experience              │  │  └───────────────────────────────┘  │
│  • Native feel                      │  │                                     │
│  • Touch optimized                  │  │  ┌───────────────────────────────┐  │
│  • Bottom navigation                │  │  │  📢 CTA ARRENDADORES          │  │
│  • Pull to refresh (futuro)         │  │  └───────────────────────────────┘  │
│                                     │  │                                     │
│  ESTADO: ⏳ En desarrollo           │  │  ESTADO: ✅ Completo                │
└─────────────────────────────────────┘  └─────────────────────────────────────┘
```

## 📊 Matriz de Detección

```
┌──────────────────┬─────────────┬──────────────┬───────────────┬──────────────┐
│                  │ User Agent  │ Screen Width │ Touch Support │   RESULTADO  │
├──────────────────┼─────────────┼──────────────┼───────────────┼──────────────┤
│ iPhone           │     ✅      │      ✅      │      ✅       │   📱 MOBILE  │
│ Android Phone    │     ✅      │      ✅      │      ✅       │   📱 MOBILE  │
│ iPad             │     ✅      │      ❌      │      ✅       │   📱 MOBILE  │
│ Laptop           │     ❌      │      ❌      │      ❌       │   🖥️ DESKTOP │
│ Desktop          │     ❌      │      ❌      │      ❌       │   🖥️ DESKTOP │
│ Laptop Touch     │     ❌      │      ❌      │      ✅       │   🖥️ DESKTOP │
│ Browser Mobile   │     ✅      │      ✅      │      ❌       │   📱 MOBILE  │
│ Tablet Landscape │     ✅      │      ❌      │      ✅       │   📱 MOBILE  │
└──────────────────┴─────────────┴──────────────┴───────────────┴──────────────┘

REGLA: Si 2 o más condiciones = ✅ → MOBILE
       Si menos de 2 condiciones = ✅ → DESKTOP
```

## 🎯 Breakpoints

```
┌─────────────────────────────────────────────────────────────────┐
│                        SCREEN WIDTHS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  0px                    768px                          1920px    │
│   │─────────────────────│──────────────────────────────│         │
│   │                     │                              │         │
│   │    📱 MOBILE        │        🖥️ DESKTOP            │         │
│   │                     │                              │         │
│   │  • Phones           │  • Tablets (landscape)       │         │
│   │  • Small tablets    │  • Laptops                   │         │
│   │                     │  • Desktops                  │         │
│   │                     │  • Large screens             │         │
│   │                     │                              │         │
└───┴─────────────────────┴──────────────────────────────┴─────────┘
```

## ⚡ Performance Timeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    TIMELINE DE CARGA                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  0ms          50ms         100ms        150ms        200ms      │
│   │────────────│────────────│────────────│────────────│         │
│   │            │            │            │            │         │
│   ▼            ▼            ▼            ▼            ▼         │
│  Request    Server       Client       Detection    Render      │
│  Sent       Response     Hydration    Complete     Complete    │
│             (with data)                                         │
│                                                                  │
│  ├─ Server Side ─┤├──────── Client Side ──────────┤            │
│                                                                  │
│  LOADING STATE: ├────────────────────┤                          │
│  (50ms - 150ms)                                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Re-detection en Resize

```
┌─────────────────────────────────────────────────────────────────┐
│                    RESIZE EVENT HANDLING                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Usuario redimensiona ventana:                                  │
│                                                                  │
│  Resize Event → Debounce (150ms) → Re-detect → Update State    │
│       │              │                  │            │          │
│       ▼              ▼                  ▼            ▼          │
│   Triggered      Wait 150ms        Run checks    Re-render     │
│                  (evita spam)      (3 factors)   if changed    │
│                                                                  │
│  EJEMPLO:                                                        │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Desktop (1200px) → Resize → Mobile (600px)           │     │
│  │                                                        │     │
│  │  1. window.innerWidth cambia de 1200 → 600           │     │
│  │  2. Espera 150ms (debounce)                          │     │
│  │  3. Re-ejecuta detección                             │     │
│  │  4. Detecta: width < 768 = true                      │     │
│  │  5. Cambia deviceType: 'desktop' → 'mobile'          │     │
│  │  6. Re-renderiza con HomeClientMobile                │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🎨 Estados Visuales

```
┌─────────────────────────────────────────────────────────────────┐
│                      ESTADOS DEL SISTEMA                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1️⃣ LOADING STATE (isLoading = true)                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │                    ┌──────────┐                         │   │
│  │                    │    H     │  ← Logo animado         │   │
│  │                    └──────────┘     (pulse effect)      │   │
│  │                                                          │   │
│  │              Cargando Habita Perú...                     │   │
│  │                                                          │   │
│  │              ▓▓▓▓▓░░░░░░░░░░░  ← Barra animada          │   │
│  │                                   (sliding effect)       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  2️⃣ MOBILE STATE (isMobile = true)                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │ Habita Perú                               👤      │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                          │   │
│  │  [Contenido móvil optimizado]                           │   │
│  │                                                          │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  🏠     🔍      ❤️      👤                        │  │   │
│  │  │ Inicio  Buscar  Favs   Perfil                     │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  3️⃣ DESKTOP STATE (isDesktop = true)                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │ ✓ Verificadas  ✓ Seguros  ✓ Soporte 24/7        │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                          │   │
│  │  ┌─────────────────────┐  ┌──────────────────────────┐  │   │
│  │  │                     │  │                          │  │   │
│  │  │  Encuentra tu       │  │    [Imagen Hero]         │  │   │
│  │  │  próximo hogar      │  │                          │  │   │
│  │  │                     │  │                          │  │   │
│  │  │  [Búsqueda]         │  │                          │  │   │
│  │  │  [4 Filtros]        │  │                          │  │   │
│  │  │                     │  │                          │  │   │
│  │  └─────────────────────┘  └──────────────────────────┘  │   │
│  │                                                          │   │
│  │  [Grid de propiedades]                                  │   │
│  │  [Cómo funciona]                                        │   │
│  │  [Por qué elegir]                                       │   │
│  │  [CTA Arrendadores]                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Estructura de Archivos

```
habita-peru/
│
├── app/
│   ├── page.tsx                          # 🔵 Server Component
│   │   └─→ Obtiene datos de DB
│   │   └─→ Renderiza <HomeClient />
│   │
│   ├── home-client.tsx                   # 🟢 Router Component (NEW)
│   │   └─→ Usa useDeviceDetection()
│   │   └─→ Muestra loading state
│   │   └─→ Renderiza Mobile o Desktop
│   │
│   ├── home-client-desktop.tsx           # 🟢 Desktop View
│   │   └─→ UI completa desktop
│   │   └─→ Announcement bar
│   │   └─→ Hero + Search + Filters
│   │   └─→ Properties grid
│   │   └─→ Features sections
│   │
│   └── home-client-mobile.tsx            # 🟢 Mobile View
│       └─→ UI móvil (en desarrollo)
│       └─→ Header fijo
│       └─→ Bottom navigation
│       └─→ Touch optimized
│
├── hooks/
│   └── useDeviceDetection.ts             # 🔧 Detection Hook (NEW)
│       └─→ Multi-factor detection
│       └─→ Resize listener
│       └─→ TypeScript types
│
└── docs/
    ├── DEVICE_DETECTION_IMPLEMENTATION.md  # 📚 Documentación
    └── DEVICE_DETECTION_FLOW.md            # 📊 Este archivo
```

## 🎯 Casos de Uso

### Caso 1: Usuario en iPhone
```
iPhone 13 Pro
├─ User Agent: "iPhone" ✅
├─ Width: 390px < 768px ✅
├─ Touch: true ✅
└─ RESULTADO: 3/3 → 📱 MOBILE VIEW
```

### Caso 2: Usuario en Laptop
```
MacBook Pro 16"
├─ User Agent: "Macintosh" ❌
├─ Width: 1728px > 768px ❌
├─ Touch: false ❌
└─ RESULTADO: 0/3 → 🖥️ DESKTOP VIEW
```

### Caso 3: Usuario en iPad
```
iPad Pro 12.9"
├─ User Agent: "iPad" ✅
├─ Width: 1024px > 768px ❌
├─ Touch: true ✅
└─ RESULTADO: 2/3 → 📱 MOBILE VIEW
```

### Caso 4: Usuario en Surface Pro (Tablet Windows)
```
Surface Pro 8
├─ User Agent: "Windows" ❌
├─ Width: 912px > 768px ❌
├─ Touch: true ✅
└─ RESULTADO: 1/3 → 🖥️ DESKTOP VIEW
```

---

**Nota:** Este sistema es flexible y puede ajustarse modificando:
- El breakpoint (actualmente 768px)
- La lógica de scoring (actualmente 2 de 3)
- Los factores de detección (agregar más checks)
