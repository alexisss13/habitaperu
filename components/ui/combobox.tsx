'use client'

import { useEffect, useRef, useState } from "react"

interface ComboboxProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  emptyLabel?: string
  className?: string
  loading?: boolean
}

export function Combobox({
  value,
  onChange,
  options,
  placeholder,
  emptyLabel = "Sin coincidencias. Puedes escribir un valor nuevo.",
  className = "",
  loading = false,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filtered = options.filter((o) => o.toLowerCase().includes(value.trim().toLowerCase()))

  return (
    <div ref={rootRef} className="relative">
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => { onChange(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        className={className}
        autoComplete="off"
      />
      {open && (
        <div className="absolute z-10 mt-1.5 w-full max-h-56 overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-[0_8px_24px_rgba(15,52,87,0.12)] py-1.5">
          {loading ? (
            <p className="px-4 py-2.5 text-sm text-gray-400">Cargando…</p>
          ) : filtered.length > 0 ? (
            filtered.slice(0, 50).map((option) => (
              <button
                key={option}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { onChange(option); setOpen(false) }}
                className="w-full text-left px-4 py-2.5 text-sm font-semibold text-[#151c26] hover:bg-gray-50 cursor-pointer transition-colors"
              >
                {option}
              </button>
            ))
          ) : (
            <p className="px-4 py-2.5 text-xs text-gray-400">{emptyLabel}</p>
          )}
        </div>
      )}
    </div>
  )
}
