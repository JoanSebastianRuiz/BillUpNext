"use client";

import axios from "axios";

import { useEffect, useState, useRef } from "react";
import { Pencil, Eye, PlusCircle, XCircle } from "lucide-react";

import { useEmpresaContext } from "@/context/EmpresaContext";
import { useUsuarioContext } from "@/context/UsuarioContext";

import { DepartamentoResponseDTO } from '@/dto/DepartamentoResponseDTO';
import { MunicipioResponseDTO } from '@/dto/MunicipioResponseDTO';
import { EmpresaResponseDTO } from "@/dto/EmpresaResponseDTO";

import MostrarInfoEmpresa from "@/components/empresas/MostrarInfoEmpresa";
import RegistrarEmpresa from "@/components/empresas/RegistrarEmpresa";
import ContenedorFiltros from "@/components/filtros/ContenedorFiltros";
import ContenedorBotonesFiltros from "@/components/filtros/ContenedorBotonesFiltros";
import BotonFiltro from "@/components/filtros/BotonFiltro";
import ContenedorSelectores from "@/components/filtros/ContenedorSelectores";
import InputFiltro from "@/components/filtros/InputFiltro";
import SelectFiltro from "@/components/filtros/SelectFiltro";
import EmpresaCard from "@/components/empresas/EmpresaCard";
import ContenedorBotonesAccionCard from "@/components/cards/ContenedorBotonesAccionCard";
import BotonAccionCard from "@/components/cards/BotonAccionCard";
import Modal from "@/components/modal/Modal";
import ContenedorPrincipal from "@/components/common/ContenedorPrincipal";


