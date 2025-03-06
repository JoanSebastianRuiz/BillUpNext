import { UbicacionVentaDTO } from "@/dto/UbicacionVentaDTO";

import ContenedorMostrarInfo from "../modal/ContenedorMostrarInfo";
import EstadoMostrarInfo from "../modal/EstadoMostrarInfo";
import { UbicacionVenta } from "@/models/UbicacionVenta";

const MostrarInfoUbicacionVenta = ({ubicacionVenta} : {ubicacionVenta : UbicacionVentaDTO}) => {
    return (
        <ContenedorMostrarInfo name = {ubicacionVenta.nombreUbicacionVenta}>
            <EstadoMostrarInfo estado={ubicacionVenta.estadoUbicacionVenta} />
        </ContenedorMostrarInfo>
    );
};

export default MostrarInfoUbicacionVenta;