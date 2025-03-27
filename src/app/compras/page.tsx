"use client";

import { useEffect, useState, useRef } from "react";
import { List, PlusCircle, XCircle, Ban } from "lucide-react";

import { CompraDTO } from "@/dto/CompraDTO";
import { useUsuarioContext } from "@/context/UsuarioContext";
import { useCompraContext } from "@/context/CompraContext";

import ContenedorFiltros from "@/components/filtros/ContenedorFiltros";
import ContenedorBotonesFiltros from "@/components/filtros/ContenedorBotonesFiltros";
import BotonFiltro from "@/components/filtros/BotonFiltro";
import ContenedorSelectores from "@/components/filtros/ContenedorSelectores";
import SelectFiltro from "@/components/filtros/SelectFiltro";
import BotonAccionCard from "@/components/cards/BotonAccionCard";
import Modal from "@/components/modal/Modal";
import ContenedorPrincipal from "@/components/common/ContenedorPrincipal";
import RegistrarCompra from "@/components/compras/RegistarCompra";
import MostrarInfoCompra from "@/components/compras/MostrarInfoCompra";
import ControlesPaginacion from "@/components/common/ControlesPaginacion";
import Table from "@/components/common/Table";
import TableRow from "@/components/common/TableRow";
import TableData from "@/components/common/TableData";
import TableMessage from "@/components/common/TableMessage";
import DateInputFiltro from "@/components/filtros/DateInputFiltro";
import CancelarCompra from "@/components/compras/CancelarCompra";


