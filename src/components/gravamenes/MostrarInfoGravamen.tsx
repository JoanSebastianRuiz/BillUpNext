import { GravamenDTO } from "@/dto/GravamenDTO";

import ContenedorMostrarInfo from "../modal/ContenedorMostrarInfo";
import EstadoMostrarInfo from "../modal/EstadoMostrarInfo";

const MostrarInfoGravamen = ({ gravamen }: {
    gravamen: GravamenDTO;
}) => {
    return (
        <ContenedorMostrarInfo name={gravamen.nombreGravamen}>
            <EstadoMostrarInfo estado={gravamen.estadoGravamen} />
        </ContenedorMostrarInfo>
    );
};

export default MostrarInfoGravamen;