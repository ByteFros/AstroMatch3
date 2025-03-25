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

const checkLoginStatus = async () => {
  const response = await fetch("http://localhost:8080/api/auth/isLoggedIn", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  const data = await response.json()
  return data.isLoggedIn
}

export const Navbar = () => {
  const { openLogin, openRegister } = useAuthStore()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newMatches, setNewMatches] = useState(3) // Número de nuevos matches (para la notificación)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const fetchLoginStatus = async () => {
      const status = await checkLoginStatus()
      setIsLoggedIn(status)
      setLoading(false)
    }

    fetchLoginStatus()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    window.location.reload()
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
      { href: "/dashboard", label: "Dashboard", icon: "📊" },
      { href: "/matches", label: "Matches", icon: "🎴" },
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
                  <span className="mr-2">{item.icon}</span>
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
                <span className="mr-2">💬</span>
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
                    <p className="text-sm font-medium">Usuario</p>
                    <p className="text-xs text-gray-500">usuario@ejemplo.com</p>
                  </div>
                </DropdownItem>
                <DropdownItem key="profile">
                  <span className="mr-2">👤</span>
                  <Link href="/settings/profile" className="w-full">
                    Perfil
                  </Link>
                </DropdownItem>
                <DropdownItem key="configuration">
                  <span className="mr-2">⚙️</span>
                  <Link href="/settings/configuration" className="w-full">
                    Configuración
                  </Link>
                </DropdownItem>
                <DropdownItem key="logout" onClick={handleLogout}>
                  <span className="mr-2">🚪</span>
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

