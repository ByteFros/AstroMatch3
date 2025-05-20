"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardBody, CardHeader, CardFooter, Button, Spinner, Chip, Divider } from "@heroui/react"
import ProfileIcon from "@/app/icons/profile-icon"
import ChatBubbleIcon from "@/app/icons/chat-bubble-icon"

interface User {
  id: number
  username: string
  age: number
  compatibility: number
  profileImageUrl: string
  bio: string
  isMutual?: boolean
  isOnline?: boolean
  zodiacSign?: string
  location?: string
  interests?: string[]
  photos?: string[]
}

export default function ProfileViewPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params?.id as string

  // Usamos useRef para guardar el usuario sin useState
  const userRef = useRef<User | null>(null)
  const loadingRef = useRef(true)
  const [, forceUpdate] = useState({}) // Para forzar render

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
      return
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          userRef.current = null
        } else {
          const data = await res.json()
          userRef.current = {
            id: data.id,
            username: data.username || "",
            age: data.age || 0,
            compatibility: data.compatibility ?? 0,
            profileImageUrl: data.profileImageUrl || "",
            bio: data.bio || "",
            isMutual: data.isMutual ?? false,
            isOnline: data.isOnline ?? false,
            zodiacSign: data.zodiacSign || "",
            location: data.location || "",
            interests: data.interests ?? [],
            photos: data.photos ?? [],
          }
        }
      } catch (error) {
        userRef.current = null
      }
      loadingRef.current = false
      forceUpdate({}) // Forzar render
    }

    fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, userId])

  const handleStartChat = () => {
    router.push(`/chat?id=${userId}`)
  }

  const handleGoBack = () => {
    router.back()
  }

  if (loadingRef.current) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    )
  }

  const user = userRef.current

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">No se pudo cargar el perfil.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6 gap-3">
        <ProfileIcon size={32} className="text-primary" />
        <h1 className="text-3xl font-bold">Perfil</h1>
      </div>

      <div className="w-full h-full ">
        {/* Main profile info */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-0 flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <img
                src={
                  user.profileImageUrl.startsWith("http")
                    ? user.profileImageUrl
                    : `http://localhost:8080${user.profileImageUrl}`
                }
                alt={`Foto de ${user.username}`}
                className="w-full h-full object-cover rounded-full"
              />
              {user.isOnline && (
                <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-center">
              {user.username}, {user.age}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gray-500 dark:text-gray-400">{user.zodiacSign}</span>
              {user.location && (
                <>
                  <span className="text-gray-500 dark:text-gray-400">•</span>
                  <span className="text-gray-500 dark:text-gray-400">{user.location}</span>
                </>
              )}
            </div>

          </CardHeader>
          <CardBody className="flex flex-col items-center">
 
            <Divider className="my-4" />
            <div className="w-full">
              <h3 className="font-semibold mb-2">Sobre mí</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {user.bio ? user.bio : "Este usuario no ha escrito una biografía aún."}
              </p>
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

        
      </div>
    </div>
  )
}

