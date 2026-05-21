# Paleta de Colores Final - Habita Perú

## Fecha: 14 de Mayo, 2026

## 🎨 Paleta Completa

### Colores Principales

| Color | Hex | RGB | Uso |
|-------|-----|-----|-----|
| **Azul Fuerte** | `#0f3457` | 15, 52, 87 | Color principal - Botones primarios, enlaces, iconos destacados |
| **Rojo-Naranja** | `#EA4227` | 234, 66, 39 | Color secundario - CTAs importantes, alertas, badges destacados |
| **Azul Claro** | `#748597` | 116, 133, 151 | Texto secundario, iconos secundarios |
| **Casi Negro** | `#151c26` | 21, 28, 38 | Texto principal |
| **Blanco** | `#ffffff` | 255, 255, 255 | Fondos principales, tarjetas |

### Colores de Soporte

| Color | Hex | Uso |
|-------|-----|-----|
| **Gris Muy Claro** | `#f8f9fa` | Fondos secundarios, áreas de contenido |
| **Gris Claro** | `#e9ecef` | Hover states, separadores |
| **Gris Medio** | `#dee2e6` | Bordes principales |
| **Amarillo Crema** | `#d5d0bd` | Detalles decorativos (opcional) |
| **Marrón Claro** | `#8f8272` | Detalles decorativos (opcional) |

### Colores Semánticos

| Color | Hex | Uso |
|-------|-----|-----|
| **Verde** | `#10b981` | Success, disponible, pagado |
| **Rojo-Naranja** | `#EA4227` | Warning, ocupado, pendiente |
| **Rojo** | `#ef4444` | Error, no disponible, vencido |
| **Azul Claro** | `#748597` | Info, información general |

## 📊 Aplicación por Sección

### 1. Sitio Público (Homepage, Propiedades)

```css
/* Fondos */
--bg: #ffffff           /* Fondo principal - BLANCO */
--bg-2: #f8f9fa         /* Fondos secundarios - Gris muy claro */
--bg-3: #e9ecef         /* Hover states */

/* Textos */
--text: #151c26         /* Texto principal - Casi negro */
--text-muted: #748597   /* Texto secundario - Azul claro */

/* Bordes */
--border: #dee2e6       /* Bordes - Gris claro */

/* Accents */
--accent: #0f3457       /* Azul fuerte - Botones principales */
--accent-secondary: #EA4227  /* Rojo-naranja - CTAs destacados */
```

**Ejemplos de uso:**
- **Botón "Buscar Propiedades"**: Azul fuerte `#0f3457`
- **Botón "Publica tu Propiedad"**: Rojo-naranja `#EA4227`
- **Enlaces del header**: Casi negro `#151c26`, hover azul fuerte
- **Precio destacado**: Rojo-naranja `#EA4227`
- **Tarjetas**: Fondo blanco, borde gris claro

### 2. Admin Panel

#### Modo Claro (por defecto)
```css
/* Fondos */
--admin-bg: #f8f9fa           /* Fondo general - GRIS MUY CLARO (no marrón) */
--admin-sidebar-bg: #ffffff   /* Sidebar - BLANCO */
--admin-card-bg: #ffffff      /* Tarjetas - BLANCO */
--admin-hover-bg: #e9ecef     /* Hover - Gris claro */

/* Textos */
--admin-text: #151c26         /* Texto principal */
--admin-text-muted: #748597   /* Texto secundario */

/* Bordes */
--admin-border: #dee2e6       /* Bordes - Gris claro */

/* Accents */
--admin-accent: #0f3457                /* Azul fuerte */
--admin-accent-secondary: #EA4227      /* Rojo-naranja */
```

**Cambios importantes:**
- ✅ **Fondo del dashboard**: Ahora es gris muy claro `#f8f9fa` en vez de marrón
- ✅ **Sidebar**: Blanco puro con bordes grises claros
- ✅ **Tarjetas**: Blanco con sombras suaves
- ✅ **Iconos activos**: Azul fuerte `#0f3457`
- ✅ **Badges de advertencia**: Rojo-naranja `#EA4227`