const EmpresasPage: React.FC = () => {
    const [modalInfo, setModalInfo] = useState(false)
    const [modalRegistrar, setModalRegistrar] = useState(false)
    const [modalActualizar, setModalActualizar] = useState(false)
    const [empresaSeleccionada, setempresaSeleccionada] = useState<EmpresaResponseDTO | null>(null)
    const {
        tiposPersona,
        setTiposPersona,
        regimenesContribuyente,
        setRegimenesContribuyente,
        empresas,
        setEmpresas
    } = useEmpresaContext()

    const {
        departamentos,
        setDepartamentos,
        municipios,
        setMunicipios
    } = useUsuarioContext()

    const [empresasFiltradas, setEmpresasFiltradas] = useState<EmpresaResponseDTO[]>([]);
    const [municipiosFiltrados, setMunicipiosFiltrados] = useState<MunicipioResponseDTO[]>([]);
    const [departamentosFiltrados, setDepartamentosFiltrados] = useState<DepartamentoResponseDTO[]>([]);

    const nombreEmpresaRef = useRef<HTMLInputElement>(null)
    const idTipoPersonaRef = useRef<HTMLSelectElement>(null)
    const idRegimenContribuyenteRef = useRef<HTMLSelectElement>(null)
    const idMunicipioRef = useRef<HTMLSelectElement>(null)
    const idDepartamentoRef = useRef<HTMLSelectElement>(null)
    const nitEmpresaRef = useRef<HTMLInputElement>(null)
    const estadoEmpresaRef = useRef<HTMLSelectElement>(null)

    const obtenerEmpresas = async () => {
        try {
            const respuesta = await axios.get<EmpresaResponseDTO[]>("/api/empresas")
            if (respuesta.status === 200) {
                setEmpresas(respuesta.data)
                setEmpresasFiltradas(respuesta.data)
            }
        } catch (error) {
            console.error("Error obteniendo empresas", error)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!tiposPersona.length) {
                    const tiposPersonaRes = await axios.get("/api/tipos-persona")
                    if (tiposPersonaRes.status === 200) {
                        setTiposPersona(tiposPersonaRes.data)
                    }
                }

                if (!regimenesContribuyente.length) {
                    const regimenesContribuyenteRes = await axios.get("/api/regimenes-contribuyente")
                    if (regimenesContribuyenteRes.status === 200) {
                        setRegimenesContribuyente(regimenesContribuyenteRes.data)
                    }
                }

                if (!empresas.length) {
                    obtenerEmpresas()
                }

                if (!departamentos.length) {
                    const departamentosRes = await axios.get("/api/departamentos")
                    if (departamentosRes.status === 200) {
                        setDepartamentos(departamentosRes.data)
                        setDepartamentosFiltrados(departamentosRes.data)
                    }
                }

                if (!municipios.length) {
                    const municipiosRes = await axios.get("/api/municipios")
                    if (municipiosRes.status === 200) {
                        setMunicipios(municipiosRes.data)
                        setMunicipiosFiltrados(municipiosRes.data)
                    }
                }

            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [setDepartamentos, setEmpresas, setMunicipios, setRegimenesContribuyente, setTiposPersona])


    const filtrarEmpresas = () => {
        const nombreEmpresa = nombreEmpresaRef.current?.value;
        const idTipoPersona = idTipoPersonaRef.current?.value;
        const idRegimenContribuyente = idRegimenContribuyenteRef.current?.value;
        const nitEmpresa = nitEmpresaRef.current?.value;
        const estadoEmpresa = estadoEmpresaRef.current?.value;
        const idDepartamento = idDepartamentoRef.current?.value;
        const idMunicipio = idMunicipioRef.current?.value;

        let empresasFiltradas = [...empresas];

        if (idTipoPersona && idTipoPersona !== "0") {
            empresasFiltradas = empresasFiltradas.filter((empresa) => empresa.idTipoPersona === Number(idTipoPersona));
        }

        if (estadoEmpresa && estadoEmpresa !== "true") {
            empresasFiltradas = empresasFiltradas.filter((empresa) => empresa.estadoEmpresa === (estadoEmpresa === "true"));
        }

        if (idRegimenContribuyente && idRegimenContribuyente !== "0") {
            empresasFiltradas = empresasFiltradas.filter((empresa) => empresa.idRegimenContribuyente === Number(idRegimenContribuyente));
        }

        if (idDepartamento && idDepartamento !== "0") {
            empresasFiltradas = empresasFiltradas.filter((empresa) => empresa.idDepartamento === Number(idDepartamento));
        }

        if (idMunicipio && idMunicipio !== "0") {
            empresasFiltradas = empresasFiltradas.filter((empresa) => empresa.idMunicipio === Number(idMunicipio));
        }

        if (nombreEmpresa) {
            empresasFiltradas = empresasFiltradas.filter((empresa) => {
                return empresa.nombreEmpresa.toLowerCase().includes(nombreEmpresa.toLowerCase());
            });
        }

        if (nitEmpresa) {
            empresasFiltradas = empresasFiltradas.filter((empresa) => {
                return empresa.nitEmpresa.toLowerCase().includes(nitEmpresa.toLowerCase());
            });
        }

        setEmpresasFiltradas(empresasFiltradas);
    };

    useEffect(() => {
        filtrarEmpresas();
    }, [empresas]);

    useEffect(() => {
        if (!departamentos.length || !municipios.length) return;

        setDepartamentosFiltrados(departamentos);

        const idDepartamento = idDepartamentoRef.current?.value;

        if (idDepartamento && idDepartamento !== "0") {
            setMunicipiosFiltrados(municipios.filter((municipio: MunicipioResponseDTO) => municipio.idDepartamento === Number(idDepartamento)));
        } else {
            setMunicipiosFiltrados(municipios); // Si no hay departamento seleccionado, mostrar todos los municipios
        }
    }, [departamentos, municipios, idDepartamentoRef.current?.value]);


    useEffect(() => {
        if (!municipios.length) return;

        const idMunicipio = idMunicipioRef.current?.value;
        if (idMunicipio && idMunicipio !== "0") {
            const departamentoEncontrado = municipios.find((municipio: MunicipioResponseDTO) => municipio.idMunicipio === Number(idMunicipio))?.idDepartamento;
            if (departamentoEncontrado && idDepartamentoRef.current) {
                idDepartamentoRef.current.value = departamentoEncontrado.toString();
                setMunicipiosFiltrados(municipios.filter((municipio: MunicipioResponseDTO) => municipio.idDepartamento === departamentoEncontrado));
            }
        }
    }, [municipios, idMunicipioRef.current?.value]);

    const limpiarFiltros = () => {
        if (idTipoPersonaRef.current) idTipoPersonaRef.current.value = "0";
        if (nombreEmpresaRef.current) nombreEmpresaRef.current.value = "";
        if (nitEmpresaRef.current) nitEmpresaRef.current.value = "";
        if (idRegimenContribuyenteRef.current) idRegimenContribuyenteRef.current.value = "0";
        if (idDepartamentoRef.current) idDepartamentoRef.current.value = "0";
        if (idMunicipioRef.current) idMunicipioRef.current.value = "0";
        filtrarEmpresas();
    }

    return (
        <ContenedorPrincipal>
            <ContenedorFiltros title="Empresas">
                {/* Botones de filtros */}
                <ContenedorBotonesFiltros>
                    <BotonFiltro
                        onClick={() => setModalRegistrar(true)}
                        Symbol={PlusCircle}
                        name="Agregar empresa" />

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
                        onChange={filtrarEmpresas} />

                    {/* NIT */}
                    <InputFiltro
                        id="nitEmpresa"
                        name="NIT"
                        ref={nitEmpresaRef}
                        onChange={filtrarEmpresas} />

                    {/* Tipo de Persona */}
                    <SelectFiltro
                        id="idTipoPersona"
                        name="Tipo de persona"
                        onChange={filtrarEmpresas}
                        ref={idTipoPersonaRef}
                    >
                        {tiposPersona.map((tipo) => (
                            <option key={tipo.idTipoPersona} value={tipo.idTipoPersona.toString()}>
                                {tipo.nombreTipoPersona}
                            </option>
                        ))}
                    </SelectFiltro>

                    {/* Regimen Contribuyente */}
                    <SelectFiltro
                        id="idRegimenContribuyente"
                        name="Regimen Contribuyente"
                        onChange={filtrarEmpresas}
                        ref={idRegimenContribuyenteRef}
                    >
                        {regimenesContribuyente.map((regimen) => (
                            <option key={regimen.idRegimenContribuyente} value={regimen.idRegimenContribuyente.toString()}>
                                {regimen.nombreRegimenContribuyente}
                            </option>
                        ))}
                    </SelectFiltro>

                    {/* Departamento */}
                    <SelectFiltro
                        id="idDepartamento"
                        name="Departamento"
                        onChange={filtrarEmpresas}
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
                        onChange={filtrarEmpresas}
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
                        onChange={filtrarEmpresas}
                        ref={estadoEmpresaRef}
                        defaultValue="true"
                    >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </SelectFiltro>
                </ContenedorSelectores>
            </ContenedorFiltros>

            {/* Grid de empresas */}
            {empresasFiltradas.length === 0 ?
                (<div className="text-center text-gray-500 mt-8">
                    No se encontraron empresas
                </div>) :
                (< div className="grid gap-4 md:grid-cols-3" >
                    {
                        empresasFiltradas.map((empresa) => (
                            <EmpresaCard empresa={empresa} key={empresa.idEmpresa}>
                                <ContenedorBotonesAccionCard>
                                    <BotonAccionCard
                                        Symbol={Pencil}
                                        onClick={() => {
                                            setempresaSeleccionada(empresa);
                                            setModalActualizar(true);
                                        }}
                                    />
                                    <BotonAccionCard
                                        Symbol={Eye}
                                        onClick={() => {
                                            setempresaSeleccionada(empresa);
                                            setModalInfo(true);
                                        }}
                                    />
                                </ContenedorBotonesAccionCard>
                            </EmpresaCard>
                        ))}

                </div >)}

            {/* Modal para mostrar la información de una empresa*/}
            <Modal isOpen={modalInfo} setIsOpen={() => setModalInfo(false)}>
                {empresaSeleccionada && <MostrarInfoEmpresa empresa={empresaSeleccionada} />}
            </Modal>


            {/* Modal para registrar un empresa*/}
            <Modal isOpen={modalRegistrar} setIsOpen={() => setModalRegistrar(false)}>
                <RegistrarEmpresa obtenerEmpresas={obtenerEmpresas} setModalRegistrar={setModalRegistrar} />
            </Modal>


            {/* Modal para actualizar un empresa*/}
            <Modal isOpen={modalActualizar} setIsOpen={() => setModalActualizar(false)}>
                <RegistrarEmpresa idEmpresa={empresaSeleccionada?.idEmpresa} obtenerEmpresas={obtenerEmpresas} setModalActualizar={setModalActualizar} />
            </Modal>

        </ContenedorPrincipal >
    );
};

export default EmpresasPage;
