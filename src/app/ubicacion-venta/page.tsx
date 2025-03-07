"use client";

import axios from "axios";

import React, { useEffect, useState, useRef } from "react";
import { Pencil, Eye, PlusCircle, XCircle } from "lucide-react";

import { UbicacionVentaDTO } from "@/dto/UbicacionVentaDTO";

import MostrarInfoUbicacionVenta from "@/components/ubicacionVenta/MostrarInfoUbicacionVenta";  
import RegistrarUbicacionVenta from "@/components/ubicacionVenta/RegistrarUbicacionVenta";
import ContenedorFiltros from "@/components/filtros/ContenedorFiltros";
import ContenedorBotonesFiltros from "@/components/filtros/ContenedorBotonesFiltros";
import BotonFiltro from "@/components/filtros/BotonFiltro";
import ContenedorSelectores from "@/components/filtros/ContenedorSelectores";
import InputFiltro from "@/components/filtros/InputFiltro";
import SelectFiltro from "@/components/filtros/SelectFiltro";
import UbicacionVentaCard from "@/components/ubicacionVenta/UbicacionVentaCard";
import ContenedorBotonesAccionCard from "@/components/cards/ContenedorBotonesAccionCard";
import BotonAccionCard from "@/components/cards/BotonAccionCard";
import Modal from "@/components/modal/Modal";
import ContenedorPrincipal from "@/components/common/ContenedorPrincipal";
import { requestToBodyStream } from "next/dist/server/body-streams";

const UbicacionVentaPage: React.FC = () => {
    const [modalInfo, setModalInfo] = useState(false);
    const [modalRegistrar, setModalRegistrar] = useState(false);
    const [modalActualizar, setModalActualizar] = useState(false);
    const [ubicacionVentaSeleccionada, setUbicacionVentaSeleccionada] = useState<UbicacionVentaDTO | null>(null);
    const [ubicacionesVenta, setUbicacionesVenta] = useState<UbicacionVentaDTO[]>([]);
    const [ubicacionesVentaFiltradas, setUbicacionesVentaFiltradas] = useState<UbicacionVentaDTO[]>([]);

    const nombreUbicacionVentaRef = useRef<HTMLInputElement>(null);
    const estadoUbicacionVentaRef = useRef<HTMLSelectElement>(null);

    const obtenerUbicacionesVenta = async () => {
        try {
            const respuesta = await axios.get<UbicacionVentaDTO[]>("/api/ubicacion-venta");
            if (respuesta.status === 200) {
                setUbicacionesVenta(respuesta.data);
                setUbicacionesVentaFiltradas(respuesta.data);
            }
        } catch (error) {
            console.error("Error obteniendo ubicaciones de venta", error);
        }
    };

    useEffect(() => {
        if (!ubicacionesVenta.length) {
            obtenerUbicacionesVenta();
        }
    }, [ubicacionesVenta.length]);

    const filtrarUbicacionesVenta = () => {
        const nombreUbicacionVenta = nombreUbicacionVentaRef.current?.value;
        const estadoUbicacionVenta = estadoUbicacionVentaRef.current?.value;

        let ubicacionesVentaFiltradas = [...ubicacionesVenta];

        if (estadoUbicacionVenta && estadoUbicacionVenta !== "true") {
            ubicacionesVentaFiltradas = ubicacionesVentaFiltradas.filter((ubicacionVenta) => ubicacionVenta.estadoUbicacionVenta === (estadoUbicacionVenta === "true"));
        }

        if (nombreUbicacionVenta) {
            ubicacionesVentaFiltradas = ubicacionesVentaFiltradas.filter((ubicacionVenta) => {
                return  ubicacionVenta.nombreUbicacionVenta.toLowerCase().includes(nombreUbicacionVenta.toLowerCase());
            });  
        }

        setUbicacionesVentaFiltradas(ubicacionesVentaFiltradas);

    };

    useEffect( () => {
        filtrarUbicacionesVenta();
    }, [ubicacionesVenta]);

    const limpiarFiltros = () => {
        if (nombreUbicacionVentaRef.current) nombreUbicacionVentaRef.current.value = "";
        if (estadoUbicacionVentaRef.current) estadoUbicacionVentaRef.current.value = "true";
        filtrarUbicacionesVenta();
    }

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
                        id= "nombreUbicacionVenta"
                        name= "Nombre"
                        ref={nombreUbicacionVentaRef}
                        onChange={filtrarUbicacionesVenta}
                    />
                    <SelectFiltro 
                        id="estadoUbicacionVenta"
                        name="Estado"
                        onChange={filtrarUbicacionesVenta}
                        ref={estadoUbicacionVentaRef}
                        defaultValue="true"
                    >
                        <option value="true">Activa</option>
                        <option value="false">Inactiva</option>
                    </SelectFiltro>
                </ContenedorSelectores>
            </ContenedorFiltros>
                        
            <div className="grid gap-4 md:grid-cols-3">
                {ubicacionesVentaFiltradas.map((ubicacionesVenta) => (
                    <UbicacionVentaCard ubicacionVenta={ubicacionesVenta} key={ubicacionesVenta.idUbicacionVenta }>
                        <ContenedorBotonesAccionCard>
                            <BotonAccionCard
                                Symbol={Pencil}
                                onClick={() => {
                                    setUbicacionVentaSeleccionada(ubicacionesVenta);
                                    setModalActualizar(true);
                                }}
                            />
                          
                        </ContenedorBotonesAccionCard>
                    </UbicacionVentaCard>
                )
                )}
            </div>

            <Modal isOpen={modalInfo} setIsOpen={() => setModalInfo(false)}>
                {ubicacionVentaSeleccionada && < MostrarInfoUbicacionVenta ubicacionVenta={ubicacionVentaSeleccionada}/>}
            </Modal>

            <Modal isOpen={modalRegistrar} setIsOpen={() => setModalRegistrar(false)} >
                <RegistrarUbicacionVenta obtenerUbicacionesVenta={obtenerUbicacionesVenta} setModalRegistrar={setModalRegistrar} />
            </Modal>

            <Modal isOpen={modalActualizar} setIsOpen={() => setModalActualizar(false)} >
                <RegistrarUbicacionVenta idUbicacionVenta={ubicacionVentaSeleccionada?.idUbicacionVenta} obtenerUbicacionesVenta={obtenerUbicacionesVenta} setModalActualizar={setModalActualizar} />
            </Modal>

        </ContenedorPrincipal>

    );


};

export default UbicacionVentaPage;