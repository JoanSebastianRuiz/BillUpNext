"use client"

import axios from "axios";

import { useUsuarioContext } from "@/context/UsuarioContext";
import { useEmpresaContext } from "@/context/EmpresaContext";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Building, User, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { TipoDocumentoResponseDTO } from "@/dto/TipoDocumentoResponseDTO";

import ContenedorPrincipal from "@/components/common/ContenedorPrincipal";
import ProfileItem from "@/components/perfil/ProfileItem";

const PerfilPage = () => {
    const {
        usuario,
        setUsuario,
        departamentos,
        setDepartamentos,
        municipios,
        setMunicipios,
        tiposDocumento,
        setTiposDocumento,
        roles,
        setRoles
    } = useUsuarioContext();

    const { empresas, setEmpresas } = useEmpresaContext();

    const { data: session } = useSession()
    const idUsuario = session?.user?.idUsuario;

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!session || idUsuario === undefined) return;

        const fetchData = async () => {
            try {
                setIsLoading(true);

                const requests = [];

                if (!departamentos.length) {
                    requests.push(axios.get("/api/departamentos").then(res => setDepartamentos(res.data)));
                }
                if (!municipios.length) {
                    requests.push(axios.get("/api/municipios").then(res => setMunicipios(res.data)));
                }
                if (!roles.length) {
                    requests.push(axios.get("/api/roles").then(res => setRoles(res.data)));
                }
                if (!tiposDocumento.length) {
                    requests.push(axios.get("/api/tipos-documento").then(res =>
                        setTiposDocumento(res.data.filter((td: TipoDocumentoResponseDTO) => td.estadoTipoDocumento) || [])
                    ));
                }
                if (!empresas.length) {
                    requests.push(axios.get("/api/empresas").then(res => setEmpresas(res.data)));
                }
                if (!usuario.nombreUsuario) {
                    requests.push(axios.get(`/api/usuarios/${idUsuario}`).then(res => setUsuario(res.data)));
                }

                await Promise.all(requests); // Espera que todas las solicitudes se completen
            } catch (error) {
                console.error("Error cargando datos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [session, idUsuario]);

    return (
        <ContenedorPrincipal>
            <div className="relative min-h-[300px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            className="absolute flex justify-center items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <p className="text-lg text-gray-500 dark:text-gray-300">Cargando perfil...</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="profile"
                            className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 max-w-2xl mx-auto"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-4">
                                {usuario.nombreUsuario} {usuario.apellidoUsuario}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ProfileItem icon={FileText} label="Tipo de documento"
                                    value={tiposDocumento.find(td => td.idTipoDocumento === usuario.idTipoDocumento)?.nombreTipoDocumento || 'N/A'}
                                />
                                <ProfileItem icon={User} label="Documento" value={usuario.numeroDocumentoUsuario} />
                                <ProfileItem icon={Building} label="Empresa"
                                    value={empresas.find(e => e.idEmpresa === usuario.idEmpresa)?.nombreEmpresa || 'N/A'}
                                />
                                <ProfileItem icon={User} label="Rol"
                                    value={roles.find(r => r.idRol === usuario.idRol)?.nombreRol || 'N/A'}
                                />
                                <ProfileItem icon={Phone} label="Teléfono" value={usuario.telefonoUsuario} />
                                <ProfileItem icon={Mail} label="Correo" value={usuario.correoUsuario} />
                                <ProfileItem icon={MapPin} label="Dirección" value={usuario.direccionUsuario} />
                                <ProfileItem icon={MapPin} label="Departamento"
                                    value={departamentos.find(d => d.idDepartamento === usuario.idDepartamento)?.nombreDepartamento || 'N/A'}
                                />
                                <ProfileItem icon={MapPin} label="Municipio"
                                    value={municipios.find(m => m.idMunicipio === usuario.idMunicipio)?.nombreMunicipio || 'N/A'}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ContenedorPrincipal>
    );
};
export default PerfilPage;