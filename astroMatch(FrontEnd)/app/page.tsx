"use client"

import { useState } from "react"
import Image from "next/image"
import ArrowRight from "./icons/arrow-right"
import { Button } from "@heroui/button"
import { useAuthStore } from "@/store/authStore" // Importa tu store

export default function HomePage() {
  const [zodiacSign, setZodiacSign] = useState("")
  const { isLoggedIn } = useAuthStore() // Obtén el estado de login

  if (!isLoggedIn) {
    return (
      <div className="">
        <section className="container mx-auto px-4 pt-16 pb-24 flex flex-col items-center text-center">
          <div className="w-48 h-48 mb-6">
            <Image
              src="/AstroMatch-icon.png"
              alt="AstroMatch Logo"
              width={292}
              height={292}
              className="w-full h-full"
            />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-purple-900 mb-6">
            Encuentra tu{" "}
            <span className="text-amber-500">conexión astral</span>
          </h1>

          <p className="text-xl text-gray-700 max-w-2xl mb-10">
            Descubre relaciones compatibles basadas en tu signo zodiacal y carta
            astral. El amor está escrito en las estrellas.
          </p>

          
        </section>
      </div>
    )
  } else {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="mb-4">
          <img
            src="/AstroMatch-icon.png"
            alt="Usuario"
            width={296}
            height={296}
            className="rounded-full shadow-lg"
          />
        </div>
        <h2 className="text-2xl font-semibold text-purple-900 mb-2">
          ¡Bienvenido de vuelta!
        </h2>
        <p className="text-gray-600">
          Nos alegra verte nuevamente en AstroMatch.
        </p>
      </div>
    )
  }

  // Si está logueado, muestra el contenido
}
