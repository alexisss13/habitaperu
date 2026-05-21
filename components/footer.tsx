"use client"

import Link from "next/link"
import { useLocale } from "@/lib/i18n-context"

export function Footer() {
  const locale = useLocale()
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <Link href={`/${locale}`} className="logo">
              <i className="fa-solid fa-house-chimney logo-icon"></i>
              <span className="logo-text">
                Habita <span className="logo-accent">Perú</span>
              </span>
            </Link>
            <p>La plataforma de arrendamiento más confiable del Perú. Gestiona tus propiedades con seguridad y transparencia.</p>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h5>Plataforma</h5>
              <Link href={`/${locale}/publicar`}>Publicar propiedad</Link>
              <Link href="/propiedades">Buscar inmueble</Link>
              <Link href="/gestion">Contratos digitales</Link>
              <Link href="/dashboard">Dashboard</Link>
            </div>

            <div className="footer-col">
              <h5>Cuenta</h5>
              <Link href="/perfil">Mi perfil</Link>
              <Link href="/gestion">Mis alquileres</Link>
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
