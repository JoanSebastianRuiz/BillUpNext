import { useState, useEffect } from "react";

const Notificacion = ({ type, message }: { type: "success" | "error"; message: string }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true); // Activa la notificación cada vez que se renderiza

        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []); // Se ejecuta solo en el montaje

    if (!visible) return null;

    return (
        <div
            className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-md 
            text-white transition-all duration-200
            ${type === "success" ? "bg-green-500 dark:bg-green-700" : "bg-red-500 dark:bg-red-700"}`}
        >
            {message}
        </div>
    );
};

export default Notificacion;
