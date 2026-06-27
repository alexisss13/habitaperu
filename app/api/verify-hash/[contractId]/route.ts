import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/verify-hash/[contractId]
// Endpoint público para verificación de integridad de contratos
// por notarios, jueces o cualquier tercero (sin autenticación)
export async function GET(_req: NextRequest, { params }: { params: Promise<{ contractId: string }> }) {
  try {
    const { contractId } = await params

    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        landlord: { select: { firstName: true, lastName: true } },
        tenant: { select: { firstName: true, lastName: true } },
        property: { select: { title: true, address: true, district: true } },
        auditLogs: {
          where: { action: "COUNTERSIGNED_LANDLORD" },
          select: { cryptoHash: true, timestamp: true },
          orderBy: { timestamp: "desc" },
          take: 1,
        },
      },
    })

    if (!contract) {
      return NextResponse.json({ error: "Contrato no encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      contractId: contract.id,
      documentHash: contract.documentHash,
      status: contract.status,
      startDate: contract.startDate.toISOString(),
      endDate: contract.endDate.toISOString(),
      createdAt: contract.createdAt.toISOString(),
      landlordSignedAt: contract.landlordSignedAt?.toISOString() ?? null,
      tenantSignedAt: contract.tenantSignedAt?.toISOString() ?? null,
      landlord: contract.landlord,
      tenant: contract.tenant,
      property: contract.property,
      auditCryptoHash: contract.auditLogs[0]?.cryptoHash ?? null,
    })
  } catch (err) {
    console.error("[GET /api/verify-hash]", err)
    return NextResponse.json({ error: "Error al verificar hash del contrato" }, { status: 500 })
  }
}
