"use client";

import React, { useEffect, useState, useRef } from "react";
import { Pencil, PlusCircle, XCircle } from "lucide-react";
import { useTiposMediosPagoContext } from "@/context/TipoMedioPagoContext";

import { TipoMedioPagoDTO } from "@/dto/TipoMedioPagoDTO";

import ContenedorFiltros from "@/components/filtros/ContenedorFiltros";
import ContenedorBotonesFiltros from "@/components/filtros/ContenedorBotonesFiltros";
import BotonFiltro from "@/components/filtros/BotonFiltro";
import ContenedorSelectores from "@/components/filtros/ContenedorSelectores";
import InputFiltro from "@/components/filtros/InputFiltro";
import SelectFiltro from "@/components/filtros/SelectFiltro";

import ContenedorBotonesAccionCard from "@/components/cards/ContenedorBotonesAccionCard";
import BotonAccionCard from "@/components/cards/BotonAccionCard";
import Modal from "@/components/modal/Modal";
import ContenedorPrincipal from "@/components/common/ContenedorPrincipal";

import Table from "@/components/common/Table";
import { TipoMedioPago } from "@/models/TipoMedioPago";

import RegistrarTipoMedioPago from "@/components/tipoMedioPago/RegistrarTipoMedioPago";

const TiposMediosPagoPage: React.FC = () => {
    const [modalRegistrar, setModalRegistrar] = useState(false);
    const [modalActualizar, setModalActualizar] = useState(false);
    const [ tipoMedioPagoSeleccionado, setTipoMedioPagoSeleccionado] = useState<TipoMedioPagoDTO | null> (null);
    const { tiposMediosPago } = useTiposMediosPagoContext();
    const [ tiposMediosPagoFiltrados, setTiposMediosPagosFiltrados] = useState<TipoMedioPagoDTO[]>([]);

    const nombreTipoMedioPagoRef = useRef<HTMLInputElement>(null);
    const estadoTipoMedioPagoRef = useRef<HTMLSelectElement>(null);

    const filtrarTiposMediosPago = () => {
        const nombreTipoMedioPago = nombreTipoMedioPagoRef.current?.value;
        const estadoTipoMedioPago = estadoTipoMedioPagoRef.current?.value;

        let tiposMediosPagoFiltrados = [...tiposMediosPago];

        if ( estadoTipoMedioPago !== undefined && estadoTipoMedioPago !== "") {
            tiposMediosPagoFiltrados = tiposMediosPagoFiltrados.filter((TipoMedioPago)=> TipoMedioPago.estadoTipoMedioPago === (estadoTipoMedioPago === "true" ) );
        }

        if ( nombreTipoMedioPago) {
            tiposMediosPagoFiltrados = tiposMediosPagoFiltrados.filter((TipoMedioPago) => {
                return TipoMedioPago.nombreTipoMedioPago.toLowerCase().includes(nombreTipoMedioPago.toLowerCase() );
            });
        }

        setTiposMediosPagosFiltrados(tiposMediosPagoFiltrados);
    };

    const limpiarFiltros = () => {
        if (nombreTipoMedioPagoRef.current) nombreTipoMedioPagoRef.current.value = "";
        filtrarTiposMediosPago();
    }

    useEffect(() => {

         if (tiposMediosPago.length > 0) {
        filtrarTiposMediosPago();
    }
    }, [tiposMediosPago]);

    const titulosTabla = [
        { titulo: "Nombre", center: false },
        { titulo: "Estado", center: true },
        { titulo: "Acciones", center: true }
    ]

    return(
        <ContenedorPrincipal>
            <ContenedorFiltros title="Tipos Medios de Pago">
                <ContenedorBotonesFiltros>
                    <BotonFiltro
                        onClick={() => setModalRegistrar(true)}
                        Symbol={PlusCircle}
                        name="Agregar tipo medio de pago"
                    />
                    <BotonFiltro
                        onClick={limpiarFiltros}
                        Symbol={XCircle}
                        name="Limpiar filtros"
                    />
                </ContenedorBotonesFiltros>

                <ContenedorSelectores>
                    <InputFiltro
                        id="nombreTipoMedioPago"
                        name="Nombre"
                        ref={nombreTipoMedioPagoRef}
                        onChange={filtrarTiposMediosPago}/>
                  

                    <SelectFiltro
                        id="estadoTipoMedioPago"
                        name="Estado"
                        onChange={filtrarTiposMediosPago}
                        ref={estadoTipoMedioPagoRef}
                        selectEstado={true}
                        defaultValue= "true"
                    >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </SelectFiltro>
                </ContenedorSelectores>              
            </ContenedorFiltros>

            <div className="w-1/2 mx-auto">
                <Table titulos={titulosTabla}>
                    {tiposMediosPagoFiltrados?.length > 0 ? (
                        tiposMediosPagoFiltrados.map((tipoMedioPago) => (
                            <tr key={tipoMedioPago.idTipoMedioPago} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                <td className="px-4 py-3">{tipoMedioPago.nombreTipoMedioPago}</td>
                                <td className="px-4 py-3 text-center">
                                    {tipoMedioPago.estadoTipoMedioPago ? "Activo" : "Inactivo"}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <BotonAccionCard
                                        Symbol={Pencil}
                                        onClick={() => {
                                            setTipoMedioPagoSeleccionado(tipoMedioPago);
                                            setModalActualizar(true);
                                        }}
                                        h={5}
                                    />
                                </td>
                            </tr>
                                    ))
                        ) : (
                        <tr>
                            <td colSpan={3} className="text-center py-4">No hay tipos de medios de pago disponibles.</td>
                        </tr>
                    )}

                </Table>
            </div>


            <Modal isOpen={modalRegistrar} setIsOpen={() => setModalRegistrar(false)}>
                <RegistrarTipoMedioPago setModalRegistrar={setModalRegistrar} />
            </Modal>

            <Modal isOpen={modalActualizar} setIsOpen={() => setModalActualizar(false)}>
                <RegistrarTipoMedioPago idTipoMedioPago={tipoMedioPagoSeleccionado?.idTipoMedioPago} setModalActualizar={setModalActualizar} />
            </Modal>
                
        </ContenedorPrincipal>

    );

};

export default TiposMediosPagoPage;
