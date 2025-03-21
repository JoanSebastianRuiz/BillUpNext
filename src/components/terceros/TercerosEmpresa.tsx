"use client";

import { useEffect, useState, useRef } from "react";
import { Pencil, Eye, PlusCircle, XCircle, PackageSearch } from "lucide-react";

import { useUsuarioContext } from '@/context/UsuarioContext';
import { useEmpresaContext } from "@/context/EmpresaContext";
import { useTerceroContext } from "@/context/TerceroContext";

import { DepartamentoResponseDTO } from '@/dto/DepartamentoResponseDTO';
import { MunicipioResponseDTO } from '@/dto/MunicipioResponseDTO';
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
import SublistaProductos from "@/components/terceros/proveedores/SublistaProductos";


const TercerosEmpresa = ({ proveedorTerceroEmpresa, tipoEmpresas }: { proveedorTerceroEmpresa: boolean, tipoEmpresas: "clientes" | "proveedores" }) => {
    const [modalInfo, setModalInfo] = useState(false)
    const [modalRegistrar, setModalRegistrar] = useState(false)
    const [modalActualizar, setModalActualizar] = useState(false)
    const [modalProductos, setModalProductos] = useState(false)
    const [terceroSeleccionado, setTerceroSeleccionado] = useState<TerceroResponseEmpresaDTO | null>(null)
    const { departamentos, municipios } = useUsuarioContext()
    const { tiposPersona, regimenesContribuyente } = useEmpresaContext()

    const { clientesEmpresa, proveedoresEmpresa } = useTerceroContext()
    const empresas = proveedorTerceroEmpresa ? proveedoresEmpresa : clientesEmpresa;

    const [empresasFiltradas, setEmpresasFiltradas] = useState<TerceroResponseEmpresaDTO[]>([]);
    const [municipiosFiltrados, setMunicipiosFiltrados] = useState<MunicipioResponseDTO[]>([]);
    const [departamentosFiltrados, setDepartamentosFiltrados] = useState<DepartamentoResponseDTO[]>([]);

    const nombreEmpresaRef = useRef<HTMLInputElement>(null)
    const nitEmpresaRef = useRef<HTMLInputElement>(null)
    const idRegimenContribuyenteRef = useRef<HTMLSelectElement>(null)
    const idTipoPersonaRef = useRef<HTMLSelectElement>(null)
    const idDepartamentoRef = useRef<HTMLSelectElement>(null)
    const idMunicipioRef = useRef<HTMLSelectElement>(null)
    const estadoEmpresaRef = useRef<HTMLSelectElement>(null)


    // Paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12); // Número de empresas por página
    const indexOfLastEmpresa = currentPage * itemsPerPage;
    const indexOfFirstEmpresa = indexOfLastEmpresa - itemsPerPage;
    const empresasActuales = empresasFiltradas.slice(indexOfFirstEmpresa, indexOfLastEmpresa);
    const totalPages = Math.ceil(empresasFiltradas.length / itemsPerPage);


    const filtrarEmpresas = () => {
        const idRegimenContribuyente = idRegimenContribuyenteRef.current?.value;
        const idTipoPersona = idTipoPersonaRef.current?.value;
        const nombreEmpresa = nombreEmpresaRef.current?.value;
        const nitEmpresa = nitEmpresaRef.current?.value;
        const estadoEmpresa = estadoEmpresaRef.current?.value;
        const idDepartamento = idDepartamentoRef.current?.value;
        const idMunicipio = idMunicipioRef.current?.value;

        let empresasFiltradas = [...empresas];

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
        filtrarEmpresas();
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
        if (estadoEmpresaRef.current) estadoEmpresaRef.current.value = "";
        filtrarEmpresas();
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
                        onChange={filtrarEmpresas} />

                    {/* NIT */}
                    <InputFiltro
                        id="nitEmpresa"
                        name="NIT"
                        ref={nitEmpresaRef}
                        onChange={filtrarEmpresas} />

                    {/* Tipo de persona */}
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

                    {/* Regimen contribuyente */}
                    <SelectFiltro
                        id="idRegimenContribuyente"
                        name="Tipo de documento"
                        onChange={filtrarEmpresas}
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
                        selectEstado={true}
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
                                    {proveedorTerceroEmpresa && (
                                        <BotonAccionCard
                                            Symbol={PackageSearch}
                                            onClick={() => {
                                                setTerceroSeleccionado(empresa);
                                                setModalProductos(true);
                                            }}
                                        />
                                    )}
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
                <RegistrarTerceroEmpresa setModalRegistrar={setModalRegistrar} proveedorTerceroEmpresa={proveedorTerceroEmpresa} />
            </Modal>


            {/* Modal para actualizar un empresa*/}
            <Modal isOpen={modalActualizar} setIsOpen={() => setModalActualizar(false)}>
                <RegistrarTerceroEmpresa terceroSeleccionado={terceroSeleccionado} setModalActualizar={setModalActualizar} proveedorTerceroEmpresa={proveedorTerceroEmpresa} />
            </Modal>

            {/* Modal para gestionar los productos de un proveedor*/}
            <Modal isOpen={modalProductos} setIsOpen={() => setModalProductos(false)}>
                <SublistaProductos tercero={terceroSeleccionado} />
            </Modal>

        </section >
    );
};

export default TercerosEmpresa;
