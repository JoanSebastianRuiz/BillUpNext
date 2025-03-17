"use client";

import { useEffect, useState, useRef } from "react";
import { Pencil, Eye, PlusCircle, XCircle } from "lucide-react";

import { useUsuarioContext } from '@/context/UsuarioContext';
import { useTerceroContext } from "@/context/TerceroContext";

import { DepartamentoResponseDTO } from '@/dto/DepartamentoResponseDTO';
import { MunicipioResponseDTO } from '@/dto/MunicipioResponseDTO';
import { TerceroResponsePersonaDTO } from "@/dto/TerceroResponsePersonaDTO";

import ContenedorFiltros from "@/components/filtros/ContenedorFiltros";
import ContenedorBotonesFiltros from "@/components/filtros/ContenedorBotonesFiltros";
import BotonFiltro from "@/components/filtros/BotonFiltro";
import ContenedorSelectores from "@/components/filtros/ContenedorSelectores";
import InputFiltro from "@/components/filtros/InputFiltro";
import SelectFiltro from "@/components/filtros/SelectFiltro";
import ClientePersonaCard from "@/components/terceros/clientes/ClientePersonaCard";
import ProveedorPersonaCard from "@/components/terceros/proveedores/ProveedorPersonaCard";
import ContenedorBotonesAccionCard from "@/components/cards/ContenedorBotonesAccionCard";
import BotonAccionCard from "@/components/cards/BotonAccionCard";
import Modal from "@/components/modal/Modal";
import MostrarInfoTerceroPersona from "@/components/terceros/MostrarInfoTerceroPersona";
import RegistrarTerceroPersona from "@/components/terceros/RegistrarTerceroPersona";
import ControlesPaginacion from "@/components/common/ControlesPaginacion";


