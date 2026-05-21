# 🏗️ Arquitectura del Proyecto - Habita Perú

## 📐 Principios de Diseño

Este proyecto sigue los principios **SOLID** y **Clean Architecture** para garantizar:

- ✅ **Mantenibilidad**: Código fácil de entender y modificar
- ✅ **Escalabilidad**: Preparado para crecer sin refactorización masiva
- ✅ **Testabilidad**: Componentes desacoplados y testeables
- ✅ **Separación de responsabilidades**: Cada capa tiene un propósito claro

## 🎯 Principios SOLID Aplicados

### 1. Single Responsibility Principle (SRP)
Cada módulo tiene una única responsabilidad:

```
✅ /lib/db.ts          → Solo gestión de Prisma Client
✅ /lib/auth.ts        → Solo configuración de autenticación
✅ /lib/validations.ts → Solo schemas de validación
✅ /components/ui/     → Solo componentes visuales reutilizables
```

### 2. Open/Closed Principle (OCP)
Componentes abiertos a extensión, cerrados a modificación:

```typescript
// Button component extensible sin modificar el core
<Button variant="primary" size="lg" className="custom-class">
  Click me
</Button>
```

### 3. Liskov Substitution Principle (LSP)
Los componentes derivados son intercambiables:

```typescript
// Todos los inputs son intercambiables
<Input type="text" />
<Input type="email" />
<Input type="password" />
```

### 4. Interface Segregation Principle (ISP)
Interfaces específicas en lugar de generales:

```typescript
// Schemas específicos por entidad
export const propertySchema = z.object({ ... })
export const contractSchema = z.object({ ... })
export const paymentSchema = z.object({ ... })
```

### 5. Dependency Inversion Principle (DIP)
Dependencias de abstracciones, no de implementaciones:

```typescript
// Prisma Client como abstracción de la DB
import { prisma } from '@/lib/db'
// No importamos directamente PostgreSQL
```

## 🏛️ Arquitectura en Capas

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Components, Pages, UI)                │
│  - React Server Components              │
│  - Client Components                    │
│  - Tailwind CSS                         │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Application Layer               │
│  (Business Logic, Use Cases)            │
│  - API Routes                           │
│  - Server Actions                       │
│  - Validations (Zod)                    │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Domain Layer                    │
│  (Entities, Business Rules)             │
│  - Prisma Models                        │
│  - TypeScript Types                     │
│  - Enums                                │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Infrastructure Layer            │
│  (Database, External Services)          │
│  - PostgreSQL (Neon)                    │
│  - Prisma ORM                           │
│  - NextAuth.js                          │
└─────────────────────────────────────────┘
```

## 📂 Estructura de Carpetas Detallada

### `/app` - Next.js App Router

```
app/
├── (auth)/                    # Grupo de rutas públicas
│   ├── login/
│   │   └── page.tsx          # Página de login
│   └── register/
│       └── page.tsx          # Página de registro
│
├── (dashboard)/               # Grupo de rutas protegidas
│   ├── layout.tsx            # Layout con sidebar
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard principal
│   ├── gestion/
│   │   └── page.tsx          # Gestión de alquileres
│   ├── perfil/
│   │   └── page.tsx          # Perfil de usuario
│   ├── propiedades/
│   │   ├── page.tsx          # Listado de propiedades
│   │   └── [id]/
│   │       └── page.tsx      # Detalle de propiedad
│   └── publicar/
│       └── page.tsx          # Publicar propiedad
│
├── api/                       # API Routes
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts      # NextAuth handler
│   ├── properties/
│   │   ├── route.ts          # GET, POST /api/properties
│   │   └── [id]/
│   │       └── route.ts      # GET, PUT, DELETE /api/properties/:id
│   ├── contracts/
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── route.ts
│   └── payments/
│       ├── route.ts
│       └── [id]/
│           └── route.ts
│
├── layout.tsx                 # Root layout
├── page.tsx                   # Homepage
└── globals.css                # Estilos globales
```

### `/components` - Componentes React

```
components/
├── ui/                        # Componentes base (Design System)
│   ├── button.tsx            # Botón reutilizable
│   ├── input.tsx             # Input reutilizable
│   ├── card.tsx              # Card container
│   ├── badge.tsx             # Badge/Tag
│   ├── modal.tsx             # Modal dialog
│   └── ...
│
├── features/                  # Componentes por feature
│   ├── properties/
│   │   ├── property-card.tsx
│   │   ├── property-filters.tsx
│   │   └── property-form.tsx
│   ├── contracts/
│   │   ├── contract-list.tsx
│   │   └── contract-detail.tsx
│   └── payments/
│       ├── payment-semaforo.tsx
│       └── payment-history.tsx
│
├── header.tsx                 # Header global
├── footer.tsx                 # Footer global
└── providers.tsx              # Context providers
```

### `/lib` - Utilidades y Configuraciones

```
lib/
├── db.ts                      # Prisma Client singleton
├── auth.ts                    # NextAuth configuration
├── validations.ts             # Zod schemas
├── utils.ts                   # Funciones helper
└── constants.ts               # Constantes globales
```

### `/prisma` - Base de Datos

```
prisma/
├── schema.prisma              # Modelo de datos
├── seed.ts                    # Datos de prueba
└── migrations/                # Migraciones (si usas migrate)
```

## 🔄 Flujo de Datos

### 1. Lectura de Datos (Server Component)

```typescript
// app/propiedades/page.tsx
import { prisma } from '@/lib/db'

