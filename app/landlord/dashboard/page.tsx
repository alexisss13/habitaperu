import { DashboardClient } from './dashboard-client'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

async function getDashboardData(landlordId: string) {
  try {
    // Obtener propiedades del arrendador
    const properties = await prisma.property.findMany({
      where: { ownerId: landlordId },
      include: {
        contracts: {
          where: {
            status: 'ACTIVE',
          },
          include: {
            tenant: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    })

    // Calcular métricas
    const totalProperties = properties.length
    const occupiedProperties = properties.filter(p => p.contracts.length > 0).length
    
    
    const monthlyIncome = properties.reduce((total, property) => {
      return total + (property.contracts.length > 0 ? Number(property.price) : 0)
    }, 0)

    // Obtener contratos próximos a vencer (30 días)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    const expiringContracts = await prisma.contract.count({
      where: {
        property: {
          ownerId: landlordId,
        },
        endDate: {
          lte: thirtyDaysFromNow,
          gte: new Date(),
        },
        status: 'ACTIVE',
      },
    })

    // Obtener pagos pendientes y vencidos
    const payments = await prisma.payment.findMany({
      where: {
        contract: {
          property: {
            ownerId: landlordId,
          },
        },
        status: {
          in: ['PENDIENTE', 'VENCIDO'],
        },
      },
      include: {
        contract: {
          include: {
            tenant: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            property: {
              select: {
                title: true,
                district: true,
              },
            },
          },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    })

    // Obtener solicitudes KYC pendientes
    const kycRequests = await prisma.user.findMany({
      where: {
        role: 'TENANT',
        kycVerification: {
          status: 'PENDIENTE',
        },
        contractsAsTenant: {
          some: {
            property: {
              ownerId: landlordId,
            },
          },
        },
      },
      include: {
        kycVerification: true,
      },
      take: 5,
    })

    return {
      metrics: {
        monthlyIncome,
        occupiedProperties,
        totalProperties,
        expiringContracts,
      },
      payments: payments.map(payment => ({
        id: payment.id,
        amount: Number(payment.amount),
        dueDate: payment.dueDate.toISOString(),
        status: payment.status,
        tenant: {
          name: `${payment.contract.tenant.firstName} ${payment.contract.tenant.lastName}`,
          email: payment.contract.tenant.email,
        },
        property: {
          title: payment.contract.property.title,
          district: payment.contract.property.district,
        },
      })),
      kycRequests: kycRequests.map(user => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        kycScore: 85, // Simulado
        kycStatus: 'PENDING',
      })),
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    // Datos de fallback para desarrollo
    return {
      metrics: {
        monthlyIncome: 8400,
        occupiedProperties: 5,
        totalProperties: 6,
        expiringContracts: 2,
      },
      payments: [
        {
          id: '1',
          amount: 1800,
          dueDate: new Date(2026, 4, 15).toISOString(),
          status: 'PENDIENTE',
          tenant: {
            name: 'Carlos Ramírez',
            email: 'carlos.ramirez@email.com',
          },
          property: {
            title: 'Depa en Miraflores',
            district: 'Miraflores',
          },
        },
        {
          id: '2',
          amount: 750,
          dueDate: new Date(2026, 4, 10).toISOString(),
          status: 'VENCIDO',
          tenant: {
            name: 'María López',
            email: 'maria.lopez@email.com',
          },
          property: {
            title: 'Habitación en San Isidro',
            district: 'San Isidro',
          },
        },
      ],
      kycRequests: [
        {
          id: '1',
          name: 'Pedro Sánchez',
          email: 'pedro.sanchez@email.com',
          kycScore: 85,
          kycStatus: 'PENDING',
        },
      ],
    }
  }
}

export default async function LandlordDashboardPage() {
  // Obtener sesión del usuario
  const session = await auth()
  const landlordId = session?.user?.id || 'demo-landlord-id'

  const data = await getDashboardData(landlordId)

  return <DashboardClient data={data} />
}
