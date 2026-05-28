import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Home01Icon, ArrowRight01Icon } from "hugeicons-react"

export const dynamic = "force-dynamic"

export default async function PublicarFormularioPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await auth()

  // Already a LANDLORD → send directly to the property form
  if (session?.user && (session.user as any).role === "LANDLORD") {
    redirect("/landlord/properties/new")
  }

  // Already a TENANT → can't publish, explain why
  if (session?.user && (session.user as any).role === "TENANT") {
    return (
      <div className="min-h-screen bg-gray-50 pt-[112px] flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md w-full text-center">
          <div
            className="size-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "linear-gradient(135deg, #0f3457 0%, #8f8272 100%)" }}
          >
            <Home01Icon size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-extrabold text-[#151c26] mb-2">
            Tu cuenta es de inquilino
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Para publicar propiedades necesitas una cuenta de arrendador.
            Puedes crear una cuenta separada o contactarnos para cambiar tu rol.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href={`/${locale}/register?role=LANDLORD`}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white no-underline hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #0f3457 0%, #8f8272 100%)" }}
            >
              Crear cuenta de arrendador
              <ArrowRight01Icon size={15} />
            </Link>
            <Link
              href="/tenant/dashboard"
              className="text-sm font-semibold text-accent no-underline hover:underline"
            >
              Volver a mi panel
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Not logged in → show landing + CTA to register as landlord
  return (
    <div className="min-h-screen bg-gray-50 pt-[112px] flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md w-full text-center">
        <div
          className="size-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: "linear-gradient(135deg, #0f3457 0%, #8f8272 100%)" }}
        >
          <Home01Icon size={28} className="text-white" />
        </div>
        <h1 className="text-xl font-extrabold text-[#151c26] mb-2">
          Publica tu propiedad
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Para publicar una propiedad en Habita Perú necesitas una cuenta de arrendador.
          El proceso toma menos de 2 minutos.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href={`/${locale}/register?role=LANDLORD`}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white no-underline hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #0f3457 0%, #8f8272 100%)" }}
          >
            Crear cuenta gratis
            <ArrowRight01Icon size={15} />
          </Link>
          <Link
            href={`/${locale}/login`}
            className="text-sm font-semibold text-accent no-underline hover:underline"
          >
            Ya tengo cuenta — Iniciar sesión
          </Link>
        </div>

        {/* Benefits */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-left">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
            ¿Por qué Habita Perú?
          </p>
          <ul className="space-y-2">
            {[
              "Contratos digitales con validez legal (Ley 27269)",
              "Verificación de identidad de inquilinos (KYC)",
              "Control de pagos y registro de morosidad",
              "Firma electrónica Clickwrap (Ley 30201)",
            ].map(b => (
              <li key={b} className="flex items-start gap-2 text-xs text-gray-500">
                <span className="text-green font-bold mt-0.5">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
