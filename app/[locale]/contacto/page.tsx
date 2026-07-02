import { Mail01Icon, WhatsappIcon, Clock01Icon } from 'hugeicons-react'

export default function ContactoPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 md:pt-40 pb-16">
      <h1 className="text-3xl font-bold text-[#151c26] mb-2">Contacto</h1>
      <p className="text-gray-500 mb-10">
        ¿Tienes alguna consulta sobre tu cuenta, un contrato o un pago? Escríbenos por cualquiera de estos medios.
      </p>

      <div className="grid sm:grid-cols-2 gap-5">
        <a
          href="mailto:soporte@habitaperu.pe"
          className="flex items-start gap-3 border border-gray-200 rounded-2xl p-6 no-underline hover:border-accent/40 transition-colors"
        >
          <Mail01Icon size={22} className="text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-[#151c26] mb-1">Correo</p>
            <p className="text-sm text-gray-500">soporte@habitaperu.pe</p>
          </div>
        </a>

        <a
          href="https://wa.me/51999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 border border-gray-200 rounded-2xl p-6 no-underline hover:border-accent/40 transition-colors"
        >
          <WhatsappIcon size={22} className="text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-[#151c26] mb-1">WhatsApp</p>
            <p className="text-sm text-gray-500">+51 999 999 999</p>
          </div>
        </a>
      </div>

      <div className="mt-6 flex items-start gap-3 border border-gray-200 rounded-2xl p-6">
        <Clock01Icon size={22} className="text-accent shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-[#151c26] mb-1">Horario de atención</p>
          <p className="text-sm text-gray-500">Lunes a viernes de 9:00 a.m. a 6:00 p.m.</p>
        </div>
      </div>
    </div>
  )
}
