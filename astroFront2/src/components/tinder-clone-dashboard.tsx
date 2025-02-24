"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Heart, MessageCircle, User, X } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/card";

interface UserProfile {
  id: number;
  username: string;
  role: string;
}

export function TinderCloneDashboard() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const token = localStorage.getItem("token");

  // Cargar usuarios desde el backend
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/user/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setProfiles(response.data))
      .catch((error) => console.error("Error al obtener usuarios:", error));
  }, [token]);

  const handleSwipe = (direction: "left" | "right") => {
    if (profiles.length > 0) {
      setCurrentProfileIndex((prev) => (prev + 1) % profiles.length);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-between items-center p-4 border-b">
        <User className="h-6 w-6" />
        <h1 className="text-2xl font-bold text-primary">TinderClone</h1>
        <MessageCircle className="h-6 w-6" />
      </header>
      <main className="flex-1 overflow-hidden p-4 flex flex-col items-center justify-center">
        {profiles.length > 0 ? (
          <Card>
            <CardContent>
              <img
                src={`/placeholder.svg?height=400&width=300`} // 📌 Aquí puedes cambiar para usar imágenes reales
                alt={profiles[currentProfileIndex].username}
                className="w-full h-[400px] object-cover"
              />
              <div className="p-4">
                <h2 className="text-2xl font-semibold">
                  {profiles[currentProfileIndex].username}
                </h2>
                <p className="text-muted-foreground">
                  {profiles[currentProfileIndex].role}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <p className="text-lg text-center text-muted-foreground">
            No hay usuarios disponibles.
          </p>
        )}
        <div className="flex justify-center gap-4 mt-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white border-2 border-red-500 hover:bg-red-100"
            onClick={() => handleSwipe("left")}
          >
            <X className="h-6 w-6 text-red-500" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white border-2 border-green-500 hover:bg-green-100"
            onClick={() => handleSwipe("right")}
          >
            <Heart className="h-6 w-6 text-green-500" />
          </Button>
        </div>
      </main>
    </div>
  );
}
