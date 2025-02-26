import ReactModal from "react-modal";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    setIsOpen: () => void;
    children: React.ReactNode;
}

const Modal = ({ isOpen, setIsOpen, children }: ModalProps) => {
    return (
        < ReactModal
            isOpen={isOpen}
            onRequestClose={setIsOpen}
            ariaHideApp={false}
            className="fixed inset-0 flex items-center justify-center z-50"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        >
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-md sm:max-w-lg md:max-w-2xl relative animate-fadeIn max-h-[90vh] overflow-y-auto">
                {/* Botón para cerrar con icono X */}
                <button
                    onClick={setIsOpen}
                    className="absolute top-3 right-3 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                    <X className="w-5 h-5 text-gray-800 dark:text-gray-300" />
                </button>
                <div className="flex justify-center">
                    {children}
                </div>
            </div>
        </ReactModal >
    )
}

export default Modal; 