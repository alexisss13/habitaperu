'use client'

interface PanelPageHeaderProps {
  icon?: React.ReactNode
  title: string
  subtitle?: string
  actions?: React.ReactNode
  className?: string
}

export function PanelPageHeader({ icon, title, subtitle, actions, className = '' }: PanelPageHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          {icon}
          <h1 className="text-3xl font-bold text-admin-text">{title}</h1>
        </div>
        {actions && (
          <div className="flex items-center gap-3 shrink-0">{actions}</div>
        )}
      </div>
      {subtitle && (
        <p className="text-sm text-admin-text-muted">{subtitle}</p>
      )}
    </div>
  )
}
