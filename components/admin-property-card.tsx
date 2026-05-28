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
  return 'bg-red/10 text-red'
}

export default function AdminPropertyCard({ property }: AdminPropertyCardProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200 transition-all cursor-pointer">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#151c26] truncate mb-1">{property.title}</p>
        <p className="text-xs text-[#748597] truncate">{property.district} • {property.owner.firstName} {property.owner.lastName}</p>
      </div>
      <div className="flex flex-col gap-1.5 items-end shrink-0 ml-3">
        <p className="text-sm font-bold text-[#151c26]">S/ {property.price.toLocaleString()}</p>
        <span className={`px-2.5 py-1 rounded-md text-[0.7rem] font-semibold uppercase tracking-[0.5px] ${statusBadge(property.status)}`}>
          {property.status}
        </span>
      </div>
    </div>
  )
}
