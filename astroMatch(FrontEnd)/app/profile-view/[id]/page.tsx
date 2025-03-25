"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardBody, CardHeader, CardFooter, Button, Spinner, Chip, Divider } from "@heroui/react"
import ProfileIcon from "@/app/icons/profile-icon"
import ChatBubbleIcon from "@/app/icons/chat-bubble-icon"

interface UserProfile {
  id: string
  username: string
  age: number
  bio: string
  zodiacSign: string
  compatibility: number
  interests: string[]
  profileImageUrl: string
  isOnline: boolean
  lastActive?: string
  location?: string
  photos: string[]
}

export default function ProfileViewPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const router = useRouter()
  const params = useParams()
  const userId = params?.id as string

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/")
        return
      }

      try {
        const response = await fetch("http://localhost:8080/api/auth/isLoggedIn", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()
        if (data.isLoggedIn) {
          setIsLoggedIn(true)
          fetchUserProfile()
        } else {
          localStorage.removeItem("token")
          router.push("/")
        }
      } catch (error) {
        console.error("Error checking login status:", error)
        localStorage.removeItem("token")
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    const fetchUserProfile = () => {
      // In a real app, you would fetch the user profile from the API
      // For demo, we'll use demo data
      const demoProfiles: Record<string, UserProfile> = {
        user1: {
          id: "user1",
          username: "Laura",
          age: 28,
          bio: "Amante de la naturaleza y los viajes. Siempre buscando nuevas aventuras y experiencias. Me encanta la fotografía y capturar momentos especiales.",
          zodiacSign: "Libra",
          compatibility: 92,
          interests: ["Viajes", "Fotografía", "Senderismo", "Yoga", "Cocina"],
          profileImageUrl: "/placeholder.svg?height=400&width=400",
          isOnline: true,
          location: "Madrid",
          photos: [
            "/placeholder.svg?height=300&width=300",
            "/placeholder.svg?height=300&width=300",
            "/placeholder.svg?height=300&width=300",
            "/placeholder.svg?height=300&width=300",
          ],
        },
        user2: {
          id: "user2",
          username: "Carlos",
          age: 31,
          bio: "Músico y fotógrafo. Me encanta explorar nuevos lugares y conocer gente interesante. Toco la guitarra en una banda local y me apasiona el cine independiente.",
          zodiacSign: "Acuario",
          compatibility: 87,
          interests: ["Música", "Fotografía", "Cine", "Viajes", "Arte"],
          profileImageUrl: "/placeholder.svg?height=400&width=400",
          isOnline: false,
          lastActive: "Hace 3 horas",
          location: "Barcelona",
          photos: [
            "/placeholder.svg?height=300&width=300",
            "/placeholder.svg?height=300&width=300",
            "/placeholder.svg?height=300&width=300",
          ],
        },
        user3: {
          id: "user3",
          username: "Sofía",
          age: 26,
          bio: "Apasionada por la cocina y el arte. Busco alguien con quien compartir momentos especiales. Me encanta viajar y descubrir nuevas culturas y gastronomías.",
          zodiacSign: "Géminis",
          compatibility: 95,
          interests: ["Arte", "Cocina", "Viajes", "Lectura", "Cine"],
          profileImageUrl: "/placeholder.svg?height=400&width=400",
          isOnline: true,
          location: "Valencia",
          photos: [
            "/placeholder.svg?height=300&width=300",
            "/placeholder.svg?height=300&width=300",
            "/placeholder.svg?height=300&width=300",
            "/placeholder.svg?height=300&width=300",
            "/placeholder.svg?height=300&width=300",
          ],
        },
        user4: {
          id: "user4",
          username: "Miguel",
          age: 30,
          bio: "Ingeniero y amante de los deportes. Siempre buscando nuevos retos. Me encanta el fútbol, la natación y el senderismo. También disfruto de la tecnología y los videojuegos.",
          zodiacSign: "Capricornio",
          compatibility: 83,
          interests: ["Deportes", "Tecnología", "Videojuegos", "Montañismo", "Viajes"],
          profileImageUrl: "/placeholder.svg?height=400&width=400",
          isOnline: false,
          lastActive: "Hace 1 día",
          location: "Sevilla",
          photos: [
            "/placeholder.svg?height=300&width=300",
            "/placeholder.svg?height=300&width=300",
            "/placeholder.svg?height=300&width=300",
          ],
        },
      }

      if (demoProfiles[userId]) {
        setProfile(demoProfiles[userId])
      } else {
        // If user not found, create a default profile
        setProfile({
          id: userId,
          username: "Usuario",
          age: 25,
          bio: "No hay información disponible para este usuario.",
          zodiacSign: "Desconocido",
          compatibility: 50,
          interests: [],
          profileImageUrl: "/placeholder.svg?height=400&width=400",
          isOnline: false,
          photos: [],
        })
      }
    }

    checkLoginStatus()
  }, [router, userId])

  const handleStartChat = () => {
    router.push(`/chat?id=${userId}`)
  }

  const handleGoBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    )
  }

  if (!isLoggedIn || !profile) {
    return null
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6 gap-3">
        <ProfileIcon size={32} className="text-primary" />
        <h1 className="text-3xl font-bold">Perfil</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main profile info */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-0 flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <img
                src={profile.profileImageUrl || "/placeholder.svg"}
                alt={`Foto de ${profile.username}`}
                className="w-full h-full object-cover rounded-full"
              />
              {profile.isOnline && (
                <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-center">
              {profile.username}, {profile.age}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gray-500 dark:text-gray-400">{profile.zodiacSign}</span>
              {profile.location && (
                <>
                  <span className="text-gray-500 dark:text-gray-400">•</span>
                  <span className="text-gray-500 dark:text-gray-400">{profile.location}</span>
                </>
              )}
            </div>
            <Chip
              color={profile.compatibility > 90 ? "success" : profile.compatibility > 80 ? "warning" : "primary"}
              variant="shadow"
              className="mt-3 font-semibold"
            >
              {profile.compatibility}% compatible
            </Chip>
          </CardHeader>
          <CardBody className="flex flex-col items-center">
            <div className="w-full mt-4">
              <h3 className="font-semibold mb-2">Intereses</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <Chip key={index} variant="flat" color="secondary" size="sm">
                    {interest}
                  </Chip>
                ))}
                {profile.interests.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No hay intereses disponibles</p>
                )}
              </div>
            </div>
            <Divider className="my-4" />
            <div className="w-full">
              <h3 className="font-semibold mb-2">Sobre mí</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{profile.bio}</p>
            </div>
          </CardBody>
          <CardFooter className="flex justify-between gap-2">
            <Button color="primary" variant="flat" className="flex-1" onPress={handleGoBack}>
              Volver
            </Button>
            <Button
              color="primary"
              className="flex-1"
              startContent={<ChatBubbleIcon size={18} />}
              onPress={handleStartChat}
            >
              Chatear
            </Button>
          </CardFooter>
        </Card>

        {/* Photos gallery */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="text-xl font-semibold">Fotos</h3>
          </CardHeader>
          <CardBody>
            {profile.photos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profile.photos.map((photo, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-lg">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Foto ${index + 1} de ${profile.username}`}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <ProfileIcon size={32} className="text-gray-400" />
                </div>
                <h4 className="text-lg font-medium mb-2">No hay fotos disponibles</h4>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  Este usuario aún no ha subido fotos a su perfil.
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