const ComprasPage: React.FC = () => {
    const [modalRegistrar, setModalRegistrar] = useState(false);
    const [modalInfo, setModalInfo] = useState(false);
    const [modalCancelar, setModalCancelar] = useState(false);
    const [compraSeleccionada, setCompraSeleccionada] = useState<CompraDTO | null>(null);
    const { compras } = useCompraContext()
    const { usuarios, usuario } = useUsuarioContext()
    const [comprasFiltradas, setComprasFiltradas] = useState<CompraDTO[]>([]);

    const fechaCompraRef = useRef<HTMLInputElement | null>(null);
    const estadoCompraRef = useRef<HTMLSelectElement>(null);
    const valorTotalCompraRef = useRef<HTMLSelectElement>(null);

    // Paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Número de compras por página
    const indexOfLastCategoria = currentPage * itemsPerPage;
    const indexOfFirstCategoria = indexOfLastCategoria - itemsPerPage;
    const comprasActuales = comprasFiltradas.slice(indexOfFirstCategoria, indexOfLastCategoria);
    const totalPages = Math.ceil(comprasFiltradas.length / itemsPerPage);

    const filtrarCompras = () => {
        const fechaCompra = fechaCompraRef.current?.value || "";
        const estadoCompra = estadoCompraRef.current?.value;
        const valorTotalCompra = valorTotalCompraRef.current?.value;

        let comprasFiltradas = [...compras];

        // Filtrar por estado de compra
        if (estadoCompra !== undefined && estadoCompra !== "") {
            const estadoBooleano = estadoCompra === "true";
            comprasFiltradas = comprasFiltradas.filter(compra => compra.estadoCompra === estadoBooleano);
        }

        // Filtrar por fecha de compra o cancelación
        if (fechaCompra !== "") {
            comprasFiltradas = comprasFiltradas.filter(compra => {
                const fecha = estadoCompra === "true"
                    ? compra.fechaCompra
                    : compra.fechaCancelacionCompra;

                const fechaFormateada = fecha ? new Date(fecha).toLocaleDateString("sv") : "";
                return fechaFormateada === fechaCompra;
            });
        }

        // Filtrar por valor total de compra
        if (valorTotalCompra && valorTotalCompra !== "0") {
            comprasFiltradas = comprasFiltradas.filter(compra => {
                const valor = Number(compra.valorTotalCompra) || 0;
                const [min, max] = valorTotalCompra.includes("+")
                    ? [parseInt(valorTotalCompra), Infinity]
                    : valorTotalCompra.split("-").map(Number);

                return valor >= min && valor <= max;
            });
        }

        setComprasFiltradas(comprasFiltradas);
    };


    const limpiarFiltros = () => {
        if (fechaCompraRef.current) fechaCompraRef.current.value = "";
        if (estadoCompraRef.current) estadoCompraRef.current.value = "true";
        if (valorTotalCompraRef.current) valorTotalCompraRef.current.value = "0";
        filtrarCompras();
    };

    useEffect(() => {
        filtrarCompras();
    }, [compras]);

    const titulosTabla = [
        { titulo: estadoCompraRef.current?.value == "true" ? "Registrada por" : "Cancelada por", center: false },
        { titulo: "Fecha", center: true },
        { titulo: "Valor", center: false },
        { titulo: "Acciones", center: true }
    ]

    return (
        <ContenedorPrincipal>
            <ContenedorFiltros title="Compras">
                <ContenedorBotonesFiltros>
                    <BotonFiltro
                        onClick={() => setModalRegistrar(true)}
                        Symbol={PlusCircle}
                        name="Agregar compra"
                    />
                    <BotonFiltro
                        onClick={limpiarFiltros}
                        Symbol={XCircle}
                        name="Limpiar filtros"
                    />
                </ContenedorBotonesFiltros>

                <ContenedorSelectores>
                    <DateInputFiltro
                        id="fechaCompra"
                        name="Fecha"
                        onChange={filtrarCompras}
                        ref={fechaCompraRef}
                    />


                    <SelectFiltro
                        id="valorTotalCompra"
                        name="Valor"
                        onChange={filtrarCompras}
                        ref={valorTotalCompraRef}
                    >
                        <option value="0-100000">Menos de $100.000</option>
                        <option value="100000-500000">$100.000 - $500.000</option>
                        <option value="500000-1000000">$500.000 - $1.000.000</option>
                        <option value="1000000+">Más de $1.000.000</option>
                    </SelectFiltro>


                    <SelectFiltro
                        id="estadoCompra"
                        name="Estado"
                        onChange={filtrarCompras}
                        ref={estadoCompraRef}
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
                    {comprasActuales.length > 0 ? (
                        comprasActuales.map((compra) => {
                            let u;
                            let fecha;
                            if (compra.estadoCompra) {
                                if (usuario.idUsuario === compra.idUsuario) {
                                    u = usuario;
                                }
                                else {
                                    u = usuarios.find(usuario => usuario.idUsuario === compra.idUsuario)
                                }
                                fecha = compra.fechaCompra;
                            } else {
                                if (usuario.idUsuario === compra.idUsuarioCancelacionCompra) {
                                    u = usuario;
                                }
                                else {
                                    u = usuarios.find(usuario => usuario.idUsuario === compra.idUsuarioCancelacionCompra)
                                }
                                fecha = compra.fechaCancelacionCompra;
                            }

                            return (
                                <TableRow key={compra.idCompra}>
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
                                    <TableData center={false}>$ {compra.valorTotalCompra || 'N/A'}</TableData>
                                    <TableData center={true}>
                                        <div className="flex justify-center gap-2">
                                            <BotonAccionCard
                                                Symbol={List}
                                                onClick={() => {
                                                    setCompraSeleccionada(compra);
                                                    setModalInfo(true);
                                                }}
                                                h={5}
                                            />
                                            {compra.estadoCompra && (
                                                <BotonAccionCard
                                                    Symbol={Ban}
                                                    onClick={() => {
                                                        setCompraSeleccionada(compra);
                                                        setModalCancelar(true);
                                                    }}
                                                    h={5}
                                                />
                                            )}

                                        </div>
                                    </TableData>
                                </TableRow>)
                        })) : (

                        <TableMessage message="No hay compras registradas" />
                    )}
                </Table>
            </div>

            <ControlesPaginacion
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />

            <Modal isOpen={modalRegistrar} setIsOpen={() => setModalRegistrar(false)}>
                <RegistrarCompra setModalRegistrar={setModalRegistrar} />
            </Modal>

            <Modal isOpen={modalInfo} setIsOpen={() => setModalInfo(false)}>
                <MostrarInfoCompra compra={compraSeleccionada} />
            </Modal>

            <Modal isOpen={modalCancelar} setIsOpen={() => setModalCancelar(false)}>
                <CancelarCompra compra={compraSeleccionada} setModal={setModalCancelar} />
            </Modal>

        </ContenedorPrincipal>
    );
};

export default ComprasPage;