"use client";

import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import { GravamenDTO } from '@/dto/GravamenDTO';

import InputForm from '@/components/form/InputForm';
import SelectForm from '@/components/form/SelectForm';
import Notificacion from '@/components/form/Notificacion';
import ContenedorRegistrar from '../modal/ContenedorRegistrar';
import ButtonForm from '../form/ButtonForm';

const RegistrarGravamen = ({ idGravamen, obtenerGravamenes, setModalActualizar, setModalRegistrar }: { idGravamen?: number, obtenerGravamenes: () => void, setModalActualizar?: (value: boolean) => void, setModalRegistrar?: (value: boolean) => void }) => {

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<GravamenDTO>();

    useEffect(() => {
        const fetchGravamen = async () => {
            if (idGravamen) {
                try {
                    const response = await axios.get(`/api/gravamen/${idGravamen}`);
                    if (response.status === 200) {
                        const gravamen = response.data;

                        setValue("nombreGravamen", gravamen.nombreGravamen || '');
                        setValue("estadoGravamen", gravamen.estadoGravamen.toString());
                    } else {
                        console.error("Error al obtener datos del gravamen:", response.data.message);
                    }
                } catch (error) {
                    console.error("Error al obtener datos del gravamen:", error);
                }
            }
        };

        fetchGravamen();
    }, [idGravamen, setValue]);

    const onSubmit = async (data: GravamenDTO) => {
        try {
            if (idGravamen) {
                const respuesta = await axios.put(`/api/gravamen/${idGravamen}`, data);
                setError(null);
                setSuccess(respuesta.data.message);
                obtenerGravamenes();
                setModalActualizar?.(false);
            } else {
                const respuesta = await axios.post('/api/gravamen', data);
                setError(null);
                setSuccess(respuesta.data.message);
                obtenerGravamenes();
                setModalRegistrar?.(false);
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const mensajeError = error.response.data?.message;
                setSuccess(null);
                setError(mensajeError);
                console.error("Error de Axios:", mensajeError, error);
            } else {
                setError("Ocurrió un error inesperado");
                console.error("Error desconocido:", error);
            }
        }
    };

    return (
        <ContenedorRegistrar name={idGravamen ? "Actualizar gravamen" : "Registrar gravamen"}>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <InputForm label="Nombre" register={register} name="nombreGravamen" type="text"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        maxLength: { value: 50, message: "Máximo 50 caracteres" }
                    }}
                    errors={errors} />

                {idGravamen && (
                    <SelectForm label="Estado" register={register} name="estadoGravamen"
                        validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                        errors={errors} >
                        <option value="" disabled>Seleccione un estado</option>
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </SelectForm>
                )}

                <div className="col-span-1 sm:col-span-2 flex justify-center mt-4">
                    <ButtonForm name={idGravamen ? "Actualizar" : "Registrar"} type="submit" />
                </div>
            </form>

            {error && <Notificacion type="error" message={error} />}
            {success && <Notificacion type="success" message={success} />}

        </ContenedorRegistrar>
    );
};

export default RegistrarGravamen;