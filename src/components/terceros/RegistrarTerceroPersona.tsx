"use client"

import axios from 'axios';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useUsuarioContext } from '@/context/UsuarioContext';
import { useSession } from 'next-auth/react';

import { DepartamentoResponseDTO } from '@/dto/DepartamentoResponseDTO';
import { MunicipioResponseDTO } from '@/dto/MunicipioResponseDTO';
import { TerceroRequestPersonaDTO } from '@/dto/TerceroRequestPersonaDTO';
import { isValidEmail } from '@/util/validators/validators';

import InputForm from '@/components/form/InputForm';
import SelectForm from '@/components/form/SelectForm';
import Notificacion from '@/components/form/Notificacion';
import ContenedorRegistrar from '../modal/ContenedorRegistrar';
import ButtonForm from '../form/ButtonForm';


const RegistrarTerceroPersona = ({ idTercero, obtenerPersonas, setModalActualizar, setModalRegistrar, proveedorTerceroPersona }: { idTercero?: number, proveedorTerceroPersona: boolean, obtenerPersonas: () => void, setModalActualizar?: (value: boolean) => void, setModalRegistrar?: (value: boolean) => void }) => {

    const { departamentos, municipios, tiposDocumento } = useUsuarioContext();

    const [municipiosFiltrados, setMunicipiosFiltrados] = useState<MunicipioResponseDTO[]>([]);
    const [departamentosFiltrados, setDepartamentosFiltrados] = useState<DepartamentoResponseDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<TerceroRequestPersonaDTO>();

    const idDepartamento = watch("idDepartamento");
    const idMunicipio = watch("idMunicipio");

    const { data: session } = useSession()
    const idEmpresa = session?.user?.idEmpresa ?? 0;

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
        const fetchTercero = async () => {
            if (idTercero) {
                try {
                    const response = await axios.get(`/api/terceros/${idTercero}?tipo=persona`);
                    if (response.status == 200) {
                        const tercero = response.data;

                        setValue("nombreTercero", tercero.nombreTercero || '');
                        setValue("apellidoTercero", tercero.apellidoTercero || '');
                        setValue("idTipoDocumento", tercero.idTipoDocumento || 0);
                        setValue("numeroDocumentoTercero", tercero.numeroDocumentoTercero || '');
                        setValue("idDepartamento", tercero.idDepartamento || 0);
                        setValue("idMunicipio", tercero.idMunicipio || 0);
                        setValue("telefonoTercero", tercero.telefonoTercero || '');
                        setValue("direccionTercero", tercero.direccionTercero || '');
                        setValue("correoTercero", tercero.correoTercero || '');
                        setValue("estadoTercero", tercero.estadoTercero.toString());

                        register("idEmpresa");
                        setValue("idEmpresa", tercero.idEmpresa || 0);

                        register("proveedorTercero");
                        setValue("proveedorTercero", tercero.proveedorTercero);
                    } else {
                        console.error("Error al obtener datos del tercero persona:", response.data.message);
                    }
                } catch (error) {
                    console.error("Error al obtener datos del tercero persona:", error);
                }
            }
        };

        fetchTercero();
    }, [idTercero, setValue]);


    const onSubmit = async (data: TerceroRequestPersonaDTO) => {
        try {
            if (idTercero) {
                let { idDepartamento, ...datosModificados } = data;

                datosModificados = { ...datosModificados, idTipoDocumento: parseInt(data.idTipoDocumento.toString()), idMunicipio: parseInt(data.idMunicipio.toString()), estadoTercero: Boolean(data.estadoTercero) };

                const respuesta = await axios.put(`/api/terceros/${idTercero}?tipo=persona`, datosModificados);
                setError(null);
                setSuccess(respuesta.data.message);
                obtenerPersonas();
                setModalActualizar?.(false);
            } else {
                let { idDepartamento, ...datosModificados } = data;
                datosModificados = { ...datosModificados, idTipoDocumento: parseInt(data.idTipoDocumento.toString()), idMunicipio: parseInt(data.idMunicipio.toString()), idEmpresa: parseInt(idEmpresa.toString()), estadoTercero: true, proveedorTercero: proveedorTerceroPersona };

                const respuesta = await axios.post("/api/terceros?tipo=persona", datosModificados);
                setError(null);
                setSuccess(respuesta.data.message);
                obtenerPersonas();
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
        <ContenedorRegistrar name={
            idTercero ?
             proveedorTerceroPersona? "Actualizar proveedor": "Actualizar cliente"
              : proveedorTerceroPersona? "Registrar proveedor": "Registrar cliente"}>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <InputForm label="Nombre" register={register} name="nombreTercero" type="text"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        maxLength: { value: 100, message: "Máximo 100 caracteres" }
                    }}
                    errors={errors} />

                <InputForm label="Apellido" register={register} name="apellidoTercero" type="text"
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

                <InputForm label="Número de documento" type="number" register={register} name="numeroDocumentoTercero"
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

                <InputForm label="Teléfono" register={register} name="telefonoTercero" type="number"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        length: { value: 10, message: "Debe tener 10 dígitos" }
                    }} errors={errors} />

                <InputForm label="Dirección" register={register} name="direccionTercero" type="text"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        maxLength: { value: 250, message: "Máximo 250 caracteres" }
                    }}
                    errors={errors} />

                <InputForm label="Correo electrónico" register={register} name="correoTercero" type="text"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        maxLength: { value: 250, message: "Máximo 250 caracteres" },
                        validate: (value: string) => isValidEmail(value) || "Correo inválido"
                    }} errors={errors} />

                {idTercero && (
                    <SelectForm label="Estado" register={register} name="estadoTercero"
                        validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                        errors={errors} >
                        <option value="" disabled>Seleccione un estado</option>
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </SelectForm>
                )}

                <div className="col-span-1 sm:col-span-2 flex justify-center mt-4">
                    <ButtonForm name={idTercero ? "Actualizar" : "Registrar"} type="submit" />
                </div>
            </form>

            {/* Notificaciones */}
            {error && <Notificacion type="error" message={error} />}
            {success && <Notificacion type="success" message={success} />}

        </ContenedorRegistrar>
    )
};

export default RegistrarTerceroPersona;

