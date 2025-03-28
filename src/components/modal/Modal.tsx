import ReactModal from "react-modal";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
    isOpen: boolean;
    setIsOpen: () => void;
    children: React.ReactNode;
    size?: "small" | "medium" | "large";
}

const sizeClasses = {
    small: "w-96 h-80",
    medium: "w-[600px] h-[400px]",
    large: "w-[900px] h-[600px]",
};

const Modal = ({ isOpen, setIsOpen, children, size = "medium" }: ModalProps) => {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={setIsOpen}
            ariaHideApp={false}
            closeTimeoutMS={300}
            className="fixed inset-0 flex items-center justify-center z-50"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        >
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={`bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 
                        ${sizeClasses[size]} max-h-[90vh] overflow-auto flex flex-col relative`}
                    >
                        {/* Botón de cierre */}
                        <button
                            onClick={setIsOpen}
                            className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        >
                            <X className="w-5 h-5 text-gray-800 dark:text-gray-300" />
                        </button>

                        {/* Contenido */}
                        <div className="flex-1 overflow-auto">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </ReactModal>
    );
};

export default Modal;
