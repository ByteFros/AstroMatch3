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

      <Card>
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

          <div className="space-y-2">
            <label className="block text-sm font-medium">Densidad de contenido</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="comfortable"
                  name="density"
                  value="comfortable"
                  defaultChecked
                  className="h-4 w-4"
                />
                <label htmlFor="comfortable" className="text-sm">
                  Cómodo
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="compact" name="density" value="compact" className="h-4 w-4" />
                <label htmlFor="compact" className="text-sm">
                  Compacto
                </label>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold">Notificaciones</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configura cómo y cuándo quieres recibir notificaciones.
          </p>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="matches" className="block text-sm font-medium">
                Nuevos matches
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Recibe notificaciones cuando tengas un nuevo match.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" id="matches" defaultChecked className="sr-only switch-checkbox" />
              <div className="switch-toggle w-11 h-6 bg-gray-300 dark:bg-gray-700 rounded-full">
                <div className="switch-dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></div>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="messages" className="block text-sm font-medium">
                Mensajes
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Recibe notificaciones cuando recibas un nuevo mensaje.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" id="messages" defaultChecked className="sr-only switch-checkbox" />
              <div className="switch-toggle w-11 h-6 bg-gray-300 dark:bg-gray-700 rounded-full">
                <div className="switch-dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></div>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="updates" className="block text-sm font-medium">
                Actualizaciones
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Recibe notificaciones sobre actualizaciones y novedades.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" id="updates" className="sr-only switch-checkbox" />
              <div className="switch-toggle w-11 h-6 bg-gray-300 dark:bg-gray-700 rounded-full">
                <div className="switch-dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></div>
              </div>
            </label>
          </div>
        </CardBody>
        <CardFooter className="flex justify-end">
          <Button color="primary" isLoading={isLoading}>
            {isLoading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

