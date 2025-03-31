"use client"

import axios from 'axios';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useUsuarioContext } from '@/context/UsuarioContext';
import { useEmpresaContext } from '@/context/EmpresaContext';
import { useSession } from 'next-auth/react';

import { DepartamentoResponseDTO } from '@/dto/DepartamentoResponseDTO';
import { MunicipioResponseDTO } from '@/dto/MunicipioResponseDTO';
import { UsuarioRequestDTO } from '@/dto/UsuarioRequestDTO';
import { isValidEmail } from '@/util/validators/validators';

import InputForm from '@/components/form/InputForm';
import SelectForm from '@/components/form/SelectForm';
import Notificacion from '@/components/form/Notificacion';
import ContenedorRegistrar from '../modal/ContenedorRegistrar';
import ButtonForm from '../form/ButtonForm';
import { UsuarioResponseDTO } from '@/dto/UsuarioResponseDTO';
import { EmpresaResponseDTO } from '@/dto/EmpresaResponseDTO';


const RegistrarUsuario = ({ usuarioSeleccionado, setModalActualizar, setModalRegistrar }: { usuarioSeleccionado?: UsuarioResponseDTO | null, setModalActualizar?: (value: boolean) => void, setModalRegistrar?: (value: boolean) => void }) => {

    const { departamentos, municipios, roles, tiposDocumento, obtenerUsuarios } = useUsuarioContext();
    const { empresas } = useEmpresaContext();

    const [municipiosFiltrados, setMunicipiosFiltrados] = useState<MunicipioResponseDTO[]>([]);
    const [departamentosFiltrados, setDepartamentosFiltrados] = useState<DepartamentoResponseDTO[]>([]);
    const [empresasFiltradas, setEmpresasFiltradas] = useState<EmpresaResponseDTO[]>([]);
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
        if (!empresas.length) return;
        if (idRol == 1) setEmpresasFiltradas(empresas.filter((empresa) => empresa.estadoEmpresa == true));

    }, [idRol, idEmpresa, empresas]);


    useEffect(() => {
        if (usuarioSeleccionado) {

            setValue("nombreUsuario", usuarioSeleccionado.nombreUsuario || '');
            setValue("apellidoUsuario", usuarioSeleccionado.apellidoUsuario || '');
            setValue("idTipoDocumento", usuarioSeleccionado.idTipoDocumento || 0);
            setValue("numeroDocumentoUsuario", usuarioSeleccionado.numeroDocumentoUsuario || '');
            setValue("idDepartamento", usuarioSeleccionado.idDepartamento || 0);
            setValue("idMunicipio", usuarioSeleccionado.idMunicipio || 0);
            if (idRol == 1) setValue("idEmpresa", usuarioSeleccionado.idEmpresa || 0);
            setValue("idRol", usuarioSeleccionado.idRol || 0);
            setValue("telefonoUsuario", usuarioSeleccionado.telefonoUsuario || '');
            setValue("direccionUsuario", usuarioSeleccionado.direccionUsuario || '');
            setValue("correoUsuario", usuarioSeleccionado.correoUsuario || '');
            setValue("estadoUsuario", usuarioSeleccionado.estadoUsuario ? "true" : "false");
        } else {
            setValue("idDepartamento", "");
            setValue("idMunicipio", "");
            if (idRol == 1) setValue("idEmpresa", "");
            setValue("idRol", "");
            setValue("idTipoDocumento", "");
        }
    }, [usuarioSeleccionado, setValue]);

    useEffect(() => {
        if (idRol === 2) {
            setValue("idEmpresa", idEmpresa || 0);
        }
    }, [idEmpresa, idRol, setValue]);

    const onSubmit = async (data: UsuarioRequestDTO) => {
        try {
            if (usuarioSeleccionado) {
                let { idDepartamento, ...datosModificados } = data;

                datosModificados = { ...data, idTipoDocumento: parseInt(data.idTipoDocumento.toString()), idMunicipio: parseInt(data.idMunicipio.toString()), idEmpresa: parseInt(data.idEmpresa.toString()), idRol: parseInt(data.idRol.toString()), estadoUsuario: String(data.estadoUsuario) === "true", claveUsuario: watch('numeroDocumentoUsuario') };

                const respuesta = await axios.put(`/api/usuarios/${usuarioSeleccionado.idUsuario}`, datosModificados);
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
        <ContenedorRegistrar name={usuarioSeleccionado ? "Actualizar usuario" : "Registrar usuario"}>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <InputForm label="Nombre" register={register} name="nombreUsuario" type="text"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        maxLength: { value: 100, message: "Máximo 100 caracteres" }
                    }}
                    errors={errors} />

                <InputForm label="Apellido" register={register} name="apellidoUsuario" type="text"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        maxLength: { value: 100, message: "Máximo 100 caracteres" }
                    }}
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
                        maxLength: { value: 10, message: "Máximo 10 caracteres" }
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

                {idRol === 1 && (
                    <SelectForm label="Empresa" register={register} name="idEmpresa"
                        validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                        errors={errors} >
                        <option value="" disabled>{empresasFiltradas.length > 0 ? "Seleccione una empresa" : "No hay empresas disponibles"}</option>
                        {empresasFiltradas.map(emp => <option key={emp.idEmpresa} value={emp.idEmpresa}>{emp.nombreEmpresa}</option>)}
                    </SelectForm>
                )}

                <SelectForm label="Rol" register={register} name="idRol"
                    validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                    errors={errors} >
                    <option value="" disabled>Seleccione un rol</option>
                    {roles.map(rol => <option key={rol.idRol} value={rol.idRol}>{rol.nombreRol}</option>)}
                </SelectForm>

                <InputForm label="Teléfono" register={register} name="telefonoUsuario" type="number"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        length: { value: 10, message: "Debe tener 10 dígitos" }
                    }} errors={errors} />

                <InputForm label="Dirección" register={register} name="direccionUsuario" type="text"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        maxLength: { value: 250, message: "Máximo 250 caracteres" }
                    }}
                    errors={errors} />

                <InputForm label="Correo electrónico" register={register} name="correoUsuario" type="text"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        maxLength: { value: 250, message: "Máximo 250 caracteres" },
                        validate: (value: string) => isValidEmail(value) || "Correo inválido"
                    }} errors={errors} />

                {usuarioSeleccionado && (
                    <SelectForm label="Estado" register={register} name="estadoUsuario"
                        validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                        errors={errors} >
                        <option value="" disabled>Seleccione un estado</option>
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </SelectForm>
                )}

                <div className="col-span-1 sm:col-span-2 flex justify-center mt-4">
                    <ButtonForm name={usuarioSeleccionado ? "Actualizar" : "Registrar"} type="submit" />
                </div>
            </form>

            {/* Notificaciones */}
            {error && <Notificacion type="error" message={error} />}
            {success && <Notificacion type="success" message={success} />}

        </ContenedorRegistrar>
    )
};

export default RegistrarUsuario;

