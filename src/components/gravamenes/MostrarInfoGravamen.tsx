import { GravamenDTO } from "@/dto/GravamenDTO";

import ContenedorMostrarInfo from "../modal/ContenedorMostrarInfo";
import ParrafoMostrarInfo from "../modal/ParrafoMostrarInfo";
import EstadoMostrarInfo from "../modal/EstadoMostrarInfo";

const MostrarInfoGravamen = ({ gravamen }: {
    gravamen: GravamenDTO;
}) => {
    return (
        <ContenedorMostrarInfo name={gravamen.nombreGravamen}>
            <ParrafoMostrarInfo
                subtitle="Porcentaje"
                text={`${gravamen.porcentajeGravamen}%`}
            />
            <ParrafoMostrarInfo
                subtitle="Tipo"
                text={gravamen.negativoGravamen ? "Deducción" : "Adición"}
            />
            <EstadoMostrarInfo estado={gravamen.estadoGravamen} />
        </ContenedorMostrarInfo>
    );
};

export default MostrarInfoGravamen;