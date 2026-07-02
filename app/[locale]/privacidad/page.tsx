const SECTIONS = [
  {
    title: '1. Datos que recopilamos',
    body: 'Datos de registro (nombre, correo, teléfono), datos de tu documento de identidad, una fotografía de tu DNI y una selfie para la verificación biométrica, así como información de tus contratos y pagos dentro de la plataforma.',
  },
  {
    title: '2. Finalidad del tratamiento',
    body: 'Usamos tus datos para verificar tu identidad antes de firmar un contrato, dar validez legal a la firma electrónica, gestionar el registro de pagos de renta, y prevenir suplantaciones de identidad en los contratos de arrendamiento.',
  },
  {
    title: '3. Verificación biométrica',
    body: 'La foto de tu DNI y tu selfie se comparan automáticamente para validar que correspondan a la misma persona. Si la coincidencia es alta, tu verificación se aprueba de forma automática; si es baja, un asesor la revisa manualmente antes de aprobarla o rechazarla.',
  },
  {
    title: '4. Almacenamiento y seguridad',
    body: 'Tus documentos e imágenes se almacenan de forma segura y solo son accesibles por el equipo autorizado de Habita Perú para fines de verificación y auditoría legal de los contratos.',
  },
  {
    title: '5. Tus derechos (ARCO)',
    body: 'Conforme a la Ley N° 29733, Ley de Protección de Datos Personales del Perú, puedes acceder, rectificar, cancelar u oponerte al tratamiento de tus datos personales escribiéndonos desde nuestra página de contacto.',
  },
  {
    title: '6. Ley aplicable',
    body: 'Esta política se rige por la Ley N° 29733, Ley de Protección de Datos Personales, y su reglamento.',
  },
]

export default function PrivacidadPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 md:pt-40 pb-16">
      <h1 className="text-3xl font-bold text-[#151c26] mb-2">Política de privacidad</h1>
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
