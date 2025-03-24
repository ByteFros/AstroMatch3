"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@heroui/react"
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react"
import { Avatar } from "@heroui/react"
import { Divider } from "@heroui/react"

export default function ProfilePage() {
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
        <h1 className="text-2xl font-bold tracking-tight">Perfil</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Administra tu información personal y cómo se muestra a otros usuarios.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold">Información del perfil</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Actualiza tu foto y datos personales.</p>
        </CardHeader>
        <Divider />
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center space-y-2">
                <Avatar src="/placeholder.svg?height=96&width=96" className="w-24 h-24" alt="Avatar del usuario" />
                <Button variant="bordered" size="sm">
                  Cambiar foto
                </Button>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium">
                      Nombre
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Tu nombre"
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-medium">
                      Nombre de usuario
                    </label>
                    <input
                      id="username"
                      type="text"
                      placeholder="@username"
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="bio" className="block text-sm font-medium">
                    Biografía
                  </label>
                  <textarea
                    id="bio"
                    placeholder="Cuéntanos sobre ti..."
                    className="w-full min-h-[100px] px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent"
                  />
                </div>
              </div>
            </div>
          </form>
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

