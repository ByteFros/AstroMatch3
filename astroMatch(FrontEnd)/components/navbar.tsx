'use client';
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
} from "@heroui/react";
import { Button } from "@heroui/react";
import LoginModal from "@/modals/login-modal";
import RegisterModal from "@/modals/Register-modal";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { usePathname, useRouter } from "next/navigation"

const checkLoginStatus = async () => {
  const response = await fetch("http://localhost:8080/api/auth/isLoggedIn", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await response.json();
  return data.isLoggedIn;
};

export const Navbar = () => {
  const { openLogin, openRegister } = useAuthStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para manejar si el usuario está logueado
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const pathname = usePathname()
  const router = useRouter(); // Instancia del router

  useEffect(() => {
    const fetchLoginStatus = async () => {
      const status = await checkLoginStatus();
      setIsLoggedIn(status);
      setLoading(false); // Finaliza la carga
    };

    fetchLoginStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Elimina el token del almacenamiento local
    setIsLoggedIn(false); // Actualiza el estado local
    window.location.reload(); // Refresca la página para aplicar los cambios
  };

  if (loading) {
    // Muestra un indicador de carga mientras se verifica el estado de inicio de sesión
    return <div>Cargando...</div>;
  }

  if (!isLoggedIn) {
    return (
      <>
        <HeroUINavbar isBordered isBlurred={false}>
          <NavbarBrand>
            <p
              className="font-bold text-inherit cursor-pointer"
              onClick={() => router.push("/")} // Redirige a "/"
            >
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
    );
  } else {
    const filteredNavItems = [
      { href: "/dashboard", label: "Dashboard", icon: "📊" },

    ];

    return (
    <>
    <HeroUINavbar isBordered isBlurred={false}>
      <NavbarBrand >
        <Link href="/" className="font-bold text-xl">
          AstroMtach
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
      </NavbarContent>

      <NavbarContent justify="end">
        {isLoggedIn ? (
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
              <DropdownItem textValue="Información de usuario" className="h-14 gap-2" key={""}>
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
        ) : (
          <div className="flex gap-2">
            <Button variant="flat" onClick={LoginModal}>
              Iniciar sesión
            </Button>
            <Button color="primary" onClick={openRegister}>
              Registrarse
            </Button>
          </div>
        )}
      </NavbarContent>
    </HeroUINavbar>
    </>
    );
  }
};
