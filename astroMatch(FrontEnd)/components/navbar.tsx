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
  const [newMatches, setNewMatches] = useState(3) // Número de nuevos matches (para la notificación)
  const pathname = usePathname()
  const router = useRouter()

  // Check authentication status on component mount
  useEffect(() => {
    const verifyAuth = async () => {
      // First check local storage
      const hasLocalAuth = checkAuth()

      if (hasLocalAuth) {
        // Verify with server
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
            // If server says not logged in, but we have local token, logout
            logout()
          }
        } catch (error) {
          console.error("Error verifying auth status:", error)
        }
      }

      setLoading(false)
    }

    verifyAuth()
  }, [checkAuth, logout])

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
              <Button onPress={openLogin} color="secondary" variant="flat">
                Login
              </Button>
            </NavbarItem>
            <NavbarItem className="hidden lg:flex">
              <Button onPress={openRegister} color="primary" variant="flat">
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
      { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
      { href: "/matches", label: "Matches", icon: MatchesCardIcon },
    ]

    return (
      <>
        <HeroUINavbar isBordered isBlurred={false}>
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
            <NavbarItem isActive={pathname === "/chat"}>
              <Link
                href="/chat"
                className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/chat" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <ChatBubbleIcon size={18} className="mr-2" />
                Chat
              </Link>
            </NavbarItem>
          </NavbarContent>

          <NavbarContent justify="end" className="gap-4">
            {/* Nuevo botón de matches */}
            <Tooltip content="Ver tus matches">
              <Badge content={newMatches} color="danger" isInvisible={newMatches === 0} shape="circle" size="sm">
                <Button
                  isIconOnly
                  variant="light"
                  aria-label="Ver matches"
                  className="text-default-500 hover:text-primary"
                  onPress={() => router.push("/people-matches")}
                >
                  <MatchesIcon size={24} />
                </Button>
              </Badge>
            </Tooltip>

            <Dropdown>
              <DropdownTrigger>
                <Avatar
                  as="button"
                  className="transition-transform"
                  src="/placeholder.svg?height=32&width=32"
                  size="sm"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Acciones de perfil">
                <DropdownItem textValue="Información de usuario" className="h-14 gap-2" key="user-info">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{user.username || "Usuario"}</p>
                    <p className="text-xs text-gray-500">usuario@ejemplo.com</p>
                  </div>
                </DropdownItem>
                <DropdownItem key="profile">
                  <ProfileIcon size={18} className="mr-2" />
                  <Link href="/settings/profile" className="w-full">
                    Perfil
                  </Link>
                </DropdownItem>
                <DropdownItem key="configuration">
                  <ConfigIcon size={18} className="mr-2" />
                  <Link href="/settings/configuration" className="w-full">
                    Configuración
                  </Link>
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

