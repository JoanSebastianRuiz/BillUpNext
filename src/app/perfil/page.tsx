"use client";

import { useUsuarioContext } from "@/context/UsuarioContext";
import { useEmpresaContext } from "@/context/EmpresaContext";
import { useState } from "react";
import { Mail, Phone, MapPin, Building, User, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ContenedorPrincipal from "@/components/common/ContenedorPrincipal";
import ProfileItem from "@/components/perfil/ProfileItem";
import Modal from "@/components/modal/Modal";
import ActualizarPerfil from "@/components/perfil/ActualizarPerfil";
import ActualizarClave from "@/components/perfil/ActualizarClave";
import BotonFiltro from "@/components/filtros/BotonFiltro";

const PerfilPage = () => {
    const {
        usuario,
        departamentos,
        municipios,
        tiposDocumento,
        roles
    } = useUsuarioContext();

    const { empresas } = useEmpresaContext();

    const [modalActualizarClave, setModalActualizarClave] = useState(false);
    const [modalActualizarPerfil, setModalActualizarPerfil] = useState(false);


    return (
        <ContenedorPrincipal>
            <div className="relative min-h-[300px] flex items-center justify-center">
                <AnimatePresence mode="wait">

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

                        <div className="flex gap-3 mt-4 justify-center">
                            <BotonFiltro
                                Symbol={User}
                                onClick={() => setModalActualizarPerfil(true)}
                                name="Actualizar perfil"
                            />
                            <BotonFiltro
                                Symbol={User}
                                onClick={() => setModalActualizarClave(true)}
                                name="Actualizar contraseña"
                            />
                        </div>
                    </motion.div>

                </AnimatePresence>
            </div>

            {/* Modal para actualizar la clave */}
            <Modal isOpen={modalActualizarClave} setIsOpen={() => setModalActualizarClave(false)} size="small">
                <ActualizarClave setModalActualizarClave={setModalActualizarClave} />
            </Modal>

            {/* Modal para actualizar el perfil */}
            <Modal isOpen={modalActualizarPerfil} setIsOpen={() => setModalActualizarPerfil(false)}>
                <ActualizarPerfil setModalActualizarPerfil={setModalActualizarPerfil} />
            </Modal>
        </ContenedorPrincipal>
    );
};

export default PerfilPage;
