"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useLocale, useTranslations } from "@/lib/i18n-context"

export function Footer() {
  const locale = useLocale()
  const t = useTranslations("footer")
  const { data: session } = useSession()
  const role = (session?.user as { role?: string } | undefined)?.role

  // Mismo criterio por rol que ya usa el header: no existe una ruta genérica
  // /{locale}/dashboard ni /{locale}/contracts — cada rol tiene su propia
  // sección fuera del segmento de locale.
  const dashboardHref =
    role === 'ADMIN'    ? '/admin/dashboard' :
    role === 'LANDLORD' ? '/landlord/dashboard' :
    role === 'TENANT'   ? '/tenant/contract' : `/${locale}/login`

  const profileHref =
    role === 'ADMIN'    ? '/admin/settings' :
    role === 'LANDLORD' ? '/landlord/settings' :
    role === 'TENANT'   ? '/tenant/settings' : `/${locale}/login`

  const rentalsHref =
    role === 'ADMIN'    ? '/admin/properties' :
    role === 'LANDLORD' ? '/landlord/properties' :
    role === 'TENANT'   ? '/tenant/contract' : `/${locale}/login`

  const contractsHref =
    role === 'ADMIN'    ? '/admin/contracts' :
    role === 'LANDLORD' ? '/landlord/contracts' :
    role === 'TENANT'   ? '/tenant/contract' : `/${locale}/login`


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
            <p>{t("description")}</p>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h5>{t("platform")}</h5>
              <Link href={`/${locale}/publicar/onboarding`}>{t("publishProperty")}</Link>
              <Link href={`/${locale}/propiedades`}>{t("searchProperty")}</Link>
              <Link href={contractsHref}>{t("digitalContracts")}</Link>
              <Link href={dashboardHref}>{t("dashboard")}</Link>
            </div>

            <div className="footer-col">
              <h5>{t("account")}</h5>
              <Link href={profileHref}>{t("myProfile")}</Link>
              <Link href={rentalsHref}>{t("myRentals")}</Link>
              <Link href={`/${locale}/login`}>{t("login")}</Link>
              <Link href={`/${locale}/register`}>{t("register")}</Link>
            </div>

            <div className="footer-col">
              <h5>{t("support")}</h5>
              <Link href={`/${locale}/ayuda`}>{t("helpCenter")}</Link>
              <Link href={`/${locale}/terminos`}>{t("terms")}</Link>
              <Link href={`/${locale}/privacidad`}>{t("privacy")}</Link>
              <Link href={`/${locale}/contacto`}>{t("contact")}</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t("copyright")}</p>
        </div>
      </div>
    </footer>
  )
}
