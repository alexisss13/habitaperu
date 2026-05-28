'use client'

import Link from "next/link"
import { type ComponentPropsWithoutRef } from "react"

// Brand gradient tokens
const GRADIENT_PRIMARY = 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)'
const GRADIENT_DANGER  = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'

export type ButtonVariant =
  | 'primary'    // brand gradient — white text
  | 'secondary'  // accent border, accent text
  | 'ghost'      // transparent, dark text
  | 'danger'     // red gradient — white text
  | 'success'    // green solid — white text
  | 'whatsapp'   // #25D366 — white text
  | 'outline'    // gray border, dark text

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

// Size → Tailwind padding + text + radius
const SIZE_CLS: Record<ButtonSize, string> = {
  xs: 'px-3    py-1.5  text-xs  gap-1.5 rounded-lg',
  sm: 'px-4    py-2    text-xs  gap-2   rounded-xl',
  md: 'px-5    py-2.5  text-sm  gap-2   rounded-xl',
  lg: 'px-6    py-3    text-sm  gap-2.5 rounded-2xl',
}

// Inline styles carry the background + color so they always win over
// any non-layered global CSS reset (button {}, a {}, etc.)
function getInlineStyle(v: ButtonVariant): React.CSSProperties {
  switch (v) {
    case 'primary':   return { background: GRADIENT_PRIMARY, color: '#ffffff' }
    case 'danger':    return { background: GRADIENT_DANGER,  color: '#ffffff' }
    case 'success':   return { background: '#16a34a',        color: '#ffffff' }
    case 'whatsapp':  return { background: '#25D366',        color: '#ffffff' }
    case 'secondary': return { background: 'transparent',   color: '#0f3457' }
    case 'ghost':     return { background: 'transparent',   color: '#374151' }
    case 'outline':   return { background: '#ffffff',        color: '#374151' }
  }
}

// Tailwind classes for border + hover (no color — that's handled above)
function getVariantCls(v: ButtonVariant): string {
  switch (v) {
    case 'primary':   return 'hover:opacity-90  border-transparent shadow-sm'
    case 'danger':    return 'hover:opacity-90  border-transparent shadow-sm'
    case 'success':   return 'hover:opacity-90  border-transparent shadow-sm'
    case 'whatsapp':  return 'hover:opacity-90  border-transparent shadow-sm'
    case 'secondary': return 'border border-[#0f3457]/30 hover:bg-[#0f3457]/5'
    case 'ghost':     return 'border-transparent hover:bg-gray-100'
    case 'outline':   return 'border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
  }
}

function Spinner() {
  return (
    <span
      className="inline-block size-[1em] rounded-full border-2 border-current border-t-transparent animate-spin shrink-0"
      aria-hidden
    />
  )
}

// ── Props ──────────────────────────────────────────────────────────────────
interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?:   ButtonVariant
  size?:      ButtonSize
  loading?:   boolean
  fullWidth?: boolean
  leftIcon?:  React.ReactNode
  rightIcon?: React.ReactNode
  // When href is provided the component renders as <Link>
  href?:      string
  external?:  boolean
}

// ── Component ──────────────────────────────────────────────────────────────
export function Button({
  variant   = 'primary',
  size      = 'md',
  loading   = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  href,
  external  = false,
  disabled,
  className = '',
  style,
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading

  const cls = [
    'inline-flex items-center justify-center font-bold',
    'transition-all duration-150 cursor-pointer',
    'border select-none',              // keep "border" so border-transparent works
    SIZE_CLS[size],
    getVariantCls(variant),
    fullWidth ? 'w-full' : '',
    isDisabled ? 'opacity-50 pointer-events-none' : '',
    className,
  ].filter(Boolean).join(' ')

  const inlineStyle: React.CSSProperties = {
    ...getInlineStyle(variant),
    ...style,                          // caller can override specific properties
  }

  const content = (
    <>
      {loading    ? <Spinner />  : leftIcon}
      {children  && <span className="leading-none">{children}</span>}
      {!loading  && rightIcon}
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        className={cls + ' no-underline'}
        style={inlineStyle}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      {...rest}
      disabled={isDisabled}
      className={cls}
      style={inlineStyle}
    >
      {content}
    </button>
  )
}

// Named re-export for legacy consumers that import { Button } from this file
export default Button
