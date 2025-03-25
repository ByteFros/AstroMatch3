"use client"

import { Link } from "@heroui/link"
import { usePathname } from "next/navigation"
import ProfileIcon from "@/app/icons/profile-icon"
import ConfigIcon from "@/app/icons/config-icon"

const navItems = [
  {
    title: "Perfil",
    href: "/settings/profile",
    icon: ProfileIcon,
  },
  {
    title: "Configuración",
    href: "/settings/configuration",
    icon: ConfigIcon,
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
            <item.icon size={20} />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

