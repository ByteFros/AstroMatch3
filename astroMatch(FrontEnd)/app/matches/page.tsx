'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Para redirigir al usuario
import SwipeInterface from "./components/swipe-interface";

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/"); // Redirige si no hay token
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/auth/isLoggedIn", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.isLoggedIn) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem("token"); // Elimina el token si no es válido
          router.push("/login"); // Redirige al usuario a la página de login
        }
      } catch (error) {
        console.error("Error al verificar el estado de inicio de sesión:", error);
        localStorage.removeItem("token"); // Elimina el token en caso de error
        router.push("/login"); // Redirige en caso de error
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, [router]);

  if (loading) {
    return <div>Cargando...</div>; // Muestra un indicador de carga mientras se verifica el estado
  }

  if (!isLoggedIn) {
    return null; // No renderiza nada si no está logueado (ya se redirigió)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b ">
      
      <SwipeInterface />
    </main>
  );
}

