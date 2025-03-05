"use client";

import axios from "axios";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Pencil, Eye, PlusCircle, XCircle } from "lucide-react";

import { useUsuarioContext } from '@/context/UsuarioContext';
import { useEmpresaContext } from "@/context/EmpresaContext";
import { useTerceroContext } from "@/context/TerceroContext";

import { DepartamentoResponseDTO } from '@/dto/DepartamentoResponseDTO';
import { MunicipioResponseDTO } from '@/dto/MunicipioResponseDTO';
import { TipoDocumentoResponseDTO } from '@/dto/TipoDocumentoResponseDTO';
import { TerceroResponseEmpresaDTO } from "@/dto/TerceroResponseEmpresaDTO";

import ContenedorFiltros from "@/components/filtros/ContenedorFiltros";
import ContenedorBotonesFiltros from "@/components/filtros/ContenedorBotonesFiltros";
import BotonFiltro from "@/components/filtros/BotonFiltro";
import ContenedorSelectores from "@/components/filtros/ContenedorSelectores";
import InputFiltro from "@/components/filtros/InputFiltro";
import SelectFiltro from "@/components/filtros/SelectFiltro";
import TerceroEmpresaCard from "@/components/terceros/TerceroEmpresaCard";
import ContenedorBotonesAccionCard from "@/components/cards/ContenedorBotonesAccionCard";
import BotonAccionCard from "@/components/cards/BotonAccionCard";
import Modal from "@/components/modal/Modal";
import MostrarInfoTerceroEmpresa from "@/components/terceros/MostrarInfoTerceroEmpresa";
import RegistrarTerceroEmpresa from "@/components/terceros/RegistrarTerceroEmpresa";
import ControlesPaginacion from "@/components/common/ControlesPaginacion";


