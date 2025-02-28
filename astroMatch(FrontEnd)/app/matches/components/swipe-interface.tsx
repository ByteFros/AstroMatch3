"use client"

import { useState, useRef } from "react"
import CheckmarkIcon from "@/app/icons/checkmark-icon"
import CloseIcon from "@/app/icons/close-icon"
import Image from "next/image"
import { motion, useAnimation, type PanInfo } from "framer-motion"

// Sample profiles data
const profiles = [
  {
    id: 1,
    name: "Sofia",
    age: 28,
    image: "/placeholder.svg?height=500&width=400",
    bio: "Love hiking and outdoor adventures",
  },
  {
    id: 2,
    name: "Marco",
    age: 32,
    image: "/placeholder.svg?height=500&width=400",
    bio: "Foodie and travel enthusiast",
  },
  {
    id: 3,
    name: "Elena",
    age: 26,
    image: "/placeholder.svg?height=500&width=400",
    bio: "Art lover and coffee addict",
  },
  {
    id: 4,
    name: "Carlos",
    age: 30,
    image: "/placeholder.svg?height=500&width=400",
    bio: "Music producer and dog lover",
  },
  {
    id: 5,
    name: "Lucia",
    age: 27,
    image: "/placeholder.svg?height=500&width=400",
    bio: "Yoga instructor and bookworm",
  },
]

export default function SwipeInterface() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<string | null>(null)
  const controls = useAnimation()
  const constraintsRef = useRef(null)

  const currentProfile = profiles[currentIndex]
  const nextProfile = profiles[currentIndex + 1]

  const handleSwipe = async (direction: string) => {
    const xMove = direction === "right" ? 600 : -600

    setDirection(direction)

    await controls.start({
      x: xMove,
      rotate: direction === "right" ? 30 : -30,
      transition: { duration: 0.5 },
    })

    // Move to next profile
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      // Reset to first profile when we reach the end
      setCurrentIndex(0)
    }

    // Reset card position
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
      // Reset position if not swiped far enough
      controls.start({ x: 0, rotate: 0, transition: { duration: 0.5 } })
    }
  }

  if (!currentProfile) {
    return <div className="text-center text-xl">No more profiles to show!</div>
  }

  return (
    <div className="relative w-full max-w-sm mx-auto h-[600px]" ref={constraintsRef}>
      {/* Next profile (shown underneath) */}
      {nextProfile && (
        <div className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden shadow-xl">
          <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden">
            <Image
              src={nextProfile.image || "/placeholder.svg"}
              alt={nextProfile.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Current profile (swipeable) */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden shadow-xl z-10"
        drag="x"
        dragConstraints={constraintsRef}
        onDragEnd={handleDragEnd}
        animate={controls}
      >
        <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden">
          <Image
            src={currentProfile.image || "/placeholder.svg"}
            alt={currentProfile.name}
            fill
            className="object-cover"
            priority
          />

          {/* Profile info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
            <h2 className="text-2xl font-bold">
              {currentProfile.name}, {currentProfile.age}
            </h2>
            <p className="mt-2">{currentProfile.bio}</p>
          </div>

          {/* Like/Dislike indicators */}
          {direction === "right" && (
            <div className="absolute top-8 right-8 bg-green-500 text-white p-2 rounded-full border-4 border-white transform rotate-12">
              <CheckmarkIcon  />
            </div>
          )}

          {direction === "left" && (
            <div className="absolute top-8 left-8 bg-red-500 text-white p-2 rounded-full border-4 border-white transform -rotate-12 w-10 h-10">
              <CloseIcon  />
            </div>
          )}
        </div>
      </motion.div>

      {/* Control buttons */}
      <div className="absolute bottom-[-80px] left-0 right-0 flex justify-center gap-8 z-20">
        <button
          onClick={() => handleSwipe("left")}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 shadow-lg transition-all"
          aria-label="Dislike"
        >
          <CloseIcon size={32}/>
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

