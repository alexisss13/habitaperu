import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect, notFound } from "next/navigation"
import { generatePeruvianLeaseAgreement } from "@/lib/services/contract-engine"
import { recordContractView } from "@/app/actions/contract-actions"
import { ContractClient } from "./contract-client"
import { CULQI_IS_MOCK } from "@/lib/culqi"

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string; locale: string }>
}

export default async function ContractPage({ params }: Props) {
  const { id: contractId, locale } = await params
  const session = await auth()

  if (!session?.user) {
    redirect(`/${locale}/login?callbackUrl=/contracts/${contractId}`)
  }

  const userId = session.user.id

  // Fetch contract from DB with related entities
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: {
      landlord: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          dni: true,
          email: true,
          phone: true,
          district: true,
        },
      },
      tenant: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          dni: true,
          email: true,
          phone: true,
          district: true,
        },
      },
      property: {
        select: {
          id: true,
          address: true,
          district: true,
          type: true,
          area: true,
          rooms: true,
          bathrooms: true,
          title: true,
        },
      },
    },
  })

  if (!contract) {
    notFound()
  }

  // Authorize: landlord/tenant of the contract, or an admin (read-only oversight)
  const isLandlord = contract.landlordId === userId
  const isTenant = contract.tenantId === userId
  const isAdmin = session.user.role === "ADMIN"

  if (!isLandlord && !isTenant && !isAdmin) {
    redirect(`/${locale}/login?error=Unauthorized`)
  }

  const backHref = isLandlord ? "/landlord/contracts" : isAdmin ? "/admin/contracts" : "/tenant/contract"

  const landlordUser = await prisma.user.findUnique({
    where: { id: contract.landlordId },
    select: { subscriptionPlan: true },
  })
  const landlordSubscriptionPlan = landlordUser?.subscriptionPlan ?? "FREE"

  // Record viewed action in Audit Trail (Clickwrap)
  await recordContractView(contractId)

  // Map to ContractData for generatePeruvianLeaseAgreement
  const contractData = {
    contractId: contract.id,
    landlord: {
      fullName: `${contract.landlord.firstName} ${contract.landlord.lastName}`,
      dni: /^\d{8}$/.test(contract.landlord.dni ?? "") ? contract.landlord.dni! : "00000000",
      email: contract.landlord.email,
      phone: contract.landlord.phone ?? "No registrado",
      address: (() => { const d = contract.landlord.district ?? "Lima"; return d.length >= 5 ? d : `${d}, Perú` })(),
      district: contract.landlord.district ?? "Lima",
    },
    tenant: {
      fullName: `${contract.tenant.firstName} ${contract.tenant.lastName}`,
      dni: /^\d{8}$/.test(contract.tenant.dni ?? "") ? contract.tenant.dni! : "00000000",
      email: contract.tenant.email,
      phone: contract.tenant.phone ?? "No registrado",
      address: (() => { const d = contract.tenant.district ?? "Lima"; return d.length >= 5 ? d : `${d}, Perú` })(),
      district: contract.tenant.district ?? "Lima",
    },
    property: {
      id: contract.property.id,
      address: contract.property.address ?? "Dirección no registrada",
      district: contract.property.district,
      type: contract.property.type,
      area: contract.property.area ?? undefined,
      rooms: contract.property.rooms,
      bathrooms: contract.property.bathrooms,
    },
    monthlyRent: Number(contract.monthlyRent),
    currency: (contract.currency ?? "PEN") as "PEN" | "USD",
    deposit: Number(contract.deposit),
    startDate: contract.startDate,
    endDate: contract.endDate,
    paymentDay: contract.paymentDay,
    paymentAccount: (() => {
      try {
        const parsed = contract.terms ? JSON.parse(contract.terms) : null
        if (
          parsed?.paymentAccount &&
          typeof parsed.paymentAccount.provider === "string" &&
          typeof parsed.paymentAccount.accountNumber === "string" &&
          typeof parsed.paymentAccount.accountHolder === "string"
        ) {
          return parsed.paymentAccount as {
            provider: "Niubiz" | "Culqi" | "Izipay" | "BCP" | "Interbank" | "BBVA"
            accountNumber: string
            accountHolder: string
          }
        }
      } catch {}
      return {
        provider: "BCP" as const,
        accountNumber: "Consultar con el arrendador",
        accountHolder: `${contract.landlord.firstName} ${contract.landlord.lastName}`,
      }
    })(),
  }

  const html = generatePeruvianLeaseAgreement(contractData)

  // Pass necessary info to client view
  return (
    <ContractClient
      contract={JSON.parse(JSON.stringify(contract))}
      html={html}
      isLandlord={isLandlord}
      isTenant={isTenant}
      backHref={backHref}
      locale={locale}
      isMockPayment={CULQI_IS_MOCK}
      landlordSubscriptionPlan={landlordSubscriptionPlan}
    />
  )
}
