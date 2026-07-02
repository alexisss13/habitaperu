import { PrismaClient, Role, PropertyType, PropertyCondition, PropertyStatus, ContractStatus, PaymentStatus, KYCStatus, NotificationType } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { seedLocations } from './seed-locations'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Limpiar datos existentes (si existen las tablas)
  try {
    await prisma.notification.deleteMany()
    await prisma.review.deleteMany()
    await prisma.payment.deleteMany()
    await prisma.contract.deleteMany()
    await prisma.kYCVerification.deleteMany()
    await prisma.property.deleteMany()
    await prisma.user.deleteMany()
    console.log('✅ Datos existentes eliminados')
  } catch (error) {
    console.log('ℹ️  Base de datos vacía o tablas no existen aún')
  }

  console.log('🌱 Sembrando ciudades y distritos...')
  await seedLocations(prisma)

  // Crear usuarios
  const hashedPassword = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@habitaperu.pe',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Sistema',
      role: Role.ADMIN,
      verified: true,
      phone: '+51 999 999 999',
    },
  })

  const landlord1 = await prisma.user.create({
    data: {
      email: 'juan.diaz@email.com',
      password: hashedPassword,
      firstName: 'Juan',
      lastName: 'Díaz Paredes',
      role: Role.LANDLORD,
      verified: true,
      phone: '+51 987 654 321',
      dni: '45678901',
      district: 'Surco',
      bio: 'Arrendador con más de 6 propiedades en Lima. Comprometido con el bienestar de mis inquilinos.',
    },
  })

  const landlord2 = await prisma.user.create({
    data: {
      email: 'rosa.vargas@email.com',
      password: hashedPassword,
      firstName: 'Rosa',
      lastName: 'Vargas',
      role: Role.LANDLORD,
      verified: true,
      phone: '+51 976 543 210',
      dni: '56789012',
      district: 'San Isidro',
    },
  })

  const tenant1 = await prisma.user.create({
    data: {
      email: 'carlos.ramirez@email.com',
      password: hashedPassword,
      firstName: 'Carlos',
      lastName: 'Ramírez',
      role: Role.TENANT,
      verified: true,
      phone: '+51 965 432 109',
      dni: '67890123',
    },
  })

  const tenant2 = await prisma.user.create({
    data: {
      email: 'maria.lopez@email.com',
      password: hashedPassword,
      firstName: 'María',
      lastName: 'López',
      role: Role.TENANT,
      verified: true,
      phone: '+51 954 321 098',
      dni: '78901234',
    },
  })

  const tenant3 = await prisma.user.create({
    data: {
      email: 'andrea.paredes@email.com',
      password: hashedPassword,
      firstName: 'Andrea',
      lastName: 'Paredes',
      role: Role.TENANT,
      verified: true,
      phone: '+51 943 210 987',
      dni: '89012345',
    },
  })

  console.log('✅ Usuarios creados')

  // Crear verificaciones KYC
  await prisma.kYCVerification.create({
    data: {
      userId: tenant1.id,
      status: KYCStatus.APROBADO,
      dniVerified: true,
      biometricVerified: true,
      backgroundCheck: true,
      verifiedAt: new Date(),
    },
  })

  await prisma.kYCVerification.create({
    data: {
      userId: tenant2.id,
      status: KYCStatus.EN_REVISION,
      dniVerified: true,
      biometricVerified: true,
      backgroundCheck: false,
    },
  })

  console.log('✅ Verificaciones KYC creadas')

  // Crear propiedades
  const property1 = await prisma.property.create({
    data: {
      title: 'Depa moderno en Miraflores',
      description: 'Hermoso departamento moderno ubicado en el corazón de Miraflores. Cuenta con acabados de primera, cocina equipada, sala amplia y dormitorios con closets empotrados.',
      type: PropertyType.DEPARTAMENTO,
      condition: PropertyCondition.AMOBLADO,
      status: PropertyStatus.OCUPADA,
      district: 'Miraflores',
      address: 'Av. Larco cuadra 10',
      area: 65,
      rooms: 2,
      bathrooms: 2,
      parking: 1,
      price: 1800,
      deposit: 1,
      minDuration: 12,
      amenities: ['WiFi', 'Cable TV', 'Agua incluida', 'Seguridad 24h', 'Ascensor'],
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
        'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&q=80',
      ],
      tenantProfile: ['profesional', 'pareja'],
      views: 245,
      favorites: 32,
      ownerId: landlord1.id,
    },
  })

  const property2 = await prisma.property.create({
    data: {
      title: 'Habitación premium con baño privado',
      description: 'Habitación ejecutiva con baño privado en una casa compartida de San Isidro. Ideal para profesionales o estudiantes universitarios.',
      type: PropertyType.HABITACION,
      condition: PropertyCondition.SEMI_AMOBLADO,
      status: PropertyStatus.OCUPADA,
      district: 'San Isidro',
      area: 18,
      rooms: 1,
      bathrooms: 1,
      parking: 0,
      price: 750,
      deposit: 1,
      minDuration: 3,
      amenities: ['WiFi', 'Agua incluida', 'Luz incluida', 'Gas incluido'],
      images: [
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
        'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
        'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=800&q=80',
      ],
      tenantProfile: ['profesional', 'estudiante'],
      views: 189,
      favorites: 18,
      ownerId: landlord2.id,
    },
  })

  const property3 = await prisma.property.create({
    data: {
      title: 'Casa familiar en Santiago de Surco',
      description: 'Amplia casa familiar en zona residencial de Surco. Cuenta con jardín, cochera para 2 autos, sala de estar, comedor, cocina equipada y 4 dormitorios.',
      type: PropertyType.CASA,
      condition: PropertyCondition.SIN_MUEBLES,
      status: PropertyStatus.OCUPADA,
      district: 'Surco',
      area: 180,
      rooms: 4,
      bathrooms: 3,
      parking: 2,
      price: 3200,
      deposit: 2,
      minDuration: 12,
      amenities: ['WiFi', 'Cable TV', 'Jardín', 'Cochera doble', 'Seguridad 24h', 'Mascotas OK'],
      images: [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      ],
      tenantProfile: ['familia'],
      views: 156,
      favorites: 24,
      ownerId: landlord1.id,
    },
  })

  const property4 = await prisma.property.create({
    data: {
      title: 'Depa amoblado con vista al mar',
      description: 'Espectacular departamento completamente amoblado con vista al mar en Barranco. Diseño moderno y minimalista.',
      type: PropertyType.DEPARTAMENTO,
      condition: PropertyCondition.AMOBLADO,
      status: PropertyStatus.OCUPADA,
      district: 'Barranco',
      area: 72,
      rooms: 2,
      bathrooms: 2,
      parking: 1,
      price: 2400,
      deposit: 1,
      minDuration: 6,
      amenities: ['WiFi', 'Cable TV', 'Completamente amoblado', 'Electrodomésticos', 'Seguridad 24h'],
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
        'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=800&q=80',
        'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&q=80',
        'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800&q=80',
      ],
      tenantProfile: ['profesional', 'extranjero'],
      views: 312,
      favorites: 45,
      ownerId: landlord1.id,
    },
  })

  const property5 = await prisma.property.create({
    data: {
      title: 'Departamento luminoso en San Borja',
      description: 'Departamento luminoso y bien ventilado en San Borja. Acabados modernos, cocina equipada y dormitorios amplios.',
      type: PropertyType.DEPARTAMENTO,
      condition: PropertyCondition.SIN_MUEBLES,
      status: PropertyStatus.DISPONIBLE,
      district: 'San Borja',
      area: 58,
      rooms: 2,
      bathrooms: 1,
      parking: 1,
      price: 1500,
      deposit: 1,
      minDuration: 12,
      amenities: ['WiFi', 'Agua incluida', 'Ascensor', 'Seguridad 24h'],
      images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80'],
      tenantProfile: ['profesional', 'pareja'],
      views: 98,
      favorites: 12,
      ownerId: landlord1.id,
    },
  })

  const property6 = await prisma.property.create({
    data: {
      title: 'Habitación ejecutiva cerca a universidades',
      description: 'Habitación ejecutiva en casa compartida de Jesús María. Ideal para estudiantes universitarios. A 10 minutos de la PUCP, UPC y USIL.',
      type: PropertyType.HABITACION,
      condition: PropertyCondition.SEMI_AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'Jesús María',
      area: 20,
      rooms: 1,
      bathrooms: 1,
      parking: 0,
      price: 550,
      deposit: 1,
      minDuration: 3,
      amenities: ['WiFi', 'Agua incluida', 'Luz incluida', 'Escritorio de trabajo'],
      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
      tenantProfile: ['estudiante'],
      views: 134,
      favorites: 8,
      ownerId: landlord2.id,
    },
  })

  const property7 = await prisma.property.create({
    data: {
      title: 'Depa moderno con piscina en La Molina',
      description: 'Departamento en condominio exclusivo con piscina, gimnasio y áreas verdes. Perfecto para familias.',
      type: PropertyType.DEPARTAMENTO,
      condition: PropertyCondition.AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'La Molina',
      area: 85,
      rooms: 3,
      bathrooms: 2,
      parking: 2,
      price: 2800,
      deposit: 2,
      minDuration: 12,
      amenities: ['WiFi', 'Cable TV', 'Piscina', 'Gimnasio', 'Seguridad 24h', 'Área de juegos'],
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'],
      tenantProfile: ['familia', 'profesional'],
      views: 267,
      favorites: 34,
      ownerId: landlord1.id,
    },
  })

  const property8 = await prisma.property.create({
    data: {
      title: 'Habitación con baño privado en Lince',
      description: 'Habitación amplia con baño privado en casa familiar. Ambiente tranquilo, cerca al centro de Lima.',
      type: PropertyType.HABITACION,
      condition: PropertyCondition.SEMI_AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'Lince',
      area: 15,
      rooms: 1,
      bathrooms: 1,
      parking: 0,
      price: 650,
      deposit: 1,
      minDuration: 3,
      amenities: ['WiFi', 'Agua incluida', 'Luz incluida', 'Lavandería'],
      images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'],
      tenantProfile: ['profesional', 'estudiante'],
      views: 89,
      favorites: 6,
      ownerId: landlord2.id,
    },
  })

  const property9 = await prisma.property.create({
    data: {
      title: 'Casa con jardín en Pueblo Libre',
      description: 'Casa acogedora con jardín amplio, perfecta para familias con mascotas. 3 dormitorios y 2 baños.',
      type: PropertyType.CASA,
      condition: PropertyCondition.SIN_MUEBLES,
      status: PropertyStatus.DISPONIBLE,
      district: 'Pueblo Libre',
      area: 150,
      rooms: 3,
      bathrooms: 2,
      parking: 1,
      price: 2500,
      deposit: 2,
      minDuration: 12,
      amenities: ['WiFi', 'Jardín', 'Mascotas OK', 'Cochera'],
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
      tenantProfile: ['familia'],
      views: 178,
      favorites: 21,
      ownerId: landlord1.id,
    },
  })

  const property10 = await prisma.property.create({
    data: {
      title: 'Depa tipo loft en Barranco',
      description: 'Loft moderno estilo industrial en el corazón de Barranco. Ideal para creativos y artistas.',
      type: PropertyType.DEPARTAMENTO,
      condition: PropertyCondition.AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'Barranco',
      area: 45,
      rooms: 1,
      bathrooms: 1,
      parking: 0,
      price: 1900,
      deposit: 1,
      minDuration: 6,
      amenities: ['WiFi', 'Cable TV', 'Completamente amoblado', 'Electrodomésticos'],
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'],
      tenantProfile: ['profesional', 'extranjero'],
      views: 312,
      favorites: 45,
      ownerId: landlord2.id,
    },
  })

  const property11 = await prisma.property.create({
    data: {
      title: 'Habitación doble en Magdalena',
      description: 'Habitación amplia para 2 personas en casa compartida. Cerca a la playa y centros comerciales.',
      type: PropertyType.HABITACION,
      condition: PropertyCondition.SEMI_AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'Magdalena',
      area: 18,
      rooms: 1,
      bathrooms: 1,
      parking: 0,
      price: 800,
      deposit: 1,
      minDuration: 3,
      amenities: ['WiFi', 'Agua incluida', 'Luz incluida', 'Lavandería compartida'],
      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
      tenantProfile: ['estudiante', 'pareja'],
      views: 156,
      favorites: 12,
      ownerId: landlord1.id,
    },
  })

  const property12 = await prisma.property.create({
    data: {
      title: 'Depa con vista panorámica en San Miguel',
      description: 'Departamento en piso alto con vista panorámica a la ciudad. Moderno y bien ubicado.',
      type: PropertyType.DEPARTAMENTO,
      condition: PropertyCondition.AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'San Miguel',
      area: 70,
      rooms: 2,
      bathrooms: 2,
      parking: 1,
      price: 2100,
      deposit: 1,
      minDuration: 12,
      amenities: ['WiFi', 'Cable TV', 'Ascensor', 'Seguridad 24h', 'Gimnasio'],
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
      tenantProfile: ['profesional', 'pareja'],
      views: 234,
      favorites: 28,
      ownerId: landlord2.id,
    },
  })

  // PROPIEDADES ADICIONALES PARA ESTUDIANTES Y TRABAJADORES

  const property13 = await prisma.property.create({
    data: {
      title: 'Habitación económica cerca a la UNI',
      description: 'Habitación perfecta para estudiantes de la UNI. A 5 minutos caminando. Ambiente tranquilo para estudiar.',
      type: PropertyType.HABITACION,
      condition: PropertyCondition.SEMI_AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'Rímac',
      area: 12,
      rooms: 1,
      bathrooms: 1,
      parking: 0,
      price: 400,
      deposit: 1,
      minDuration: 3,
      amenities: ['WiFi', 'Agua incluida', 'Luz incluida', 'Escritorio', 'Closet'],
      images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'],
      tenantProfile: ['estudiante'],
      views: 145,
      favorites: 18,
      ownerId: landlord1.id,
    },
  })

  const property14 = await prisma.property.create({
    data: {
      title: 'Habitación para estudiante PUCP',
      description: 'Habitación individual a 10 minutos de la PUCP. Casa compartida con otros estudiantes. Ambiente de estudio.',
      type: PropertyType.HABITACION,
      condition: PropertyCondition.SEMI_AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'San Miguel',
      area: 14,
      rooms: 1,
      bathrooms: 1,
      parking: 0,
      price: 500,
      deposit: 1,
      minDuration: 3,
      amenities: ['WiFi', 'Agua incluida', 'Luz incluida', 'Escritorio', 'Biblioteca compartida'],
      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
      tenantProfile: ['estudiante'],
      views: 198,
      favorites: 24,
      ownerId: landlord2.id,
    },
  })

  const property15 = await prisma.property.create({
    data: {
      title: 'Habitación cerca a UPC Monterrico',
      description: 'Habitación amoblada a 8 minutos de UPC Monterrico. Ideal para estudiantes. Zona segura y tranquila.',
      type: PropertyType.HABITACION,
      condition: PropertyCondition.AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'Surco',
      area: 15,
      rooms: 1,
      bathrooms: 1,
      parking: 0,
      price: 600,
      deposit: 1,
      minDuration: 3,
      amenities: ['WiFi', 'Agua incluida', 'Luz incluida', 'Escritorio', 'Cama', 'Closet'],
      images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'],
      tenantProfile: ['estudiante'],
      views: 223,
      favorites: 31,
      ownerId: landlord1.id,
    },
  })

  const property16 = await prisma.property.create({
    data: {
      title: 'Habitación para profesional en San Isidro',
      description: 'Habitación ejecutiva para profesional. Zona corporativa de San Isidro. Cerca a bancos y oficinas.',
      type: PropertyType.HABITACION,
      condition: PropertyCondition.AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'San Isidro',
      area: 16,
      rooms: 1,
      bathrooms: 1,
      parking: 0,
      price: 800,
      deposit: 1,
      minDuration: 3,
      amenities: ['WiFi', 'Agua incluida', 'Luz incluida', 'Escritorio', 'Closet', 'Aire acondicionado'],
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
      tenantProfile: ['profesional'],
      views: 167,
      favorites: 22,
      ownerId: landlord2.id,
    },
  })

  const property17 = await prisma.property.create({
    data: {
      title: 'Habitación compartida para estudiantes',
      description: 'Habitación doble para 2 estudiantes. Precio por persona. Cerca a universidades de Lima Centro.',
      type: PropertyType.HABITACION,
      condition: PropertyCondition.SEMI_AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'Jesús María',
      area: 20,
      rooms: 1,
      bathrooms: 1,
      parking: 0,
      price: 350,
      deposit: 1,
      minDuration: 3,
      amenities: ['WiFi', 'Agua incluida', 'Luz incluida', '2 camas', '2 escritorios'],
      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
      tenantProfile: ['estudiante'],
      views: 189,
      favorites: 15,
      ownerId: landlord1.id,
    },
  })

  const property18 = await prisma.property.create({
    data: {
      title: 'Habitación con baño privado - USIL',
      description: 'Habitación con baño privado cerca a USIL. Ideal para estudiantes que valoran su privacidad.',
      type: PropertyType.HABITACION,
      condition: PropertyCondition.AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'La Molina',
      area: 18,
      rooms: 1,
      bathrooms: 1,
      parking: 0,
      price: 700,
      deposit: 1,
      minDuration: 3,
      amenities: ['WiFi', 'Agua incluida', 'Luz incluida', 'Baño privado', 'Escritorio', 'Closet'],
      images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'],
      tenantProfile: ['estudiante'],
      views: 201,
      favorites: 27,
      ownerId: landlord2.id,
    },
  })

  const property19 = await prisma.property.create({
    data: {
      title: 'Habitación para trabajador remoto',
      description: 'Habitación perfecta para trabajadores remotos. Escritorio amplio, silla ergonómica, internet de alta velocidad.',
      type: PropertyType.HABITACION,
      condition: PropertyCondition.AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'Miraflores',
      area: 17,
      rooms: 1,
      bathrooms: 1,
      parking: 0,
      price: 850,
      deposit: 1,
      minDuration: 3,
      amenities: ['WiFi 100Mbps', 'Agua incluida', 'Luz incluida', 'Escritorio grande', 'Silla ergonómica', 'Closet'],
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
      tenantProfile: ['profesional'],
      views: 178,
      favorites: 29,
      ownerId: landlord1.id,
    },
  })

  const property20 = await prisma.property.create({
    data: {
      title: 'Mini depa para estudiante UPC',
      description: 'Mini departamento tipo estudio. Perfecto para estudiante independiente. Cocina y baño privado.',
      type: PropertyType.DEPARTAMENTO,
      condition: PropertyCondition.AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'Surco',
      area: 25,
      rooms: 1,
      bathrooms: 1,
      parking: 0,
      price: 900,
      deposit: 1,
      minDuration: 6,
      amenities: ['WiFi', 'Cocina equipada', 'Baño privado', 'Escritorio', 'Cama', 'Closet'],
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'],
      tenantProfile: ['estudiante', 'profesional'],
      views: 245,
      favorites: 38,
      ownerId: landlord2.id,
    },
  })

  const property21 = await prisma.property.create({
    data: {
      title: 'Habitación cerca a Jockey Plaza',
      description: 'Habitación en zona comercial. Cerca a Jockey Plaza y centros de trabajo. Ideal para profesionales.',
      type: PropertyType.HABITACION,
      condition: PropertyCondition.SEMI_AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'Surco',
      area: 14,
      rooms: 1,
      bathrooms: 1,
      parking: 0,
      price: 550,
      deposit: 1,
      minDuration: 3,
      amenities: ['WiFi', 'Agua incluida', 'Luz incluida', 'Escritorio', 'Closet'],
      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
      tenantProfile: ['profesional', 'estudiante'],
      views: 156,
      favorites: 19,
      ownerId: landlord1.id,
    },
  })

  const property22 = await prisma.property.create({
    data: {
      title: 'Habitación para estudiante de medicina',
      description: 'Habitación cerca a hospitales y facultades de medicina. Ambiente tranquilo para estudiar.',
      type: PropertyType.HABITACION,
      condition: PropertyCondition.SEMI_AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'Lince',
      area: 13,
      rooms: 1,
      bathrooms: 1,
      parking: 0,
      price: 450,
      deposit: 1,
      minDuration: 3,
      amenities: ['WiFi', 'Agua incluida', 'Luz incluida', 'Escritorio amplio', 'Buena iluminación'],
      images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'],
      tenantProfile: ['estudiante'],
      views: 134,
      favorites: 16,
      ownerId: landlord2.id,
    },
  })

  const property23 = await prisma.property.create({
    data: {
      title: 'Habitación en casa de familia - Estudiantes',
      description: 'Habitación en casa familiar. Ambiente cálido y seguro. Comidas opcionales disponibles.',
      type: PropertyType.HABITACION,
      condition: PropertyCondition.SEMI_AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'Pueblo Libre',
      area: 15,
      rooms: 1,
      bathrooms: 1,
      parking: 0,
      price: 480,
      deposit: 1,
      minDuration: 3,
      amenities: ['WiFi', 'Agua incluida', 'Luz incluida', 'Escritorio', 'Ambiente familiar'],
      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
      tenantProfile: ['estudiante'],
      views: 167,
      favorites: 21,
      ownerId: landlord1.id,
    },
  })

  const property24 = await prisma.property.create({
    data: {
      title: 'Habitación ejecutiva - Profesionales',
      description: 'Habitación de lujo para profesionales exigentes. Baño privado, aire acondicionado, escritorio ejecutivo.',
      type: PropertyType.HABITACION,
      condition: PropertyCondition.AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'San Isidro',
      area: 20,
      rooms: 1,
      bathrooms: 1,
      parking: 0,
      price: 950,
      deposit: 1,
      minDuration: 3,
      amenities: ['WiFi', 'Agua incluida', 'Luz incluida', 'Baño privado', 'Aire acondicionado', 'Escritorio ejecutivo', 'TV'],
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
      tenantProfile: ['profesional'],
      views: 189,
      favorites: 33,
      ownerId: landlord2.id,
    },
  })

  console.log('✅ Propiedades creadas (24 total - 12 adicionales para estudiantes y trabajadores)')

  // Crear contratos
  const contract1 = await prisma.contract.create({
    data: {
      propertyId: property1.id,
      landlordId: landlord1.id,
      tenantId: tenant1.id,
      status: ContractStatus.ACTIVE,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      monthlyRent: 1800,
      deposit: 1800,
      landlordSignedAt: new Date('2025-12-20'),
      tenantSignedAt: new Date('2025-12-22'),
    },
  })

  const contract2 = await prisma.contract.create({
    data: {
      propertyId: property2.id,
      landlordId: landlord2.id,
      tenantId: tenant2.id,
      status: ContractStatus.ACTIVE,
      startDate: new Date('2026-02-01'),
      endDate: new Date('2027-01-31'),
      monthlyRent: 750,
      deposit: 750,
      landlordSignedAt: new Date('2026-01-25'),
      tenantSignedAt: new Date('2026-01-26'),
    },
  })

  const contract3 = await prisma.contract.create({
    data: {
      propertyId: property4.id,
      landlordId: landlord1.id,
      tenantId: tenant3.id,
      status: ContractStatus.ACTIVE,
      startDate: new Date('2026-04-01'),
      endDate: new Date('2027-03-31'),
      monthlyRent: 2400,
      deposit: 2400,
      landlordSignedAt: new Date('2026-03-25'),
      tenantSignedAt: new Date('2026-03-26'),
    },
  })

  console.log('✅ Contratos creados')

  // Crear pagos
  await prisma.payment.create({
    data: {
      contractId: contract1.id,
      landlordId: landlord1.id,
      tenantId: tenant1.id,
      amount: 1800,
      dueDate: new Date('2026-04-01'),
      paidDate: new Date('2026-04-01'),
      status: PaymentStatus.PAGADO,
      paymentMethod: 'Transferencia bancaria',
    },
  })

  await prisma.payment.create({
    data: {
      contractId: contract2.id,
      landlordId: landlord2.id,
      tenantId: tenant2.id,
      amount: 750,
      dueDate: new Date('2026-04-05'),
      status: PaymentStatus.PENDIENTE,
    },
  })

  await prisma.payment.create({
    data: {
      contractId: contract3.id,
      landlordId: landlord1.id,
      tenantId: tenant3.id,
      amount: 2400,
      dueDate: new Date('2026-04-01'),
      status: PaymentStatus.EN_PROCESO,
      paymentMethod: 'Yape',
    },
  })

  console.log('✅ Pagos creados')

  // Crear reseñas
  await prisma.review.create({
    data: {
      propertyId: property1.id,
      authorId: tenant1.id,
      targetId: landlord1.id,
      rating: 5,
      comment: 'Excelente departamento, muy bien ubicado. El arrendador es muy atento y resolvió cualquier problema rápidamente.',
    },
  })

  await prisma.review.create({
    data: {
      propertyId: property2.id,
      authorId: tenant2.id,
      targetId: landlord2.id,
      rating: 5,
      comment: 'Habitación muy cómoda y limpia. La dueña es muy amable y el ambiente de la casa es tranquilo.',
    },
  })

  console.log('✅ Reseñas creadas')

  // Crear notificaciones
  await prisma.notification.create({
    data: {
      userId: landlord1.id,
      type: NotificationType.PAYMENT_SUCCESS,
      title: 'Pago recibido',
      message: 'Carlos Ramírez ha pagado S/ 1,800 por el mes de abril',
      metadata: { contractId: contract1.id, amount: 1800 },
    },
  })

  await prisma.notification.create({
    data: {
      userId: landlord2.id,
      type: NotificationType.PAYMENT_SUBMIT,
      title: 'Pago pendiente',
      message: 'María López tiene un pago pendiente de S/ 750',
      metadata: { contractId: contract2.id, amount: 750 },
    },
  })

  console.log('✅ Notificaciones creadas')

  console.log('\n🎉 Seed completado exitosamente!')
  console.log('\n📧 Credenciales de prueba:')
  console.log('Admin: admin@habitaperu.pe / password123')
  console.log('Arrendador: juan.diaz@email.com / password123')
  console.log('Inquilino: carlos.ramirez@email.com / password123')
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
