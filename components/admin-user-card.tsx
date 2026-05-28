"use client"

interface AdminUserCardProps {
  user: { id: string; firstName: string; lastName: string; email: string; role: string }
  index: number
}

const avatarGradient = (role: string) => {
  if (role === 'ADMIN') return 'linear-gradient(135deg, #EA4227, #d63820)'
  if (role === 'LANDLORD') return 'linear-gradient(135deg, #0f3457, #0a2540)'
  return 'linear-gradient(135deg, #8f8272, #7a7260)'
}

const roleBadge = (role: string) => {
  if (role === 'ADMIN') return { cls: 'bg-accent-secondary/10 text-accent-secondary', label: 'Admin' }
  if (role === 'LANDLORD') return { cls: 'bg-accent/10 text-accent', label: 'Arrendador' }
  return { cls: 'bg-brown/10 text-brown', label: 'Inquilino' }
}

export default function AdminUserCard({ user }: AdminUserCardProps) {
  const badge = roleBadge(user.role)
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200 transition-all cursor-pointer">
      <div className="flex items-center gap-3 min-w-0">
        <div className="size-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
          style={{ background: avatarGradient(user.role) }}>
          {user.firstName[0]}{user.lastName[0]}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#151c26] truncate mb-0.5">{user.firstName} {user.lastName}</p>
          <p className="text-xs text-[#748597] truncate">{user.email}</p>
        </div>
      </div>
      <span className={`px-2.5 py-1 rounded-md text-[0.7rem] font-semibold uppercase tracking-[0.5px] shrink-0 ${badge.cls}`}>
        {badge.label}
      </span>
    </div>
  )
}
