"use client"

interface AdminPropertyCardProps {
  property: {
    id: string; title: string; district: string; price: number
    status: string; owner: { firstName: string; lastName: string }
  }
  index: number
}

const statusBadge = (status: string) => {
  if (status === 'DISPONIBLE') return 'bg-brown/10 text-brown'
  if (status === 'OCUPADA') return 'bg-accent-secondary/10 text-accent-secondary'
  if (status === 'MANTENIMIENTO') return 'bg-[#f59e0b]/10 text-[#f59e0b]'
  return 'bg-admin-text-muted/10 text-admin-text-muted'
}

export default function AdminPropertyCard({ property }: AdminPropertyCardProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-admin-border bg-admin-bg hover:bg-admin-hover-bg transition-all cursor-pointer">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-admin-text truncate mb-1">{property.title}</p>
        <p className="text-xs text-admin-text-muted truncate">{property.district} • {property.owner.firstName} {property.owner.lastName}</p>
      </div>
      <div className="flex flex-col gap-1.5 items-end shrink-0 ml-3">
        <p className="text-sm font-bold text-admin-text">S/ {property.price.toLocaleString()}</p>
        <span className={`px-2.5 py-1 rounded-md text-[0.7rem] font-semibold uppercase tracking-[0.5px] ${statusBadge(property.status)}`}>
          {property.status}
        </span>
      </div>
    </div>
  )
}
