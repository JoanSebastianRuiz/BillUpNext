import { useCajaContext } from "@/context/CajaContext";
import { useUsuarioContext } from "@/context/UsuarioContext";

import { DetalleCajaDTO } from "@/dto/DetalleCajaDTO";

import ContenedorMostrarInfo from "../modal/ContenedorMostrarInfo";
import ParrafoMostrarInfo from "../modal/ParrafoMostrarInfo";


const MostrarInfoDetalleCaja = ({ detalleCaja}: {detalleCaja: DetalleCajaDTO}) => {
    const { cajas } = useCajaContext();
    const { usuarios } = useUsuarioContext();

    return (
        <ContenedorMostrarInfo name={cajas.find((caja) => caja.idCaja === detalleCaja.idCaja)?.nombreCaja || 'N/A'}>
            <ParrafoMostrarInfo subtitle=" Caja " text={cajas.find((caja) => caja.idCaja === detalleCaja.idCaja)?.nombreCaja || 'N/A'} />
            <ParrafoMostrarInfo subtitle=" Usuario " text={usuarios.find(usu => usu.idUsuario === detalleCaja.idUsuario)?.nombreUsuario || 'N/A' } />
            <ParrafoMostrarInfo subtitle=" Fecha Apertura " text={detalleCaja.fechaAperturaDetalleCaja.toLocaleDateString()} />
            <ParrafoMostrarInfo subtitle=" Fecha Cierre " text={detalleCaja.fechaCierreDetalleCaja.toLocaleDateString()} />
            <ParrafoMostrarInfo subtitle=" Monto Apertura Caja " text={detalleCaja.dineroAperturaDetalleCaja.toString()} />
            <ParrafoMostrarInfo subtitle=" Monto Cierre Caja " text={detalleCaja.dineroCierreDetalleCaja.toString()} />
            <ParrafoMostrarInfo subtitle=" Monto del Sistema Cierre Caja " text={detalleCaja.dineroCierreSistemaDetalleCaja.toString()} />

        </ContenedorMostrarInfo>

    );
};

export default MostrarInfoDetalleCaja;