const TercerosEmpresa = ({ proveedorTerceroEmpresa, tipoEmpresas }: { proveedorTerceroEmpresa: boolean, tipoEmpresas: "clientes" | "proveedores" }) => {
    const [modalInfo, setModalInfo] = useState(false)
    const [modalRegistrar, setModalRegistrar] = useState(false)
    const [modalActualizar, setModalActualizar] = useState(false)
    const [terceroSeleccionado, setTerceroSeleccionado] = useState<TerceroResponseEmpresaDTO | null>(null)
    const {
        departamentos,
        setDepartamentos,
        municipios,
        setMunicipios,
    } = useUsuarioContext()
    const {
        tiposPersona,
        setTiposPersona,
        regimenesContribuyente,
        setRegimenesContribuyente,

    } = useEmpresaContext()

    const { clientesEmpresa, setClientesEmpresa, proveedoresEmpresa, setProveedoresEmpresa } = useTerceroContext()

    const [empresasFiltradas, setEmpresasFiltradas] = useState<TerceroResponseEmpresaDTO[]>([]);
    const [municipiosFiltrados, setMunicipiosFiltrados] = useState<MunicipioResponseDTO[]>([]);
    const [departamentosFiltrados, setDepartamentosFiltrados] = useState<DepartamentoResponseDTO[]>([]);

    const nombreEmpresaRef = useRef<HTMLInputElement>(null)
    const nitEmpresaRef = useRef<HTMLInputElement>(null)
    const idRegimenContribuyenteRef = useRef<HTMLSelectElement>(null)
    const idTipoPersonaRef = useRef<HTMLSelectElement>(null)
    const idDepartamentoRef = useRef<HTMLSelectElement>(null)
    const idMunicipioRef = useRef<HTMLSelectElement>(null)
    const estadoPersonaRef = useRef<HTMLSelectElement>(null)

    const { data: session } = useSession()
    const idEmpresa = session?.user?.idEmpresa;

    // Paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12); // Número de empresas por página
    const indexOfLastEmpresa = currentPage * itemsPerPage;
    const indexOfFirstEmpresa = indexOfLastEmpresa - itemsPerPage;
    const empresasActuales = empresasFiltradas.slice(indexOfFirstEmpresa, indexOfLastEmpresa);
    const totalPages = Math.ceil(empresasFiltradas.length / itemsPerPage);


    const obtenerEmpresas = async () => {
        if (!session || idEmpresa === undefined) return; // Esperar a que la sesión esté lista
        try {
            const respuestaEmpresas = await axios.get(`/api/empresas/${idEmpresa}/${tipoEmpresas}?tipo=empresa`);
            if (respuestaEmpresas.status === 200) {
                if (tipoEmpresas === "proveedores") {
                    setProveedoresEmpresa(respuestaEmpresas.data)
                    setEmpresasFiltradas(respuestaEmpresas.data)
                } else {
                    setClientesEmpresa(respuestaEmpresas.data)
                    setEmpresasFiltradas(respuestaEmpresas.data)
                }

            } else {
                console.error(respuestaEmpresas.data)
            }

        } catch (error) {
            console.error(`Error al obtener los ${tipoEmpresas} empresa:`, error)
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

                if (!tiposPersona.length) {
                    const tiposPersonaRes = await axios.get("/api/tipos-persona")
                    if (tiposPersonaRes.status !== 200) {
                        console.error(tiposPersonaRes.data)
                    }
                    setTiposPersona(tiposPersonaRes.data || [])
                }

                if (!regimenesContribuyente.length) {
                    const regimenesContribuyenteRes = await axios.get("/api/regimenes-contribuyente")
                    if (regimenesContribuyenteRes.status !== 200) {
                        console.error(regimenesContribuyenteRes.data)
                    }
                    setRegimenesContribuyente(regimenesContribuyenteRes.data || [])
                }

                if (!municipios.length) {
                    const municipiosRes = await axios.get("/api/municipios")
                    if (municipiosRes.status !== 200) {
                        console.error(municipiosRes.data)
                    }
                    setMunicipios(municipiosRes.data || [])
                }

                if (tipoEmpresas === "clientes" && !clientesEmpresa.length) {
                    obtenerEmpresas()
                }

                if (tipoEmpresas === "proveedores" && !proveedoresEmpresa.length) {
                    obtenerEmpresas()
                }

            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [session, idEmpresa, setDepartamentos, setTiposPersona, setMunicipios, setClientesEmpresa, setProveedoresEmpresa, setRegimenesContribuyente])


    const filtrarUsuarios = () => {
        const idRegimenContribuyente = idRegimenContribuyenteRef.current?.value;
        const idTipoPersona = idTipoPersonaRef.current?.value;
        const nombreEmpresa = nombreEmpresaRef.current?.value;
        const nitEmpresa = nitEmpresaRef.current?.value;
        const estadoEmpresa = estadoPersonaRef.current?.value;
        const idDepartamento = idDepartamentoRef.current?.value;
        const idMunicipio = idMunicipioRef.current?.value;

        let empresasFiltradas = [...clientesEmpresa];

        if (estadoEmpresa !== undefined && estadoEmpresa !== "") {
            empresasFiltradas = empresasFiltradas.filter((empresa) => empresa.estadoTercero === (estadoEmpresa === "true"));
        }

        if (idRegimenContribuyente && idRegimenContribuyente !== "0") {
            empresasFiltradas = empresasFiltradas.filter((empresa) => empresa.idRegimenContribuyente === Number(idRegimenContribuyente));
        }

        if (idTipoPersona && idTipoPersona !== "0") {
            empresasFiltradas = empresasFiltradas.filter((empresa) => empresa.idTipoPersona === Number(idTipoPersona));
        }

        if (idDepartamento && idDepartamento !== "0") {
            empresasFiltradas = empresasFiltradas.filter((empresa) => empresa.idDepartamento === Number(idDepartamento));
        }

        if (idMunicipio && idMunicipio !== "0") {
            empresasFiltradas = empresasFiltradas.filter((empresa) => empresa.idMunicipio === Number(idMunicipio));
        }

        if (nombreEmpresa) {
            empresasFiltradas = empresasFiltradas.filter((empresa) => empresa.nombreTercero.toLowerCase().includes(nombreEmpresa.toLowerCase()));
        }

        if (nitEmpresa) {
            empresasFiltradas = empresasFiltradas.filter((empresa) => empresa.nitTercero.toLowerCase().includes(nitEmpresa.toLowerCase()));
        }

        setEmpresasFiltradas(empresasFiltradas);
    };

    useEffect(() => {
        filtrarUsuarios();
    }, [clientesEmpresa]);

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
        if (idRegimenContribuyenteRef.current) idRegimenContribuyenteRef.current.value = "0";
        if (idTipoPersonaRef.current) idTipoPersonaRef.current.value = "0";
        if (nombreEmpresaRef.current) nombreEmpresaRef.current.value = "";
        if (nitEmpresaRef.current) nitEmpresaRef.current.value = "";
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
                        name={proveedorTerceroEmpresa ? "Agregar proveedor" : "Agregar cliente"} />

                    <BotonFiltro
                        onClick={limpiarFiltros}
                        Symbol={XCircle}
                        name="Limpiar filtros" />

                </ContenedorBotonesFiltros>

                {/* Selectores de filtros */}
                <ContenedorSelectores>
                    {/* Nombre */}
                    <InputFiltro
                        id="nombreEmpresa"
                        name="Nombre"
                        ref={nombreEmpresaRef}
                        onChange={filtrarUsuarios} />

                    {/* NIT */}
                    <InputFiltro
                        id="nitEmpresa"
                        name="NIT"
                        ref={nitEmpresaRef}
                        onChange={filtrarUsuarios} />

                    {/* Tipo de persona */}
                    <SelectFiltro
                        id="idTipoPersona"
                        name="Tipo de persona"
                        onChange={filtrarUsuarios}
                        ref={idTipoPersonaRef}
                    >
                        {tiposPersona.map((tipo) => (
                            <option key={tipo.idTipoPersona} value={tipo.idTipoPersona.toString()}>
                                {tipo.nombreTipoPersona}
                            </option>
                        ))}
                    </SelectFiltro>

                    {/* Regimen contribuyente */}
                    <SelectFiltro
                        id="idRegimenContribuyente"
                        name="Tipo de documento"
                        onChange={filtrarUsuarios}
                        ref={idRegimenContribuyenteRef}
                    >
                        {regimenesContribuyente.map((tipo) => (
                            <option key={tipo.idRegimenContribuyente} value={tipo.idRegimenContribuyente.toString()}>
                                {tipo.nombreRegimenContribuyente}
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
                        id="estadoEmpresa"
                        name="Estado"
                        onChange={filtrarUsuarios}
                        ref={estadoPersonaRef}
                        defaultValue="true"
                    >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </SelectFiltro>
                </ContenedorSelectores>
            </ContenedorFiltros>

            {/* Grid de empresas */}
            {empresasActuales.length === 0 ?
                (<div className="text-center text-gray-500 mt-8">
                    No se encontraron empresas
                </div>) :
                (< div className="grid gap-4 md:grid-cols-3" >
                    {
                        empresasActuales.map((empresa) => (
                            <TerceroEmpresaCard tercero={empresa} key={empresa.idTercero}>
                                <ContenedorBotonesAccionCard>
                                    <BotonAccionCard
                                        Symbol={Pencil}
                                        onClick={() => {
                                            setTerceroSeleccionado(empresa);
                                            setModalActualizar(true);
                                        }}
                                    />
                                    <BotonAccionCard
                                        Symbol={Eye}
                                        onClick={() => {
                                            setTerceroSeleccionado(empresa);
                                            setModalInfo(true);
                                        }}
                                    />
                                </ContenedorBotonesAccionCard>
                            </TerceroEmpresaCard>
                        ))}

                </div >)}

            {/* Controles de paginación */}
            <ControlesPaginacion
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />

            {/* Modal para mostrar la información de una empresa*/}
            <Modal isOpen={modalInfo} setIsOpen={() => setModalInfo(false)}>
                {terceroSeleccionado && <MostrarInfoTerceroEmpresa tercero={terceroSeleccionado} />}
            </Modal>


            {/* Modal para registrar un empresa*/}
            <Modal isOpen={modalRegistrar} setIsOpen={() => setModalRegistrar(false)}>
                <RegistrarTerceroEmpresa obtenerEmpresas={obtenerEmpresas} setModalRegistrar={setModalRegistrar} proveedorTerceroEmpresa={proveedorTerceroEmpresa} />
            </Modal>


            {/* Modal para actualizar un empresa*/}
            <Modal isOpen={modalActualizar} setIsOpen={() => setModalActualizar(false)}>
                <RegistrarTerceroEmpresa idTercero={terceroSeleccionado?.idTercero} obtenerEmpresas={obtenerEmpresas} setModalActualizar={setModalActualizar} proveedorTerceroEmpresa={proveedorTerceroEmpresa} />
            </Modal>

        </section >
    );
};

export default TercerosEmpresa;
