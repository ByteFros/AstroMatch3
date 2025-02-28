'use client'
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
  
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import LoginModal from "@/modals/login-modal";
import { useAuthStore } from "@/store/authStore"; 
import RegisterModal from "@/modals/Register-modal";
import Link from "next/link";


export const Navbar = () => {
const { openLogin, openRegister } = useAuthStore();  // Desestructurar correctamente la función 'openLogin'

  return (
    <>
      <HeroUINavbar isBordered isBlurred={false}>
        <NavbarBrand>
          <p className="font-bold text-inherit">AstroMatch</p>
        </NavbarBrand>
        <NavbarItem>
          <Link color="foreground" href="#">
            About us
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Astral Card 
          </Link>
        </NavbarItem>
        <NavbarContent className="hidden sm:flex gap-4" justify="center"></NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Button
              onPress={openLogin}  // Llamar a la función para abrir el modal de Login
              color="secondary"
              variant="flat"
            >
              Login
            </Button>
          </NavbarItem>
          <NavbarItem className="hidden lg:flex">
            <Button
              onPress={openRegister}  // Llamar a la función para abrir el modal de Registro
              color="primary"
              variant="flat"
            >
              Register
            </Button>
          </NavbarItem>
        </NavbarContent>
      </HeroUINavbar>

      {/* Renderiza ambos modales */}
      <LoginModal />
      <RegisterModal />
    </>
  );
};





