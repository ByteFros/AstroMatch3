"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@heroui/react"
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react"
import { Divider } from "@heroui/react"
import { useTheme } from "next-themes"


export default function ConfigurationPage() {
  const { theme, setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulación de guardado
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Personaliza tu experiencia y ajusta las preferencias de la aplicación.
        </p>
      </div>

      <Card className="bg-[var(--card)]">
        <CardHeader className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold">Apariencia</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Personaliza cómo se ve la aplicación.</p>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="theme" className="block text-sm font-medium">
              Tema
            </label>
            <select
              id="theme"
              className="w-full md:w-[200px] px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent"
              value={theme || "system"}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
              <option value="system">Sistema</option>
            </select>
          </div>


        </CardBody>
      </Card>


    </div>
  )
}

