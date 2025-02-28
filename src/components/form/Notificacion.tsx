interface NotificacionProps {
    type: "success" | "error";
    message: string;
}

const Notificacion = ({ type, message }: NotificacionProps) => {
    return (
        <div
            className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-md 
        text-white transition-all duration-200
        ${type === "success"
                    ? "bg-green-500 dark:bg-green-700"
                    : "bg-red-500 dark:bg-red-700"
                }`}
        >
            {message}
        </div>

    )
}

export default Notificacion;