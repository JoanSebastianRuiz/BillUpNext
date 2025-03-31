"use client";

import { useEffect, useState, useRef } from "react";
import { List, PlusCircle, XCircle, Ban, Unlock, Lock } from "lucide-react";

import { VentaDTO } from "@/dto/VentaDTO";
import { useUsuarioContext } from "@/context/UsuarioContext";

import ContenedorFiltros from "@/components/filtros/ContenedorFiltros";
import ContenedorBotonesFiltros from "@/components/filtros/ContenedorBotonesFiltros";
import BotonFiltro from "@/components/filtros/BotonFiltro";
import ContenedorSelectores from "@/components/filtros/ContenedorSelectores";
import SelectFiltro from "@/components/filtros/SelectFiltro";
import BotonAccionCard from "@/components/cards/BotonAccionCard";
import Modal from "@/components/modal/Modal";
import ContenedorPrincipal from "@/components/common/ContenedorPrincipal";
import ControlesPaginacion from "@/components/common/ControlesPaginacion";
import Table from "@/components/common/Table";
import TableRow from "@/components/common/TableRow";
import TableData from "@/components/common/TableData";
import TableMessage from "@/components/common/TableMessage";
import DateInputFiltro from "@/components/filtros/DateInputFiltro";
import RegistrarMovimiento from "@/components/movimientos/RegistrarMovimiento";
import { useCajaContext } from "@/context/CajaContext";
import { MovimientoDTO } from "@/dto/MovimientoDTO";
import AbrirCaja from "@/components/cajas/AbrirCaja";
import CerrarCaja from "@/components/cajas/CerrarCaja";
import MostrarInfoMovimiento from "@/components/movimientos/MostrarInfoMovimiento";
import { UsuarioResponseDTO } from "@/dto/UsuarioResponseDTO";


