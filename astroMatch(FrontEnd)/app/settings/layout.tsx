import type React from "react"
import { SettingsSidebar } from "../../components/settings-sidebar"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">{children}</div>
        <SettingsSidebar />
      </div>
    </div>
  )
}