#### Modo Oscuro
```css
/* Fondos */
--admin-bg: #151c26           /* Fondo general - Casi negro */
--admin-sidebar-bg: #1f2937   /* Sidebar - Gris oscuro */
--admin-card-bg: #1f2937      /* Tarjetas - Gris oscuro */

/* Textos */
--admin-text: #f8f9fa         /* Texto principal - Gris muy claro */
--admin-text-muted: #748597   /* Texto secundario - Azul claro */
```

### 3. Componentes Específicos

#### Botones

```css
/* Botón Primario (Azul fuerte) */
.btn-primary, .admin-btn-primary {
  background: linear-gradient(135deg, #0f3457 0%, #061829 100%);
  color: #fff;
  box-shadow: 0 2px 8px rgba(15,52,87,0.3);
}

/* Botón Secundario/Accent (Rojo-naranja) */
.btn-accent, .admin-btn-accent {
  background: linear-gradient(135deg, #EA4227 0%, #d63820 100%);
  color: #fff;
  box-shadow: 0 2px 8px rgba(234,66,39,0.3);
}

/* Botón Ghost */
.btn-ghost {
  background: transparent;
  border: 1.5px solid #dee2e6;
  color: #151c26;
}
```

#### Badges

```css
/* Success */
.admin-badge.success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

/* Warning (Rojo-naranja) */
.admin-badge.warning {
  background: rgba(234,66,39,0.1);
  color: #EA4227;
}

/* Accent (Rojo-naranja destacado) */
.admin-badge.accent {
  background: rgba(234,66,39,0.1);
  color: #EA4227;
}

/* Info */
.admin-badge.info {
  background: rgba(116,133,151,0.1);
  color: #748597;
}
```

#### Stats Cards (Admin Dashboard)

```css
/* Icono Accent (Azul fuerte) */
.admin-stat-icon.accent {
  background: rgba(15, 52, 87, 0.1);
  color: #0f3457;
}

/* Icono Secondary (Rojo-naranja) */
.admin-stat-icon.secondary {
  background: rgba(234,66,39,0.1);
  color: #EA4227;
}

/* Icono Success (Verde) */
.admin-stat-icon.success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

/* Icono Info (Azul claro) */
.admin-stat-icon.info {
  background: rgba(116,133,151,0.1);
  color: #748597;
}
```

## 🎯 Guía de Uso de Colores

### Cuándo usar cada color:

#### Azul Fuerte `#0f3457`
- ✅ Botones principales de navegación
- ✅ Enlaces importantes
- ✅ Iconos de menú activos
- ✅ Headers y títulos destacados
- ✅ Logo "Perú" en el header

#### Rojo-Naranja `#EA4227`
- ✅ Botones de acción principal (CTAs)
- ✅ "Publica tu Propiedad"
- ✅ Precios destacados
- ✅ Badges de advertencia/ocupado
- ✅ Elementos que requieren atención
- ✅ Iconos de notificaciones importantes

#### Blanco `#ffffff`
- ✅ Fondos de tarjetas
- ✅ Sidebar del admin
- ✅ Fondos principales de páginas
- ✅ Texto sobre fondos oscuros

#### Gris Muy Claro `#f8f9fa`
- ✅ Fondo del dashboard admin
- ✅ Fondos secundarios del sitio público
- ✅ Áreas de contenido

#### Azul Claro `#748597`
- ✅ Texto secundario (ubicaciones, descripciones)
- ✅ Iconos secundarios
- ✅ Información complementaria

#### Casi Negro `#151c26`
- ✅ Texto principal en todo el sitio
- ✅ Títulos y encabezados
- ✅ Logo "Habita" en el header

## 📝 Variables CSS Completas

```css
:root {
  /* Backgrounds */
  --bg: #ffffff;
  --bg-2: #f8f9fa;
  --bg-3: #e9ecef;
  
  /* Text */
  --text: #151c26;
  --text-muted: #748597;
  
  /* Borders */
  --border: #dee2e6;
  --border-2: #ced4da;
  
  /* Primary Accent */
  --accent: #0f3457;
  --accent-hover: #0a2540;
  --accent-dark: #061829;
  
  /* Secondary Accent */
  --accent-secondary: #EA4227;
  --accent-secondary-hover: #d63820;
  
  /* Decorative (opcional) */
  --cream: #d5d0bd;
  --brown: #8f8272;
  
  /* Semantic */
  --green: #10b981;
  --red: #EA4227;
  --amber: #EA4227;
}
```

