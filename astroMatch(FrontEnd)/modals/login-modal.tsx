"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Importar router de Next.js
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, Link } from "@heroui/react";
import { useAuthStore } from "@/store/authStore";

export default function LoginModal() {
  const { isLoginOpen, closeLogin } = useAuthStore();
  const router = useRouter(); // Hook para manejar navegación

  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setErrorMessage(null);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Error al iniciar sesión");
        return;
      }

      // Guardar token y datos del usuario en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);



      // Cerrar modal
      closeLogin();

      // Redirigir a la vista de matches
      router.push("/matches");
    } catch (error) {
      console.error("Error en el login:", error);
      setErrorMessage("Hubo un problema con el inicio de sesión.");
    }
  };

  return (
    <Modal isOpen={isLoginOpen} size="sm" placement="top-center" onOpenChange={closeLogin}>
      <ModalContent>
        <div className="px-5">
          <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
          <ModalBody>
            <Input name="username" label="Username" placeholder="Enter your username" variant="bordered" onChange={handleChange} />
            <Input name="password" label="Password" placeholder="Enter your password" type="password" variant="bordered" onChange={handleChange} />

            {errorMessage && <p className="text-red-500 text-xs mt-2">{errorMessage}</p>}

            <div className="flex py-2 px-1 justify-between">
              <Checkbox classNames={{ label: "text-small" }}>Remember me</Checkbox>
              <Link color="primary" href="#" size="sm">Forgot password?</Link>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={closeLogin}>
              Close
            </Button>
            <Button color="primary" onClick={handleLogin}>
              Sign in
            </Button>
          </ModalFooter>
        </div>
      </ModalContent>
    </Modal>
  );
}
