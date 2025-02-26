// LogiModal.tsx
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, Link } from "@heroui/react";
import { useAuthStore } from "@/store/authStore";

export default function LoginModal() {
  const { isLoginOpen, closeLogin } = useAuthStore();  // Obtener el estado 'isLoginOpen' y la función 'closeLogin'

  return (
    <Modal isOpen={isLoginOpen} size="sm" placement="top-center" onOpenChange={closeLogin}>
      <ModalContent>
      <div className="px-5">
        <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
        <ModalBody>
          <Input label="Email" placeholder="Enter your email" variant="bordered" />
          <Input label="Password" placeholder="Enter your password" type="password" variant="bordered" />
          <div className="flex py-2 px-1 justify-between">
            <Checkbox classNames={{ label: "text-small" }}>Remember me</Checkbox>
            <Link color="primary" href="#" size="sm">Forgot password?</Link>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={closeLogin}>
            Close
          </Button>
          <Button color="primary" onPress={closeLogin}>
            Sign in
          </Button>
        </ModalFooter>
        </div>
      </ModalContent>
    </Modal>
  );
}
