import { TipoMedioPagoDTO } from "@/dto/TipoMedioPagoDTO";

import ContenedorMostrarInfo from "../modal/ContenedorMostrarInfo";
import EstadoMostrarInfo from "../modal/EstadoMostrarInfo";

const MostrarInfoTipoMedioPago = ({ tipoMedioPago}: {tipoMedioPago : TipoMedioPagoDTO }) => {
    return (
        <ContenedorMostrarInfo name = {tipoMedioPago.nombreTipoMedioPago}>
                <EstadoMostrarInfo estado = {tipoMedioPago.estadoTipoMedioPago} /> 
        </ContenedorMostrarInfo>
    );
};

export default MostrarInfoTipoMedioPago;