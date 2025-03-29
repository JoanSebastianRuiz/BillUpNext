"use client";

import { useUsuarioContext } from '@/context/UsuarioContext';

import { MovimientoDTO } from '@/dto/MovimientoDTO';

import ParrafoMostrarInfo from '../modal/ParrafoMostrarInfo';
import ContenedorMostrarInfo from '../modal/ContenedorMostrarInfo';
import EstadoMostrarInfo from '../modal/EstadoMostrarInfo';
import { useEffect, useState } from 'react';
import { useCajaContext } from '@/context/CajaContext';


const MostrarInfoMovimiento = ({ movimiento }: { movimiento: MovimientoDTO | null }) => {
    const { usuarios } = useUsuarioContext();
    const { cajas } = useCajaContext();
    const [cajero, setCajero] = useState(usuarios.find(usuario => usuario.idUsuario === movimiento?.idUsuario));

    return (
        <ContenedorMostrarInfo name="">
            <ParrafoMostrarInfo
                subtitle="Realizado por"
                text={`${cajero?.nombreUsuario} ${cajero?.apellidoUsuario}`}
            />

            <ParrafoMostrarInfo
                subtitle="Caja"
                text={`${cajas.find(caja => caja.idCaja === movimiento?.idCaja)?.nombreCaja}`}
            />

            <ParrafoMostrarInfo
                subtitle="Fecha de movimiento"
                text={`${movimiento?.fechaMovimiento
                    ? new Date(movimiento.fechaMovimiento).toLocaleString('es-ES', {
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
                subtitle="Valor"
                text={`$ ${movimiento?.valorMovimiento}`} />

            <EstadoMostrarInfo estado={movimiento?.tipoMovimiento ?? false} movimiento={true} />


            <div className="col-span-1 sm:col-span-2">
                <ParrafoMostrarInfo
                    subtitle="Descripción"
                    justify={true}
                    text={movimiento?.descripcionMovimiento || "No hay descripción"}
                />
            </div>


        </ContenedorMostrarInfo >
    );
};

export default MostrarInfoMovimiento;