export default async function PropertiesPage() {
  // Fetch directo en Server Component
  const properties = await prisma.property.findMany({
    where: { status: 'DISPONIBLE' },
    include: { owner: true }
  })

  return <PropertyList properties={properties} />
}
```

### 2. Mutación de Datos (API Route)

```typescript
// app/api/properties/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { propertySchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  // 1. Validar datos
  const body = await req.json()
  const validated = propertySchema.parse(body)

  // 2. Verificar autenticación
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 3. Crear en DB
  const property = await prisma.property.create({
    data: { ...validated, ownerId: session.user.id }
  })

  // 4. Retornar respuesta
  return NextResponse.json(property, { status: 201 })
}
```

### 3. Formularios (Client Component)

```typescript
// components/features/properties/property-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { propertySchema } from '@/lib/validations'

export function PropertyForm() {
  const form = useForm({
    resolver: zodResolver(propertySchema)
  })

  const onSubmit = async (data) => {
    const res = await fetch('/api/properties', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    // Handle response
  }

  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>
}
```

## 🔐 Seguridad

### Autenticación

```typescript
// lib/auth.ts
export const { auth, signIn, signOut } = NextAuth({
  providers: [Credentials({ ... })],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) token.role = user.role
      return token
    },
    session: ({ session, token }) => {
      session.user.role = token.role
      return session
    }
  }
})
```

### Autorización (Middleware)

```typescript
// middleware.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const role = req.auth?.user?.role

  // Proteger rutas de dashboard
  if (pathname.startsWith('/dashboard') && !req.auth) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Proteger rutas de landlord
  if (pathname.startsWith('/publicar') && role !== 'LANDLORD') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
})
```

### Validación de Datos

```typescript
// Siempre validar en el servidor
import { propertySchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = propertySchema.parse(body) // Lanza error si inválido
    // Procesar datos validados
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 })
    }
  }
}
```

## 🎨 Patrones de Diseño Utilizados

### 1. Singleton Pattern
```typescript
// lib/db.ts - Un solo cliente de Prisma
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
```

### 2. Factory Pattern
```typescript
// components/ui/button.tsx - Factory de variantes
const variants = {
  primary: "bg-red-600 text-white",
  ghost: "bg-transparent border",
  danger: "bg-red-600 text-white"
}
```

### 3. Repository Pattern
```typescript
// services/property-service.ts
export class PropertyService {
  async findAll(filters) {
    return prisma.property.findMany({ where: filters })
  }
  
  async findById(id) {
    return prisma.property.findUnique({ where: { id } })
  }
  
  async create(data) {
    return prisma.property.create({ data })
  }
}
```

### 4. Composition Pattern
```typescript
// Componentes compuestos
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>Contenido</CardContent>
</Card>
```

## 📊 Modelo de Datos (ERD Simplificado)

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│    User     │───────│   Property   │───────│  Contract   │
│             │ 1:N   │              │ 1:N   │             │
│ - id        │       │ - id         │       │ - id        │
│ - email     │       │ - title      │       │ - startDate │
│ - role      │       │ - price      │       │ - endDate   │
│ - firstName │       │ - ownerId    │       │ - status    │
└─────────────┘       └──────────────┘       └─────────────┘
       │                                             │
       │ 1:1                                         │ 1:N
       │                                             │
┌─────────────┐                              ┌─────────────┐
│     KYC     │                              │   Payment   │
│             │                              │             │
│ - userId    │                              │ - contractId│
│ - status    │                              │ - amount    │
│ - verified  │                              │ - status    │
└─────────────┘                              └─────────────┘
```

## 🚀 Performance

### Server Components por Defecto
- Renderizado en servidor
- Menos JavaScript al cliente
- Mejor SEO

### Optimización de Imágenes
```typescript
import Image from 'next/image'

<Image
  src="/property.jpg"
  alt="Property"
  width={800}
  height={600}
  loading="lazy"
/>
```

### Caching
```typescript
// Revalidar cada 60 segundos
export const revalidate = 60

export default async function Page() {
  const data = await fetch('...', { next: { revalidate: 60 } })
}
```

## 📝 Convenciones de Código

### Nombres de Archivos
- Componentes: `kebab-case.tsx` (property-card.tsx)
- Páginas: `page.tsx`, `layout.tsx`
- API Routes: `route.ts`
- Utilidades: `kebab-case.ts` (auth-utils.ts)

### Nombres de Componentes
- PascalCase: `PropertyCard`, `PaymentSemaforo`

### Nombres de Funciones
- camelCase: `getUserById`, `createProperty`

### Constantes
- UPPER_SNAKE_CASE: `MAX_FILE_SIZE`, `DEFAULT_PAGE_SIZE`

## 🧪 Testing (Futuro)

```
tests/
├── unit/
│   ├── components/
│   └── lib/
├── integration/
│   └── api/
└── e2e/
    └── flows/
```

## 📚 Referencias

- [Next.js Best Practices](https://nextjs.org/docs/app/building-your-application)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

**Última actualización**: Mayo 2026
