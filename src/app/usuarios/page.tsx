"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Pencil, Eye, PlusCircle, XCircle } from "lucide-react";

import { useUsuarioContext } from '@/context/UsuarioContext';
import { useEmpresaContext } from "@/context/EmpresaContext";

import { DepartamentoResponseDTO } from '@/dto/DepartamentoResponseDTO';
import { MunicipioResponseDTO } from '@/dto/MunicipioResponseDTO';
import { UsuarioResponseDTO } from "@/dto/UsuarioResponseDTO";

import ContenedorFiltros from "@/components/filtros/ContenedorFiltros";
import ContenedorBotonesFiltros from "@/components/filtros/ContenedorBotonesFiltros";
import BotonFiltro from "@/components/filtros/BotonFiltro";
import ContenedorSelectores from "@/components/filtros/ContenedorSelectores";
import InputFiltro from "@/components/filtros/InputFiltro";
import SelectFiltro from "@/components/filtros/SelectFiltro";
import UsuarioCard from "@/components/usuarios/UsuarioCard";
import ContenedorBotonesAccionCard from "@/components/cards/ContenedorBotonesAccionCard";
import BotonAccionCard from "@/components/cards/BotonAccionCard";
import Modal from "@/components/modal/Modal";
import ContenedorPrincipal from "@/components/common/ContenedorPrincipal";
import MostrarInfoUsuario from "@/components/usuarios/MostrarInfoUsuario";
import RegistrarUsuario from "@/components/usuarios/RegistrarUsuario";
import ControlesPaginacion from "@/components/common/ControlesPaginacion";


