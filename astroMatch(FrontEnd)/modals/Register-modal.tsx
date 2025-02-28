'use client'
import React, { useRef, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, Link, Select, SelectItem } from "@heroui/react";
import { useAuthStore } from "@/store/authStore";

export const horoscopos = [
  { key: "aries", label: "Aries" },
  { key: "taurus", label: "Taurus" },
  { key: "gemini", label: "Gemini" },
  { key: "cancer", label: "Cancer" },
  { key: "leo", label: "Leo" },
  { key: "virgo", label: "Virgo" },
  { key: "libra", label: "Libra" },
  { key: "scorpio", label: "Scorpio" },
  { key: "sagittarius", label: "Sagittarius" },
  { key: "capricorn", label: "Capricorn" },
  { key: "aquarius", label: "Aquarius" },
  { key: "pisces", label: "Pisces" }
];

export const generos = [
  { key: "male", label: "Hombre" },
  { key: "female", label: "Mujer" }
];

export default function RegisterModal() {
  const { isRegisterOpen, closeRegister } = useAuthStore();
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const imageRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    age: "",
    gender: "",
    preferredGender: "",
  });

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar cambio de archivo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  // Manejar el registro de usuario
  const handleRegister = async () => {
    if (!imageRef.current || !imageRef.current.files?.length) {
      alert("Por favor, selecciona una imagen.");
      return;
    }

    const file = imageRef.current.files[0];

    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("age", formData.age);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("preferredGender", formData.preferredGender);
    formDataToSend.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error al registrar el usuario");
        return;
      }

      // Guardar token en localStorage
      localStorage.setItem("token", data.token);
      alert("Usuario registrado con éxito");

      // Cerrar modal
      closeRegister();
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Hubo un problema con el registro.");
    }
  };
  return (
    <Modal isOpen={isRegisterOpen} size="sm" placement="top-center" onOpenChange={closeRegister}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Register</ModalHeader>
        <div className="px-4">
          <ModalBody>
            {/* Inputs de registro */}
            <Input name="username" label="User" placeholder="Enter your User" variant="bordered" onChange={handleChange} />
            <Input name="password" label="Password" placeholder="Enter your Password" type="password" variant="bordered" onChange={handleChange} />
            <Input name="email" label="Mail" placeholder="Enter your mail" variant="bordered" onChange={handleChange} />
            {/* <Input label="Name" placeholder="Enter your Name" variant="bordered" /> */}

            {/* Edad y Horóscopo en la misma línea */}
            <div className="flex gap-4">
              <Input name="age" label="Age" placeholder="Enter your age" type="number" variant="bordered" onChange={handleChange} />
              <Select name="zodiacSign" className="max-w-xs" label="Select Horoscope" onChange={handleChange}>
                {horoscopos.map((horoscopo) => (
                  <SelectItem key={horoscopo.key}>{horoscopo.label}</SelectItem>
                ))}
              </Select>
            </div>

            <div className="flex gap-4">
              <Select name="gender" className="max-w-xs" label="What is your gender?" onChange={handleChange}>
                {generos.map((genero) => (
                  <SelectItem key={genero.key}>{genero.label}</SelectItem>
                ))}
              </Select>
              <Select name="preferredGender" className="max-w-xs" label="What gender do you like?" onChange={handleChange}>
                {generos.map((genero) => (
                  <SelectItem key={genero.key}>{genero.label}</SelectItem>
                ))}
              </Select>
            </div>


            {/* Subir imagen */}
            <div className="py-4 flex flex-col items-end">
              {selectedFileName && <p className="text-xs text-gray-600">Archivo seleccionado: {selectedFileName}</p>}
              <Button color="primary" as="label">
                Upload Image
                <input type="file" hidden ref={imageRef} accept="image/*" onChange={handleFileChange} />
              </Button>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={closeRegister}>
              Close
            </Button>
            <Button color="primary" onPress={handleRegister}>
              Sign up
            </Button>
          </ModalFooter>
        </div>
      </ModalContent>
    </Modal>
  );
}
