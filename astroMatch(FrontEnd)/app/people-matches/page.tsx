"use client"

import { useState, useEffect } from "react"
import { Card, CardBody, CardFooter, Button, Spinner, Chip } from "@heroui/react"
import { useRouter } from "next/navigation"
import MatchesIcon from "@/app/icons/matches-icon"

interface Match {
  id: string
  username: string
  age: number
  compatibility: number
  profileImageUrl: string
  bio: string
  lastActive: string
  isOnline: boolean
  zodiacSign: string
}

export default function PeopleMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

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
          fetchMatches()
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

    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:8080/api/users/matches", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setMatches(data)
        }
      } catch (error) {
        console.error("Error fetching matches:", error)
      } finally {
        setLoading(false)
      }
    }

    checkLoginStatus()
  }, [router])

  const handleStartChat = (matchId: string) => {
    router.push(`/chat?id=${matchId}`)
  }

  const handleViewProfile = (matchId: string) => {
    router.push(`/profile-view/${matchId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    )
  }

  if (!isLoggedIn) {
    return null
  }

  // Fallback data for demonstration if API doesn't return data
  const demoMatches: Match[] =
    matches.length > 0
      ? matches
      : [
          {
            id: "1",
            username: "Laura",
            age: 28,
            compatibility: 92,
            profileImageUrl: "/placeholder.svg?height=300&width=300",
            bio: "Amante de la naturaleza y los viajes. Siempre buscando nuevas aventuras.",
            lastActive: "Hace 2 horas",
            isOnline: true,
            zodiacSign: "Libra",
          },
          {
            id: "2",
            username: "Carlos",
            age: 31,
            compatibility: 87,
            profileImageUrl: "/placeholder.svg?height=300&width=300",
            bio: "Músico y fotógrafo. Me encanta explorar nuevos lugares y conocer gente interesante.",
            lastActive: "Hace 1 día",
            isOnline: false,
            zodiacSign: "Acuario",
          },
          {
            id: "3",
            username: "Sofía",
            age: 26,
            compatibility: 95,
            profileImageUrl: "/placeholder.svg?height=300&width=300",
            bio: "Apasionada por la cocina y el arte. Busco alguien con quien compartir momentos especiales.",
            lastActive: "En línea",
            isOnline: true,
            zodiacSign: "Géminis",
          },
          {
            id: "4",
            username: "Miguel",
            age: 30,
            compatibility: 83,
            profileImageUrl: "/placeholder.svg?height=300&width=300",
            bio: "Ingeniero y amante de los deportes. Siempre buscando nuevos retos.",
            lastActive: "Hace 3 horas",
            isOnline: false,
            zodiacSign: "Capricornio",
          },
        ]

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8 gap-3">
        <MatchesIcon size={32} className="text-primary" />
        <h1 className="text-3xl font-bold">Tus Matches</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {demoMatches.map((match) => (
          <Card key={match.id} className="border border-gray-200 dark:border-gray-800">
            <CardBody className="p-0 overflow-hidden">
              <div className="relative h-64 w-full">
                <img
                  src={
                    match.profileImageUrl.startsWith("http")
                      ? match.profileImageUrl
                      : `/placeholder.svg?height=300&width=300`
                  }
                  alt={`Foto de ${match.username}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Chip
                    color={match.compatibility > 90 ? "success" : match.compatibility > 80 ? "warning" : "primary"}
                    variant="shadow"
                    className="font-semibold"
                  >
                    {match.compatibility}% compatible
                  </Chip>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">
                      {match.username}, {match.age}
                    </h2>
                    {match.isOnline && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
                  </div>
                  <p className="text-sm opacity-90">{match.zodiacSign}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm line-clamp-2">{match.bio}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {match.isOnline ? "En línea ahora" : `Última vez: ${match.lastActive}`}
                </p>
              </div>
            </CardBody>
            <CardFooter className="flex justify-between gap-2">
              <Button color="primary" variant="flat" className="flex-1" onPress={() => handleViewProfile(match.id)}>
                Ver perfil
              </Button>
              <Button color="primary" className="flex-1" onPress={() => handleStartChat(match.id)}>
                Chatear
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

