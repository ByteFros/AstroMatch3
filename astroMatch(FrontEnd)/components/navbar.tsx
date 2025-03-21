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
import { useRouter } from "next/navigation"; // Importa el hook useRouter

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
    return (
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
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                as="button"
                size="md"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">zoey@example.com</p>
              </DropdownItem>
              <DropdownItem key="settings">Perfil</DropdownItem>
              <DropdownItem key="team_settings">Configuracion</DropdownItem>
              <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                onClick={handleLogout} // Simula cerrar sesión
              >
                Cerrar Sesión
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </HeroUINavbar>
    );
  }
};
