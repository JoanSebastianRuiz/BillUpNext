"use client"

import { useForm } from 'react-hook-form';
import { use, useEffect, useState } from 'react';
import { useUsuarioContext } from '@/context/UsuarioContext';
import axios from 'axios';
import InputForm from '@/components/form/InputForm';
import SelectForm from '@/components/form/SelectForm';
import { isValidEmail, isValidPhoneNumber, isValidDocument } from '@/util/validators/validators';
import { DepartamentoResponseDTO } from '@/dto/DepartamentoResponseDTO';
import { MunicipioResponseDTO } from '@/dto/MunicipioResponseDTO';
import { UsuarioRequestDTO } from '@/dto/UsuarioRequestDTO';
import Notificacion from '@/components/form/Notificacion';
import { useSession } from 'next-auth/react';


const RegistrarUsuario = ({ idUsuario, obtenerUsuarios, setModalActualizar, setModalRegistrar }: { idUsuario?: number, obtenerUsuarios: () => void, setModalActualizar?: (value: boolean) => void, setModalRegistrar?: (value: boolean) => void }) => {

    const { departamentos, municipios, empresas, roles, tiposDocumento } = useUsuarioContext();

    const [municipiosFiltrados, setMunicipiosFiltrados] = useState<MunicipioResponseDTO[]>([]);
    const [departamentosFiltrados, setDepartamentosFiltrados] = useState<DepartamentoResponseDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<UsuarioRequestDTO>();

    const idDepartamento = watch("idDepartamento");
    const idMunicipio = watch("idMunicipio");

    const { data: session } = useSession()
    const idRol = session?.user?.idRol;
    const idEmpresa = session?.user?.idEmpresa;

    useEffect(() => {
        if (!departamentos.length) return;
        setDepartamentosFiltrados(departamentos);

        if (idDepartamento) {
            setMunicipiosFiltrados(municipios.filter((municipio) => municipio.idDepartamento == idDepartamento));
        }

    }, [idDepartamento, departamentos]);


    useEffect(() => {
        if (!municipios.length) return;

        setMunicipiosFiltrados(municipios);

        if (idMunicipio) {
            const departamentoEncontrado = municipios.find((municipio) => municipio.idMunicipio == idMunicipio)?.idDepartamento;
            if (departamentoEncontrado) {
                setValue("idDepartamento", departamentoEncontrado);
            }
        }
    }, [idMunicipio, municipios]);




    useEffect(() => {
        const fetchUsuario = async () => {
            if (idUsuario) {
                try {
                    const response = await axios.get(`/api/usuarios/${idUsuario}`);
                    if (response.status == 200) {
                        const usuario = response.data;

                        setValue("nombreUsuario", usuario.nombreUsuario || '');
                        setValue("apellidoUsuario", usuario.apellidoUsuario || '');
                        setValue("idTipoDocumento", usuario.idTipoDocumento || 0);
                        setValue("numeroDocumentoUsuario", usuario.numeroDocumentoUsuario || '');
                        setValue("idDepartamento", usuario.idDepartamento || 0);
                        setValue("idMunicipio", usuario.idMunicipio || 0);
                        setValue("idEmpresa", usuario.idEmpresa || 0);
                        setValue("idRol", usuario.idRol || 0);
                        setValue("telefonoUsuario", usuario.telefonoUsuario || '');
                        setValue("direccionUsuario", usuario.direccionUsuario || '');
                        setValue("correoUsuario", usuario.correoUsuario || '');
                        setValue("estadoUsuario", usuario.estadoUsuario.toString());
                    } else {
                        console.error("Error al obtener datos del usuario:", response.data.message);
                    }
                } catch (error) {
                    console.error("Error al obtener datos del usuario:", error);
                }
            }
        };

        fetchUsuario();
    }, [idUsuario, setValue]);

    useEffect(() => {
        if (idRol === 2) {
            setValue("idEmpresa", idEmpresa || 0);
        }
    }, [idEmpresa, idRol, setValue]);

    const onSubmit = async (data: UsuarioRequestDTO) => {
        try {
            if (idUsuario) {
                let { idDepartamento, ...datosModificados } = data;

                datosModificados = { ...data, idTipoDocumento: parseInt(data.idTipoDocumento.toString()), idMunicipio: parseInt(data.idMunicipio.toString()), idEmpresa: parseInt(data.idEmpresa.toString()), idRol: parseInt(data.idRol.toString()), estadoUsuario: Boolean(data.estadoUsuario), claveUsuario: watch('numeroDocumentoUsuario') };

                const respuesta = await axios.put(`/api/usuarios/${idUsuario}`, datosModificados);
                setError(null);
                setSuccess(respuesta.data.message);
                obtenerUsuarios();
                setModalActualizar?.(false);
            } else {
                let { idDepartamento, ...datosModificados } = data;
                datosModificados = { ...data, idTipoDocumento: parseInt(data.idTipoDocumento.toString()), idMunicipio: parseInt(data.idMunicipio.toString()), idEmpresa: parseInt(data.idEmpresa.toString()), idRol: parseInt(data.idRol.toString()), estadoUsuario: true, claveUsuario: watch('numeroDocumentoUsuario') };

                const respuesta = await axios.post('/api/usuarios', datosModificados);
                setError(null);
                setSuccess(respuesta.data.message);
                obtenerUsuarios();
                setModalRegistrar?.(false);
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                // Capturar el mensaje de error del backend
                const mensajeError = error.response.data?.message;
                setSuccess(null);
                setError(mensajeError);
                console.error("Error de Axios:", mensajeError, error);
            } else {
                // Error desconocido
                setError("Ocurrió un error inesperado");
                console.error("Error desconocido:", error);
            }
        }
    }


    return (
        <section className="flex justify-center items-center min-h-screen px-4">
            <div className="w-full max-w-4xl bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 border border-gray-300 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">
                    Registrar Usuario
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <InputForm label="Nombre" register={register} name="nombreUsuario" type="text"
                        validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                        errors={errors} />

                    <InputForm label="Apellido" register={register} name="apellidoUsuario" type="text"
                        validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                        errors={errors} />

                    <SelectForm label="Tipo de documento" register={register} name="idTipoDocumento"
                        validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                        errors={errors} >
                        <option value="" disabled>Seleccione un tipo de documento</option>
                        {tiposDocumento.map(tipo => <option key={tipo.idTipoDocumento} value={tipo.idTipoDocumento}>{tipo.nombreTipoDocumento}</option>)}
                    </SelectForm>

                    <InputForm label="Número de documento" type="number" register={register} name="numeroDocumentoUsuario"
                        validationRules={{
                            required: { value: true, message: "Este campo es obligatorio" },
                            minLength: { value: 8, message: "Debe tener al menos 8 caracteres" },
                            maxLength: { value: 10, message: "Máximo 10 caracteres" },
                            validate: (value: string) => isValidDocument(value) || "Documento inválido"
                        }} errors={errors} />

                    <SelectForm label="Departamento" register={register} name="idDepartamento"
                        validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                        errors={errors} >
                        <option value="" disabled>Seleccione un departamento</option>
                        {departamentosFiltrados.map(depto => <option key={depto.idDepartamento} value={depto.idDepartamento}>{depto.nombreDepartamento}</option>)}
                    </SelectForm>

                    <SelectForm label="Municipio" register={register} name="idMunicipio"
                        validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                        errors={errors} >
                        <option value="" disabled>Seleccione un municipio</option>
                        {municipiosFiltrados.map(mun => <option key={mun.idMunicipio} value={mun.idMunicipio}>{mun.nombreMunicipio}</option>)}
                    </SelectForm>

                    {idRol === 1 ? (
                        <SelectForm label="Empresa" register={register} name="idEmpresa"
                            validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                            errors={errors} >
                            <option value="" disabled>Seleccione una empresa</option>
                            {empresas.map(emp => <option key={emp.idEmpresa} value={emp.idEmpresa}>{emp.nombreEmpresa}</option>)}
                        </SelectForm>
                    ) :
                        <SelectForm label="Empresa" register={register} name="idEmpresa"
                            validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                            errors={errors} >
                                {idEmpresa && empresas.find(emp => emp.idEmpresa == idEmpresa) && <option value={idEmpresa}>{empresas.find(emp => emp.idEmpresa == idEmpresa)?.nombreEmpresa}</option>}
                        </SelectForm>}

                    <SelectForm label="Rol" register={register} name="idRol"
                        validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                        errors={errors} >
                        <option value="" disabled>Seleccione un rol</option>
                        {roles.map(rol => <option key={rol.idRol} value={rol.idRol}>{rol.nombreRol}</option>)}
                    </SelectForm>

                    <InputForm label="Teléfono" register={register} name="telefonoUsuario" type="number"
                        validationRules={{
                            required: { value: true, message: "Este campo es obligatorio" },
                            validate: (value: string) => isValidPhoneNumber(value) || "Teléfono inválido"
                        }} errors={errors} />

                    <InputForm label="Dirección" register={register} name="direccionUsuario" type="text"
                        validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                        errors={errors} />

                    <InputForm label="Correo electrónico" register={register} name="correoUsuario" type="text"
                        validationRules={{
                            required: { value: true, message: "Este campo es obligatorio" },
                            validate: (value: string) => isValidEmail(value) || "Correo inválido"
                        }} errors={errors} />

                    {idUsuario && (
                        <SelectForm label="Estado" register={register} name="estadoUsuario"
                            validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                            errors={errors} >
                            <option value="" disabled>Seleccione un estado</option>
                            <option value="true">Activo</option>
                            <option value="false">Inactivo</option>
                        </SelectForm>
                    )}

                    <div className="col-span-1 sm:col-span-2 flex justify-center mt-4">
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                                 shadow-md transition-all focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                        >
                            {idUsuario ? "Actualizar" : "Registrar"}
                        </button>
                    </div>
                </form>

                {/* Notificaciones */}
                {error && <Notificacion type="error" message={error} />}
                {success && <Notificacion type="success" message={success} />}
            </div>
        </section>
    )
};

export default RegistrarUsuario;

