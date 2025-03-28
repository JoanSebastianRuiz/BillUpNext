"use client";

import axios from "axios";

import React, { useEffect, useRef, useState } from "react";
import { Pencil, PlusCircle, XCircle, Lock } from "lucide-react";

import { CajaDTO } from "@/dto/CajaDTO";

import RegistrarCaja from "@/components/cajas/RegistrarCaja";

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
import Notificacion from '@/components/form/Notificacion';

import Modal from "@/components/modal/Modal";
import { useCajaContext } from "@/context/CajaContext";

const CajasPage: React.FC = () => {

    const [modalRegistrar, setModalRegistrar] = useState(false);
    const [modalActualizar, setModalActualizar] = useState(false);
    const [cajaSeleccionada, setCajaSeleccionada] = useState<CajaDTO | null>(null);
    const [cajasFiltradas, setCajasFiltradas] = useState<CajaDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { cajas, obtenerCajas } = useCajaContext();

    const nombreCajaRef = useRef<HTMLInputElement>(null);
    const estadoCajaRef = useRef<HTMLSelectElement>(null);
    const openCajaRef = useRef<HTMLSelectElement>(null);

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
        const openCaja = openCajaRef.current?.value;


        let cajasFiltradas = [...cajas];

        if (estadoCaja !== undefined && estadoCaja !== "") {
            cajasFiltradas = cajasFiltradas.filter((caja) => caja.estadoCaja === (estadoCaja === "true"));
        }

        if (openCaja !== undefined && openCaja !== "0") {
            cajasFiltradas = cajasFiltradas.filter((caja) => caja.openCaja === (openCaja === "true"));
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
        if (openCajaRef.current) openCajaRef.current.value = "0";
        filtrarCajas();
    };

    const handleCerrarCaja = async (caja: CajaDTO) => {
        try {
            const respuesta = await axios.put(`/api/cajas/${caja.idCaja}/cerrar`);
            setError(null);
            setSuccess(respuesta.data.message);
            obtenerCajas();

        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const mensajeError = error.response.data?.message;
                setSuccess(null);
                setError(mensajeError);
                console.error("Error de Axios:", mensajeError, error);
            } else {
                setError("Ocurrió un error inesperado");
                console.error("Error desconocido:", error);
            }
        }
    }

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
                        name="Disponibilidad"
                        onChange={filtrarCajas}
                        ref={estadoCajaRef}
                        selectEstado={true}
                        defaultValue="true"
                    >
                        <option value="true">Disponible</option>
                        <option value="false">No disponible</option>
                    </SelectFiltro>

                    <SelectFiltro
                        id="openCaja"
                        name="Estado"
                        onChange={filtrarCajas}
                        ref={openCajaRef}
                        defaultValue="true"
                    >
                        <option value="true">Abierta</option>
                        <option value="false">Cerrada</option>
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
                                    <div className="flex justify-center items-center gap-x-2">
                                        <BotonAccionCard
                                            Symbol={Pencil}
                                            onClick={() => {
                                                setCajaSeleccionada(caja);
                                                setModalActualizar(true);
                                            }}
                                            h={5}
                                        />
                                        {caja.openCaja && (
                                            <BotonAccionCard
                                                Symbol={Lock}
                                                onClick={() => handleCerrarCaja(caja)}
                                                h={5}
                                            />
                                        )}
                                    </div>
                                </td>
                            </tr>

                        ))) : (

                        <tr>
                            <td colSpan={2} className="text-center py-4 text-gray-500 dark:text-gray-400">
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

            {error && <Notificacion type="error" message={error} />}
            {success && <Notificacion type="success" message={success} />}

        </ContenedorPrincipal>

    );

};

export default CajasPage;

