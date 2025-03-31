"use client";


import React, { useEffect, useState, useRef } from "react";
import { Pencil, PlusCircle, XCircle } from "lucide-react";
import { useVentaContext } from "@/context/VentaContext";

import { UbicacionVentaDTO } from "@/dto/UbicacionVentaDTO";

import RegistrarUbicacionVenta from "@/components/ubicacionVenta/RegistrarUbicacionVenta";
import ContenedorFiltros from "@/components/filtros/ContenedorFiltros";
import ContenedorBotonesFiltros from "@/components/filtros/ContenedorBotonesFiltros";
import BotonFiltro from "@/components/filtros/BotonFiltro";
import ContenedorSelectores from "@/components/filtros/ContenedorSelectores";
import InputFiltro from "@/components/filtros/InputFiltro";
import SelectFiltro from "@/components/filtros/SelectFiltro";
import BotonAccionCard from "@/components/cards/BotonAccionCard";
import Modal from "@/components/modal/Modal";
import ContenedorPrincipal from "@/components/common/ContenedorPrincipal";
import Table from "@/components/common/Table";
import ControlesPaginacion from "@/components/common/ControlesPaginacion";

const UbicacionVentaPage: React.FC = () => {
    const [modalRegistrar, setModalRegistrar] = useState(false);
    const [modalActualizar, setModalActualizar] = useState(false);
    const [ubicacionVentaSeleccionada, setUbicacionVentaSeleccionada] = useState<UbicacionVentaDTO | null>(null);
    const [ubicacionesVentaFiltradas, setUbicacionesVentaFiltradas] = useState<UbicacionVentaDTO[]>([]);

    const nombreUbicacionVentaRef = useRef<HTMLInputElement>(null);
    const estadoUbicacionVentaRef = useRef<HTMLSelectElement>(null);

    const { ubicacionesVenta } = useVentaContext();

    // Paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // Número de categorias por página
    const indexOfLastCategoria = currentPage * itemsPerPage;
    const indexOfFirstCategoria = indexOfLastCategoria - itemsPerPage;
    const ubicacionesVentaActuales = ubicacionesVentaFiltradas.slice(indexOfFirstCategoria, indexOfLastCategoria);
    const totalPages = Math.ceil(ubicacionesVentaFiltradas.length / itemsPerPage);

    const filtrarUbicacionesVenta = () => {
        const nombreUbicacionVenta = nombreUbicacionVentaRef.current?.value;
        const estadoUbicacionVenta = estadoUbicacionVentaRef.current?.value;

        let ubicacionesVentaFiltradas = [...ubicacionesVenta];

        if (estadoUbicacionVenta !== undefined && estadoUbicacionVenta !== "") {
            ubicacionesVentaFiltradas = ubicacionesVentaFiltradas.filter((ubicacionVenta) => ubicacionVenta.estadoUbicacionVenta === (estadoUbicacionVenta === "true"));
        }

        if (nombreUbicacionVenta) {
            ubicacionesVentaFiltradas = ubicacionesVentaFiltradas.filter((ubicacionVenta) => {
                return ubicacionVenta.nombreUbicacionVenta.toLowerCase().includes(nombreUbicacionVenta.toLowerCase());
            });
        }

        setUbicacionesVentaFiltradas(ubicacionesVentaFiltradas);
    };

    useEffect(() => {
        filtrarUbicacionesVenta();
    }, [ubicacionesVenta]);

    const limpiarFiltros = () => {
        if (nombreUbicacionVentaRef.current) nombreUbicacionVentaRef.current.value = "";
        if (estadoUbicacionVentaRef.current) estadoUbicacionVentaRef.current.value = "true";
        filtrarUbicacionesVenta();
    }

    const titulosTabla = [
        { titulo: "Nombre", center: false },
        { titulo: "Acciones", center: true }
    ];

    return (
        <ContenedorPrincipal>
            <ContenedorFiltros title="Ubicaciones de venta">
                <ContenedorBotonesFiltros>
                    <BotonFiltro
                        onClick={() => setModalRegistrar(true)}
                        Symbol={PlusCircle}
                        name="Registrar ubicación de venta"
                    />
                    <BotonFiltro
                        onClick={limpiarFiltros}
                        Symbol={XCircle}
                        name="Limpiar filtros"
                    />
                </ContenedorBotonesFiltros>
                <ContenedorSelectores>
                    <InputFiltro
                        id="nombreUbicacionVenta"
                        name="Nombre"
                        ref={nombreUbicacionVentaRef}
                        onChange={filtrarUbicacionesVenta}
                    />
                    <SelectFiltro
                        id="estadoUbicacionVenta"
                        name="Estado"
                        onChange={filtrarUbicacionesVenta}
                        ref={estadoUbicacionVentaRef}
                        defaultValue="true"
                        selectEstado={true}
                    >
                        <option value="true">Activa</option>
                        <option value="false">Inactiva</option>
                    </SelectFiltro>
                </ContenedorSelectores>
            </ContenedorFiltros>

            <div className="w-1/2 mx-auto">
                <Table titulos={titulosTabla}>
                    {ubicacionesVentaActuales.length > 0 ? (
                        ubicacionesVentaActuales.map((ubicacion) => (
                            <tr key={ubicacion.idUbicacionVenta} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                <td className="px-4 py-3">{ubicacion.nombreUbicacionVenta}</td>
                                <td className="px-4 py-3 text-center">
                                    <BotonAccionCard
                                        Symbol={Pencil}
                                        onClick={() => {
                                            setUbicacionVentaSeleccionada(ubicacion);
                                            setModalActualizar(true);
                                        }}
                                        h={5}
                                    />
                                </td>
                            </tr>
                        ))) : (

                        <tr>
                            <td colSpan={2} className="text-center py-4 text-gray-500 dark:text-gray-400">
                                No se encontraron ubicaciones
                            </td>
                        </tr>
                    )}
                </Table>
            </div>


            <ControlesPaginacion
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />


            <Modal isOpen={modalRegistrar} setIsOpen={() => setModalRegistrar(false)} size="small">
                <RegistrarUbicacionVenta setModalRegistrar={setModalRegistrar} />
            </Modal>

            <Modal isOpen={modalActualizar} setIsOpen={() => setModalActualizar(false)} size="small">
                <RegistrarUbicacionVenta ubicacionVentaSeleccionada={ubicacionVentaSeleccionada} setModalActualizar={setModalActualizar} />
            </Modal>

        </ContenedorPrincipal>

    );


};

export default UbicacionVentaPage;