const MovimientosPage: React.FC = () => {
    const [modalRegistrar, setModalRegistrar] = useState(false);
    const [modalInfo, setModalInfo] = useState(false);
    const [movimientoSeleccionado, setMovimientoSeleccionado] = useState<MovimientoDTO | null>(null);
    const [modalAbrirCaja, setModalAbrirCaja] = useState(false);
    const [modalCerrarCaja, setModalCerrarCaja] = useState(false);
    const { movimientos, cajaSeleccionada, cajas } = useCajaContext()
    const { usuarios, usuario } = useUsuarioContext()
    const [cajeros, setCajeros] = useState<UsuarioResponseDTO[]>(usuarios);
    const [movimientosFiltrados, setMovimientosFiltrados] = useState<MovimientoDTO[]>([]);

    const fechaMovimientoRef = useRef<HTMLInputElement | null>(null);
    const tipoMovimientoRef = useRef<HTMLSelectElement>(null);
    const valorMovimientoRef = useRef<HTMLSelectElement>(null);
    const idUsuarioRef = useRef<HTMLSelectElement>(null);
    const idCajaRef = useRef<HTMLSelectElement>(null);

    // Paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Número de movimientos por página
    const indexOfLastMovimiento = currentPage * itemsPerPage;
    const indexOfFirstMovimiento = indexOfLastMovimiento - itemsPerPage;
    const movimientosActuales = movimientosFiltrados.slice(indexOfFirstMovimiento, indexOfLastMovimiento);
    const totalPages = Math.ceil(movimientosFiltrados.length / itemsPerPage);

    const filtrarMovimientos = () => {
        const fechaMovimiento = fechaMovimientoRef.current?.value || "";
        const tipoMovimiento = tipoMovimientoRef.current?.value;
        const valorMovimiento = valorMovimientoRef.current?.value;
        const idUsuario = idUsuarioRef.current?.value;
        const idCaja = idCajaRef.current?.value;

        let movimientosFiltrados = [...movimientos];

        // Filtrar por estado de movimiento
        if (tipoMovimiento !== undefined && tipoMovimiento !== "0") {
            const estadoBooleano = tipoMovimiento === "true";
            movimientosFiltrados = movimientosFiltrados.filter(movimiento => movimiento.tipoMovimiento === estadoBooleano);
        }

        // Filtrar por fecha de movimiento o cancelación
        if (fechaMovimiento !== "") {
            movimientosFiltrados = movimientosFiltrados.filter(movimiento => {
                const fecha = movimiento.fechaMovimiento
                const fechaFormateada = fecha ? new Date(fecha).toLocaleDateString("sv") : "";
                return fechaFormateada === fechaMovimiento;
            });
        }

        // Filtrar por valor total de movimiento
        if (valorMovimiento && valorMovimiento !== "0") {
            movimientosFiltrados = movimientosFiltrados.filter(movimiento => {
                const valor = Number(movimiento.valorMovimiento) || 0;
                const [min, max] = valorMovimiento.includes("+")
                    ? [parseInt(valorMovimiento), Infinity]
                    : valorMovimiento.split("-").map(Number);

                return valor >= min && valor <= max;
            });
        }

        // Filtrar por caja
        if (idCaja && idCaja !== "0") {
            movimientosFiltrados = movimientosFiltrados.filter(movimiento => movimiento.idCaja === Number(idCaja));
        }

        // Filtrar por usuario
        if (idUsuario && idUsuario !== "0" && usuario.idRol == 2) {
            movimientosFiltrados = movimientosFiltrados.filter(movimiento => movimiento.idUsuario === Number(idUsuario));
        }

        setMovimientosFiltrados(movimientosFiltrados);
    };


    const limpiarFiltros = () => {
        if (fechaMovimientoRef.current) fechaMovimientoRef.current.value = "0";
        if (tipoMovimientoRef.current) tipoMovimientoRef.current.value = "true";
        if (valorMovimientoRef.current) valorMovimientoRef.current.value = "0";
        if (idUsuarioRef.current && usuario.idRol == 2) idUsuarioRef.current.value = "0";
        if (idCajaRef.current) idCajaRef.current.value = "0";
        filtrarMovimientos();
    };

    useEffect(() => {
        filtrarMovimientos();
    }, [movimientos]);

    useEffect(() => {
        if (usuario.idRol === 2) {
            const cajerosFiltrados = usuarios.filter(usuario => usuario.idRol === 3);
            setCajeros(cajerosFiltrados);
        }
    }, [usuarios, usuario.idRol]);

    useEffect(() => {
        if (usuario.idRol === 3) {
            setMovimientosFiltrados(movimientos.filter(movimiento => movimiento.idUsuario === usuario.idUsuario));
        }
    }, [movimientos]);

    let titulosTabla;
    if (usuario.idRol === 2) {
        titulosTabla = [
            { titulo: "Fecha", center: false },
            { titulo: "Valor", center: false },
            { titulo: "Tipo", center: false },
            { titulo: "Descripción", center: false },
            { titulo: "Acciones", center: false },
        ]
    } else {
        titulosTabla = [
            { titulo: "Fecha", center: false },
            { titulo: "Valor", center: false },
            { titulo: "Tipo", center: false },
            { titulo: "Descripción", center: false }
        ]
    }


    return (
        <ContenedorPrincipal>
            <ContenedorFiltros title="Movimientos">
                <ContenedorBotonesFiltros>
                    {usuario.idRol === 3 && (
                        cajaSeleccionada == null ?
                            <BotonFiltro
                                onClick={() => setModalAbrirCaja(true)}
                                Symbol={Unlock}
                                name="Abrir caja"
                            />
                            :
                            (<>
                                <BotonFiltro
                                    onClick={() => setModalCerrarCaja(true)}
                                    Symbol={Lock}
                                    name="Cerrar caja"
                                />

                                <BotonFiltro
                                    onClick={() => setModalRegistrar(true)}
                                    Symbol={PlusCircle}
                                    name="Registrar movimiento"
                                />
                            </>)
                    )}

                    <BotonFiltro
                        onClick={limpiarFiltros}
                        Symbol={XCircle}
                        name="Limpiar filtros"
                    />
                </ContenedorBotonesFiltros>

                <ContenedorSelectores>
                    <DateInputFiltro
                        id="fechaMovimiento"
                        name="Fecha"
                        onChange={filtrarMovimientos}
                        ref={fechaMovimientoRef}
                    />


                    <SelectFiltro
                        id="valorMovimiento"
                        name="Valor"
                        onChange={filtrarMovimientos}
                        ref={valorMovimientoRef}
                    >
                        <option value="0-100000">Menos de $100.000</option>
                        <option value="100000-500000">$100.000 - $500.000</option>
                        <option value="500000-1000000">$500.000 - $1.000.000</option>
                        <option value="1000000+">Más de $1.000.000</option>
                    </SelectFiltro>


                    <SelectFiltro
                        id="tipoMovimiento"
                        name="Tipo"
                        onChange={filtrarMovimientos}
                        ref={tipoMovimientoRef}
                    >
                        <option value="true">Entrada</option>
                        <option value="false">Salida</option>
                    </SelectFiltro>

                    <SelectFiltro
                        id="idCaja"
                        name="Caja"
                        onChange={filtrarMovimientos}
                        ref={idCajaRef}
                    >
                        {cajas.map(caja => (
                            <option key={caja.idCaja} value={caja.idCaja}>
                                {caja.nombreCaja}
                            </option>
                        ))}
                    </SelectFiltro>

                    {usuario.idRol === 2 && (
                        <SelectFiltro
                            id="idUsuario"
                            name="Cajero"
                            onChange={filtrarMovimientos}
                            ref={idUsuarioRef}
                        >
                            {cajeros.length > 0 ? (
                                cajeros.map(cajero => (
                                    <option key={cajero.idUsuario} value={cajero.idUsuario}>
                                        {cajero.nombreUsuario}
                                    </option>
                                ))
                            ) : (
                                <option value="0" disabled>No hay cajeros disponibles</option>
                            )}
                        </SelectFiltro>
                    )}
                </ContenedorSelectores>
            </ContenedorFiltros>

            <div className="">
                <Table titulos={titulosTabla}>
                    {movimientosActuales.length > 0 ? (
                        movimientosActuales.map((movimiento) => {
                            return (
                                <TableRow key={movimiento.idMovimiento}>
                                    <TableData center={false} noWrap={true} width="20%">
                                        {movimiento.fechaMovimiento
                                            ? new Date(movimiento.fechaMovimiento).toLocaleString('es-ES', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                            })
                                            : 'No registrada'}
                                    </TableData>
                                    <TableData center={false} noWrap={true} width="20%">$ {movimiento.valorMovimiento || 'N/A'}</TableData>
                                    <TableData center={false} noWrap={true} width="15%">
                                        {movimiento.tipoMovimiento ? 'Entrada' : 'Salida'}
                                    </TableData>
                                    <TableData center={false} noWrap={false} width={usuario.idRol == 2? "45%" : "30%"}>{movimiento.descripcionMovimiento || 'N/A'}</TableData>
                                    {usuario.idRol === 2 &&
                                        (<TableData center={false} width="15%">
                                            <div className="flex gap-2">
                                                <BotonAccionCard
                                                    Symbol={List}
                                                    onClick={() => {
                                                        setMovimientoSeleccionado(movimiento);
                                                        setModalInfo(true);
                                                    }}
                                                    h={5}
                                                />
                                            </div>
                                        </TableData>)}
                                </TableRow>)
                        })) : (

                        <TableMessage message="No hay movmientos registrados" colSpan={usuario.idRol == 3 ? 4 : 5} />
                    )}
                </Table>
            </div>

            <ControlesPaginacion
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />

            {/* Modal para registrar movimiento */}
            <Modal isOpen={modalRegistrar} setIsOpen={() => setModalRegistrar(false)}>
                <RegistrarMovimiento setModal={setModalRegistrar} />
            </Modal>

            {/* Modal para abrir caja */}
            <Modal isOpen={modalAbrirCaja} setIsOpen={() => setModalAbrirCaja(false)} size="small">
                <AbrirCaja setModal={setModalAbrirCaja} />
            </Modal>

            {/* Modal para cerrar caja */}
            <Modal isOpen={modalCerrarCaja} setIsOpen={() => setModalCerrarCaja(false)} size="small">
                <CerrarCaja setModal={setModalCerrarCaja} />
            </Modal>

            {/* Modal para mostrar información del movimiento */}
            <Modal isOpen={modalInfo} setIsOpen={() => setModalInfo(false)}>
                <MostrarInfoMovimiento movimiento={movimientoSeleccionado} />
            </Modal>

        </ContenedorPrincipal >
    );
};

export default MovimientosPage;