"use client";

import axios from "axios";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Pencil, Eye, PlusCircle, XCircle } from "lucide-react";

import { useUsuarioContext } from '@/context/UsuarioContext';
import { useTerceroContext } from "@/context/TerceroContext";

import { DepartamentoResponseDTO } from '@/dto/DepartamentoResponseDTO';
import { MunicipioResponseDTO } from '@/dto/MunicipioResponseDTO';
import { TipoDocumentoResponseDTO } from '@/dto/TipoDocumentoResponseDTO';
import { TerceroResponsePersonaDTO } from "@/dto/TerceroResponsePersonaDTO";

import ContenedorFiltros from "@/components/filtros/ContenedorFiltros";
import ContenedorBotonesFiltros from "@/components/filtros/ContenedorBotonesFiltros";
import BotonFiltro from "@/components/filtros/BotonFiltro";
import ContenedorSelectores from "@/components/filtros/ContenedorSelectores";
import InputFiltro from "@/components/filtros/InputFiltro";
import SelectFiltro from "@/components/filtros/SelectFiltro";
import TerceroPersonaCard from "@/components/terceros/TerceroPersonaCard";
import ContenedorBotonesAccionCard from "@/components/cards/ContenedorBotonesAccionCard";
import BotonAccionCard from "@/components/cards/BotonAccionCard";
import Modal from "@/components/modal/Modal";
import MostrarInfoTerceroPersona from "@/components/terceros/MostrarInfoTerceroPersona";
import RegistrarTerceroPersona from "@/components/terceros/RegistrarTerceroPersona";
import ContenedorPrincipal from "@/components/common/ContenedorPrincipal";


