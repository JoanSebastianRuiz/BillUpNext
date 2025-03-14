"use client";

import axios from "axios";

import React, { useEffect, useRef, useState } from "react";
import { Pencil, Eye, PlusCircle, XCircle } from "lucide-react";

import { CajaDTO } from "@/dto/CajaDTO";

import RegistrarCaja from "@/components/caja/RegistrarCaja";

import ContenedorFiltros from "@/components/filtros/ContenedorFiltros";
import ContenedorBotonesFiltros from "@/components/filtros/ContenedorBotonesFiltros";
import BotonFiltro from "@/components/filtros/BotonFiltro";
import ContenedorSelectores from "@/components/filtros/ContenedorSelectores";
import InputFiltro from "@/components/filtros/InputFiltro";
import SelectFiltro from "@/components/filtros/SelectFiltro";

import CajaCard from "@/components/caja/CajaCard";
import ContenedorBotonesAccionCard from "@/components/cards/ContenedorBotonesAccionCard";
import BotonAccionCard from "@/components/cards/BotonAccionCard";
import ContenedorPrincipal from "@/components/common/ContenedorPrincipal";

import Modal from "@/components/modal/Modal";
import { useCajaContext } from "@/context/CajaContext";

const CajasPage: React.FC = () => {
    
    const [modalRegistrar, setModalRegistrar] = useState(false);
    const [modalActualizar, setModalActualizar] = useState(false);
    const [cajaSeleccionada, setCajaSeleccionada] = useState<CajaDTO | null>(null);
    const [cajasFiltradas, setCajasFiltradas] = useState<CajaDTO[]>([]);

    const {empresas, cajas, obtenerCajas} = useCajaContext();
   // const [cajas, setCajas] = useState<CajaDTO[]>([]);
   

    const nombreCajaRef = useRef<HTMLInputElement>(null);
    const idEmpresaRef = useRef<HTMLSelectElement>(null);
    const estadoCajaRef = useRef<HTMLSelectElement>(null);


    const filtrarCajas = () => {
        
        const idEmpresa = idEmpresaRef.current?.value;
        const nombreCaja = nombreCajaRef.current?.value;
        const estadoCaja = estadoCajaRef.current?.value;
        

        let cajasFiltradas = [...cajas];

        if (idEmpresa && idEmpresa !== ""){
            cajasFiltradas = cajasFiltradas.filter((caja) => caja.idEmpresa === Number(idEmpresa));
        }

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
        if (idEmpresaRef.current) idEmpresaRef.current.value = "0";
        if (nombreCajaRef.current) nombreCajaRef.current.value ="";
        filtrarCajas();
    };


    return (
        <ContenedorPrincipal>
            <ContenedorFiltros title= "Cajas">
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

             {/* Grid de Cajas */}
            <div className="grid gap-4 md:grid-cols-3">
                {cajasFiltradas.map((caja) => (
                    <CajaCard caja={caja} key={caja.idCaja}>
                        <ContenedorBotonesAccionCard>
                            <BotonAccionCard
                                Symbol={Pencil}
                                onClick={() => {
                                    setCajaSeleccionada(caja);
                                    setModalActualizar(true);
                                }}
                            />
                        </ContenedorBotonesAccionCard>
                    </CajaCard>
                ))}
            </div>

                {/* Modal para registrar una caja*/}
            <Modal isOpen={modalRegistrar} setIsOpen={() => setModalRegistrar(false)}>
                <RegistrarCaja obtenerCajas={obtenerCajas} setModalRegistrar={setModalRegistrar} />
            </Modal>

                {/* Modal para actualizar una caja*/}
            <Modal isOpen={modalActualizar} setIsOpen={() => setModalActualizar(false)} >
                <RegistrarCaja idCaja={cajaSeleccionada?.idCaja} obtenerCajas={obtenerCajas} setModalActualizar={setModalActualizar} />
            </Modal>

        </ContenedorPrincipal>

    );

};

export default CajasPage;

