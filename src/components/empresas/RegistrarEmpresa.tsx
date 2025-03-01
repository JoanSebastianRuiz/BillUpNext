"use client"

import axios from 'axios';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useEmpresaContext } from '@/context/EmpresaContext';
import { useUsuarioContext } from '@/context/UsuarioContext';

import { DepartamentoResponseDTO } from '@/dto/DepartamentoResponseDTO';
import { MunicipioResponseDTO } from '@/dto/MunicipioResponseDTO';
import { EmpresaRequestDTO } from '@/dto/EmpresaRequestDTO';
import { isValidEmail } from '@/util/validators/validators';

import InputForm from '@/components/form/InputForm';
import SelectForm from '@/components/form/SelectForm';
import Notificacion from '@/components/form/Notificacion';
import ContenedorRegistrar from '../modal/ContenedorRegistrar';
import ButtonForm from '../form/ButtonForm';

const RegistrarEmpresa = ({ idEmpresa, obtenerEmpresas, setModalActualizar, setModalRegistrar }: { idEmpresa?: number, obtenerEmpresas: () => void, setModalActualizar?: (value: boolean) => void, setModalRegistrar?: (value: boolean) => void }) => {

    const { departamentos, municipios } = useUsuarioContext();
    const { tiposPersona, regimenesContribuyente } = useEmpresaContext();

    const [municipiosFiltrados, setMunicipiosFiltrados] = useState<MunicipioResponseDTO[]>([]);
    const [departamentosFiltrados, setDepartamentosFiltrados] = useState<DepartamentoResponseDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<EmpresaRequestDTO>();

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
            const departamentoEncontrado = municipios.find((municipio: MunicipioResponseDTO) => municipio.idMunicipio == idMunicipio)?.idDepartamento;
            if (departamentoEncontrado) {
                setValue("idDepartamento", departamentoEncontrado);
            }
        }
    }, [idMunicipio, municipios]);


    useEffect(() => {
        const fetchEmpresa = async () => {
            if (idEmpresa) {
                try {
                    const response = await axios.get(`/api/empresas/${idEmpresa}`);
                    if (response.status == 200) {
                        const empresa = response.data;

                        setValue("nombreEmpresa", empresa.nombreEmpresa || '');
                        setValue("idTipoPersona", empresa.idTipoPersona || 0);
                        setValue("idRegimenContribuyente", empresa.idRegimenContribuyente || 0);
                        setValue("idDepartamento", empresa.idDepartamento || 0);
                        setValue("idMunicipio", empresa.idMunicipio || 0);
                        setValue("nitEmpresa", empresa.nitEmpresa || "");
                        setValue("digitoVerificacionEmpresa", empresa.digitoVerificacionEmpresa || "");
                        setValue("razonSocialEmpresa", empresa.razonSocialEmpresa || '');
                        setValue("telefonoEmpresa", empresa.telefonoEmpresa || '');
                        setValue("direccionEmpresa", empresa.direccionEmpresa || '');
                        setValue("correoEmpresa", empresa.correoEmpresa || '');
                        setValue("codigoPostalEmpresa", empresa.codigoPostalEmpresa || '');
                        setValue("estadoEmpresa", empresa.estadoEmpresa ? empresa.estadoEmpresa.toString() : '');
                    } else {
                        console.error("Error al obtener datos de la empresa:", response.data.message);
                    }
                } catch (error) {
                    console.error("Error al obtener datos de la empresa:", error);
                }
            }
        };

        fetchEmpresa();
    }, [idEmpresa, setValue]);

    const onSubmit = async (data: EmpresaRequestDTO) => {
        try {
            if (idEmpresa) {
                let { idDepartamento, ...datosModificados } = data;

                datosModificados = { ...data, idTipoPersona: parseInt(data.idTipoPersona.toString()), idMunicipio: parseInt(data.idMunicipio.toString()), idRegimenContribuyente: parseInt(data.idRegimenContribuyente.toString()), estadoEmpresa: Boolean(data.estadoEmpresa) };

                const respuesta = await axios.put(`/api/empresas/${idEmpresa}`, datosModificados);
                setError(null);
                setSuccess(respuesta.data.message);
                obtenerEmpresas();
                setModalActualizar?.(false);
            } else {
                let { idDepartamento, ...datosModificados } = data;
                datosModificados = { ...data, idTipoPersona: parseInt(data.idTipoPersona.toString()), idMunicipio: parseInt(data.idMunicipio.toString()), idRegimenContribuyente: parseInt(data.idRegimenContribuyente.toString()), estadoEmpresa: true };

                const respuesta = await axios.post('/api/empresas', datosModificados);
                setError(null);
                setSuccess(respuesta.data.message);
                obtenerEmpresas();
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
        <ContenedorRegistrar name={idEmpresa ? "Actualizar empresa" : "Registrar empresa"}>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">

                <InputForm label="Nombre" register={register} name="nombreEmpresa" type="text"
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
                            name="nitEmpresa"
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
                            name="digitoVerificacionEmpresa"
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

                <InputForm label="Razón social" register={register} name="razonSocialEmpresa" type="text"
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

                <InputForm label="Código postal" register={register} name="codigoPostalEmpresa" type="text"
                    validationRules={{ 
                        required: { value: true, message: "Este campo es obligatorio" },
                        maxLength: { value: 6, message: "Máximo 6 caracteres" }
                    }}
                    errors={errors} />

                <InputForm label="Teléfono" register={register} name="telefonoEmpresa" type="number"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        length: { value: 10, message: "Debe tener 10 caracteres" }
                    }} errors={errors} />

                <InputForm label="Dirección" register={register} name="direccionEmpresa" type="text"
                    validationRules={{ 
                        required: { value: true, message: "Este campo es obligatorio" },
                        maxLength: { value: 250, message: "Máximo 250 caracteres" } 
                    }}
                    errors={errors} />

                <InputForm label="Correo electrónico" register={register} name="correoEmpresa" type="text"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        maxLength: { value: 250, message: "Máximo 250 caracteres" },
                        validate: (value: string) => isValidEmail(value) || "Correo inválido"
                    }} errors={errors} />

                {idEmpresa && (
                    <SelectForm label="Estado" register={register} name="estadoEmpresa"
                        validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                        errors={errors} >
                        <option value="" disabled>Seleccione un estado</option>
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </SelectForm>
                )}

                <div className="col-span-1 sm:col-span-2 flex justify-center mt-4">
                    <ButtonForm name={idEmpresa ? "Actualizar" : "Registrar"} type="submit" />
                </div>
            </form>

            {/* Notificaciones */}
            {error && <Notificacion type="error" message={error} />}
            {success && <Notificacion type="success" message={success} />}

        </ContenedorRegistrar>
    )
};

export default RegistrarEmpresa;

