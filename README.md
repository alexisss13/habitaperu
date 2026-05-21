# 🏠 Habita Perú - Plataforma de Arrendamiento

Plataforma completa de gestión de arrendamiento desarrollada con Next.js 14, TypeScript, Prisma y PostgreSQL.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Base de Datos](#base-de-datos)
- [Desarrollo](#desarrollo)
- [Roles y Permisos](#roles-y-permisos)
- [API Routes](#api-routes)
- [Deployment](#deployment)

## ✨ Características

### Para Arrendadores (Landlords)
- ✅ Publicación de propiedades con imágenes
- ✅ Dashboard con métricas en tiempo real
- ✅ Gestión de contratos digitales
- ✅ Semáforo de pagos (Pagado/Pendiente/En Proceso)
- ✅ Verificación KYC de inquilinos
- ✅ Sistema de notificaciones
- ✅ Perfil personalizable

### Para Inquilinos (Tenants)
- ✅ Búsqueda avanzada de propiedades
- ✅ Filtros por tipo, precio, distrito, amenidades
- ✅ Sistema de favoritos
- ✅ Solicitud de visitas
- ✅ Firma digital de contratos
- ✅ Historial de pagos

### Funcionalidades Generales
- ✅ Autenticación con NextAuth.js v5
- ✅ Roles: ADMIN, LANDLORD, TENANT
- ✅ Contratos con validez legal
- ✅ Sistema de reseñas y calificaciones
- ✅ Matching inteligente inquilino-propiedad
- ✅ Responsive design (mobile-first)

## 🛠 Stack Tecnológico

### Frontend
- **Next.js 14+** - React Framework con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de schemas

### Backend
- **Next.js API Routes** - Endpoints RESTful
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Base de datos relacional (Neon)
- **NextAuth.js v5** - Autenticación
- **bcryptjs** - Hash de contraseñas

### DevOps
- **Vercel** - Deployment (recomendado)
- **Prisma Studio** - Database GUI
- **ESLint** - Linting

## 📁 Estructura del Proyecto

```
habita-peru/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Rutas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # Rutas protegidas
│   │   ├── dashboard/
│   │   ├── gestion/
│   │   ├── perfil/
│   │   ├── propiedades/
│   │   └── publicar/
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   ├── properties/
│   │   ├── contracts/
│   │   └── payments/
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # Componentes React
│   ├── ui/                       # Componentes base
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── features/                 # Componentes por feature
│   ├── header.tsx
│   └── footer.tsx
├── lib/                          # Utilidades
│   ├── db.ts                     # Prisma client
│   ├── auth.ts                   # NextAuth config
│   └── validations.ts            # Zod schemas
├── prisma/
│   ├── schema.prisma             # Modelo de datos
│   └── seed.ts                   # Datos de prueba
├── public/                       # Assets estáticos
├── .env                          # Variables de entorno
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+ (recomendado 20+)
- npm o yarn
- PostgreSQL (local o Neon)

### Pasos

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd habita-peru
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
NEXTAUTH_SECRET="tu-secret-key-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Sincronizar base de datos**
```bash
npm run db:push
```

5. **Poblar con datos de prueba**
```bash
npm run db:seed
```

6. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | URL de conexión PostgreSQL | `postgresql://...` |
| `NEXTAUTH_SECRET` | Secret para JWT | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL de la aplicación | `http://localhost:3000` |

### Base de Datos (Neon)

La aplicación está configurada para usar **Neon PostgreSQL**. La URL de conexión ya está incluida en el `.env`:

```
postgresql://neondb_owner:npg_7y4muFjzOZxH@ep-orange-unit-ahdz7wig-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## 🗄️ Base de Datos

### Modelo de Datos

#### User
- Usuarios del sistema (Admin, Landlord, Tenant)
- Autenticación y perfil
- Relaciones: propiedades, contratos, pagos, KYC

#### Property
- Propiedades publicadas
- Tipos: Habitación, Departamento, Casa, Oficina, Local
- Estados: Disponible, Ocupada, Mantenimiento

#### Contract
- Contratos de arrendamiento
- Estados: Activo, Vencido, Cancelado
- Firma digital de ambas partes

#### Payment
- Pagos mensuales
- Estados: Pagado, Pendiente, En Proceso, Vencido
- Semáforo de pagos

#### KYCVerification
- Verificación de identidad
- Pasos: DNI, Biometría, Antecedentes
- Estados: Pendiente, En Revisión, Aprobado, Rechazado

#### Review
- Reseñas y calificaciones
- Rating 1-5 estrellas

#### Notification
- Sistema de notificaciones
- Tipos: payment, contract, kyc, property

### Comandos Prisma

```bash
# Sincronizar schema con DB
npm run db:push

# Generar cliente Prisma
npx prisma generate

# Abrir Prisma Studio (GUI)
npm run db:studio

# Crear migración
npx prisma migrate dev --name nombre_migracion

# Ejecutar seed
npm run db:seed
```

## 👥 Roles y Permisos

### ADMIN
- Acceso total al sistema
- Gestión de usuarios
- Moderación de contenido
- Estadísticas globales

### LANDLORD (Arrendador)
- Publicar propiedades
- Gestionar contratos
- Ver pagos recibidos
- Dashboard de métricas
- Verificar inquilinos (KYC)

### TENANT (Inquilino)
- Buscar propiedades
- Solicitar visitas
- Firmar contratos
- Realizar pagos
- Dejar reseñas

## 🔐 Autenticación

### Credenciales de Prueba

Después de ejecutar `npm run db:seed`:

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@habitaperu.pe | password123 |
| Landlord | juan.diaz@email.com | password123 |
| Tenant | carlos.ramirez@email.com | password123 |

### Flujo de Autenticación

1. Usuario ingresa email/password
2. NextAuth valida credenciales con Prisma
3. Se genera JWT con rol del usuario
4. Session se almacena en cookie httpOnly
5. Middleware protege rutas según rol

## 📡 API Routes

### Autenticación
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout
- `POST /api/auth/signup` - Registro

### Propiedades
- `GET /api/properties` - Listar propiedades
- `GET /api/properties/:id` - Detalle de propiedad
- `POST /api/properties` - Crear propiedad (LANDLORD)
- `PUT /api/properties/:id` - Actualizar propiedad (LANDLORD)
- `DELETE /api/properties/:id` - Eliminar propiedad (LANDLORD)

### Contratos
- `GET /api/contracts` - Listar contratos del usuario
- `POST /api/contracts` - Crear contrato (LANDLORD)
- `PUT /api/contracts/:id/sign` - Firmar contrato

### Pagos
- `GET /api/payments` - Listar pagos
- `POST /api/payments` - Registrar pago
- `PUT /api/payments/:id` - Actualizar estado de pago

## 🚀 Deployment

### Vercel (Recomendado)

1. **Push a GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Conectar con Vercel**
- Ir a [vercel.com](https://vercel.com)
- Importar repositorio
- Configurar variables de entorno
- Deploy automático

3. **Variables de Entorno en Vercel**
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://tu-dominio.vercel.app
```

### Build Local

```bash
npm run build
npm start
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Desarrollo (localhost:3000)
npm run build        # Build de producción
npm start            # Servidor de producción
npm run lint         # Linting con ESLint
npm run db:push      # Sincronizar schema con DB
npm run db:seed      # Poblar DB con datos de prueba
npm run db:studio    # Abrir Prisma Studio
```

## 🎨 Personalización

### Colores (Tailwind)

El color principal es `#FF385C` (rojo Habita). Para cambiar:

```js
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: '#FF385C',
      // ...
    }
  }
}
```

### Logo

Reemplazar el SVG en `components/header.tsx` y `components/footer.tsx`

## 🐛 Troubleshooting

### Error de conexión a DB
```bash
# Verificar que la URL de conexión sea correcta
echo $DATABASE_URL

# Probar conexión
npx prisma db push
```

### Error de autenticación
```bash
# Regenerar secret
openssl rand -base64 32

# Actualizar NEXTAUTH_SECRET en .env
```

### Prisma Client no generado
```bash
npx prisma generate
```

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Neon PostgreSQL](https://neon.tech)

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👨‍💻 Autor

Desarrollado para Habita Perú - 2026

---

**¿Necesitas ayuda?** Contacta a: soporte@habitaperu.pe
