"use client"

import axios from 'axios';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useUsuarioContext } from '@/context/UsuarioContext';

import { DepartamentoResponseDTO } from '@/dto/DepartamentoResponseDTO';
import { MunicipioResponseDTO } from '@/dto/MunicipioResponseDTO';
import { UsuarioRequestDTO } from '@/dto/UsuarioRequestDTO';
import { isValidEmail } from '@/util/validators/validators';

import InputForm from '@/components/form/InputForm';
import SelectForm from '@/components/form/SelectForm';
import Notificacion from '@/components/form/Notificacion';
import ContenedorRegistrar from '../modal/ContenedorRegistrar';
import ButtonForm from '../form/ButtonForm';
import { UsuarioResponseDTO } from "@/dto/UsuarioResponseDTO";


const ActualizarPerfil = ({ setModalActualizarPerfil }: { setModalActualizarPerfil?: (value: boolean) => void }) => {

    const { departamentos, municipios, tiposDocumento, usuario, setUsuario } = useUsuarioContext();

    const [municipiosFiltrados, setMunicipiosFiltrados] = useState<MunicipioResponseDTO[]>([]);
    const [departamentosFiltrados, setDepartamentosFiltrados] = useState<DepartamentoResponseDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<UsuarioRequestDTO>();

    const idDepartamento = watch("idDepartamento");
    const idMunicipio = watch("idMunicipio");

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
        if (!usuario) return; // Evita errores si usuario es undefined
        setValue("nombreUsuario", usuario.nombreUsuario || '');
        setValue("apellidoUsuario", usuario.apellidoUsuario || '');
        setValue("idTipoDocumento", usuario.idTipoDocumento || 0);
        setValue("numeroDocumentoUsuario", usuario.numeroDocumentoUsuario || '');
        setValue("idDepartamento", usuario.idDepartamento || 0);
        setValue("idMunicipio", usuario.idMunicipio || 0);
        setValue("telefonoUsuario", usuario.telefonoUsuario || '');
        setValue("direccionUsuario", usuario.direccionUsuario || '');
        setValue("correoUsuario", usuario.correoUsuario || '');
    }, [usuario, setValue]);


    const onSubmit = async (data: UsuarioRequestDTO) => {
        try {
            let { idDepartamento, ...datosModificados } = data;

            datosModificados = { ...data, idTipoDocumento: parseInt(data.idTipoDocumento.toString()), idMunicipio: parseInt(data.idMunicipio.toString()), idEmpresa: parseInt(usuario.idEmpresa.toString()), idRol: parseInt(usuario.idRol.toString()), estadoUsuario: true };

            const respuesta = await axios.put(`/api/usuarios/${usuario.idUsuario}`, datosModificados);
            setError(null);
            setSuccess(respuesta.data.message);
            const responseInfoUsuario = await axios.get(`/api/usuarios/${usuario.idUsuario}`);
            const infoUsuario = responseInfoUsuario.data;
            setUsuario(infoUsuario);
            setModalActualizarPerfil?.(false);
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
        <ContenedorRegistrar name={"Actualizar perfil"}>

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

                <div className="col-span-1 sm:col-span-2 flex justify-center mt-4">
                    <ButtonForm name={"Actualizar"} type="submit" />
                </div>
            </form>

            {/* Notificaciones */}
            {error && <Notificacion type="error" message={error} />}
            {success && <Notificacion type="success" message={success} />}

        </ContenedorRegistrar>
    )
};

export default ActualizarPerfil;