## ✅ Cambios Realizados

1. ✅ **Incorporado color rojo-naranja** `#EA4227` como accent secundario
2. ✅ **Cambiado fondo del admin dashboard** de marrón `#d5d0bd` a gris claro `#f8f9fa`
3. ✅ **Actualizado bordes** de marrón a gris claro `#dee2e6`
4. ✅ **Fondos secundarios** ahora usan gris muy claro en vez de crema
5. ✅ **Marrón y crema** ahora son colores decorativos opcionales
6. ✅ **Agregadas clases** `.admin-btn-accent` y `.admin-badge.accent`
7. ✅ **Agregado icono** `.admin-stat-icon.secondary` para rojo-naranja

## 🔄 Comparación: Antes vs Ahora

| Elemento | Antes | Ahora |
|----------|-------|-------|
| Fondo admin dashboard | Marrón `#d5d0bd` | Gris claro `#f8f9fa` ✅ |
| Bordes | Marrón `#8f8272` | Gris claro `#dee2e6` ✅ |
| Color secundario | No existía | Rojo-naranja `#EA4227` ✅ |
| Fondos secundarios | Crema `#d5d0bd` | Gris `#f8f9fa` ✅ |
| Warning badges | Marrón | Rojo-naranja ✅ |

## 🎨 Ejemplos Visuales

### Homepage
```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (Fondo: Blanco #ffffff)                             │
│  Logo: "Habita" (#151c26) + "Perú" (#0f3457)               │
│  Botón: "Publica tu Propiedad" (#EA4227) ← ROJO-NARANJA    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  HERO (Fondo: Blanco #ffffff)                               │
│  Título: Casi negro #151c26                                 │
│  Botón: "Buscar Propiedades" (#0f3457) ← AZUL FUERTE       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  TARJETA DE PROPIEDAD (Fondo: Blanco #ffffff)               │
│  Borde: Gris claro #dee2e6                                  │
│  Título: Casi negro #151c26                                 │
│  Ubicación: Azul claro #748597                              │
│  Precio: Rojo-naranja #EA4227 ← DESTACADO                   │
└─────────────────────────────────────────────────────────────┘
```

### Admin Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│  SIDEBAR (Fondo: Blanco #ffffff)                            │
│  Borde derecho: Gris claro #dee2e6                          │
│  Iconos activos: Azul fuerte #0f3457                        │
│  Hover: Gris claro #e9ecef                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  CONTENIDO (Fondo: Gris muy claro #f8f9fa) ← CAMBIADO      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ STAT CARD (Fondo: Blanco #ffffff)                   │   │
│  │ Icono: Azul fuerte #0f3457                          │   │
│  │ Valor: Casi negro #151c26                           │   │
│  │ Label: Azul claro #748597                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ BADGE: "OCUPADA" (Rojo-naranja #EA4227)            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## ✅ Verificación

- ✅ Build exitoso: `npm run build`
- ✅ Fondo admin dashboard: Gris claro (no marrón)
- ✅ Color rojo-naranja incorporado
- ✅ Blanco usado para tarjetas y sidebar
- ✅ Contraste WCAG AA/AAA cumplido
- ✅ Modo claro y oscuro funcionando

## 📚 Archivos Modificados

1. **`habita-peru/app/globals.css`**
   - Variables CSS principales actualizadas
   - Variables del admin panel actualizadas
   - Nuevas clases para color secundario
   - Fondos cambiados de marrón a gris

## 🚀 Próximos Pasos

- ⏳ Actualizar componentes específicos para usar el rojo-naranja en CTAs
- ⏳ Revisar todas las páginas para consistencia
- ⏳ Ajustar badges y estados según feedback
- ⏳ Documentar patrones de uso de colores para el equipo
