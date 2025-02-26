interface NotificacionProps {
    type: "success" | "error";
    message: string;
}

const Notificacion = ({type, message} : NotificacionProps) => {
    return (
        <div className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 ${type =="success"? "bg-green-500" : "bg-red-500" }  text-white px-4 py-2 rounded-lg shadow-md`}>
            {message}
        </div>
    )
}