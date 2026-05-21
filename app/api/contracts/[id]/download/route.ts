/**
 * app/api/contracts/[id]/download/route.ts
 *
 * API Route segura para descarga del contrato en formato PDF.
 * Solo el landlord o el tenant asociados al contractId pueden acceder.
 *
 * Seguridad Zero-Trust:
 *  - Valida JWT vía NextAuth v5 antes de cualquier consulta a DB.
 *  - Verifica titularidad del contrato (landlordId o tenantId).
 *  - Headers HTTP estrictos: no-store, Content-Disposition attachment.
 *
 * Generación de PDF:
 *  - Usa jsPDF (puro JavaScript, sin binarios nativos) para convertir
 *    el HTML del contrato a PDF con layout A4.
 *  - El texto se extrae del HTML y se renderiza con fuentes embebidas.
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { generatePeruvianLeaseAgreement } from "@/lib/services/contract-engine"
import { Role } from "@prisma/client"
import { jsPDF } from "jspdf"

// ─────────────────────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────────────────────

interface RouteParams {
  params: Promise<{ id: string }>
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilidad: extraer texto plano del HTML del contrato para jsPDF
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convierte el HTML del contrato a un array de líneas de texto plano
 * preservando la estructura de cláusulas para el PDF.
 * jsPDF no renderiza HTML directamente; trabajamos con texto estructurado.
 */
function extractStructuredTextFromHtml(html: string): Array<{
  text: string
  isBold: boolean
  isTitle: boolean
  isSubtitle: boolean
  indent: number
}> {
  const lines: Array<{
    text: string
    isBold: boolean
    isTitle: boolean
    isSubtitle: boolean
    indent: number
  }> = []

  // Extraer el contenido del body
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  if (!bodyMatch) return lines

  let content = bodyMatch[1]

  // Eliminar el bloque <style>
  content = content.replace(/<style[\s\S]*?<\/style>/gi, "")

  // Procesar h1 → título principal
  content = content.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, inner) => {
    const text = inner.replace(/<[^>]+>/g, "").trim()
    lines.push({ text, isBold: true, isTitle: true, isSubtitle: false, indent: 0 })
    return ""
  })

  // Procesar h2 → subtítulos de sección
  content = content.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, inner) => {
    const text = inner.replace(/<[^>]+>/g, "").trim()
    lines.push({ text: "", isBold: false, isTitle: false, isSubtitle: false, indent: 0 })
    lines.push({ text, isBold: true, isTitle: false, isSubtitle: true, indent: 0 })
    return ""
  })

  // Procesar <li> → ítems de lista con indentación
  content = content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, inner) => {
    const text = inner.replace(/<[^>]+>/g, "").trim()
    if (text) {
      lines.push({ text: `  • ${text}`, isBold: false, isTitle: false, isSubtitle: false, indent: 8 })
    }
    return ""
  })

  // Procesar <p> y <div class="clause"> → párrafos normales
  content = content.replace(/<(?:p|div)[^>]*>([\s\S]*?)<\/(?:p|div)>/gi, (_, inner) => {
    const text = inner.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
    if (text && text.length > 2) {
      lines.push({ text, isBold: false, isTitle: false, isSubtitle: false, indent: 0 })
    }
    return ""
  })

  // Procesar <td> → celdas de tabla de partes
  content = content.replace(/<td[^>]*>([\s\S]*?)<\/td>/gi, (_, inner) => {
    const text = inner.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
    if (text && text.length > 2) {
      lines.push({ text: `  ${text}`, isBold: false, isTitle: false, isSubtitle: false, indent: 4 })
    }
    return ""
  })

  // Filtrar líneas vacías duplicadas
  return lines.filter((line) => line.text.trim().length > 0)
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilidad: generar PDF con jsPDF
// ─────────────────────────────────────────────────────────────────────────────

