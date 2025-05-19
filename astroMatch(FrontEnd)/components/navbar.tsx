"use client"
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge,
  Button,
  Tooltip,
} from "@heroui/react"
import LoginModal from "@/modals/login-modal"
import RegisterModal from "@/modals/Register-modal"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuthStore } from "@/store/authStore"
import { usePathname, useRouter } from "next/navigation"
import MatchesIcon from "@/app/icons/matches-icon"
import DashboardIcon from "@/app/icons/dashboard-icon"
import MatchesCardIcon from "@/app/icons/matches-card-icon"
import ChatBubbleIcon from "@/app/icons/chat-bubble-icon"
import ProfileIcon from "@/app/icons/profile-icon"
import ConfigIcon from "@/app/icons/config-icon"
import LogoutIcon from "@/app/icons/logout-icon"

export const Navbar = () => {
  const { openLogin, openRegister, isLoggedIn, user, logout, checkAuth } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [newMatches, setNewMatches] = useState(0) // Número de nuevos matches (para la notificación)
  const [userProfile, setUserProfile] = useState<{
    id: number;
    username: string;
    email: string;
    profileImageUrl: string;
  } | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // Check authentication status on component mount
  useEffect(() => {
    const verifyAuth = async () => {
      const hasLocalAuth = checkAuth()
      if (hasLocalAuth) {
        try {
          const token = localStorage.getItem("token")
          const response = await fetch("http://localhost:8080/api/auth/isLoggedIn", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          const data = await response.json()
          if (!data.isLoggedIn) {
            logout()
          } else {
            // Llama a fetchUserProfile pero no esperes a que termine para quitar el loading
            fetchUserProfile()
          }
        } catch (error) {
          console.error("Error verifying auth status:", error)
        }
      }
      setLoading(false) // Quita el loading aunque el perfil aún no esté
    }
    verifyAuth()
  }, [checkAuth, logout])

  // Function to fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8080/api/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUserProfile({
          id: data.id,
          username: data.username,
          email: data.email || "No email provided",
          profileImageUrl: data.profileImageUrl
        })
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  if (!isLoggedIn) {
    return (
      <>
        <HeroUINavbar isBordered isBlurred={false}>
          <NavbarBrand>
            <p className="font-bold text-inherit cursor-pointer" onClick={() => router.push("/")}>
              AstroMatch
            </p>
          </NavbarBrand>
          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <NavbarItem>
              <Link href="#">About us</Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="#">Astral Card</Link>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex">
              <Button onPress={openLogin} color="secondary" >
                Login
              </Button>
            </NavbarItem>
            <NavbarItem className="hidden lg:flex">
              <Button onPress={openRegister} color="primary" >
                Register
              </Button>
            </NavbarItem>
          </NavbarContent>
        </HeroUINavbar>

        <LoginModal />
        <RegisterModal />
      </>
    )
  } else {
    const filteredNavItems = [
      
      { href: "/matches", label: "Matches", icon: MatchesCardIcon },
    ]

    // Construct the full avatar URL
    const avatarUrl = userProfile?.profileImageUrl 
      ? `${API_URL}${userProfile.profileImageUrl}` 
      : "";

    return (
      <>
        <HeroUINavbar className="bg-[var(--navbar)]" isBordered isBlurred={false}>
          <NavbarBrand>
            <Link href="/" className="font-bold text-xl">
              AstroMatch
            </Link>
          </NavbarBrand>

          <NavbarContent className="hidden sm:flex gap-4">
            {filteredNavItems.map((item) => (
              <NavbarItem key={item.href} isActive={pathname === item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <item.icon size={18} className="mr-2" />
                  {item.label}
                </Link>
              </NavbarItem>
            ))}
         
          </NavbarContent>

          <NavbarContent justify="end" className="gap-4">
            {/* Nuevo botón de matches */}
            <Tooltip content="Ver tus matches">
              <Badge content={newMatches} color="danger"  shape="circle" size="sm">
                <Button
                  isIconOnly
                  variant="light"
                  aria-label="Ver matches"
                  className="text-default-500 hover:text-primary"
                  onPress={() => router.push("/chat")}
                >
                  <ChatBubbleIcon size={24} />
                </Button>
              </Badge>
            </Tooltip>

            <Dropdown className="bg-[var(--dropdown)]">
              <DropdownTrigger>
                <Avatar
                  as="button"
                  className="transition-transform"
                  src={avatarUrl}
                  size="sm"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Acciones de perfil">
                <DropdownItem textValue="Información de usuario" className="h-14 gap-2" key="user-info">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{userProfile?.username || user.username || "Usuario"}</p>
                    <p className="text-xs text-gray-500">{userProfile?.email || "usuario@ejemplo.com"}</p>
                  </div>
                </DropdownItem>
                <DropdownItem key="profile" onClick={() => router.push("/settings/profile")}>
                  <ProfileIcon size={18} className="mr-2" />
                  <span className="w-full">Perfil</span>
                </DropdownItem>
                <DropdownItem key="my-matches" onClick={() => router.push("/people-matches")}>
                  <MatchesIcon size={18} className="mr-2" />
                  <span className="w-full">Mis matches</span>
                </DropdownItem>
                <DropdownItem key="configuration" onClick={() => router.push("/settings/configuration")}>
                  <ConfigIcon size={18} className="mr-2" />
                  <span className="w-full">Configuración</span>
                </DropdownItem>
                <DropdownItem key="logout" onClick={handleLogout}>
                  <LogoutIcon size={18} className="mr-2" />
                  <span>Cerrar sesión</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>
        </HeroUINavbar>
      </>
    )
  }
}