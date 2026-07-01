"use client"

import Link from "next/link"
import Image from "next/image"
import { useLocale, useTranslations } from "@/lib/i18n-context"

export function Footer() {
  const locale = useLocale()
  const t = useTranslations("footer")
  
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
              <Link href={`/${locale}/contracts`}>{t("digitalContracts")}</Link>
              <Link href={`/${locale}/dashboard`}>{t("dashboard")}</Link>
            </div>

            <div className="footer-col">
              <h5>{t("account")}</h5>
              <Link href={`/${locale}/dashboard`}>{t("myProfile")}</Link>
              <Link href={`/${locale}/dashboard`}>{t("myRentals")}</Link>
              <Link href={`/${locale}/login`}>{t("login")}</Link>
              <Link href={`/${locale}/register`}>{t("register")}</Link>
            </div>

            <div className="footer-col">
              <h5>{t("support")}</h5>
              <Link href="#">{t("helpCenter")}</Link>
              <Link href="#">{t("terms")}</Link>
              <Link href="#">{t("privacy")}</Link>
              <Link href="#">{t("contact")}</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t("copyright")}</p>
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
