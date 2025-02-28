"use client";

import { UsuarioResponseDTO } from "@/dto/UsuarioResponseDTO";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pencil, Eye, PlusCircle, XCircle } from "lucide-react";
import MostrarInfoUsuario from "@/components/usuarios/MostrarInfoUsuario";
import RegistrarUsuario from "@/components/usuarios/RegistrarUsuario";
import { useUsuarioContext } from '@/context/UsuarioContext';
import { RolDTO } from '@/dto/RolDTO';
import { DepartamentoDTO } from '@/dto/DepartamentoDTO';
import { MunicipioDTO } from '@/dto/MunicipioDTO';
import { TipoDocumentoDTO } from '@/dto/TipoDocumentoDTO';
import { useRef } from "react";
import { EmpresaResponseDTO } from "@/dto/EmpresaResponseDTO";
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
import { useSession } from "next-auth/react";


const UsuariosPage: React.FC = () => {
    const [modalInfo, setModalInfo] = useState(false)
    const [modalRegistrar, setModalRegistrar] = useState(false)
    const [modalActualizar, setModalActualizar] = useState(false)
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<UsuarioResponseDTO | null>(null)
    const {
        departamentos,
        setDepartamentos,
        municipios,
        setMunicipios,
        empresas,
        setEmpresas,
        roles,
        setRoles,
        tiposDocumento,
        setTiposDocumento,
        usuarios,
        setUsuarios,
    } = useUsuarioContext()


    const [usuariosFiltrados, setUsuariosFiltrados] = useState<UsuarioResponseDTO[]>([]);
    const [municipiosFiltrados, setMunicipiosFiltrados] = useState<MunicipioDTO[]>([]);
    const [departamentosFiltrados, setDepartamentosFiltrados] = useState<DepartamentoDTO[]>([]);

    const nombreUsuarioRef = useRef<HTMLInputElement>(null)
    const idTipoDocumentoRef = useRef<HTMLSelectElement>(null)
    const idDepartamentoRef = useRef<HTMLSelectElement>(null)
    const idMunicipioRef = useRef<HTMLSelectElement>(null)
    const idEmpresaRef = useRef<HTMLSelectElement>(null)
    const idRolRef = useRef<HTMLSelectElement>(null)
    const estadoUsuarioRef = useRef<HTMLSelectElement>(null)

    const { data: session } = useSession()
    const idRol = session?.user?.idRol;
    const idEmpresa = session?.user?.idEmpresa;


    const obtenerUsuarios = async () => {
        if (!session || idRol === undefined || idEmpresa === undefined) return; // Esperar a que la sesión esté lista
        try { 
            if (idRol === 2) {
                const respuesta = await axios.get<UsuarioResponseDTO[]>(`/api/empresas/${idEmpresa}/usuarios`)
                if (respuesta.status === 200) {
                    setUsuarios(respuesta.data)
                    setUsuariosFiltrados(respuesta.data)
                } else {
                    console.error(respuesta.data)
                }
                return
            }
            
            const respuesta = await axios.get<UsuarioResponseDTO[]>("/api/usuarios")
            if (respuesta.status === 200) {
                setUsuarios(respuesta.data)
                setUsuariosFiltrados(respuesta.data)
            } else {
                console.error(respuesta.data)
            }
        } catch (error) {
            console.error("Error al obtener los usuarios:", error)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!session || idRol === undefined || idEmpresa === undefined) return; // Esperar a que la sesión esté lista
            try {
                const [departamentosRes, empresasRes, rolesRes, tiposDocumentoRes, municipiosRes, usuariosRes] = await Promise.all([
                    axios.get("/api/departamentos"),
                    axios.get("/api/empresas"),
                    axios.get("/api/roles"),
                    axios.get("/api/tipos-documento"),
                    axios.get("/api/municipios"),
                    idRol === 2 ? axios.get(`/api/empresas/${idEmpresa}/usuarios`) : axios.get("/api/usuarios"),
                ])

                if (departamentosRes.status !== 200) {
                    console.error(departamentosRes.data)
                }

                if (empresasRes.status !== 200) {
                    console.error(empresasRes.data)
                }

                if (rolesRes.status !== 200) {
                    console.error(rolesRes.data)
                }

                if (tiposDocumentoRes.status !== 200) {
                    console.error(tiposDocumentoRes.data)
                }

                if (municipiosRes.status !== 200) {
                    console.error(municipiosRes.data)
                }

                if (usuariosRes.status !== 200) {
                    console.error(usuariosRes.data)
                }

                setDepartamentos(departamentosRes.data || [])
                setEmpresas(empresasRes.data.filter((empresa: EmpresaResponseDTO) => empresa.estadoEmpresa === true) || [])
                setRoles(
                    rolesRes.data.filter((rol: RolDTO) =>
                        rol.estadoRol === true && !(idRol === 2 && rol.idRol === 1)
                    )
                );
                setTiposDocumento(
                    tiposDocumentoRes.data.filter(
                        (tipoDocumento: TipoDocumentoDTO) => tipoDocumento.estadoTipoDocumento === true,
                    ) || [],
                )
                setMunicipios(municipiosRes.data || [])
                setUsuarios(usuariosRes.data || [])
                setUsuariosFiltrados(usuariosRes.data || [])
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [session, idRol, idEmpresa, setDepartamentos, setEmpresas, setRoles, setTiposDocumento, setMunicipios, setUsuarios])


    const filtrarUsuarios = () => {
        const idTipoDocumento = idTipoDocumentoRef.current?.value;
        const nombreUsuario = nombreUsuarioRef.current?.value;
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

        setUsuariosFiltrados(usuariosFiltrados);
        console.log(usuariosFiltrados);
    };

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

    const limpiarFiltros = () => {
        if (idTipoDocumentoRef.current) idTipoDocumentoRef.current.value = "0";
        if (nombreUsuarioRef.current) nombreUsuarioRef.current.value = "";
        if (idEmpresaRef.current) idEmpresaRef.current.value = "0";
        if (idRolRef.current) idRolRef.current.value = "0";
        if (idDepartamentoRef.current) idDepartamentoRef.current.value = "0";
        if (idMunicipioRef.current) idMunicipioRef.current.value = "0";
        filtrarUsuarios();
    }

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
                        defaultValue="true"
                    >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </SelectFiltro>
                </ContenedorSelectores>
            </ContenedorFiltros>

            {/* Grid de usuarios */}
            < div className="grid gap-4 md:grid-cols-3" >
                {
                    usuariosFiltrados.map((usuario) => (
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

            </div >

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
                <RegistrarUsuario idUsuario={usuarioSeleccionado?.idUsuario} obtenerUsuarios={obtenerUsuarios} setModalActualizar={setModalActualizar} />
            </Modal>

        </ContenedorPrincipal >
    );
};

export default UsuariosPage;