const ClientesPersona: React.FC = () => {
    const [modalInfo, setModalInfo] = useState(false)
    const [modalRegistrar, setModalRegistrar] = useState(false)
    const [modalActualizar, setModalActualizar] = useState(false)
    const [terceroSeleccionado, setTerceroSeleccionado] = useState<TerceroResponsePersonaDTO | null>(null)
    const {
        departamentos,
        setDepartamentos,
        municipios,
        setMunicipios,
        tiposDocumento,
        setTiposDocumento,
    } = useUsuarioContext()

    const { clientesPersona, setClientesPersona } = useTerceroContext()

    const [clientesPersonaFiltrados, setClientesPersonaFiltrados] = useState<TerceroResponsePersonaDTO[]>([]);
    const [municipiosFiltrados, setMunicipiosFiltrados] = useState<MunicipioResponseDTO[]>([]);
    const [departamentosFiltrados, setDepartamentosFiltrados] = useState<DepartamentoResponseDTO[]>([]);

    const nombreClientePersonaRef = useRef<HTMLInputElement>(null)
    const idTipoDocumentoRef = useRef<HTMLSelectElement>(null)
    const idDepartamentoRef = useRef<HTMLSelectElement>(null)
    const idMunicipioRef = useRef<HTMLSelectElement>(null)
    const estadoClientePersonaRef = useRef<HTMLSelectElement>(null)

    const { data: session } = useSession()
    const idEmpresa = session?.user?.idEmpresa;


    const obtenerClientes = async () => {
        if (!session || idEmpresa === undefined) return; // Esperar a que la sesión esté lista
        try {
            const respuestaPersonas = await axios.get(`/api/empresas/${idEmpresa}/clientes?tipo=persona`);
            if (respuestaPersonas.status === 200) {
                setClientesPersona(respuestaPersonas.data)
                setClientesPersonaFiltrados(respuestaPersonas.data)

            } else {
                console.error(respuestaPersonas.data)
            }

        } catch (error) {
            console.error("Error al obtener los clientes persona:", error)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!session || idEmpresa === undefined) return; // Esperar a que la sesión esté lista
            try {
                if (!departamentos.length) {
                    const departamentosRes = await axios.get("/api/departamentos")
                    if (departamentosRes.status !== 200) {
                        console.error(departamentosRes.data)
                    }
                    setDepartamentos(departamentosRes.data || [])
                }

                if (!tiposDocumento.length) {
                    const tiposDocumentoRes = await axios.get("/api/tipos-documento")
                    if (tiposDocumentoRes.status !== 200) {
                        console.error(tiposDocumentoRes.data)
                    }
                    setTiposDocumento(
                        tiposDocumentoRes.data.filter(
                            (tipoDocumento: TipoDocumentoResponseDTO) => tipoDocumento.estadoTipoDocumento === true,
                        ) || [],
                    )
                }

                if (!municipios.length) {
                    const municipiosRes = await axios.get("/api/municipios")
                    if (municipiosRes.status !== 200) {
                        console.error(municipiosRes.data)
                    }
                    setMunicipios(municipiosRes.data || [])
                }

                if (!clientesPersona.length) {
                    obtenerClientes()
                }

            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [session, idEmpresa, setDepartamentos, setTiposDocumento, setMunicipios, setClientesPersona])


    const filtrarUsuarios = () => {
        const idTipoDocumento = idTipoDocumentoRef.current?.value;
        const nombrePersona = nombreClientePersonaRef.current?.value;
        const estadoClientePersona = estadoClientePersonaRef.current?.value;
        const idDepartamento = idDepartamentoRef.current?.value;
        const idMunicipio = idMunicipioRef.current?.value;

        let clientesPersonaFiltrados = [...clientesPersona];

        if (estadoClientePersona !== undefined && estadoClientePersona !== "") {
            clientesPersonaFiltrados = clientesPersonaFiltrados.filter((clientePersona) => clientePersona.estadoTercero === (estadoClientePersona === "true"));
        }

        if (idTipoDocumento && idTipoDocumento !== "0") {
            clientesPersonaFiltrados = clientesPersonaFiltrados.filter((clientePersona) => clientePersona.idTipoDocumento === Number(idTipoDocumento));
        }

        if (idDepartamento && idDepartamento !== "0") {
            clientesPersonaFiltrados = clientesPersonaFiltrados.filter((clientePersona) => clientePersona.idDepartamento === Number(idDepartamento));
        }

        if (idMunicipio && idMunicipio !== "0") {
            clientesPersonaFiltrados = clientesPersonaFiltrados.filter((clientePersona) => clientePersona.idMunicipio === Number(idMunicipio));
        }

        if (nombrePersona) {
            clientesPersonaFiltrados = clientesPersonaFiltrados.filter((clientePersona) => {
                const nombreCompleto = `${clientePersona.nombreTercero} ${clientePersona.apellidoTercero}`;
                return nombreCompleto.toLowerCase().includes(nombrePersona.toLowerCase());
            });
        }

        setClientesPersonaFiltrados(clientesPersonaFiltrados);
        console.log(clientesPersonaFiltrados);
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
        if (nombreClientePersonaRef.current) nombreClientePersonaRef.current.value = "";
        if (idDepartamentoRef.current) idDepartamentoRef.current.value = "0";
        if (idMunicipioRef.current) idMunicipioRef.current.value = "0";
        filtrarUsuarios();
    }

    return (
        <ContenedorPrincipal>
            <ContenedorFiltros title="Personas">
                {/* Botones de filtros */}
                <ContenedorBotonesFiltros>
                    <BotonFiltro
                        onClick={() => setModalRegistrar(true)}
                        Symbol={PlusCircle}
                        name="Agregar cliente" />

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
                        ref={nombreClientePersonaRef}
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
                        id="estadoClientePersona"
                        name="Estado"
                        onChange={filtrarUsuarios}
                        ref={estadoClientePersonaRef}
                        defaultValue="true"
                    >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </SelectFiltro>
                </ContenedorSelectores>
            </ContenedorFiltros>

            {/* Grid de clientesPersona */}
            < div className="grid gap-4 md:grid-cols-3" >
                {
                    clientesPersonaFiltrados.map((clientePersona) => (
                        <TerceroPersonaCard tercero={clientePersona} key={clientePersona.idTercero}>
                            <ContenedorBotonesAccionCard>
                                <BotonAccionCard
                                    Symbol={Pencil}
                                    onClick={() => {
                                        setTerceroSeleccionado(clientePersona);
                                        setModalActualizar(true);
                                    }}
                                />
                                <BotonAccionCard
                                    Symbol={Eye}
                                    onClick={() => {
                                        setTerceroSeleccionado(clientePersona);
                                        setModalInfo(true);
                                    }}
                                />
                            </ContenedorBotonesAccionCard>
                        </TerceroPersonaCard>
                    ))}

            </div >

            {/* Modal para mostrar la información de un clientePersona*/}
            <Modal isOpen={modalInfo} setIsOpen={() => setModalInfo(false)}>
                {terceroSeleccionado && <MostrarInfoTerceroPersona tercero={terceroSeleccionado} />}
            </Modal>


            {/* Modal para registrar un clientePersona*/}
            <Modal isOpen={modalRegistrar} setIsOpen={() => setModalRegistrar(false)}>
                <RegistrarTerceroPersona obtenerPersonas={obtenerClientes} setModalRegistrar={setModalRegistrar} proveedorTerceroPersona={false} />
            </Modal>


            {/* Modal para actualizar un clientePersona*/}
            <Modal isOpen={modalActualizar} setIsOpen={() => setModalActualizar(false)}>
                <RegistrarTerceroPersona idTercero={terceroSeleccionado?.idTercero} obtenerPersonas={obtenerClientes} setModalActualizar={setModalActualizar} proveedorTerceroPersona={false} />
            </Modal>

        </ContenedorPrincipal >
    );
};

export default ClientesPersona;
