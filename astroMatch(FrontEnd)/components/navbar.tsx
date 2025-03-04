'use client'
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/react";
import { Button } from "@heroui/react";
import LoginModal from "@/modals/login-modal";
import { useAuthStore } from "@/store/authStore"; 
import RegisterModal from "@/modals/Register-modal";
import Link from "next/link";

export const Navbar = () => {
  const { openLogin, openRegister } = useAuthStore();
  const isLoggedIn = false; // Cambia esto según tu lógica de autenticación

  if (!isLoggedIn) {
    return (
      <>
        <HeroUINavbar isBordered isBlurred={false}>
          <NavbarBrand>
            <p className="font-bold text-inherit">AstroMatch</p>
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
              <Button
                onPress={openLogin}
                color="secondary"
                variant="flat"
              >
                Login
              </Button>
            </NavbarItem>
            <NavbarItem className="hidden lg:flex">
              <Button
                onPress={openRegister}
                color="primary"
                variant="flat"
              >
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
          <p className="font-bold text-inherit">AstroMatch</p>
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
              <DropdownItem key="logout" color="danger">
                Cerrar Sesion
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </HeroUINavbar>
    );
  }
};
