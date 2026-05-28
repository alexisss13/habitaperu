import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { ContractsView } from "./contracts-view"

export const dynamic = 'force-dynamic'

export default async function LandlordContractsPage() {
  const session = await auth()

  if (!session || session.user.role !== "LANDLORD") {
    redirect("/login")
  }

  const landlordId = session.user.id

  // Fetch landlord details
  const landlord = await prisma.user.findUnique({
    where: { id: landlordId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      dni: true,
      phone: true,
      district: true,
      email: true,
    },
  })

  if (!landlord) {
    redirect("/login")
  }

  // 1. Obtener contratos del arrendador
  const contracts = await prisma.contract.findMany({
    where: { landlordId },
    include: {
      tenant: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          price: true,
          district: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // 2. Obtener propiedades disponibles del arrendador (para crear nuevo contrato)
  const properties = await prisma.property.findMany({
    where: {
      ownerId: landlordId,
      status: 'DISPONIBLE',
    },
    select: {
      id: true,
      title: true,
      price: true,
      district: true,
      address: true,
      type: true,
      area: true,
      rooms: true,
      bathrooms: true,
    },
  })

  // 3. Obtener todos los inquilinos para el dropdown de selección
  const tenants = await prisma.user.findMany({
    where: {
      role: 'TENANT',
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      dni: true,
      email: true,
      phone: true,
      district: true,
    },
  })

  const serializedLandlord = JSON.parse(JSON.stringify(landlord))
  const serializedContracts = JSON.parse(JSON.stringify(contracts))
  const serializedProperties = JSON.parse(JSON.stringify(properties))
  const serializedTenants = JSON.parse(JSON.stringify(tenants))

  return (
    <ContractsView 
      landlord={serializedLandlord}
      contracts={serializedContracts} 
      properties={serializedProperties}
      tenants={serializedTenants}
    />
  )
}
