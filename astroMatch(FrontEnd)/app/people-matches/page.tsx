"use client"

import { useState, useEffect } from "react"
import { Card, CardBody, CardFooter, Button, Spinner, Chip } from "@heroui/react"
import { useRouter } from "next/navigation"
import MatchesIcon from "@/app/icons/matches-icon"

interface Match {
  id: number
  username: string
  age: number
  compatibility: number
  profileImageUrl: string
  bio: string
  isMutual: boolean
}

export default function PeopleMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
      return
    }

    const fetchMatches = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/matches/likes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()
        setMatches(data)
      } catch (err) {
        console.error("Error fetching matches", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [router])

  const handleStartChat = (matchId: number) => {
    router.push(`/chat?id=${matchId}`)
  }

  const handleViewProfile = (matchId: number) => {
    router.push(`/profile-view/${matchId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8 gap-3">
        <MatchesIcon size={32} className="text-primary" />
        <h1 className="text-3xl font-bold">Tus Matches</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {matches.map((match) => (
          <Card key={match.id} className="border border-gray-200 dark:border-gray-800">
            <CardBody className="p-0 overflow-hidden">
              <div className="relative h-64 w-full">
                <img
                  src={
                    match.profileImageUrl.startsWith("http")
                      ? match.profileImageUrl
                      : `http://localhost:8080${match.profileImageUrl}`
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
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold">
                  {match.username}, {match.age}
                </h2>
                <p className="text-sm text-gray-500">{match.bio}</p>
              </div>
            </CardBody>

            <CardFooter className="flex justify-between gap-2">
              <Button color="primary" variant="flat" className="flex-1" onPress={() => handleViewProfile(match.id)}>
                Ver perfil
              </Button>

              <Button
                color="primary"
                className="flex-1"
                onPress={() => handleStartChat(match.id)}
                isDisabled={!match.isMutual}
              >
                {match.isMutual ? "Chatear" : "Esperando"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
