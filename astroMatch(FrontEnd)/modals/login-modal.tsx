"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation" // Importar router de Next.js
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, Link } from "@heroui/react"
import { useAuthStore } from "@/store/authStore"

export default function LoginModal() {
  const { isLoginOpen, closeLogin, login } = useAuthStore()
  const router = useRouter() // Hook para manejar navegación

  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleLogin = async () => {
    setErrorMessage(null)

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(data.message || "Error al iniciar sesión")
        return
      }

      // Use the centralized login function
      login(data.username, data.role, data.token)

      // Cerrar modal
      closeLogin()

      // Redirigir a la vista de matches
      router.push("/matches")
    } catch (error) {
      console.error("Error en el login:", error)
      setErrorMessage("Hubo un problema con el inicio de sesión.")
    }
  }

  return (
    <Modal isOpen={isLoginOpen} size="sm" placement="top-center" onOpenChange={closeLogin}>
      <ModalContent>
        <div className="px-5">
          <ModalHeader className="flex flex-col gap-1">Iniciar sesión</ModalHeader>
          <ModalBody>
            <Input
              name="username"
              label="Usuario"
              placeholder="Introduce tu usuario"
              variant="bordered"
              onChange={handleChange}
            />
            <Input
              name="password"
              label="Contraseña"
              placeholder="Introduce tu contraseña"
              type="password"
              variant="bordered"
              onChange={handleChange}
            />

            {errorMessage && <p className="text-red-500 text-xs mt-2">{errorMessage}</p>}

            <div className="flex py-2 px-1 justify-between">
              <Checkbox classNames={{ label: "text-small" }}>Recuérdame</Checkbox>
              <Link color="primary" href="#" size="sm">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={closeLogin}>
              Cerrar
            </Button>
            <Button color="primary" onClick={handleLogin}>
              Iniciar sesión
            </Button>
          </ModalFooter>
        </div>
      </ModalContent>
    </Modal>
  )
}

