"use client";

import { useEffect, useState, useRef } from "react";
import { List, PlusCircle, XCircle, Ban } from "lucide-react";

import { CompraDTO } from "@/dto/CompraDTO";
import { useUsuarioContext } from "@/context/UsuarioContext";
import { useCajaContext } from "@/context/CajaContext";

import ContenedorFiltros from "@/components/filtros/ContenedorFiltros";
import ContenedorBotonesFiltros from "@/components/filtros/ContenedorBotonesFiltros";
import BotonFiltro from "@/components/filtros/BotonFiltro";
import ContenedorSelectores from "@/components/filtros/ContenedorSelectores";
import SelectFiltro from "@/components/filtros/SelectFiltro";
import ContenedorPrincipal from "@/components/common/ContenedorPrincipal";
import ControlesPaginacion from "@/components/common/ControlesPaginacion";
import Table from "@/components/common/Table";
import TableRow from "@/components/common/TableRow";
import TableData from "@/components/common/TableData";
import TableMessage from "@/components/common/TableMessage";
import DateInputFiltro from "@/components/filtros/DateInputFiltro";
import { DetalleCajaDTO } from "@/dto/DetalleCajaDTO";


const BalanceCajasPage: React.FC = () => {
    const { detallesCajas, cajas } = useCajaContext()
    const { usuarios } = useUsuarioContext()
    const [detallesCajasFiltrados, setDetallesCajasFiltrados] = useState<DetalleCajaDTO[]>([]);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState(usuarios);

    const fechaAperturaRef = useRef<HTMLInputElement | null>(null);
    const idUsuarioRef = useRef<HTMLSelectElement>(null);
    const idCajaRef = useRef<HTMLSelectElement>(null);

    // Paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Número de detallesCajas por página
    const indexOfLastCategoria = currentPage * itemsPerPage;
    const indexOfFirstCategoria = indexOfLastCategoria - itemsPerPage;
    const detallesCajasActuales = detallesCajasFiltrados.slice(indexOfFirstCategoria, indexOfLastCategoria);
    const totalPages = Math.ceil(detallesCajasFiltrados.length / itemsPerPage);

    const filtrarDetallesCajas = () => {
        const fechaAperturaDetalleCaja = fechaAperturaRef.current?.value || "";
        const idUsuario = idUsuarioRef.current?.value;
        const idCaja = idCajaRef.current?.value;

        let detallesCajasFiltrados = [...detallesCajas];


        // Filtrar por fecha de apertura
        if (fechaAperturaDetalleCaja !== "") {
            detallesCajasFiltrados = detallesCajasFiltrados.filter(detalle => {
                const fecha = detalle.fechaAperturaDetalleCaja;
                const fechaFormateada = fecha ? new Date(fecha).toLocaleDateString("sv") : "";
                return fechaFormateada === fechaAperturaDetalleCaja;
            });
        }

        // Filtrar por valor total de detalle
        if (idCaja && idCaja !== "0") {
            detallesCajasFiltrados = detallesCajasFiltrados.filter(detalle => detalle.idCaja === Number(idCaja));
        }

        // Filtrar por usuario
        if (idUsuario && idUsuario !== "0") {
            detallesCajasFiltrados = detallesCajasFiltrados.filter(detalle => detalle.idUsuario === Number(idUsuario));
        }

        setDetallesCajasFiltrados(detallesCajasFiltrados);
    };


    const limpiarFiltros = () => {
        if (fechaAperturaRef.current) fechaAperturaRef.current.value = "";
        if (idUsuarioRef.current) idUsuarioRef.current.value = "0";
        if (idCajaRef.current) idCajaRef.current.value = "0";
        filtrarDetallesCajas();
    };

    useEffect(() => {
        filtrarDetallesCajas();
    }, [detallesCajas]);

    useEffect(() => {
        setUsuariosFiltrados(usuarios.filter(usuario => usuario.idRol === 3));
    }, [usuarios]);

    const titulosTabla = [
        { titulo: "Fecha Apertura", center: false },
        { titulo: "Dinero Apertura", center: false },
        { titulo: "Fecha Cierre", center: false },
        { titulo: "Dinero Cierre Reportado", center: false },
        { titulo: "Dinero Cierre Sistema", center: false }
    ]

    return (
        <ContenedorPrincipal>
            <ContenedorFiltros title="Balance de Cajas">
                <ContenedorBotonesFiltros>
                    <BotonFiltro
                        onClick={limpiarFiltros}
                        Symbol={XCircle}
                        name="Limpiar filtros"
                    />
                </ContenedorBotonesFiltros>

                <ContenedorSelectores>
                    <DateInputFiltro
                        id="fechaAperturaDetalleCaja"
                        name="Fecha"
                        onChange={filtrarDetallesCajas}
                        ref={fechaAperturaRef}
                    />

                    <SelectFiltro
                        id="idCaja"
                        name="Caja"
                        onChange={filtrarDetallesCajas}
                        ref={idCajaRef}
                    >
                        {cajas.map(caja => (
                            <option key={caja.idCaja} value={caja.idCaja}>
                                {caja.nombreCaja}
                            </option>
                        ))}
                    </SelectFiltro>

                    <SelectFiltro
                        id="idUsuario"
                        name="Cajero"
                        onChange={filtrarDetallesCajas}
                        ref={idUsuarioRef}
                    >
                        {usuariosFiltrados.map(usuario => (
                            <option key={usuario.idUsuario} value={usuario.idUsuario}>
                                {`${usuario.nombreUsuario} ${usuario.apellidoUsuario}`}
                            </option>
                        ))}
                    </SelectFiltro>

                </ContenedorSelectores>
            </ContenedorFiltros>

            <div className="">
                <Table titulos={titulosTabla}>
                    {detallesCajasActuales.length > 0 ? (
                        detallesCajasActuales.map((detalle) => {
                            return (
                                <TableRow key={detalle.idDetalleCaja}>
                                    <TableData center={false} noWrap={true}>{
                                        detalle.fechaAperturaDetalleCaja
                                            ? new Date(detalle.fechaAperturaDetalleCaja).toLocaleString('es-ES', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                            })
                                            : 'No registrada'
                                    }</TableData>
                                    <TableData center={false} noWrap={true}>$ {detalle.dineroAperturaDetalleCaja}</TableData>
                                    <TableData center={false} noWrap={true}>{
                                        detalle.fechaCierreDetalleCaja
                                            ? new Date(detalle.fechaCierreDetalleCaja).toLocaleString('es-ES', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                            })
                                            : 'No registrada'
                                    }</TableData>
                                    <TableData center={false} noWrap={true}>
                                        {detalle.dineroCierreDetalleCaja !== null ? `$ ${detalle.dineroCierreDetalleCaja}` : 'No registrado'}
                                    </TableData>
                                    <TableData center={false} noWrap={true}>
                                        {detalle.dineroCierreSistemaDetalleCaja !== null ? `$ ${detalle.dineroCierreSistemaDetalleCaja}` : 'No registrado'}
                                    </TableData>
                                </TableRow>)
                        })) : (

                        <TableMessage colSpan={5} message="No hay balances de caja registrados" />
                    )}
                </Table>
            </div>

            <ControlesPaginacion
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />

        </ContenedorPrincipal>
    );
};

export default BalanceCajasPage;