const SECTIONS = [
  {
    title: '1. Objeto',
    body: 'Habita Perú es una plataforma que conecta a arrendadores e inquilinos en el Perú, facilitando la publicación de propiedades, la verificación de identidad, la firma electrónica de contratos de arrendamiento y el registro de pagos de renta.',
  },
  {
    title: '2. Registro de cuenta',
    body: 'Para usar la plataforma debes crear una cuenta con información veraz. Cualquier cuenta puede publicar propiedades (ganando así la capacidad de arrendador) o postular como inquilino a un contrato.',
  },
  {
    title: '3. Verificación de identidad (KYC)',
    body: 'Para firmar un contrato como inquilino, se requiere verificar tu identidad mediante una foto de tu documento de identidad y una selfie, conforme a la Ley N° 30933 (desalojo exprés) y la Ley N° 30201 (allanamiento futuro), que exigen validar la identidad del firmante.',
  },
  {
    title: '4. Responsabilidades del arrendador',
    body: 'El arrendador es responsable de la veracidad de la información publicada sobre su propiedad, de iniciar y gestionar el contrato con el inquilino que elija, y de aprobar o rechazar los comprobantes de pago recibidos.',
  },
  {
    title: '5. Responsabilidades del inquilino',
    body: 'El inquilino es responsable de completar su verificación de identidad, revisar el contrato antes de firmarlo, y realizar los pagos de renta en los plazos acordados, subiendo el comprobante correspondiente.',
  },
  {
    title: '6. Pagos y comisiones de la plataforma',
    body: 'El pago de la renta mensual se realiza directamente entre arrendador e inquilino (transferencia, Yape, Plin u otro medio), mediante la carga de un comprobante. Habita Perú puede cobrar comisiones independientes por servicios de la plataforma, como destacar una publicación o planes de suscripción para arrendadores.',
  },
  {
    title: '7. Terminación de contratos',
    body: 'Los contratos pueden finalizar por vencimiento del plazo pactado o darse por terminados anticipadamente conforme a la normativa peruana de arrendamiento vigente y a las condiciones específicas pactadas en cada contrato.',
  },
  {
    title: '8. Limitación de responsabilidad',
    body: 'Habita Perú actúa como intermediario tecnológico. No es parte del contrato de arrendamiento y no garantiza el cumplimiento de las obligaciones entre arrendador e inquilino, más allá de facilitar la trazabilidad legal del proceso.',
  },
  {
    title: '9. Ley aplicable',
    body: 'Estos términos se rigen por las leyes de la República del Perú.',
  },
]

export default function TerminosPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 md:pt-40 pb-16">
      <h1 className="text-3xl font-bold text-[#151c26] mb-2">Términos de uso</h1>
      <p className="text-gray-500 mb-10">Última actualización: julio de 2026.</p>

      <div className="flex flex-col gap-8">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="text-base font-bold text-[#151c26] mb-2">{section.title}</h2>
            <p className="text-sm text-gray-500 leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
