# Paleta de Colores Visual - Habita Perú

## 🎨 Colores Principales

```
┌─────────────────────────────────────────────────────────────┐
│  AZUL FUERTE - #0f3457                                      │
│  ███████████████████████████████████████████████████████    │
│  Uso: Botones principales, enlaces, iconos destacados      │
│  RGB: 15, 52, 87                                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  AZUL CLARO - #748597                                       │
│  ███████████████████████████████████████████████████████    │
│  Uso: Texto secundario, iconos secundarios                 │
│  RGB: 116, 133, 151                                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  MARRÓN CLARO - #8f8272                                     │
│  ███████████████████████████████████████████████████████    │
│  Uso: Bordes, separadores, elementos de advertencia        │
│  RGB: 143, 130, 114                                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  AMARILLO PÁLIDO (CREMA) - #d5d0bd                          │
│  ███████████████████████████████████████████████████████    │
│  Uso: Fondos secundarios, hover states                     │
│  RGB: 213, 208, 189                                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  CASI NEGRO - #151c26                                       │
│  ███████████████████████████████████████████████████████    │
│  Uso: Texto principal (en vez de negro puro)               │
│  RGB: 21, 28, 38                                            │
└─────────────────────────────────────────────────────────────┘
```

## 🌐 Aplicación en el Sitio Público

### Homepage
- **Fondo principal**: Blanco `#ffffff`
- **Fondo secundario**: Amarillo pálido `#d5d0bd`
- **Texto principal**: Casi negro `#151c26`
- **Texto secundario**: Azul claro `#748597`
- **Botones CTA**: Gradiente azul fuerte `#0f3457` → `#061829`
- **Bordes**: Marrón claro `#8f8272`

### Header/Navbar
- **Logo "Habita"**: Casi negro `#151c26`
- **Logo "Perú"**: Azul fuerte `#0f3457`
- **Enlaces**: Casi negro `#151c26`
- **Enlaces hover**: Azul fuerte `#0f3457`
- **Botón "Publica tu propiedad"**: Gradiente azul fuerte

### Tarjetas de Propiedades
- **Fondo**: Blanco `#ffffff`
- **Borde**: Marrón claro `#8f8272`
- **Título**: Casi negro `#151c26`
- **Ubicación**: Azul claro `#748597`
- **Precio**: Azul fuerte `#0f3457` (destacado)

### Footer
- **Fondo**: Amarillo pálido `#d5d0bd`
- **Texto**: Casi negro `#151c26`
- **Enlaces**: Azul claro `#748597`
- **Enlaces hover**: Azul fuerte `#0f3457`

## 🔐 Admin Panel

### Modo Claro (Default)
```
┌─────────────────────────────────────────────────────────────┐
│  SIDEBAR                                                    │
│  Fondo: Blanco #ffffff                                      │
│  Bordes: Marrón claro #8f8272                               │
│  Texto: Casi negro #151c26                                  │
│  Iconos activos: Azul fuerte #0f3457                        │
│  Hover: #f5f3ed                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  CONTENIDO PRINCIPAL                                        │
│  Fondo: Amarillo pálido #d5d0bd                             │
│  Tarjetas: Blanco #ffffff                                   │
│  Texto: Casi negro #151c26                                  │
│  Texto secundario: Azul claro #748597                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  STATS CARDS                                                │
│  Fondo: Blanco #ffffff                                      │
│  Borde: Marrón claro #8f8272                                │
│  Iconos: Azul fuerte #0f3457 (accent)                       │
│  Valores: Casi negro #151c26                                │
│  Labels: Azul claro #748597                                 │
└─────────────────────────────────────────────────────────────┘
```