function generatePdfBuffer(
  contractId: string,
  html: string,
  documentHash: string,
): ArrayBuffer {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const marginLeft = 20
  const marginRight = 20
  const marginTop = 20
  const marginBottom = 25
  const contentWidth = pageWidth - marginLeft - marginRight
  let cursorY = marginTop

  // ── Función auxiliar: añadir nueva página si es necesario ──────────────────
  function checkPageBreak(lineHeight: number): void {
    if (cursorY + lineHeight > pageHeight - marginBottom) {
      doc.addPage()
      cursorY = marginTop
      addPageFooter()
    }
  }

  // ── Footer de cada página ──────────────────────────────────────────────────
  function addPageFooter(): void {
    const pageCount = doc.getNumberOfPages()
    doc.setFontSize(7)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(120, 120, 120)
    doc.text(
      `Habita Perú — Contrato ${contractId} — Página ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" },
    )
    doc.text(
      `Hash SHA-256: ${documentHash.substring(0, 32)}...`,
      pageWidth / 2,
      pageHeight - 6,
      { align: "center" },
    )
    doc.setTextColor(0, 0, 0)
  }

  // ── Encabezado de primera página ──────────────────────────────────────────
  doc.setFillColor(30, 64, 175) // azul Habita Perú
  doc.rect(0, 0, pageWidth, 14, "F")
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(255, 255, 255)
  doc.text("HABITA PERÚ — MOTOR LEGALTECH", pageWidth / 2, 9, { align: "center" })
  doc.setTextColor(0, 0, 0)
  cursorY = 22

  // ── Procesar líneas del HTML ───────────────────────────────────────────────
  const structuredLines = extractStructuredTextFromHtml(html)

  for (const line of structuredLines) {
    if (line.isTitle) {
      doc.setFontSize(13)
      doc.setFont("helvetica", "bold")
      const titleLines = doc.splitTextToSize(line.text, contentWidth)
      for (const tl of titleLines) {
        checkPageBreak(7)
        doc.text(tl, pageWidth / 2, cursorY, { align: "center" })
        cursorY += 7
      }
      cursorY += 3
    } else if (line.isSubtitle) {
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(30, 64, 175)
      checkPageBreak(6)
      doc.text(line.text.toUpperCase(), marginLeft, cursorY)
      cursorY += 6
      // Línea decorativa bajo el subtítulo
      doc.setDrawColor(30, 64, 175)
      doc.setLineWidth(0.3)
      doc.line(marginLeft, cursorY - 1, pageWidth - marginRight, cursorY - 1)
      doc.setTextColor(0, 0, 0)
      cursorY += 2
    } else if (line.isBold) {
      doc.setFontSize(9)
      doc.setFont("helvetica", "bold")
      const boldLines = doc.splitTextToSize(line.text, contentWidth - line.indent)
      for (const bl of boldLines) {
        checkPageBreak(5)
        doc.text(bl, marginLeft + line.indent, cursorY)
        cursorY += 5
      }
    } else {
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      const normalLines = doc.splitTextToSize(line.text, contentWidth - line.indent)
      for (const nl of normalLines) {
        checkPageBreak(5)
        doc.text(nl, marginLeft + line.indent, cursorY)
        cursorY += 5
      }
      cursorY += 1
    }
  }

  // ── Sección de hash al final del documento ────────────────────────────────
  cursorY += 6
  checkPageBreak(20)
  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.text("SELLO DE INTEGRIDAD CRIPTOGRÁFICA (SHA-256):", marginLeft, cursorY)
  cursorY += 5
  doc.setFont("courier", "normal")
  doc.setFontSize(7)
  doc.setTextColor(60, 60, 60)
  const hashLines = doc.splitTextToSize(documentHash, contentWidth)
  for (const hl of hashLines) {
    checkPageBreak(5)
    doc.text(hl, marginLeft, cursorY)
    cursorY += 5
  }
  doc.setTextColor(0, 0, 0)

  // ── Footer de la última página ────────────────────────────────────────────
  addPageFooter()

  return doc.output("arraybuffer")
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/contracts/[id]/download
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  try {
    // ── 1. Autenticación ──────────────────────────────────────────────────────
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "No autenticado. Inicia sesión para descargar el contrato." },
        { status: 401 },
      )
    }

    const userId = (session.user as { id: string; role: Role }).id
    const { id: contractId } = await params

    if (!contractId || typeof contractId !== "string") {
      return NextResponse.json(
        { error: "ID de contrato inválido." },
        { status: 400 },
      )
    }

    // ── 2. Obtener contrato con datos completos para generar el PDF ───────────
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
          },
        },
      },
    })

    if (!contract) {
      return NextResponse.json(
        { error: "Contrato no encontrado." },
        { status: 404 },
      )
    }

    // ── 3. Autorización: solo landlord o tenant del contrato ──────────────────
    const isLandlord = contract.landlordId === userId
    const isTenant = contract.tenantId === userId

    if (!isLandlord && !isTenant) {
      return NextResponse.json(
        { error: "No tienes permiso para descargar este contrato." },
        { status: 403 },
      )
    }

    // ── 4. Verificar que el contrato tiene documentHash ───────────────────────
    if (!contract.documentHash) {
      return NextResponse.json(
        { error: "El contrato aún no tiene un documento generado." },
        { status: 422 },
      )
    }

    // ── 5. Validar que los datos del DNI están presentes ──────────────────────
    if (!contract.landlord.dni || !contract.tenant.dni) {
      return NextResponse.json(
        { error: "Datos incompletos del contrato. Verifique la información de las partes." },
        { status: 422 },
      )
    }

    // ── 6. Regenerar el HTML del contrato para el PDF ─────────────────────────
    const contractData = {
      contractId: contract.id,
      landlord: {
        fullName: `${contract.landlord.firstName} ${contract.landlord.lastName}`,
        dni: contract.landlord.dni,
        email: contract.landlord.email,
        phone: contract.landlord.phone ?? "No registrado",
        address: contract.landlord.district ?? "Lima",
        district: contract.landlord.district ?? "Lima",
      },
      tenant: {
        fullName: `${contract.tenant.firstName} ${contract.tenant.lastName}`,
        dni: contract.tenant.dni,
        email: contract.tenant.email,
        phone: contract.tenant.phone ?? "No registrado",
        address: contract.tenant.district ?? "Lima",
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
        } catch {
          // terms no es JSON válido — usar default
        }
        return {
          provider: "BCP" as const,
          accountNumber: "Consultar con el arrendador",
          accountHolder: `${contract.landlord.firstName} ${contract.landlord.lastName}`,
        }
      })(),
    }

    const html = generatePeruvianLeaseAgreement(contractData)

    // ── 7. Generar PDF con jsPDF ──────────────────────────────────────────────
    const pdfBuffer = generatePdfBuffer(contract.id, html, contract.documentHash)

    // ── 8. Respuesta con headers HTTP estrictos ───────────────────────────────
    const filename = `contrato-habita-peru-${contract.id}.pdf`

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        // Seguridad: no cachear documentos legales con datos personales
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        // Prevenir que el navegador adivine el tipo de contenido
        "X-Content-Type-Options": "nosniff",
        // Identificador del contrato en los headers para trazabilidad
        "X-Contract-Id": contract.id,
        "X-Document-Hash": contract.documentHash,
      },
    })
  } catch (error: unknown) {
    console.error("[GET /api/contracts/[id]/download] Error:", error)
    return NextResponse.json(
      { error: "Error interno al generar el PDF. Intente nuevamente." },
      { status: 500 },
    )
  }
}
