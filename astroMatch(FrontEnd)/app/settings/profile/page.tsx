"use client"

import { useState, useEffect } from "react"
import { Button, Card, CardBody, CardFooter, CardHeader, Divider } from "@heroui/react"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    profileImageUrl: "",
    age: 18,
    gender: "",
    preferredGender: "",
    zodiacSign: ""
  })
  const [originalUsername, setOriginalUsername] = useState("");

  const fetchProfile = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    const res = await fetch(`${API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const user = await res.json()
    setForm({
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
      bio: user.bio || "",
      profileImageUrl: user.profileImageUrl || "",
      age: user.age || 18,
      gender: user.gender || "",
      preferredGender: user.preferredGender || "",
      zodiacSign: user.zodiacSign || ""
    })
    setOriginalUsername(user.username || "");
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setForm((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No hay sesión activa");
      setIsLoading(false);
      return;
    }

    // Envía los datos como JSON (sin imagen)
    const body = {
      name: form.name,
      username: form.username,
      email: form.email,
      bio: form.bio,
      age: Number(form.age),
      gender: form.gender,
      preferredGender: form.preferredGender,
      zodiacSign: form.zodiacSign,
      profileImageUrl: form.profileImageUrl || ""
    };

    const response = await fetch(`${API_URL}/api/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    setIsLoading(false);
    if (!response.ok) {
      const errorText = await response.text();
      alert("Error al actualizar el perfil: " + errorText);
    } else {
      if (form.username !== originalUsername) {
        alert("Has cambiado tu nombre de usuario. Por seguridad, debes volver a iniciar sesión.");
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
      }
      alert("Perfil actualizado correctamente");
      fetchProfile();
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Perfil</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Administra tu información personal y cómo se muestra a otros usuarios.
        </p>
      </div>

      <Card className="bg-[var(--card)]">
        <CardHeader className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold">Información del perfil</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Actualiza tus datos personales.</p>
        </CardHeader>
        <Divider />
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-medium">Nombre de usuario</label>
                    <input
                      id="username"
                      type="text"
                      placeholder="@username"
                      value={form.username}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">Correo electrónico</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="age" className="block text-sm font-medium">Edad</label>
                  <input
                    id="age"
                    type="number"
                    placeholder="Tu edad"
                    value={form.age}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="gender" className="block text-sm font-medium">Género</label>
                  <select
                    id="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent"
                  >
                    <option value="">Selecciona tu género</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="preferredGender" className="block text-sm font-medium">Género preferido</label>
                  <select
                    id="preferredGender"
                    value={form.preferredGender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent"
                  >
                    <option value="">Selecciona tu preferencia</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                    <option value="any">Cualquiera</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="zodiacSign" className="block text-sm font-medium">Signo Zodiacal</label>
                  <input
                    id="zodiacSign"
                    type="text"
                    placeholder="Ej. Aries, Tauro..."
                    value={form.zodiacSign}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="bio" className="block text-sm font-medium">Biografía</label>
                  <textarea
                    id="bio"
                    placeholder="Cuéntanos sobre ti..."
                    value={form.bio}
                    onChange={handleChange}
                    className="w-full min-h-[100px] px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent"
                  />
                </div>
              </div>
            </div>
            <CardFooter className="flex justify-end">
              <Button color="primary" type="submit" isLoading={isLoading}>
                {isLoading ? "Guardando..." : "Guardar cambios"}
              </Button>
            </CardFooter>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}

