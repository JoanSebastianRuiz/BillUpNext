"use client";

import { useEffect, useState, useRef } from "react";
import { List, PlusCircle, XCircle, Ban } from "lucide-react";

import { VentaDTO } from "@/dto/VentaDTO";
import { useUsuarioContext } from "@/context/UsuarioContext";
import { useVentaContext } from "@/context/VentaContext";

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
import MostrarInfoVenta from "@/components/ventas/MostrarInfoVenta";
import CancelarVenta from "@/components/ventas/CancelarVenta";
import RegistrarVenta from "@/components/ventas/RegistrarVenta";


const VentasPage: React.FC = () => {
    const [modalRegistrar, setModalRegistrar] = useState(false);
    const [modalInfo, setModalInfo] = useState(false);
    const [modalCancelar, setModalCancelar] = useState(false);
    const [ventaSeleccionada, setVentaSeleccionada] = useState<VentaDTO | null>(null);
    const { ventas } = useVentaContext()
    const { usuarios, usuario } = useUsuarioContext()
    const [ventasFiltradas, setVentasFiltradas] = useState<VentaDTO[]>([]);

    const fechaVentaRef = useRef<HTMLInputElement | null>(null);
    const estadoVentaRef = useRef<HTMLSelectElement>(null);
    const valorTotalVentaRef = useRef<HTMLSelectElement>(null);

    // Paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Número de ventas por página
    const indexOfLastCategoria = currentPage * itemsPerPage;
    const indexOfFirstCategoria = indexOfLastCategoria - itemsPerPage;
    const ventasActuales = ventasFiltradas.slice(indexOfFirstCategoria, indexOfLastCategoria);
    const totalPages = Math.ceil(ventasFiltradas.length / itemsPerPage);

    const filtrarVentas = () => {
        const fechaVenta = fechaVentaRef.current?.value || "";
        const estadoVenta = estadoVentaRef.current?.value;
        const valorTotalVenta = valorTotalVentaRef.current?.value;

        let ventasFiltradas = [...ventas];

        // Filtrar por estado de venta
        if (estadoVenta !== undefined && estadoVenta !== "") {
            const estadoBooleano = estadoVenta === "true";
            ventasFiltradas = ventasFiltradas.filter(venta => venta.estadoVenta === estadoBooleano);
        }

        // Filtrar por fecha de venta o cancelación
        if (fechaVenta !== "") {
            ventasFiltradas = ventasFiltradas.filter(venta => {
                const fecha = estadoVenta === "true"
                    ? venta.fechaVenta
                    : venta.fechaCancelacionVenta;

                const fechaFormateada = fecha ? new Date(fecha).toLocaleDateString("sv") : "";
                return fechaFormateada === fechaVenta;
            });
        }

        // Filtrar por valor total de venta
        if (valorTotalVenta && valorTotalVenta !== "0") {
            ventasFiltradas = ventasFiltradas.filter(venta => {
                const valor = Number(venta.valorTotalVenta) || 0;
                const [min, max] = valorTotalVenta.includes("+")
                    ? [parseInt(valorTotalVenta), Infinity]
                    : valorTotalVenta.split("-").map(Number);

                return valor >= min && valor <= max;
            });
        }

        setVentasFiltradas(ventasFiltradas);
    };


    const limpiarFiltros = () => {
        if (fechaVentaRef.current) fechaVentaRef.current.value = "";
        if (estadoVentaRef.current) estadoVentaRef.current.value = "true";
        if (valorTotalVentaRef.current) valorTotalVentaRef.current.value = "0";
        filtrarVentas();
    };

    useEffect(() => {
        filtrarVentas();
    }, [ventas]);

    const titulosTabla = [
        { titulo: estadoVentaRef.current?.value == "true" ? "Registrada por" : "Cancelada por", center: false },
        { titulo: "Fecha", center: true },
        { titulo: "Valor", center: false },
        { titulo: "Acciones", center: true }
    ]

    return (
        <ContenedorPrincipal>
            <ContenedorFiltros title="Ventas">
                <ContenedorBotonesFiltros>
                    {usuario.idRol === 3 && (
                        <BotonFiltro
                            onClick={() => setModalRegistrar(true)}
                            Symbol={PlusCircle}
                            name="Registrar venta"
                        />)}

                    <BotonFiltro
                        onClick={limpiarFiltros}
                        Symbol={XCircle}
                        name="Limpiar filtros"
                    />
                </ContenedorBotonesFiltros>

                <ContenedorSelectores>
                    <DateInputFiltro
                        id="fechaVenta"
                        name="Fecha"
                        onChange={filtrarVentas}
                        ref={fechaVentaRef}
                    />


                    <SelectFiltro
                        id="valorTotalVenta"
                        name="Valor"
                        onChange={filtrarVentas}
                        ref={valorTotalVentaRef}
                    >
                        <option value="0-100000">Menos de $100.000</option>
                        <option value="100000-500000">$100.000 - $500.000</option>
                        <option value="500000-1000000">$500.000 - $1.000.000</option>
                        <option value="1000000+">Más de $1.000.000</option>
                    </SelectFiltro>


                    <SelectFiltro
                        id="estadoVenta"
                        name="Estado"
                        onChange={filtrarVentas}
                        ref={estadoVentaRef}
                        selectEstado={true}
                        defaultValue="true"
                    >
                        <option value="true">Registrada</option>
                        <option value="false">Cancelada</option>
                    </SelectFiltro>
                </ContenedorSelectores>
            </ContenedorFiltros>

            <div className="w-1/2 mx-auto">
                <Table titulos={titulosTabla}>
                    {ventasActuales.length > 0 ? (
                        ventasActuales.map((venta) => {
                            let u;
                            let fecha;
                            if (venta.estadoVenta) {
                                if (usuario.idUsuario === venta.idUsuario) {
                                    u = usuario;
                                }
                                else {
                                    u = usuarios.find(usuario => usuario.idUsuario === venta.idUsuario)
                                }
                                fecha = venta.fechaVenta;
                            } else {
                                if (usuario.idUsuario === venta.idUsuarioCancelacionVenta) {
                                    u = usuario;
                                }
                                else {
                                    u = usuarios.find(usuario => usuario.idUsuario === venta.idUsuarioCancelacionVenta)
                                }
                                fecha = venta.fechaCancelacionVenta;
                            }

                            return (
                                <TableRow key={venta.idVenta}>
                                    <TableData center={false}>{`${u?.nombreUsuario} ${u?.apellidoUsuario}`}</TableData>
                                    <TableData center={true}>
                                        {fecha
                                            ? new Date(fecha).toLocaleString('es-ES', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                            })
                                            : 'N/A'}
                                    </TableData>
                                    <TableData center={false}>$ {venta.valorTotalVenta || 'N/A'}</TableData>
                                    <TableData center={true}>
                                        <div className="flex justify-center gap-2">
                                            <BotonAccionCard
                                                Symbol={List}
                                                onClick={() => {
                                                    setVentaSeleccionada(venta);
                                                    setModalInfo(true);
                                                }}
                                                h={5}
                                            />
                                            {usuario.idRol == 2 && venta.estadoVenta && (
                                                <BotonAccionCard
                                                    Symbol={Ban}
                                                    onClick={() => {
                                                        setVentaSeleccionada(venta);
                                                        setModalCancelar(true);
                                                    }}
                                                    h={5}
                                                />
                                            )}

                                        </div>
                                    </TableData>
                                </TableRow>)
                        })) : (

                        <TableMessage message="No hay ventas registradas" />
                    )}
                </Table>
            </div>

            <ControlesPaginacion
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />

            <Modal isOpen={modalRegistrar} setIsOpen={() => setModalRegistrar(false)}>
                <RegistrarVenta setModal={setModalRegistrar} />
            </Modal>

            <Modal isOpen={modalInfo} setIsOpen={() => setModalInfo(false)}>
                <MostrarInfoVenta venta={ventaSeleccionada} />
            </Modal>

            <Modal isOpen={modalCancelar} setIsOpen={() => setModalCancelar(false)}>
                <CancelarVenta venta={ventaSeleccionada} setModal={setModalCancelar} />
            </Modal>

        </ContenedorPrincipal>
    );
};

export default VentasPage;