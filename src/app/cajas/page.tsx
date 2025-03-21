"use client";

import React, { useEffect, useRef, useState } from "react";
import { Pencil, PlusCircle, XCircle } from "lucide-react";

import { CajaDTO } from "@/dto/CajaDTO";

import RegistrarCaja from "@/components/caja/RegistrarCaja";

import ContenedorFiltros from "@/components/filtros/ContenedorFiltros";
import ContenedorBotonesFiltros from "@/components/filtros/ContenedorBotonesFiltros";
import BotonFiltro from "@/components/filtros/BotonFiltro";
import ContenedorSelectores from "@/components/filtros/ContenedorSelectores";
import InputFiltro from "@/components/filtros/InputFiltro";
import SelectFiltro from "@/components/filtros/SelectFiltro";
import ControlesPaginacion from "@/components/common/ControlesPaginacion";
import Table from "@/components/common/Table";
import BotonAccionCard from "@/components/cards/BotonAccionCard";
import ContenedorPrincipal from "@/components/common/ContenedorPrincipal";

import Modal from "@/components/modal/Modal";
import { useCajaContext } from "@/context/CajaContext";

const CajasPage: React.FC = () => {

    const [modalRegistrar, setModalRegistrar] = useState(false);
    const [modalActualizar, setModalActualizar] = useState(false);
    const [cajaSeleccionada, setCajaSeleccionada] = useState<CajaDTO | null>(null);
    const [cajasFiltradas, setCajasFiltradas] = useState<CajaDTO[]>([]);

    const { cajas } = useCajaContext();


    const nombreCajaRef = useRef<HTMLInputElement>(null);
    const estadoCajaRef = useRef<HTMLSelectElement>(null);

    // Paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // Número de categorias por página
    const indexOfLastCategoria = currentPage * itemsPerPage;
    const indexOfFirstCategoria = indexOfLastCategoria - itemsPerPage;
    const cajasActuales = cajasFiltradas.slice(indexOfFirstCategoria, indexOfLastCategoria);
    const totalPages = Math.ceil(cajasFiltradas.length / itemsPerPage);

    const filtrarCajas = () => {

        const nombreCaja = nombreCajaRef.current?.value;
        const estadoCaja = estadoCajaRef.current?.value;


        let cajasFiltradas = [...cajas];

        if (estadoCaja !== undefined && estadoCaja !== "") {
            cajasFiltradas = cajasFiltradas.filter((caja) => caja.estadoCaja === (estadoCaja === "true"));
        }

        if (nombreCaja) {
            cajasFiltradas = cajasFiltradas.filter((caja) => {
                return caja.nombreCaja.toLowerCase().includes(nombreCaja.toLowerCase());
            });
        }

        setCajasFiltradas(cajasFiltradas);
    };

    useEffect(() => {
        filtrarCajas();
    }, [cajas]);

    const limpiarFiltros = () => {
        if (nombreCajaRef.current) nombreCajaRef.current.value = "";
        if (estadoCajaRef.current) estadoCajaRef.current.value = "true";
        filtrarCajas();
    };

    const titulosTabla = [
        { titulo: "Nombre", center: false },
        { titulo: "Acciones", center: true }
    ]

    return (
        <ContenedorPrincipal>
            <ContenedorFiltros title="Cajas">
                {/* Botones de filtros */}
                <ContenedorBotonesFiltros>
                    <BotonFiltro
                        onClick={() => setModalRegistrar(true)}
                        Symbol={PlusCircle}
                        name="Agregar Caja"
                    />
                    <BotonFiltro
                        onClick={limpiarFiltros}
                        Symbol={XCircle}
                        name="Limpiar filtros"
                    />
                </ContenedorBotonesFiltros>
                <ContenedorSelectores>
                    {/* Nombre */}
                    <InputFiltro
                        id="nombreCaja"
                        name="Nombre"
                        ref={nombreCajaRef}
                        onChange={filtrarCajas}
                    />
                    {/* Estado */}
                    <SelectFiltro
                        id="estadoCaja"
                        name="Estado"
                        onChange={filtrarCajas}
                        ref={estadoCajaRef}
                        selectEstado={true}
                        defaultValue="true"
                    >
                        <option value="true">Activo </option>
                        <option value="false">Inactivo </option>
                    </SelectFiltro>
                </ContenedorSelectores>
            </ContenedorFiltros>

            <div className="w-1/2 mx-auto">
                <Table titulos={titulosTabla}>
                    {cajasActuales.length > 0 ? (
                        cajasActuales.map((caja) => (
                            <tr key={caja.idCaja} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                <td className="px-4 py-3">{caja.nombreCaja}</td>
                                <td className="px-4 py-3 text-center">
                                    <BotonAccionCard
                                        Symbol={Pencil}
                                        onClick={() => {
                                            setCajaSeleccionada(caja);
                                            setModalActualizar(true);
                                        }}
                                        h={5}
                                    />
                                </td>
                            </tr>
                        ))) : (

                        <tr>
                            <td colSpan={3} className="text-center py-4 text-gray-500 dark:text-gray-400">
                                No se encontraron cajas
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

            {/* Modal para registrar una caja*/}
            <Modal isOpen={modalRegistrar} setIsOpen={() => setModalRegistrar(false)}>
                <RegistrarCaja setModalRegistrar={setModalRegistrar} />
            </Modal>

            {/* Modal para actualizar una caja*/}
            <Modal isOpen={modalActualizar} setIsOpen={() => setModalActualizar(false)} >
                <RegistrarCaja cajaSeleccionada={cajaSeleccionada} setModalActualizar={setModalActualizar} />
            </Modal>

        </ContenedorPrincipal>

    );

};

export default CajasPage;

