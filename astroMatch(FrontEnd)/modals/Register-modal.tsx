// LogiModal.tsx
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, Link, Select, SelectItem,} from "@heroui/react";
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
  {key: "hombre", label: "Hombre"},
  {key: "Mujer", label: "Mujer"},
  
];
export default function RegisterModal() {
  const { isRegisterOpen, closeRegister } = useAuthStore();  // Obtener el estado 'isLoginOpen' y la función 'closeLogin'

  return (
    <Modal isOpen={isRegisterOpen} size="sm" placement="top-center" onOpenChange={closeRegister}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Register</ModalHeader>
        <div className="px-4">
        <ModalBody>
          {/* Correo */}
          <Input label="User" placeholder="Enter your User" variant="bordered" />
          <Input label="Password" placeholder="Enter your Password"  type="password" variant="bordered" />
          <Input label="Mail" placeholder="Enter your mail" variant="bordered" />
          <Input label="Name" placeholder="Enter your Name" variant="bordered" />
          {/* Edad y Horóscopo en la misma línea */}
          <div className="flex gap-4 ">
            <Input label="Age" placeholder="pon tu edad" type="number" variant="bordered" className="" />
                 <Select className="max-w-xs" label="Seleciona un horoscopo">
        {horoscopos.map((horoscopo) => (
          <SelectItem key={horoscopo.key}>{horoscopo.label}</SelectItem>
        ))}
        
      </Select>
      </div>
      <div className="flex gap-4">
         <Select className="max-w-xs" label="Cual es tu genero?">
        {generos.map((genero) => (
          <SelectItem key={genero.key}>{genero.label}</SelectItem>
        ))}
      </Select>
         <Select className="max-w-xs" label="Que genero te gusta?">
        {generos.map((genero) => (
          <SelectItem key={genero.key}>{genero.label}</SelectItem>
        ))}
      </Select>
      </div>
          

          {/* Botón para subir imagen */}
          <div className="py-4 flex justify-end">
            <Button color="primary">
              Upload Image
              <input type="file" hidden />
            </Button>
          </div>

          {/* Otros campos */}
          
        </ModalBody>
        <ModalFooter> 
            <div className="justify-start">
            <Button color="primary">
              Upload Image
              <input type="file" hidden />
            </Button>
          </div>
          <Button color="danger" variant="flat" onPress={closeRegister}>
            Close
          </Button>
          <Button color="primary" onPress={closeRegister}>
            Sign up
          </Button>
          
        </ModalFooter>
        </div>
      </ModalContent>
    </Modal>
  );
}
