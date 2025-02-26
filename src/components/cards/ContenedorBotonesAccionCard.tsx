import { ReactNode } from "react";

const ContenedorBotonesAccionCard = ({ children }: { children: ReactNode }) => {
    return (

        < div className="flex gap-6 mt-4 justify-center" >
            {children}
        </div >
    );
};

export default ContenedorBotonesAccionCard;