const TercerosPersona = ({ proveedorTerceroPersona, tipoPersonas }: { proveedorTerceroPersona: boolean, tipoPersonas: "clientes" | "proveedores" }) => {
    const [modalInfo, setModalInfo] = useState(false)
    const [modalRegistrar, setModalRegistrar] = useState(false)
    const [modalActualizar, setModalActualizar] = useState(false)
    const [terceroSeleccionado, setTerceroSeleccionado] = useState<TerceroResponsePersonaDTO | null>(null)
    const { departamentos, municipios, tiposDocumento } = useUsuarioContext()

    const { clientesPersona, proveedoresPersona } = useTerceroContext()

    const personas = tipoPersonas === "clientes" ? clientesPersona : proveedoresPersona;
    const [personasFiltradas, setPersonasFiltradas] = useState<TerceroResponsePersonaDTO[]>([]);
    const [municipiosFiltrados, setMunicipiosFiltrados] = useState<MunicipioResponseDTO[]>([]);
    const [departamentosFiltrados, setDepartamentosFiltrados] = useState<DepartamentoResponseDTO[]>([]);

    const nombrePersonaRef = useRef<HTMLInputElement>(null)
    const idTipoDocumentoRef = useRef<HTMLSelectElement>(null)
    const numeroDocumentoPersonaRef = useRef<HTMLInputElement>(null)
    const idDepartamentoRef = useRef<HTMLSelectElement>(null)
    const idMunicipioRef = useRef<HTMLSelectElement>(null)
    const estadoPersonaRef = useRef<HTMLSelectElement>(null)


    // Paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12); // Número de empresas por página
    const indexOfLastPersona = currentPage * itemsPerPage;
    const indexOfFirstPersona = indexOfLastPersona - itemsPerPage;
    const personasActuales = personasFiltradas.slice(indexOfFirstPersona, indexOfLastPersona);
    const totalPages = Math.ceil(personasFiltradas.length / itemsPerPage);


    const filtrarUsuarios = () => {
        const idTipoDocumento = idTipoDocumentoRef.current?.value;
        const nombrePersona = nombrePersonaRef.current?.value;
        const numeroDocumentoPersona = numeroDocumentoPersonaRef.current?.value;
        const estadoPersona = estadoPersonaRef.current?.value;
        const idDepartamento = idDepartamentoRef.current?.value;
        const idMunicipio = idMunicipioRef.current?.value;

        let personasFiltradas = [...personas];

        if (estadoPersona !== undefined && estadoPersona !== "") {
            personasFiltradas = personasFiltradas.filter((persona) => persona.estadoTercero === (estadoPersona === "true"));
        }

        if (idTipoDocumento && idTipoDocumento !== "0") {
            personasFiltradas = personasFiltradas.filter((persona) => persona.idTipoDocumento === Number(idTipoDocumento));
        }

        if (idDepartamento && idDepartamento !== "0") {
            personasFiltradas = personasFiltradas.filter((persona) => persona.idDepartamento === Number(idDepartamento));
        }

        if (idMunicipio && idMunicipio !== "0") {
            personasFiltradas = personasFiltradas.filter((persona) => persona.idMunicipio === Number(idMunicipio));
        }

        if (nombrePersona) {
            personasFiltradas = personasFiltradas.filter((persona) => {
                const nombreCompleto = `${persona.nombreTercero} ${persona.apellidoTercero}`;
                return nombreCompleto.toLowerCase().includes(nombrePersona.toLowerCase());
            });
        }

        if (numeroDocumentoPersona) {
            personasFiltradas = personasFiltradas.filter((persona) => persona.numeroDocumentoTercero.includes(numeroDocumentoPersona));
        }

        setPersonasFiltradas(personasFiltradas);
    };

    useEffect(() => {
        filtrarUsuarios();
    }, [clientesPersona]);

    useEffect(() => {
        if (!departamentos.length || !municipios.length) return;

        setDepartamentosFiltrados(departamentos);

        const idDepartamento = idDepartamentoRef.current?.value;

        if (idDepartamento && idDepartamento !== "0") {
            setMunicipiosFiltrados(municipios.filter((municipio) => municipio.idDepartamento === Number(idDepartamento)));
        } else {
            setMunicipiosFiltrados(municipios); // Si no hay departamento seleccionado, mostrar todos los municipios
        }
    }, [departamentos, municipios, idDepartamentoRef.current?.value]);


    useEffect(() => {
        if (!municipios.length) return;

        const idMunicipio = idMunicipioRef.current?.value;
        if (idMunicipio && idMunicipio !== "0") {
            const departamentoEncontrado = municipios.find((municipio) => municipio.idMunicipio === Number(idMunicipio))?.idDepartamento;
            if (departamentoEncontrado && idDepartamentoRef.current) {
                idDepartamentoRef.current.value = departamentoEncontrado.toString();
                setMunicipiosFiltrados(municipios.filter((municipio) => municipio.idDepartamento === departamentoEncontrado));
            }
        }
    }, [municipios, idMunicipioRef.current?.value]);

    const limpiarFiltros = () => {
        if (idTipoDocumentoRef.current) idTipoDocumentoRef.current.value = "0";
        if (nombrePersonaRef.current) nombrePersonaRef.current.value = "";
        if (numeroDocumentoPersonaRef.current) numeroDocumentoPersonaRef.current.value = "";
        if (idDepartamentoRef.current) idDepartamentoRef.current.value = "0";
        if (idMunicipioRef.current) idMunicipioRef.current.value = "0";
        filtrarUsuarios();
    }

    return (
        <section>
            <ContenedorFiltros title="">
                {/* Botones de filtros */}
                <ContenedorBotonesFiltros>
                    <BotonFiltro
                        onClick={() => setModalRegistrar(true)}
                        Symbol={PlusCircle}
                        name={proveedorTerceroPersona ? "Agregar proveedor" : "Agregar cliente"} />

                    <BotonFiltro
                        onClick={limpiarFiltros}
                        Symbol={XCircle}
                        name="Limpiar filtros" />

                </ContenedorBotonesFiltros>

                {/* Selectores de filtros */}
                <ContenedorSelectores>
                    {/* Nombre */}
                    <InputFiltro
                        id="nombrePersona"
                        name="Nombre"
                        ref={nombrePersonaRef}
                        onChange={filtrarUsuarios} />

                    {/* Tipo de Documento */}
                    <SelectFiltro
                        id="idTipoDocumento"
                        name="Tipo de documento"
                        onChange={filtrarUsuarios}
                        ref={idTipoDocumentoRef}
                    >
                        {tiposDocumento.map((tipo) => (
                            <option key={tipo.idTipoDocumento} value={tipo.idTipoDocumento.toString()}>
                                {tipo.nombreTipoDocumento}
                            </option>
                        ))}
                    </SelectFiltro>

                    {/* Número de documento */}
                    <InputFiltro
                        id="numeroDocumentoPersona"
                        name="Número de documento"
                        ref={numeroDocumentoPersonaRef}
                        onChange={filtrarUsuarios} />

                    {/* Departamento */}
                    <SelectFiltro
                        id="idDepartamento"
                        name="Departamento"
                        onChange={filtrarUsuarios}
                        ref={idDepartamentoRef}
                    >
                        {departamentosFiltrados.map((departamento) => (
                            <option key={departamento.idDepartamento} value={departamento.idDepartamento.toString()}>
                                {departamento.nombreDepartamento}
                            </option>
                        ))}
                    </SelectFiltro>

                    {/* Municipio */}
                    <SelectFiltro
                        id="idMunicipio"
                        name="Municipio"
                        onChange={filtrarUsuarios}
                        ref={idMunicipioRef}
                    >
                        {municipiosFiltrados.map((municipio) => (
                            <option key={municipio.idMunicipio} value={municipio.idMunicipio.toString()}>
                                {municipio.nombreMunicipio}
                            </option>
                        ))}
                    </SelectFiltro>

                    {/* Estado */}
                    <SelectFiltro
                        id="estadoPersona"
                        name="Estado"
                        onChange={filtrarUsuarios}
                        ref={estadoPersonaRef}
                        selectEstado={true}
                        defaultValue="true"
                    >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </SelectFiltro>
                </ContenedorSelectores>
            </ContenedorFiltros>

            {/* Grid de personas */}
            {personasActuales.length === 0 ?
                (<div className="text-center text-gray-500 mt-8">
                    No se encontraron personas
                </div>) :
                (< div className="grid gap-4 md:grid-cols-3" >
                    {personasActuales.map((persona) =>
                        proveedorTerceroPersona ? (
                            <ProveedorPersonaCard tercero={persona} key={persona.idTercero}>
                                
                                    <BotonAccionCard
                                        Symbol={Pencil}
                                        onClick={() => {
                                            setTerceroSeleccionado(persona);
                                            setModalActualizar(true);
                                        }}
                                        h={3}
                                    />
                                    <BotonAccionCard
                                        Symbol={Eye}
                                        onClick={() => {
                                            setTerceroSeleccionado(persona);
                                            setModalInfo(true);
                                        }}
                                        h={3}
                                    />
                                
                            </ProveedorPersonaCard>
                        ) : (
                            <ClientePersonaCard tercero={persona} key={persona.idTercero}>
                                <ContenedorBotonesAccionCard>
                                    <BotonAccionCard
                                        Symbol={Pencil}
                                        onClick={() => {
                                            setTerceroSeleccionado(persona);
                                            setModalActualizar(true);
                                        }}
                                    />
                                    <BotonAccionCard
                                        Symbol={Eye}
                                        onClick={() => {
                                            setTerceroSeleccionado(persona);
                                            setModalInfo(true);
                                        }}
                                    />
                                </ContenedorBotonesAccionCard>
                            </ClientePersonaCard>
                        )
                    )}

                </div >)}

            {/* Controles de paginación */}
            <ControlesPaginacion
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />

            {/* Modal para mostrar la información de un persona*/}
            <Modal isOpen={modalInfo} setIsOpen={() => setModalInfo(false)}>
                {terceroSeleccionado && <MostrarInfoTerceroPersona tercero={terceroSeleccionado} />}
            </Modal>


            {/* Modal para registrar un persona*/}
            <Modal isOpen={modalRegistrar} setIsOpen={() => setModalRegistrar(false)}>
                <RegistrarTerceroPersona setModalRegistrar={setModalRegistrar} proveedorTerceroPersona={proveedorTerceroPersona} />
            </Modal>


            {/* Modal para actualizar un persona*/}
            <Modal isOpen={modalActualizar} setIsOpen={() => setModalActualizar(false)}>
                <RegistrarTerceroPersona terceroSeleccionado={terceroSeleccionado} setModalActualizar={setModalActualizar} proveedorTerceroPersona={proveedorTerceroPersona} />
            </Modal>

        </section >
    );
};

export default TercerosPersona;