const UsuariosPage: React.FC = () => {
    const [modalInfo, setModalInfo] = useState(false)
    const [modalRegistrar, setModalRegistrar] = useState(false)
    const [modalActualizar, setModalActualizar] = useState(false)
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<UsuarioResponseDTO | null>(null)
    const {
        departamentos,
        municipios,
        roles,
        tiposDocumento,
        usuarios,
        obtenerUsuarios
    } = useUsuarioContext()

    const { empresas } = useEmpresaContext()

    const [usuariosFiltrados, setUsuariosFiltrados] = useState<UsuarioResponseDTO[]>([]);
    const [municipiosFiltrados, setMunicipiosFiltrados] = useState<MunicipioResponseDTO[]>([]);
    const [departamentosFiltrados, setDepartamentosFiltrados] = useState<DepartamentoResponseDTO[]>([]);

    const nombreUsuarioRef = useRef<HTMLInputElement>(null)
    const idTipoDocumentoRef = useRef<HTMLSelectElement>(null)
    const numeroDocumentoUsuarioRef = useRef<HTMLInputElement>(null)
    const idDepartamentoRef = useRef<HTMLSelectElement>(null)
    const idMunicipioRef = useRef<HTMLSelectElement>(null)
    const idEmpresaRef = useRef<HTMLSelectElement>(null)
    const idRolRef = useRef<HTMLSelectElement>(null)
    const estadoUsuarioRef = useRef<HTMLSelectElement>(null)

    const { data: session } = useSession()
    const idRol = session?.user?.idRol;

    // Paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12); // Número de empresas por página
    const indexOfLastUsuario = currentPage * itemsPerPage;
    const indexOfFirstUsuario = indexOfLastUsuario - itemsPerPage;
    const usuariosActuales = usuariosFiltrados.slice(indexOfFirstUsuario, indexOfLastUsuario);
    const totalPages = Math.ceil(usuariosFiltrados.length / itemsPerPage);


    const filtrarUsuarios = () => {
        const idTipoDocumento = idTipoDocumentoRef.current?.value;
        const nombreUsuario = nombreUsuarioRef.current?.value;
        const numeroDocumentoUsuario = numeroDocumentoUsuarioRef.current?.value;
        const idEmpresa = idEmpresaRef.current?.value;
        const idRol = idRolRef.current?.value;
        const estadoUsuario = estadoUsuarioRef.current?.value;
        const idDepartamento = idDepartamentoRef.current?.value;
        const idMunicipio = idMunicipioRef.current?.value;

        let usuariosFiltrados = [...usuarios];

        if (idRol && idRol !== "0") {
            usuariosFiltrados = usuariosFiltrados.filter((usuario) => usuario.idRol === Number(idRol));
        }

        if (estadoUsuario !== undefined && estadoUsuario !== "") {
            usuariosFiltrados = usuariosFiltrados.filter((usuario) => usuario.estadoUsuario === (estadoUsuario === "true"));
        }

        if (idEmpresa && idEmpresa !== "0") {
            usuariosFiltrados = usuariosFiltrados.filter((usuario) => usuario.idEmpresa === Number(idEmpresa));
        }

        if (idTipoDocumento && idTipoDocumento !== "0") {
            usuariosFiltrados = usuariosFiltrados.filter((usuario) => usuario.idTipoDocumento === Number(idTipoDocumento));
        }

        if (idDepartamento && idDepartamento !== "0") {
            usuariosFiltrados = usuariosFiltrados.filter((usuario) => usuario.idDepartamento === Number(idDepartamento));
        }

        if (idMunicipio && idMunicipio !== "0") {
            usuariosFiltrados = usuariosFiltrados.filter((usuario) => usuario.idMunicipio === Number(idMunicipio));
        }

        if (nombreUsuario) {
            usuariosFiltrados = usuariosFiltrados.filter((usuario) => {
                const nombreCompleto = `${usuario.nombreUsuario} ${usuario.apellidoUsuario}`;
                return nombreCompleto.toLowerCase().includes(nombreUsuario.toLowerCase());
            });
        }

        if (numeroDocumentoUsuario) {
            usuariosFiltrados = usuariosFiltrados.filter((usuario) => usuario.numeroDocumentoUsuario.includes(numeroDocumentoUsuario));
        }

        setUsuariosFiltrados(usuariosFiltrados);
    };

    const limpiarFiltros = () => {
        if (idTipoDocumentoRef.current) idTipoDocumentoRef.current.value = "0";
        if (nombreUsuarioRef.current) nombreUsuarioRef.current.value = "";
        if (numeroDocumentoUsuarioRef.current) numeroDocumentoUsuarioRef.current.value = "";
        if (idEmpresaRef.current) idEmpresaRef.current.value = "0";
        if (idRolRef.current) idRolRef.current.value = "0";
        if (idDepartamentoRef.current) idDepartamentoRef.current.value = "0";
        if (idMunicipioRef.current) idMunicipioRef.current.value = "0";
        filtrarUsuarios();
    }

    useEffect(() => {
        filtrarUsuarios();
    }, [usuarios]);


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


    return (
        <ContenedorPrincipal>
            <ContenedorFiltros title="Usuarios">
                {/* Botones de filtros */}
                <ContenedorBotonesFiltros>
                    <BotonFiltro
                        onClick={() => setModalRegistrar(true)}
                        Symbol={PlusCircle}
                        name="Agregar usuario" />

                    <BotonFiltro
                        onClick={limpiarFiltros}
                        Symbol={XCircle}
                        name="Limpiar filtros" />

                </ContenedorBotonesFiltros>

                {/* Selectores de filtros */}
                <ContenedorSelectores>
                    {/* Nombre */}
                    <InputFiltro
                        id="nombreUsuario"
                        name="Nombre"
                        ref={nombreUsuarioRef}
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

                    {/* Numero de documento */}
                    <InputFiltro
                        id="numeroDocumentoUsuario"
                        name="Numero de documento"
                        ref={numeroDocumentoUsuarioRef}
                        onChange={filtrarUsuarios} />

                    {/* Empresa */}
                    {idRol === 1 && (
                        <SelectFiltro
                            id="idEmpresa"
                            name="Empresa"
                            onChange={filtrarUsuarios}
                            ref={idEmpresaRef}
                        >
                            {empresas.map((emp) => (
                                <option key={emp.idEmpresa} value={emp.idEmpresa.toString()}>
                                    {emp.nombreEmpresa}
                                </option>
                            ))}
                        </SelectFiltro>
                    )
                    }


                    {/* Rol */}
                    <SelectFiltro
                        id="idRol"
                        name="Rol"
                        onChange={filtrarUsuarios}
                        ref={idRolRef}
                    >
                        {roles.map((rol) => (
                            <option key={rol.idRol} value={rol.idRol.toString()}>
                                {rol.nombreRol}
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
                        id="estadoUsuario"
                        name="Estado"
                        onChange={filtrarUsuarios}
                        ref={estadoUsuarioRef}
                        selectEstado={true}
                        defaultValue="true"
                    >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </SelectFiltro>
                </ContenedorSelectores>
            </ContenedorFiltros>

            {/* Grid de usuarios */}
            {usuariosActuales.length === 0 ?
                (<div className="text-center text-gray-500 mt-8">
                    No se encontraron usuarios
                </div>) :
                (< div className="grid gap-4 md:grid-cols-3" >
                    {
                        usuariosActuales.map((usuario) => (
                            <UsuarioCard usuario={usuario} key={usuario.idUsuario}>
                                <ContenedorBotonesAccionCard>
                                    <BotonAccionCard
                                        Symbol={Pencil}
                                        onClick={() => {
                                            setUsuarioSeleccionado(usuario);
                                            setModalActualizar(true);
                                        }}
                                    />
                                    <BotonAccionCard
                                        Symbol={Eye}
                                        onClick={() => {
                                            setUsuarioSeleccionado(usuario);
                                            setModalInfo(true);
                                        }}
                                    />
                                </ContenedorBotonesAccionCard>
                            </UsuarioCard>
                        ))}

                </div >)}

            {/* Controles de paginación */}
            <ControlesPaginacion
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />

            {/* Modal para mostrar la información de un usuario*/}
            <Modal isOpen={modalInfo} setIsOpen={() => setModalInfo(false)}>
                {usuarioSeleccionado && <MostrarInfoUsuario usuario={usuarioSeleccionado} />}
            </Modal>


            {/* Modal para registrar un usuario*/}
            <Modal isOpen={modalRegistrar} setIsOpen={() => setModalRegistrar(false)}>
                <RegistrarUsuario obtenerUsuarios={obtenerUsuarios} setModalRegistrar={setModalRegistrar} />
            </Modal>


            {/* Modal para actualizar un usuario*/}
            <Modal isOpen={modalActualizar} setIsOpen={() => setModalActualizar(false)}>
                <RegistrarUsuario usuarioSeleccionado={usuarioSeleccionado} obtenerUsuarios={obtenerUsuarios} setModalActualizar={setModalActualizar} />
            </Modal>

        </ContenedorPrincipal >
    );
};

export default UsuariosPage;
