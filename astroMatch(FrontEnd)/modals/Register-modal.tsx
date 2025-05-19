"use client"
import type React from "react"
import { useRef, useState } from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@heroui/react"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"

export const horoscopos = [
  { key: "Aries", label: "Aries" },
  { key: "Tauro", label: "Tauro" },
  { key: "Géminis", label: "Géminis" },
  { key: "Cáncer", label: "Cáncer" },
  { key: "Leo", label: "Leo" },
  { key: "Virgo", label: "Virgo" },
  { key: "Libra", label: "Libra" },
  { key: "Escorpio", label: "Escorpio" },
  { key: "Sagittario", label: "Sagittario" },
  { key: "Capricornio", label: "Capricornio" },
  { key: "Acuario", label: "Acuario" },
  { key: "Piscis", label: "Piscis" },
]

export const generos = [
  { key: "male", label: "Hombre" },
  { key: "female", label: "Mujer" },
]

export default function RegisterModal() {
  const { isRegisterOpen, closeRegister, login } = useAuthStore()
  const [selectedFileName, setSelectedFileName] = useState<string>("")
  const imageRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    age: "",
    gender: "",
    preferredGender: "",
    zodiacSign: "",
  })

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Manejar cambios en Selects de HeroUI manualmente
  const handleSelectChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  // Manejar cambio de archivo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]
    if (file) {
      setSelectedFileName(file.name)
    }
  }

  // Manejar el registro de usuario
  const handleRegister = async () => {
    if (!imageRef.current || !imageRef.current.files?.length) {
      alert("Por favor, selecciona una imagen.")
      return
    }

    const file = imageRef.current.files[0]

    const formDataToSend = new FormData()
    formDataToSend.append("username", formData.username)
    formDataToSend.append("password", formData.password)
    formDataToSend.append("email", formData.email)
    formDataToSend.append("age", formData.age)
    formDataToSend.append("gender", formData.gender)
    formDataToSend.append("preferredGender", formData.preferredGender)
    formDataToSend.append("zodiacSign", formData.zodiacSign)
    formDataToSend.append("file", file)

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        body: formDataToSend,
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || "Error al registrar el usuario")
        return
      }

      // Use the centralized login function
      login(formData.username, "user", data.token)

      alert("Usuario registrado con éxito")

      // Cerrar modal
      closeRegister()

      // Redirect to matches
      router.push("/matches")
    } catch (error) {
      console.error("Error en el registro:", error)
      alert("Hubo un problema con el registro.")
    }
  }
  return (
    <Modal isOpen={isRegisterOpen} size="sm" placement="top-center" onOpenChange={closeRegister}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Registro</ModalHeader>
        <div className="px-4">
          <ModalBody>
            {/* Inputs de registro */}
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
            <Input
              name="email"
              label="Correo electrónico"
              placeholder="Introduce tu correo"
              variant="bordered"
              onChange={handleChange}
            />

            {/* Edad y Horóscopo en la misma línea */}
            <div className="flex gap-4">
              <Input
                name="age"
                label="Edad"
                placeholder="Introduce tu edad"
                type="number"
                variant="bordered"
                onChange={handleChange}
              />
              <Select
                name="zodiacSign"
                className="max-w-xs"
                label="Selecciona tu horóscopo"
                onSelectionChange={(value) => handleSelectChange("zodiacSign", Array.from(value)[0] as string)}
              >
                {horoscopos.map((horoscopo) => (
                  <SelectItem key={horoscopo.key}>{horoscopo.key}</SelectItem>
                ))}
              </Select>
            </div>

            <div className="flex gap-4">
              <Select
                name="gender"
                className="max-w-xs"
                label="¿Cuál es tu género?"
                onChange={handleChange}
              >
                {generos.map((genero) => (
                  <SelectItem key={genero.key}>{genero.label}</SelectItem>
                ))}
              </Select>
              <Select
                name="preferredGender"
                className="max-w-xs"
                label="¿Qué género te gusta?"
                onChange={handleChange}
              >
                {generos.map((genero) => (
                  <SelectItem key={genero.key}>{genero.label}</SelectItem>
                ))}
              </Select>
            </div>

            {/* Subir imagen */}
            <div className="py-4 flex flex-col items-end">
              {selectedFileName && <p className="text-xs text-gray-600">Archivo seleccionado: {selectedFileName}</p>}
              <Button color="primary" as="label">
                Subir imagen
                <input type="file" hidden ref={imageRef} accept="image/*" onChange={handleFileChange} />
              </Button>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={closeRegister}>
              Cerrar
            </Button>
            <Button color="primary" onPress={handleRegister}>
              Registrarse
            </Button>
          </ModalFooter>
        </div>
      </ModalContent>
    </Modal>
  )
}

