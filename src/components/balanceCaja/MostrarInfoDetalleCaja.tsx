"use client";

import { useUsuarioContext } from '@/context/UsuarioContext';

import { DetalleCajaDTO } from '@/dto/DetalleCajaDTO';

import ParrafoMostrarInfo from '../modal/ParrafoMostrarInfo';
import ContenedorMostrarInfo from '../modal/ContenedorMostrarInfo';
import EstadoMostrarInfo from '../modal/EstadoMostrarInfo';
import { useEffect, useState } from 'react';
import { useCajaContext } from '@/context/CajaContext';


const MostrarInfoDetalleCaja = ({ detalleCaja }: { detalleCaja: DetalleCajaDTO | null }) => {
    const { usuarios } = useUsuarioContext();
    const { cajas } = useCajaContext();
    const [cajero, setCajero] = useState(usuarios.find(usuario => usuario.idUsuario === detalleCaja?.idUsuario));

    return (
        <ContenedorMostrarInfo name="">
            <ParrafoMostrarInfo
                subtitle="Cajero"
                text={`${cajero?.nombreUsuario} ${cajero?.apellidoUsuario}`}
            />

            <ParrafoMostrarInfo
                subtitle="Caja"
                text={`${cajas.find(caja => caja.idCaja === detalleCaja?.idCaja)?.nombreCaja}`}
            />

            <ParrafoMostrarInfo
                subtitle="Fecha de apertura"
                text={`${detalleCaja?.fechaAperturaDetalleCaja
                    ? new Date(detalleCaja.fechaAperturaDetalleCaja).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    })
                    : 'N/A'}`}
            />

            <ParrafoMostrarInfo
                subtitle="Dinero de apertura"
                text={`$ ${detalleCaja?.dineroAperturaDetalleCaja}`} />

            <ParrafoMostrarInfo
                subtitle="Fecha de cierre"
                text={`${detalleCaja?.fechaCierreDetalleCaja
                    ? new Date(detalleCaja.fechaCierreDetalleCaja).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    })
                    : 'N/A'}`}
            />

            <ParrafoMostrarInfo
                subtitle="Dinero de cierre reportado"
                text={detalleCaja?.dineroCierreDetalleCaja ? `$ ${detalleCaja?.dineroCierreDetalleCaja}` : "No reportado"} />

            <ParrafoMostrarInfo
                subtitle="Dinero de cierre calculado"
                text={`$ ${detalleCaja?.dineroCierreSistemaDetalleCaja}`} />

        </ContenedorMostrarInfo >
    );
};

export default MostrarInfoDetalleCaja;