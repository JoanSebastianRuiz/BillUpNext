"use client";

import axios from "axios";
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";

import { DepartamentoResponseDTO } from "@/dto/DepartamentoResponseDTO";
import { MunicipioResponseDTO } from "@/dto/MunicipioResponseDTO";
import { TipoDocumentoResponseDTO } from "@/dto/TipoDocumentoResponseDTO";
import { RolDTO } from "@/dto/RolDTO";
import { UsuarioResponseDTO } from "@/dto/UsuarioResponseDTO";

interface UserContextType {
    usuario: UsuarioResponseDTO;
    setUsuario: (usuario: UsuarioResponseDTO) => void;
    departamentos: DepartamentoResponseDTO[];
    setDepartamentos: (departamentos: DepartamentoResponseDTO[]) => void;
    municipios: MunicipioResponseDTO[];
    setMunicipios: (municipios: MunicipioResponseDTO[]) => void;
    tiposDocumento: TipoDocumentoResponseDTO[];
    setTiposDocumento: (tiposDocumento: TipoDocumentoResponseDTO[]) => void;
    roles: RolDTO[];
    setRoles: (roles: RolDTO[]) => void;
    usuarios: UsuarioResponseDTO[];
    setUsuarios: (usuarios: UsuarioResponseDTO[]) => void;
    obtenerUsuarios: () => void;
    loading: boolean; // Estado de carga
}

const UsuarioContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UsuarioContextProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [usuario, setUsuario] = useState<UsuarioResponseDTO>({} as UsuarioResponseDTO);
    const [departamentos, setDepartamentos] = useState<DepartamentoResponseDTO[]>([]);
    const [municipios, setMunicipios] = useState<MunicipioResponseDTO[]>([]);
    const [tiposDocumento, setTiposDocumento] = useState<TipoDocumentoResponseDTO[]>([]);
    const [roles, setRoles] = useState<RolDTO[]>([]);
    const [usuarios, setUsuarios] = useState<UsuarioResponseDTO[]>([]);
    const [loading, setLoading] = useState(true); // Estado de carga

    const { data: session, status } = useSession();
    const idRol = session?.user?.idRol;
    const idEmpresa = session?.user?.idEmpresa;
    const idUsuario = session?.user?.idUsuario;

    const obtenerUsuarios = async () => {
        if (status !== "authenticated" || idRol === undefined || idEmpresa === undefined) return;
        setLoading(true);
        try {
            const endpoint = idRol === 2 ? `/api/empresas/${idEmpresa}/usuarios` : "/api/usuarios";
            const respuesta = await axios.get<UsuarioResponseDTO[]>(endpoint);

            if (respuesta.status === 200) {
                setUsuarios(respuesta.data.filter(usuario => usuario.idUsuario !== session.user.idUsuario));
                setUsuario(respuesta.data.find(usuario => usuario.idUsuario === idUsuario) || {} as UsuarioResponseDTO);
            } else {
                console.error(respuesta.data);
            }
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status !== "authenticated" || !idRol || !idEmpresa) return; // Esperar a que la sesión esté lista
        const fetchData = async () => {

            setLoading(true); // Iniciar carga antes de la petición
            try {
                const [departamentosRes, municipiosRes, rolesRes, tiposDocumentoRes, usuariosRes] = await Promise.all([
                    axios.get("/api/departamentos"),
                    axios.get("/api/municipios"),
                    axios.get("/api/roles"),
                    axios.get("/api/tipos-documento"),
                    idRol === 2 || idRol === 3 ? axios.get(`/api/empresas/${idEmpresa}/usuarios`) : axios.get("/api/usuarios")
                ]);

                if (departamentosRes.status === 200) setDepartamentos(departamentosRes.data);
                if (municipiosRes.status === 200) setMunicipios(municipiosRes.data);
                if (rolesRes.status === 200) {
                    setRoles(rolesRes.data.filter((rol: RolDTO) => rol.estadoRol === true && !(idRol === 2 && rol.idRol === 1)));
                }
                if (tiposDocumentoRes.status === 200) {
                    setTiposDocumento(tiposDocumentoRes.data.filter((tipo: TipoDocumentoResponseDTO) => tipo.estadoTipoDocumento === true) || []);
                }
                if (usuariosRes.status === 200) {
                    setUsuarios(usuariosRes.data.filter((usuario: UsuarioResponseDTO) => usuario.idUsuario !== session.user.idUsuario) || []);
                    setUsuario(usuariosRes.data.find((usuario: UsuarioResponseDTO) => usuario.idUsuario === idUsuario) || {} as UsuarioResponseDTO);
                }
            } catch (error) {
                console.error("Error al obtener los datos de Usuario Context:", error);
            } finally {
                setLoading(false); // Finalizar carga después de obtener los datos
            }
        };


        if (idRol === 1 || idRol === 2 || idRol === 3) fetchData();
        console.log(usuarios);
    }, [status, idRol, idEmpresa]);

    return (
        <UsuarioContext.Provider value={{
            usuario,
            setUsuario,
            departamentos,
            setDepartamentos,
            municipios,
            setMunicipios,
            tiposDocumento,
            setTiposDocumento,
            roles,
            setRoles,
            usuarios,
            setUsuarios,
            obtenerUsuarios,
            loading
        }}>
            {children}
        </UsuarioContext.Provider>
    );
};

export const useUsuarioContext = (): UserContextType => {
    const context = useContext(UsuarioContext);
    if (!context) {
        throw new Error("useUsuarioContext debe usarse dentro de un UsuarioContextProvider");
    }
    return context;
};
