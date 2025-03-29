"use client"

import { useState, useRef, useEffect } from "react"
import CheckmarkIcon from "@/app/icons/checkmark-icon"
import CloseIcon from "@/app/icons/close-icon"
import Image from "next/image"
import { motion, useAnimation, type PanInfo } from "framer-motion"

export default function SwipeInterface() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<string | null>(null)
  const controls = useAnimation()
  const constraintsRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
  
    const fetchProfiles = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/matches", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()
        setProfiles(data)
        setCurrentIndex(0) // Reiniciar para mostrar desde el principio
      } catch (error) {
        console.error("Error fetching profiles:", error)
      }
    }
  
    // Primera carga
    fetchProfiles()
  
    // Intervalo de 60s
    const intervalId = setInterval(fetchProfiles, 60000)
  
    return () => clearInterval(intervalId)
  }, [])
  
  if (profiles.length === 0) {
    return <div className="text-center text-xl">No more profiles to show!</div>
  }

  const currentProfile = profiles[currentIndex]
  const nextProfile = profiles[currentIndex + 1]

  const handleSwipe = async (direction: string) => {
    const token = localStorage.getItem("token")
    const currentUserId = currentProfile.id
  
    if (!token || !currentUserId) return
  
    const isLike = direction === "right"
    const endpoint = isLike
      ? `http://localhost:8080/api/matches/${currentUserId}`
      : `http://localhost:8080/api/matches/dislike/${currentUserId}`
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!response.ok) throw new Error("Error en la petición")
  
      // Mostrar mensaje del backend solo para likes
      if (isLike) {
        const data = await response.json()
        if (data?.message) {
          console.log(data.message)
        }
      }
    } catch (error) {
      console.error("Error handling swipe:", error)
      alert("Hubo un error al procesar tu acción.")
    }
  
    const xMove = direction === "right" ? 600 : -600
    setDirection(direction)
  
    await controls.start({
      x: xMove,
      rotate: direction === "right" ? 30 : -30,
      transition: { duration: 0.5 },
    })
  
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setProfiles([]) // 🔁 Esto activa el mensaje "No more profiles"
    }
    
    controls.start({ x: 0, rotate: 0, transition: { duration: 0 } })
    setDirection(null)
  }
  

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100
    if (info.offset.x > threshold) {
      handleSwipe("right")
    } else if (info.offset.x < -threshold) {
      handleSwipe("left")
    } else {
      controls.start({ x: 0, rotate: 0, transition: { duration: 0.5 } })
    }
  }

  return (
    <div className="relative w-full max-w-sm mx-auto h-[600px]" ref={constraintsRef}>
      {nextProfile && (
        <div className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden shadow-xl">
          <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden">
            <Image
              src={`http://localhost:8080${nextProfile.profileImageUrl}`}
              alt={nextProfile.username || "Perfil sin nombre"}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

<motion.div
  className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden shadow-xl z-10"
  drag="x"
  dragConstraints={constraintsRef}
  onDragEnd={handleDragEnd}
  animate={controls}
>
  <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden">
    <Image
      src={`http://localhost:8080${currentProfile.profileImageUrl}`}
      alt={currentProfile.username || "Perfil sin nombre"}
      fill
      className="object-cover"
      priority
      draggable={false}  // Agrega esta línea
    />

    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
      <h2 className="text-2xl font-bold">
        {currentProfile.username}, {currentProfile.age}
      </h2>
      <p className="mt-2">{currentProfile.bio}</p>
      <p className="mt-2 text-lg">✨ Compatibilidad: {currentProfile.compatibility}%</p> {/* ✅ Mostrar compatibilidad */}
    </div>

    {direction === "right" && (
      <div className="absolute top-8 right-8 bg-green-500 text-white p-2 rounded-full border-4 border-white transform rotate-12">
        
      </div>
    )}

    {direction === "left" && (
      <div className="absolute top-8 left-8 bg-red-500 text-white p-2 rounded-full border-4 border-white transform -rotate-12">
        
      </div>
    )}
  </div>
</motion.div>

      <div className="absolute bottom-[-80px] left-0 right-0 flex justify-center gap-8 z-20">
        <button
          onClick={() => handleSwipe("left")}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 shadow-lg transition-all"
          aria-label="Dislike"
        >
          <CloseIcon size={32} />
        </button>
        <button
          onClick={() => handleSwipe("right")}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all"
          aria-label="Like"
        >
          <CheckmarkIcon size={32} />
        </button>
      </div>
    </div>
  )
}

