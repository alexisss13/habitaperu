'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n-context'

const FAQS = [
  {
    question: '¿Cómo alquilo una propiedad en Habita Perú?',
    answer: 'Busca una propiedad en la sección "Propiedades", contacta al arrendador por WhatsApp desde la ficha del inmueble. El arrendador es quien inicia el contrato desde su panel una vez que se ponen de acuerdo — tú solo debes tener tu cuenta creada y tu identidad verificada (KYC) para poder firmarlo.',
  },
  {
    question: '¿Por qué necesito verificar mi identidad (KYC)?',
    answer: 'La verificación de identidad le da validez legal a la firma electrónica de tu contrato, previniendo suplantaciones. Se hace con la cámara de tu dispositivo: una foto de tu DNI y una selfie, que se comparan automáticamente.',
  },
  {
    question: '¿Cómo publico una propiedad como arrendador?',
    answer: 'Cualquier cuenta puede publicar una propiedad desde "Publicar propiedad". Al hacerlo, tu cuenta gana automáticamente la capacidad de arrendador, sin perder tu rol original.',
  },
  {
    question: '¿Cómo funcionan los pagos de alquiler?',
    answer: 'Cada mes, el sistema genera automáticamente un pago pendiente en tu contrato. Subes tu comprobante (transferencia, Yape, Plin, etc.) y el arrendador lo aprueba desde su panel.',
  },
  {
    question: '¿Qué pasa si mi expediente KYC no se aprueba automáticamente?',
    answer: 'Si la coincidencia entre tu selfie y tu DNI es baja, tu expediente pasa a revisión manual por el equipo de Habita Perú, con una respuesta en un máximo de 24 horas hábiles.',
  },
  {
    question: '¿Puedo cancelar un contrato antes de que termine?',
    answer: 'Sí, el arrendador puede dar por finalizado un contrato desde su panel conforme a la normativa de arrendamiento vigente en el Perú. Te recomendamos revisar las condiciones pactadas en tu contrato antes de solicitarlo.',
  },
]

export default function AyudaPage() {
  const locale = useLocale()
  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 md:pt-40 pb-16">
      <h1 className="text-3xl font-bold text-[#151c26] mb-2">Centro de ayuda</h1>
      <p className="text-gray-500 mb-10">Respuestas a las preguntas más frecuentes sobre Habita Perú.</p>

      <div className="flex flex-col gap-6">
        {FAQS.map((faq) => (
          <div key={faq.question} className="border border-gray-200 rounded-2xl p-6">
            <h2 className="text-base font-bold text-[#151c26] mb-2">{faq.question}</h2>
            <p className="text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t border-gray-200 pt-8 text-sm text-gray-500">
        ¿No encontraste lo que buscabas? Escríbenos desde la página de{' '}
        <Link href={`/${locale}/contacto`} className="text-accent font-semibold no-underline">contacto</Link>.
      </div>
    </div>
  )
}
