import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react"; // Example icon library

interface ModalProps {
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

const Modal = ({
  trigger,
  title,
  description,
  className,
  children,
}: ModalProps) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-10/12 h-10/12 translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <Dialog.Title className="hidden">
            Modal Title for Screen Readers
          </Dialog.Title>
          <Dialog.Description className="hiddem">
            Description for Screen Readers
          </Dialog.Description>
          <div className={`w-full h-full ${className}`}>{children}</div>

          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
