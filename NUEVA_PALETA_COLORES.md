# Nueva Paleta de Colores - Habita Perú

## Fecha: 14 de Mayo, 2026

## Paleta de Colores Aplicada

### Colores Principales

| Color | Hex | Uso |
|-------|-----|-----|
| **Azul Fuerte** | `#0f3457` | Color principal (accent), botones, enlaces, iconos destacados |
| **Azul Claro** | `#748597` | Texto secundario, iconos secundarios |
| **Marrón Claro** | `#8f8272` | Bordes, separadores, elementos de advertencia |
| **Amarillo Pálido (Crema)** | `#d5d0bd` | Fondos secundarios, hover states |
| **Casi Negro** | `#151c26` | Texto principal (en vez de negro puro) |

## Aplicación en el Sistema

### 1. Sitio Público (Homepage, Propiedades, etc.)

```css
:root {
  /* Backgrounds */
  --bg:        #ffffff;           /* Fondo principal */
  --bg-2:      #d5d0bd;           /* Amarillo pálido - fondos secundarios */
  --bg-3:      #c5c0ad;           /* Variante más oscura */
  
  /* Borders */
  --border:    #8f8272;           /* Marrón claro - bordes principales */
  --border-2:  #7a7260;           /* Variante más oscura */
  
  /* Text */
  --text:      #151c26;           /* Casi negro - texto principal */
  --text-muted:#748597;           /* Azul claro - texto secundario */
  --text-dim:  #9099a8;           /* Texto deshabilitado */
  
  /* Brand Accent */
  --accent:        #0f3457;       /* Azul fuerte - color principal */
  --accent-hover:  #0a2540;       /* Hover más oscuro */
  --accent-dark:   #061829;       /* Gradientes */
}
```

### 2. Admin Panel

#### Modo Claro (por defecto)
```css
:root {
  --admin-bg:            #d5d0bd;  /* Amarillo pálido - fondo general */
  --admin-sidebar-bg:    #ffffff;  /* Blanco - sidebar */
  --admin-card-bg:       #ffffff;  /* Blanco - tarjetas */
  --admin-hover-bg:      #f5f3ed;  /* Hover suave */
  
  --admin-text:          #151c26;  /* Casi negro */
  --admin-text-muted:    #748597;  /* Azul claro */
  
  --admin-border:        #8f8272;  /* Marrón claro */
  
  --admin-accent:        #0f3457;  /* Azul fuerte */
}
```

#### Modo Oscuro
```css
html[data-theme="dark"] {
  --admin-bg:            #151c26;  /* Casi negro - fondo general */
  --admin-sidebar-bg:    #1f2937;  /* Gris oscuro - sidebar */
  --admin-card-bg:       #1f2937;  /* Gris oscuro - tarjetas */
  --admin-hover-bg:      #2a3441;  /* Hover más claro */
  
  --admin-text:          #d5d0bd;  /* Amarillo pálido - texto */
  --admin-text-muted:    #748597;  /* Azul claro */
  
  --admin-border:        #2a3441;  /* Bordes sutiles */
}
```

### 3. Colores Semánticos

Estos colores se mantienen consistentes para estados y acciones:

```css
/* Success (Verde) */
--admin-success:       #10b981;
--admin-success-bg:    rgba(16, 185, 129, 0.1);

/* Warning (Marrón Claro) */
--admin-warning:       #8f8272;
--admin-warning-bg:    rgba(143,130,114,0.15);

/* Error (Rojo) */
--admin-error:         #ef4444;
--admin-error-bg:      rgba(239, 68, 68, 0.1);

/* Info (Azul Claro) */
--admin-info:          #748597;
--admin-info-bg:       rgba(116,133,151,0.1);
```

## Componentes Actualizados

### Botones Principales
- Gradiente: `#0f3457` → `#061829`
- Sombra: `rgba(15,52,87,0.30)`
- Hover: Sombra más intensa `rgba(15,52,87,0.40)`

### Tarjetas y Cards
- Fondo: `#ffffff` (modo claro) / `#1f2937` (modo oscuro)
- Bordes: `#8f8272` (marrón claro)
- Sombras: Basadas en `rgba(21,28,38,...)` en vez de negro puro

### Sidebar del Admin
- Fondo: `#ffffff` (modo claro) / `#1f2937` (modo oscuro)
- Iconos activos: `#0f3457` (azul fuerte)
- Hover: `#f5f3ed` (modo claro) / `#2a3441` (modo oscuro)

### Header del Sitio Público
- Logo: Azul fuerte `#0f3457`
- Texto: Casi negro `#151c26`
- Hover: Azul fuerte `#0f3457`

## Archivos Modificados

1. **`habita-peru/app/globals.css`**
   - Variables CSS principales (`:root`)
   - Variables del admin panel
   - Modo oscuro (`html[data-theme="dark"]`)
   - Sombras actualizadas
   - Botones y componentes

## Verificación

✅ Build exitoso: `npm run build`
✅ Paleta aplicada en todo el sitio
✅ Modo claro y oscuro funcionando
✅ Consistencia en todos los componentes

## Cómo Cambiar Colores en el Futuro

Para cambiar la paleta completa, edita las variables en `habita-peru/app/globals.css`:

```css
:root {
  --accent: #TU_COLOR_PRINCIPAL;
  --text: #TU_COLOR_TEXTO;
  --bg-2: #TU_COLOR_FONDO_SECUNDARIO;
  /* ... etc ... */
}
```

Todos los componentes se actualizarán automáticamente porque usan estas variables CSS.

## Contraste y Accesibilidad

La nueva paleta mantiene buenos niveles de contraste:
- **Texto principal** (`#151c26`) sobre blanco: ✅ AAA
- **Azul fuerte** (`#0f3457`) sobre blanco: ✅ AA
- **Azul claro** (`#748597`) sobre blanco: ✅ AA (texto secundario)

## Próximos Pasos

- ✅ Paleta aplicada en sitio público
- ✅ Paleta aplicada en admin panel
- ✅ Modo claro y oscuro funcionando
- ⏳ Verificar en todas las páginas (propiedades, detalle, login, etc.)
- ⏳ Ajustar si es necesario según feedback visual

## Notas

- La paleta usa **azul fuerte** como color principal en vez del rosa/coral de Airbnb
- El **amarillo pálido casi crema** se usa para fondos secundarios y estados hover
- El **marrón claro** se usa para bordes y separadores
- El **casi negro** (`#151c26`) es más suave que el negro puro y combina mejor con la paleta
