"use client"

import Link from "next/link"
import Image from "next/image"
import { useLocale } from "@/lib/i18n-context"

export function Footer() {
  const locale = useLocale()
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <Link href={`/${locale}`} className="no-underline">
              <Image
                src="/habita-logo-horizontal.svg"
                alt="Habita Perú"
                width={180}
                height={48}
                className="h-11 w-auto"
              />
            </Link>
            <p>La plataforma de arrendamiento más confiable del Perú. Gestiona tus propiedades con seguridad y transparencia.</p>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h5>Plataforma</h5>
              <Link href={`/${locale}/publicar`}>Publicar propiedad</Link>
              <Link href={`/${locale}/propiedades`}>Buscar inmueble</Link>
              <Link href={`/${locale}/contracts`}>Contratos digitales</Link>
              <Link href={`/${locale}/dashboard`}>Dashboard</Link>
            </div>

            <div className="footer-col">
              <h5>Cuenta</h5>
              <Link href={`/${locale}/dashboard`}>Mi perfil</Link>
              <Link href={`/${locale}/dashboard`}>Mis alquileres</Link>
              <Link href={`/${locale}/login`}>Iniciar sesión</Link>
              <Link href={`/${locale}/register`}>Registrarse</Link>
            </div>

            <div className="footer-col">
              <h5>Soporte</h5>
              <Link href="#">Centro de ayuda</Link>
              <Link href="#">Términos de uso</Link>
              <Link href="#">Privacidad</Link>
              <Link href="#">Contacto</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Habita Perú. Todos los derechos reservados.</p>
          <div className="footer-social">
            <a href="#" aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
            <a href="#" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#" aria-label="Facebook">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fa-brands fa-twitter"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
