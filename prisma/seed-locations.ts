import { PrismaClient } from '@prisma/client'

// Trujillo arranca activa (ciudad de lanzamiento); el resto queda cargada
// pero inactiva hasta que el admin decida habilitarla desde /admin/locations.
export const CITIES: { name: string; isActive: boolean; districts: string[] }[] = [
  {
    name: 'Trujillo',
    isActive: true,
    districts: ['Trujillo', 'El Porvenir', 'La Esperanza', 'Víctor Larco Herrera', 'Moche', 'Huanchaco'],
  },
  {
    name: 'Lima',
    isActive: false,
    districts: [
      'Barranco', 'Jesús María', 'La Molina', 'Lince', 'Magdalena',
      'Miraflores', 'Pueblo Libre', 'Rímac', 'San Borja', 'San Isidro',
      'San Miguel', 'Surco',
    ],
  },
  { name: 'Chiclayo', isActive: false, districts: [] },
  { name: 'Arequipa', isActive: false, districts: [] },
  { name: 'Piura', isActive: false, districts: [] },
  { name: 'Cusco', isActive: false, districts: [] },
  { name: 'Ica', isActive: false, districts: [] },
  { name: 'Tacna', isActive: false, districts: [] },
  { name: 'Huancayo', isActive: false, districts: [] },
  { name: 'Iquitos', isActive: false, districts: [] },
  { name: 'Cajamarca', isActive: false, districts: [] },
  { name: 'Puno', isActive: false, districts: [] },
]

export async function seedLocations(prisma: PrismaClient) {
  for (const cityData of CITIES) {
    const city = await prisma.city.upsert({
      where: { name: cityData.name },
      update: {},
      create: { name: cityData.name, isActive: cityData.isActive },
    })

    for (const districtName of cityData.districts) {
      await prisma.district.upsert({
        where: { cityId_name: { cityId: city.id, name: districtName } },
        update: {},
        create: { name: districtName, cityId: city.id, isActive: true },
      })
    }

    console.log(`  ✔ ${cityData.name} (${cityData.isActive ? 'activa' : 'inactiva'}) — ${cityData.districts.length} distritos`)
  }
}

// Permite ejecutarlo solo, de forma idempotente, sin tocar el resto de datos:
// npx tsx prisma/seed-locations.ts
if (require.main === module) {
  const prisma = new PrismaClient()
  console.log('🌱 Sembrando ciudades y distritos (idempotente, no borra datos existentes)...')
  seedLocations(prisma)
    .then(() => console.log('✅ Listo.'))
    .catch((e) => { console.error(e); process.exit(1) })
    .finally(async () => { await prisma.$disconnect() })
}
