"use client"

import axios from 'axios';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useUsuarioContext } from '@/context/UsuarioContext';
import { useEmpresaContext } from '@/context/EmpresaContext';
import { useTerceroContext } from '@/context/TerceroContext';
import { useSession } from 'next-auth/react';

import { DepartamentoResponseDTO } from '@/dto/DepartamentoResponseDTO';
import { MunicipioResponseDTO } from '@/dto/MunicipioResponseDTO';
import { TerceroRequestEmpresaDTO } from '@/dto/TerceroRequestEmpresaDTO';
import { isValidEmail } from '@/util/validators/validators';

import InputForm from '@/components/form/InputForm';
import SelectForm from '@/components/form/SelectForm';
import Notificacion from '@/components/form/Notificacion';
import ContenedorRegistrar from '../modal/ContenedorRegistrar';
import ButtonForm from '../form/ButtonForm';
import { TerceroResponseEmpresaDTO } from '@/dto/TerceroResponseEmpresaDTO';


const RegistrarTerceroEmpresa = ({ terceroSeleccionado, setModalActualizar, setModalRegistrar, proveedorTerceroEmpresa }: { terceroSeleccionado?: TerceroResponseEmpresaDTO | null, proveedorTerceroEmpresa: boolean, setModalActualizar?: (value: boolean) => void, setModalRegistrar?: (value: boolean) => void }) => {

    const { departamentos, municipios } = useUsuarioContext();
    const { tiposPersona, regimenesContribuyente } = useEmpresaContext();
    const { obtenerEmpresas } = useTerceroContext();

    const [municipiosFiltrados, setMunicipiosFiltrados] = useState<MunicipioResponseDTO[]>([]);
    const [departamentosFiltrados, setDepartamentosFiltrados] = useState<DepartamentoResponseDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<TerceroRequestEmpresaDTO>();

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

        if (terceroSeleccionado) {
            setValue("nombreTercero", terceroSeleccionado.nombreTercero || '');
            setValue("nitTercero", terceroSeleccionado.nitTercero || '');
            setValue("digitoVerificacionTercero", terceroSeleccionado.digitoVerificacionTercero || '');
            setValue("razonSocialTercero", terceroSeleccionado.razonSocialTercero || '');
            setValue("idTipoPersona", terceroSeleccionado.idTipoPersona || 0);
            setValue("idRegimenContribuyente", terceroSeleccionado.idRegimenContribuyente || 0);
            setValue("idDepartamento", terceroSeleccionado.idDepartamento || 0);
            setValue("idMunicipio", terceroSeleccionado.idMunicipio || 0);
            setValue("codigoPostalTercero", terceroSeleccionado.codigoPostalTercero || '');
            setValue("telefonoTercero", terceroSeleccionado.telefonoTercero || '');
            setValue("direccionTercero", terceroSeleccionado.direccionTercero || '');
            setValue("correoTercero", terceroSeleccionado.correoTercero || '');
            setValue("estadoTercero", terceroSeleccionado.estadoTercero? "true" : "false");
        } else{
            setValue("idTipoPersona", "");
            setValue("idRegimenContribuyente", "");
            setValue("idDepartamento", "");
            setValue("idMunicipio", "");
        }

    }, [terceroSeleccionado, setValue]);


    const onSubmit = async (data: TerceroRequestEmpresaDTO) => {
        try {
            if (terceroSeleccionado) {
                let { idDepartamento, ...datosModificados } = data;

                datosModificados = { ...datosModificados, idTipoPersona: parseInt(data.idTipoPersona.toString()), idMunicipio: parseInt(data.idMunicipio.toString()), idRegimenContribuyente: parseInt(data.idRegimenContribuyente.toString()), estadoTercero: String(data.estadoTercero) === "true", idEmpresa: parseInt(idEmpresa.toString()), proveedorTercero: proveedorTerceroEmpresa };

                const respuesta = await axios.put(`/api/terceros/${terceroSeleccionado.idTercero}?tipo=empresa`, datosModificados);
                setError(null);
                setSuccess(respuesta.data.message);
                obtenerEmpresas(proveedorTerceroEmpresa ? "proveedores" : "clientes");
                setModalActualizar?.(false);
            } else {
                let { idDepartamento, ...datosModificados } = data;
                datosModificados = { ...datosModificados, idTipoPersona: parseInt(data.idTipoPersona.toString()), idMunicipio: parseInt(data.idMunicipio.toString()), idEmpresa: parseInt(idEmpresa.toString()), idRegimenContribuyente: parseInt(data.idRegimenContribuyente.toString()), estadoTercero: true, proveedorTercero: proveedorTerceroEmpresa };

                const respuesta = await axios.post("/api/terceros?tipo=empresa", datosModificados);
                setError(null);
                setSuccess(respuesta.data.message);
                obtenerEmpresas(proveedorTerceroEmpresa ? "proveedores" : "clientes");
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
            terceroSeleccionado ?
                proveedorTerceroEmpresa ? "Actualizar proveedor" : "Actualizar cliente"
                : proveedorTerceroEmpresa ? "Registrar proveedor" : "Registrar cliente"}>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <InputForm label="Nombre" register={register} name="nombreTercero" type="text"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        maxLength: { value: 250, message: "Máximo 250 caracteres" }
                    }}
                    errors={errors} />

                <SelectForm label="Tipo de persona" register={register} name="idTipoPersona"
                    validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                    errors={errors} >
                    <option value="" disabled>Seleccione un tipo de persona</option>
                    {tiposPersona.map(tipo => <option key={tipo.idTipoPersona} value={tipo.idTipoPersona}>{tipo.nombreTipoPersona}</option>)}
                </SelectForm>

                <div className="flex items-center col-span-1 sm:col-span-2 gap-2">
                    <div className="flex-1">
                        <InputForm
                            label="NIT"
                            type="number"
                            register={register}
                            name="nitTercero"
                            validationRules={{
                                required: { value: true, message: "Este campo es obligatorio" },
                                length: { value: 9, message: "Debe tener 9 caracteres" }
                            }}
                            errors={errors}
                        />
                    </div>

                    {/* Contenedor ajustado para centrar el guion con respecto a ambos inputs */}
                    <div className="flex flex-col justify-center items-center h-full">
                        <span className="text-lg font-semibold">-</span>
                    </div>

                    <div className="w-20">
                        <InputForm
                            label="DV"
                            type="number"
                            register={register}
                            name="digitoVerificacionTercero"
                            validationRules={{
                                required: { value: true, message: "Este campo es obligatorio" },
                                length: { value: 1, message: "DV inválido" }
                            }}
                            errors={errors}
                        />
                    </div>
                </div>

                <SelectForm label="Regimen contribuyente" register={register} name="idRegimenContribuyente"
                    validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                    errors={errors} >
                    <option value="" disabled>Seleccione un regimen contribuyente</option>
                    {regimenesContribuyente.map(r => <option key={r.idRegimenContribuyente} value={r.idRegimenContribuyente}>{r.nombreRegimenContribuyente}</option>)}
                </SelectForm>

                <InputForm label="Razón social" register={register} name="razonSocialTercero" type="text"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        maxLength: { value: 250, message: "Máximo 250 caracteres" }
                    }}
                    errors={errors} />

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

                <InputForm label="Código postal" register={register} name="codigoPostalTercero" type="text"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        maxLength: { value: 6, message: "Máximo 6 caracteres" }
                    }}
                    errors={errors} />

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

                {terceroSeleccionado && (
                    <SelectForm label="Estado" register={register} name="estadoTercero"
                        validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                        errors={errors} >
                        <option value="" disabled>Seleccione un estado</option>
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </SelectForm>
                )}

                <div className="col-span-1 sm:col-span-2 flex justify-center mt-4">
                    <ButtonForm name={terceroSeleccionado ? "Actualizar" : "Registrar"} type="submit" />
                </div>
            </form>

            {/* Notificaciones */}
            {error && <Notificacion type="error" message={error} />}
            {success && <Notificacion type="success" message={success} />}

        </ContenedorRegistrar>
    )
};

export default RegistrarTerceroEmpresa;