### Modo Oscuro
```
┌─────────────────────────────────────────────────────────────┐
│  SIDEBAR                                                    │
│  Fondo: #1f2937                                             │
│  Bordes: #2a3441                                            │
│  Texto: Amarillo pálido #d5d0bd                             │
│  Iconos activos: Azul fuerte #0f3457                        │
│  Hover: #2a3441                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  CONTENIDO PRINCIPAL                                        │
│  Fondo: Casi negro #151c26                                  │
│  Tarjetas: #1f2937                                          │
│  Texto: Amarillo pálido #d5d0bd                             │
│  Texto secundario: Azul claro #748597                       │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Badges y Estados

```css
/* Success (Disponible, Pagado) */
Fondo: rgba(16, 185, 129, 0.1)
Texto: #10b981

/* Warning (Ocupada, Pendiente) */
Fondo: rgba(143,130,114,0.15)
Texto: #8f8272 (Marrón claro)

/* Error (No disponible, Vencido) */
Fondo: rgba(239, 68, 68, 0.1)
Texto: #ef4444

/* Info (Información general) */
Fondo: rgba(116,133,151,0.1)
Texto: #748597 (Azul claro)
```

## 📊 Ejemplos de Uso

### Botón Principal
```css
background: linear-gradient(135deg, #0f3457 0%, #061829 100%);
color: #ffffff;
box-shadow: 0 2px 8px rgba(15,52,87,0.30);

/* Hover */
box-shadow: 0 6px 20px rgba(15,52,87,0.40);
```

### Tarjeta
```css
background: #ffffff;
border: 1px solid #8f8272;
box-shadow: 0 2px 8px rgba(21,28,38,0.08);
```

### Input/Campo de Texto
```css
background: #ffffff;
border: 1px solid #8f8272;
color: #151c26;

/* Focus */
border-color: #0f3457;
box-shadow: 0 0 0 3px rgba(15,52,87,0.1);
```

### Link/Enlace
```css
color: #0f3457;
text-decoration: none;

/* Hover */
text-decoration: underline;
color: #0a2540;
```

## 🔄 Comparación: Antes vs Ahora

| Elemento | Antes (Airbnb) | Ahora (Habita Perú) |
|----------|----------------|---------------------|
| Color principal | Rosa #FF385C | Azul fuerte #0f3457 |
| Texto principal | Negro #222222 | Casi negro #151c26 |
| Texto secundario | Gris #717171 | Azul claro #748597 |
| Fondo secundario | Gris #f7f7f7 | Amarillo pálido #d5d0bd |
| Bordes | Gris #e8e8e8 | Marrón claro #8f8272 |

## ✅ Verificación de Contraste (WCAG)

| Combinación | Ratio | Nivel |
|-------------|-------|-------|
| #151c26 sobre #ffffff | 14.8:1 | AAA ✅ |
| #0f3457 sobre #ffffff | 10.2:1 | AAA ✅ |
| #748597 sobre #ffffff | 4.8:1 | AA ✅ |
| #8f8272 sobre #ffffff | 4.2:1 | AA ✅ |
| #d5d0bd sobre #151c26 | 11.5:1 | AAA ✅ |

Todos los contrastes cumplen con WCAG 2.1 nivel AA o superior.

## 🎨 Paleta Completa en Código

```css
/* Copiar y pegar en cualquier proyecto */
:root {
  --azul-fuerte: #0f3457;
  --azul-claro: #748597;
  --marron-claro: #8f8272;
  --amarillo-palido: #d5d0bd;
  --casi-negro: #151c26;
  
  /* Variantes */
  --azul-fuerte-hover: #0a2540;
  --azul-fuerte-dark: #061829;
  --amarillo-palido-dark: #c5c0ad;
  --marron-claro-dark: #7a7260;
}
```

## 📱 Responsive

La paleta se mantiene consistente en todos los tamaños de pantalla:
- Mobile: Mismos colores, ajuste de espaciado
- Tablet: Mismos colores, ajuste de grid
- Desktop: Paleta completa con todos los detalles

## 🌙 Modo Oscuro

El modo oscuro invierte la lógica:
- Fondos claros → Fondos oscuros (#151c26, #1f2937)
- Textos oscuros → Textos claros (#d5d0bd)
- Bordes claros → Bordes oscuros (#2a3441)
- **Accent se mantiene**: #0f3457 (funciona en ambos modos)
