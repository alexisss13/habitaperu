import { PrismaClient, Role, PropertyType, PropertyCondition, PropertyStatus, ContractStatus, PaymentStatus, KYCStatus, NotificationType } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { seedLocations } from './seed-locations'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos (Trujillo)...')

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
      email: 'jose.chavez@email.com',
      password: hashedPassword,
      firstName: 'José',
      lastName: 'Chávez Rodríguez',
      role: Role.LANDLORD,
      verified: true,
      phone: '+51 987 111 222',
      dni: '41123456',
      district: 'Trujillo',
      bio: 'Arrendador con varias propiedades en el centro de Trujillo. Cerca a la UNT y UPAO.',
    },
  })

  const landlord2 = await prisma.user.create({
    data: {
      email: 'lucia.saldana@email.com',
      password: hashedPassword,
      firstName: 'Lucía',
      lastName: 'Saldaña Vílchez',
      role: Role.LANDLORD,
      verified: true,
      phone: '+51 976 222 333',
      dni: '42234567',
      district: 'Víctor Larco Herrera',
      bio: 'Alquilo departamentos y habitaciones en Víctor Larco. Atención directa y rápida.',
    },
  })

  const landlord3 = await prisma.user.create({
    data: {
      email: 'manuel.quiroz@email.com',
      password: hashedPassword,
      firstName: 'Manuel',
      lastName: 'Quiroz Alva',
      role: Role.LANDLORD,
      verified: true,
      phone: '+51 965 333 444',
      dni: '43345678',
      district: 'El Porvenir',
    },
  })

  const landlord4 = await prisma.user.create({
    data: {
      email: 'patricia.rios@email.com',
      password: hashedPassword,
      firstName: 'Patricia',
      lastName: 'Ríos Bazán',
      role: Role.LANDLORD,
      verified: true,
      phone: '+51 954 444 555',
      dni: '44456789',
      district: 'Huanchaco',
      bio: 'Propiedades cerca a la playa de Huanchaco, ideales para trabajo remoto.',
    },
  })

  const tenant1 = await prisma.user.create({
    data: {
      email: 'brayan.torres@email.com',
      password: hashedPassword,
      firstName: 'Brayan',
      lastName: 'Torres Campos',
      role: Role.TENANT,
      verified: true,
      phone: '+51 943 555 666',
      dni: '45567890',
    },
  })

  const tenant2 = await prisma.user.create({
    data: {
      email: 'fiorella.castillo@email.com',
      password: hashedPassword,
      firstName: 'Fiorella',
      lastName: 'Castillo Nureña',
      role: Role.TENANT,
      verified: false,
      phone: '+51 932 666 777',
      dni: '46678901',
    },
  })

  const tenant3 = await prisma.user.create({
    data: {
      email: 'diego.mendoza@email.com',
      password: hashedPassword,
      firstName: 'Diego',
      lastName: 'Mendoza Ibáñez',
      role: Role.TENANT,
      verified: false,
      phone: '+51 921 777 888',
      dni: '47789012',
    },
  })

  const tenant4 = await prisma.user.create({
    data: {
      email: 'karla.benites@email.com',
      password: hashedPassword,
      firstName: 'Karla',
      lastName: 'Benites Rubio',
      role: Role.TENANT,
      verified: false,
      phone: '+51 910 888 999',
      dni: '48890123',
    },
  })

  const tenant5 = await prisma.user.create({
    data: {
      email: 'renzo.aguilar@email.com',
      password: hashedPassword,
      firstName: 'Renzo',
      lastName: 'Aguilar Peña',
      role: Role.TENANT,
      verified: false,
      phone: '+51 909 999 000',
      dni: '49901234',
    },
  })

  const tenant6 = await prisma.user.create({
    data: {
      email: 'valeria.cruz@email.com',
      password: hashedPassword,
      firstName: 'Valeria',
      lastName: 'Cruz Honorio',
      role: Role.TENANT,
      verified: true,
      phone: '+51 908 000 111',
      dni: '40012345',
    },
  })

  console.log('✅ Usuarios creados (1 admin, 4 arrendadores, 6 inquilinos)')

  // Crear verificaciones KYC (distintos estados para poder probar cada flujo)
  await prisma.kYCVerification.create({
    data: {
      userId: tenant1.id,
      status: KYCStatus.APROBADO,
      dniVerified: true,
      biometricVerified: true,
      backgroundCheck: true,
      faceMatchScore: 91,
      verifiedAt: new Date(),
    },
  })

  await prisma.kYCVerification.create({
    data: {
      userId: tenant2.id,
      status: KYCStatus.EN_REVISION,
      dniVerified: false,
      biometricVerified: false,
      backgroundCheck: false,
      faceMatchScore: 32,
    },
  })

  await prisma.kYCVerification.create({
    data: {
      userId: tenant4.id,
      status: KYCStatus.RECHAZADO,
      dniVerified: false,
      biometricVerified: false,
      backgroundCheck: false,
      reviewNotes: 'La foto del DNI está borrosa y no se pueden verificar los datos. Por favor vuelve a intentarlo con mejor iluminación.',
    },
  })

  await prisma.kYCVerification.create({
    data: {
      userId: tenant6.id,
      status: KYCStatus.APROBADO,
      dniVerified: true,
      biometricVerified: true,
      backgroundCheck: true,
      faceMatchScore: 88,
      verifiedAt: new Date(),
    },
  })

  // tenant3 y tenant5 quedan sin expediente KYC (para probar el flujo desde cero)

  console.log('✅ Verificaciones KYC creadas (aprobado, en revisión, rechazado, sin iniciar)')

  // Crear propiedades — todas en Trujillo, La Esperanza, El Porvenir,
  // Víctor Larco Herrera, Moche y Huanchaco. 5 fotos por propiedad, ninguna repetida.

  const property1 = await prisma.property.create({
    data: {
      title: 'Habitación cerca a la UNT',
      description: 'Habitación amoblada a 8 minutos caminando de la Universidad Nacional de Trujillo. Ambiente tranquilo, ideal para estudiar.',
      type: PropertyType.HABITACION,
      condition: PropertyCondition.SEMI_AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'Trujillo',
      address: 'Jr. Independencia 450',
      area: 14,
      rooms: 1,
      bathrooms: 1,
      parking: 0,
      price: 350,
      deposit: 1,
      minDuration: 3,
      amenities: ['WiFi', 'Agua incluida', 'Luz incluida', 'Escritorio', 'Closet'],
      images: [
        'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
        'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80',
        'https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?w=800&q=80',
        'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80',
        'https://images.unsplash.com/photo-1696762932825-2737db830bbe?w=800&q=80',
      ],
      tenantProfile: ['estudiante'],
      views: 132,
      favorites: 14,
      ownerId: landlord1.id,
    },
  })

  const property2 = await prisma.property.create({
    data: {
      title: 'Habitación con baño privado - UPAO',
      description: 'Habitación con baño privado a 10 minutos de la UPAO. Casa compartida con otros estudiantes, ambiente seguro.',
      type: PropertyType.HABITACION,
      condition: PropertyCondition.AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'Trujillo',
      address: 'Av. América Sur 1230',
      area: 16,
      rooms: 1,
      bathrooms: 1,
      parking: 0,
      price: 450,
      deposit: 1,
      minDuration: 3,
      amenities: ['WiFi', 'Agua incluida', 'Luz incluida', 'Baño privado', 'Escritorio'],
      images: [
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
        'https://images.unsplash.com/photo-1633505650701-6104c4fc72c2?w=800&q=80',
        'https://images.unsplash.com/photo-1615529162924-f8605388461d?w=800&q=80',
        'https://images.unsplash.com/photo-1595526051245-4506e0005bd0?w=800&q=80',
        'https://images.unsplash.com/photo-1750420556288-d0e32a6f517b?w=800&q=80',
      ],
      tenantProfile: ['estudiante'],
      views: 156,
      favorites: 19,
      ownerId: landlord2.id,
    },
  })

  const property3 = await prisma.property.create({
    data: {
      title: 'Habitación amoblada cerca a la UCV',
      description: 'Habitación individual amoblada, muy cerca al campus de la Universidad César Vallejo. Zona con buen transporte.',
      type: PropertyType.HABITACION,
      condition: PropertyCondition.AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'La Esperanza',
      address: 'Av. Perú 890',
      area: 15,
      rooms: 1,
      bathrooms: 1,
      parking: 0,
      price: 400,
      deposit: 1,
      minDuration: 3,
      amenities: ['WiFi', 'Agua incluida', 'Luz incluida', 'Cama', 'Closet'],
      images: [
        'https://images.unsplash.com/photo-1604580040660-f0a7f9abaea6?w=800&q=80',
        'https://images.unsplash.com/photo-1642541070065-3912f347e7c6?w=800&q=80',
        'https://images.unsplash.com/photo-1653974123568-b5eff6d851e1?w=800&q=80',
        'https://images.unsplash.com/photo-1640109478916-f445f8f19b11?w=800&q=80',
        'https://images.unsplash.com/photo-1638840992956-142399e7e2df?w=800&q=80',
      ],
      tenantProfile: ['estudiante'],
      views: 98,
      favorites: 9,
      ownerId: landlord3.id,
    },
  })

  const property4 = await prisma.property.create({
    data: {
      title: 'Habitación ejecutiva en Víctor Larco',
      description: 'Habitación ejecutiva en zona residencial de Víctor Larco Herrera, cerca al Real Plaza y la Universidad Privada del Norte.',
      type: PropertyType.HABITACION,
      condition: PropertyCondition.AMOBLADO,
      status: PropertyStatus.OCUPADA,
      district: 'Víctor Larco Herrera',
      address: 'Av. Larco 2100',
      area: 18,
      rooms: 1,
      bathrooms: 1,
      parking: 0,
      price: 550,
      deposit: 1,
      minDuration: 6,
      amenities: ['WiFi', 'Agua incluida', 'Luz incluida', 'Baño privado', 'Aire acondicionado', 'Escritorio'],
      images: [
        'https://images.unsplash.com/photo-1702014859878-5d4743176d28?w=800&q=80',
        'https://images.unsplash.com/photo-1630699376331-7d70d7a3e417?w=800&q=80',
        'https://images.unsplash.com/photo-1630699376289-b62375a35505?w=800&q=80',
        'https://images.unsplash.com/photo-1630699375895-fe5996d163ee?w=800&q=80',
        'https://images.unsplash.com/photo-1770757587087-766db2874c21?w=800&q=80',
      ],
      tenantProfile: ['profesional'],
      views: 201,
      favorites: 27,
      ownerId: landlord1.id,
    },
  })

  const property5 = await prisma.property.create({
    data: {
      title: 'Habitación compartida para estudiantes - El Porvenir',
      description: 'Habitación doble económica en El Porvenir. Precio accesible, ideal para estudiantes con presupuesto ajustado.',
      type: PropertyType.HABITACION,
      condition: PropertyCondition.SEMI_AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'El Porvenir',
      address: 'Jr. Sánchez Carrión 340',
      area: 20,
      rooms: 1,
      bathrooms: 1,
      parking: 0,
      price: 280,
      deposit: 1,
      minDuration: 3,
      amenities: ['WiFi', 'Agua incluida', 'Luz incluida', '2 camas', '2 escritorios'],
      images: [
        'https://images.unsplash.com/photo-1652882860938-f90aa298e644?w=800&q=80',
        'https://images.unsplash.com/photo-1652882860902-7c6b0f88ef23?w=800&q=80',
        'https://images.unsplash.com/photo-1610879485443-c472257793d1?w=800&q=80',
        'https://images.unsplash.com/photo-1772476361208-27d580dd3328?w=800&q=80',
        'https://images.unsplash.com/photo-1630699376167-3870469e7598?w=800&q=80',
      ],
      tenantProfile: ['estudiante'],
      views: 87,
      favorites: 7,
      ownerId: landlord4.id,
    },
  })

  const property6 = await prisma.property.create({
    data: {
      title: 'Habitación con vista al mar en Huanchaco',
      description: 'Habitación con vista al mar a pocos pasos del malecón de Huanchaco. Ideal para trabajo remoto o surfistas.',
      type: PropertyType.HABITACION,
      condition: PropertyCondition.AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'Huanchaco',
      address: 'Malecón Grau 210',
      area: 17,
      rooms: 1,
      bathrooms: 1,
      parking: 0,
      price: 500,
      deposit: 1,
      minDuration: 3,
      amenities: ['WiFi 100Mbps', 'Vista al mar', 'Agua incluida', 'Luz incluida', 'Escritorio'],
      images: [
        'https://images.unsplash.com/photo-1737305473724-896a66064a68?w=800&q=80',
        'https://images.unsplash.com/photo-1737305457462-57fcd66ccee4?w=800&q=80',
        'https://images.unsplash.com/photo-1737305467768-cfcbf106a535?w=800&q=80',
        'https://images.unsplash.com/photo-1737305457496-dc7503cdde1e?w=800&q=80',
        'https://images.unsplash.com/photo-1652882861109-570be85c2b92?w=800&q=80',
      ],
      tenantProfile: ['profesional', 'extranjero'],
      views: 245,
      favorites: 38,
      ownerId: landlord2.id,
    },
  })

  const property7 = await prisma.property.create({
    data: {
      title: 'Depa moderno en el centro de Trujillo',
      description: 'Departamento moderno a 5 minutos de la Plaza de Armas de Trujillo. Acabados de primera y cocina equipada.',
      type: PropertyType.DEPARTAMENTO,
      condition: PropertyCondition.AMOBLADO,
      status: PropertyStatus.OCUPADA,
      district: 'Trujillo',
      address: 'Jr. Bolívar 560',
      area: 65,
      rooms: 2,
      bathrooms: 2,
      parking: 1,
      price: 1200,
      deposit: 1,
      minDuration: 12,
      amenities: ['WiFi', 'Cable TV', 'Agua incluida', 'Seguridad 24h', 'Ascensor'],
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
        'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80',
      ],
      tenantProfile: ['profesional', 'pareja'],
      views: 289,
      favorites: 41,
      ownerId: landlord2.id,
    },
  })

  const property8 = await prisma.property.create({
    data: {
      title: 'Departamento familiar en Víctor Larco',
      description: 'Departamento amplio en zona residencial de Víctor Larco. 3 dormitorios, ideal para familias.',
      type: PropertyType.DEPARTAMENTO,
      condition: PropertyCondition.SIN_MUEBLES,
      status: PropertyStatus.DISPONIBLE,
      district: 'Víctor Larco Herrera',
      address: 'Av. Húsares de Junín 780',
      area: 95,
      rooms: 3,
      bathrooms: 2,
      parking: 1,
      price: 1500,
      deposit: 2,
      minDuration: 12,
      amenities: ['WiFi', 'Agua incluida', 'Ascensor', 'Seguridad 24h'],
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
        'https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=800&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80',
        'https://images.unsplash.com/photo-1613575831056-0acd5da8f085?w=800&q=80',
      ],
      tenantProfile: ['familia'],
      views: 176,
      favorites: 22,
      ownerId: landlord3.id,
    },
  })

  const property9 = await prisma.property.create({
    data: {
      title: 'Depa amoblado cerca al Real Plaza',
      description: 'Departamento amoblado a 5 minutos del Real Plaza Trujillo. Muy bien ubicado, cerca a bancos y centros comerciales.',
      type: PropertyType.DEPARTAMENTO,
      condition: PropertyCondition.AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'Trujillo',
      address: 'Av. Mansiche 1450',
      area: 58,
      rooms: 2,
      bathrooms: 1,
      parking: 1,
      price: 1100,
      deposit: 1,
      minDuration: 12,
      amenities: ['WiFi', 'Cable TV', 'Completamente amoblado', 'Electrodomésticos'],
      images: [
        'https://images.unsplash.com/photo-1628592102751-ba83b0314276?w=800&q=80',
        'https://images.unsplash.com/photo-1675279200694-8529c73b1fd0?w=800&q=80',
        'https://images.unsplash.com/photo-1585128792020-803d29415281?w=800&q=80',
        'https://images.unsplash.com/photo-1665249934445-1de680641f50?w=800&q=80',
        'https://images.unsplash.com/photo-1612320648993-61c1cd604b71?w=800&q=80',
      ],
      tenantProfile: ['profesional'],
      views: 143,
      favorites: 17,
      ownerId: landlord1.id,
    },
  })

  const property10 = await prisma.property.create({
    data: {
      title: 'Departamento con vista al mar en Huanchaco',
      description: 'Departamento con vista al mar en Huanchaco, a pocos metros de la playa. Ideal para extranjeros y profesionales remotos.',
      type: PropertyType.DEPARTAMENTO,
      condition: PropertyCondition.AMOBLADO,
      status: PropertyStatus.OCUPADA,
      district: 'Huanchaco',
      address: 'Malecón Larco 320',
      area: 72,
      rooms: 2,
      bathrooms: 2,
      parking: 1,
      price: 1600,
      deposit: 1,
      minDuration: 6,
      amenities: ['WiFi', 'Vista al mar', 'Cable TV', 'Completamente amoblado', 'Seguridad 24h'],
      images: [
        'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=800&q=80',
        'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80',
        'https://images.unsplash.com/photo-1617228069096-4638a7ffc906?w=800&q=80',
        'https://images.unsplash.com/photo-1622372738946-62e02505feb3?w=800&q=80',
        'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80',
      ],
      tenantProfile: ['profesional', 'extranjero'],
      views: 312,
      favorites: 46,
      ownerId: landlord1.id,
    },
  })

  const property11 = await prisma.property.create({
    data: {
      title: 'Mini departamento para estudiante en Trujillo',
      description: 'Mini departamento tipo estudio a 10 minutos de la UNT. Cocina y baño privado, ideal para estudiante independiente.',
      type: PropertyType.DEPARTAMENTO,
      condition: PropertyCondition.AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'Trujillo',
      address: 'Jr. Pizarro 670',
      area: 28,
      rooms: 1,
      bathrooms: 1,
      parking: 0,
      price: 700,
      deposit: 1,
      minDuration: 6,
      amenities: ['WiFi', 'Cocina equipada', 'Baño privado', 'Escritorio'],
      images: [
        'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80',
        'https://images.unsplash.com/photo-1632583824020-937ae9564495?w=800&q=80',
        'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=800&q=80',
        'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=800&q=80',
        'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&q=80',
      ],
      tenantProfile: ['estudiante', 'profesional'],
      views: 167,
      favorites: 21,
      ownerId: landlord4.id,
    },
  })

  const property12 = await prisma.property.create({
    data: {
      title: 'Depa luminoso en La Esperanza',
      description: 'Departamento luminoso y bien ventilado en La Esperanza. Acabados modernos, cerca a avenidas principales.',
      type: PropertyType.DEPARTAMENTO,
      condition: PropertyCondition.SIN_MUEBLES,
      status: PropertyStatus.DISPONIBLE,
      district: 'La Esperanza',
      address: 'Av. Miguel Grau 210',
      area: 60,
      rooms: 2,
      bathrooms: 1,
      parking: 1,
      price: 850,
      deposit: 1,
      minDuration: 12,
      amenities: ['WiFi', 'Agua incluida', 'Buena iluminación'],
      images: [
        'https://images.unsplash.com/photo-1600684388091-627109f3cd60?w=800&q=80',
        'https://images.unsplash.com/photo-1628745277862-bc0b2d68c50c?w=800&q=80',
        'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&q=80',
        'https://images.unsplash.com/photo-1610177534644-34d881503b83?w=800&q=80',
        'https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?w=800&q=80',
      ],
      tenantProfile: ['pareja', 'profesional'],
      views: 121,
      favorites: 13,
      ownerId: landlord3.id,
    },
  })

  const property13 = await prisma.property.create({
    data: {
      title: 'Casa familiar en Moche cerca a las Huacas',
      description: 'Casa familiar en Moche, a pocos minutos de las Huacas del Sol y de la Luna. Zona tranquila y residencial.',
      type: PropertyType.CASA,
      condition: PropertyCondition.SIN_MUEBLES,
      status: PropertyStatus.DISPONIBLE,
      district: 'Moche',
      address: 'Calle Grau 145',
      area: 130,
      rooms: 3,
      bathrooms: 2,
      parking: 1,
      price: 1400,
      deposit: 2,
      minDuration: 12,
      amenities: ['WiFi', 'Jardín', 'Cochera', 'Mascotas OK'],
      images: [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      ],
      tenantProfile: ['familia'],
      views: 154,
      favorites: 18,
      ownerId: landlord2.id,
    },
  })

  const property14 = await prisma.property.create({
    data: {
      title: 'Casa con jardín en Víctor Larco Herrera',
      description: 'Amplia casa familiar en zona residencial de Víctor Larco. Jardín, cochera para 2 autos y 4 dormitorios.',
      type: PropertyType.CASA,
      condition: PropertyCondition.SIN_MUEBLES,
      status: PropertyStatus.DISPONIBLE,
      district: 'Víctor Larco Herrera',
      address: 'Av. Larco 3400',
      area: 190,
      rooms: 4,
      bathrooms: 3,
      parking: 2,
      price: 2200,
      deposit: 2,
      minDuration: 12,
      amenities: ['WiFi', 'Cable TV', 'Jardín', 'Cochera doble', 'Seguridad 24h', 'Mascotas OK'],
      images: [
        'https://images.unsplash.com/photo-1756706718604-ef4af3970e33?w=800&q=80',
        'https://images.unsplash.com/photo-1712124343150-f33fa86e431f?w=800&q=80',
        'https://images.unsplash.com/photo-1711453414798-e8d60c8731a9?w=800&q=80',
        'https://images.unsplash.com/photo-1711452183732-1899e63cf0b3?w=800&q=80',
        'https://images.unsplash.com/photo-1712079081178-a77e00259252?w=800&q=80',
      ],
      tenantProfile: ['familia'],
      views: 198,
      favorites: 25,
      ownerId: landlord1.id,
    },
  })

  const property15 = await prisma.property.create({
    data: {
      title: 'Casa de playa en Huanchaco',
      description: 'Casa de playa a una cuadra del malecón de Huanchaco. Perfecta para familias o grupos que buscan vivir cerca al mar.',
      type: PropertyType.CASA,
      condition: PropertyCondition.SEMI_AMOBLADO,
      status: PropertyStatus.DISPONIBLE,
      district: 'Huanchaco',
      address: 'Los Tumbos 88',
      area: 160,
      rooms: 3,
      bathrooms: 2,
      parking: 1,
      price: 2500,
      deposit: 2,
      minDuration: 6,
      amenities: ['WiFi', 'Vista al mar', 'Terraza', 'Cochera', 'Semi amoblada'],
      images: [
        'https://images.unsplash.com/photo-1712079080919-79043a557e85?w=800&q=80',
        'https://images.unsplash.com/photo-1712123748043-9d0602c59f79?w=800&q=80',
        'https://images.unsplash.com/photo-1712123482365-d5da7689800f?w=800&q=80',
        'https://images.unsplash.com/photo-1712123927512-042489706822?w=800&q=80',
        'https://images.unsplash.com/photo-1712079080934-a7ed8bc4fff9?w=800&q=80',
      ],
      tenantProfile: ['familia', 'extranjero'],
      views: 267,
      favorites: 39,
      ownerId: landlord4.id,
    },
  })

  const property16 = await prisma.property.create({
    data: {
      title: 'Casa amplia en El Porvenir',
      description: 'Casa amplia en zona residencial de El Porvenir. Buena alternativa económica para familias.',
      type: PropertyType.CASA,
      condition: PropertyCondition.SIN_MUEBLES,
      status: PropertyStatus.DISPONIBLE,
      district: 'El Porvenir',
      address: 'Jr. Vencedores de Chan Chan 512',
      area: 140,
      rooms: 3,
      bathrooms: 2,
      parking: 1,
      price: 1200,
      deposit: 1,
      minDuration: 12,
      amenities: ['WiFi', 'Jardín', 'Cochera'],
      images: [
        'https://images.unsplash.com/photo-1712079081150-e3193c14f2c7?w=800&q=80',
        'https://images.unsplash.com/photo-1712079325210-5b4f2383ead2?w=800&q=80',
        'https://images.unsplash.com/photo-1712079324278-a20c961d44a1?w=800&q=80',
        'https://images.unsplash.com/photo-1712123748456-e5f2fcaca984?w=800&q=80',
        'https://images.unsplash.com/photo-1712079082140-b34e2168b528?w=800&q=80',
      ],
      tenantProfile: ['familia'],
      views: 112,
      favorites: 11,
      ownerId: landlord3.id,
    },
  })

  console.log('✅ Propiedades creadas (16 total en Trujillo, La Esperanza, El Porvenir, Víctor Larco Herrera, Moche y Huanchaco)')

  // Crear contratos
  const contract1 = await prisma.contract.create({
    data: {
      propertyId: property4.id,
      landlordId: landlord1.id,
      tenantId: tenant1.id,
      status: ContractStatus.ACTIVE,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      monthlyRent: 550,
      deposit: 550,
      landlordSignedAt: new Date('2025-12-20'),
      tenantSignedAt: new Date('2025-12-22'),
    },
  })

  const contract2 = await prisma.contract.create({
    data: {
      propertyId: property7.id,
      landlordId: landlord2.id,
      tenantId: tenant2.id,
      status: ContractStatus.ACTIVE,
      startDate: new Date('2026-02-01'),
      endDate: new Date('2027-01-31'),
      monthlyRent: 1200,
      deposit: 1200,
      landlordSignedAt: new Date('2026-01-25'),
      tenantSignedAt: new Date('2026-01-26'),
    },
  })

  const contract3 = await prisma.contract.create({
    data: {
      propertyId: property10.id,
      landlordId: landlord1.id,
      tenantId: tenant3.id,
      status: ContractStatus.ACTIVE,
      startDate: new Date('2026-04-01'),
      endDate: new Date('2027-03-31'),
      monthlyRent: 1600,
      deposit: 1600,
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
      amount: 550,
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
      amount: 1200,
      dueDate: new Date('2026-04-05'),
      status: PaymentStatus.PENDIENTE,
    },
  })

  await prisma.payment.create({
    data: {
      contractId: contract3.id,
      landlordId: landlord1.id,
      tenantId: tenant3.id,
      amount: 1600,
      dueDate: new Date('2026-04-01'),
      status: PaymentStatus.EN_PROCESO,
      paymentMethod: 'Yape',
    },
  })

  console.log('✅ Pagos creados')

  // Crear reseñas
  await prisma.review.create({
    data: {
      propertyId: property4.id,
      authorId: tenant1.id,
      targetId: landlord1.id,
      rating: 5,
      comment: 'Excelente habitación, muy bien ubicada cerca al Real Plaza. El arrendador responde rápido ante cualquier consulta.',
    },
  })

  await prisma.review.create({
    data: {
      propertyId: property7.id,
      authorId: tenant2.id,
      targetId: landlord2.id,
      rating: 4,
      comment: 'Buen departamento en pleno centro de Trujillo. Todo cerca, aunque a veces hay ruido de la avenida.',
    },
  })

  console.log('✅ Reseñas creadas')

  // Crear notificaciones
  await prisma.notification.create({
    data: {
      userId: landlord1.id,
      type: NotificationType.PAYMENT_SUCCESS,
      title: 'Pago recibido',
      message: 'Brayan Torres ha pagado S/ 550 por el mes de abril',
      metadata: { contractId: contract1.id, amount: 550 },
    },
  })

  await prisma.notification.create({
    data: {
      userId: landlord2.id,
      type: NotificationType.PAYMENT_SUBMIT,
      title: 'Pago pendiente',
      message: 'Fiorella Castillo tiene un pago pendiente de S/ 1,200',
      metadata: { contractId: contract2.id, amount: 1200 },
    },
  })

  console.log('✅ Notificaciones creadas')

  console.log('\n🎉 Seed completado exitosamente!')
  console.log('\n📧 Credenciales de prueba (todas con password123):')
  console.log('Admin: admin@habitaperu.pe')
  console.log('Arrendadores: jose.chavez@email.com, lucia.saldana@email.com, manuel.quiroz@email.com, patricia.rios@email.com')
  console.log('Inquilinos: brayan.torres@email.com (KYC aprobado), fiorella.castillo@email.com (KYC en revisión),')
  console.log('            diego.mendoza@email.com (sin KYC, con contrato), karla.benites@email.com (KYC rechazado),')
  console.log('            renzo.aguilar@email.com (sin KYC, sin contrato), valeria.cruz@email.com (KYC aprobado, sin contrato)')
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
