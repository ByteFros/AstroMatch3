"use client"

import { Link } from "@heroui/link"
import { usePathname } from "next/navigation"

const navItems = [
  {
    title: "Perfil",
    href: "/settings/profile",
    icon: "👤", // Emoji como placeholder para User
  },
  {
    title: "Configuración",
    href: "/settings/configuration",
    icon: "⚙️", // Emoji como placeholder para Settings
  },
]

export function SettingsSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-full md:w-64 space-y-4">
      <div className="text-lg font-semibold mb-4">Ajustes</div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

