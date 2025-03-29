"use client";

import axios from 'axios';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useCajaContext } from '@/context/CajaContext';


import Notificacion from '@/components/form/Notificacion';
import ContenedorRegistrar from '../modal/ContenedorRegistrar';
import ButtonForm from '../form/ButtonForm';
import TextareaForm from '../form/TextAreaForm';
import SelectForm from '../form/SelectForm';
import { MovimientoDTO } from '@/dto/MovimientoDTO';
import { useUsuarioContext } from '@/context/UsuarioContext';
import InputForm from '../form/InputForm';


const RegistrarMovimiento = ({ setModal }: { setModal?: (value: boolean) => void }) => {

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<MovimientoDTO>();
    const { usuario } = useUsuarioContext()
    const { obtenerMovimientos } = useCajaContext();
    const { cajaSeleccionada } = useCajaContext();

    const onSubmit = async (data: MovimientoDTO) => {
        try {
            const datosModificados = { ...data, idUsuario: Number(usuario.idUsuario), idCaja: cajaSeleccionada?.idCaja, tipoMovimiento: String(data.tipoMovimiento) === "true", valorMovimiento: Number(data.valorMovimiento) };

            const respuesta = await axios.post('/api/movimientos', datosModificados);
            setError(null);
            setSuccess(respuesta.data.message);
            obtenerMovimientos();
            setModal?.(false);

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
        <ContenedorRegistrar name={"Registrar movimiento"}>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">

                <SelectForm label="Tipo" register={register} name="tipoMovimiento"
                    validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                    errors={errors} >
                    <option value="" disabled>Seleccione un tipo</option>
                    <option value="true">Entrada</option>
                    <option value="false">Salida</option>
                </SelectForm>

                <InputForm label="Valor" register={register} name="valorMovimiento" type="number" dinero={true}
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        min: { value: 1, message: "Mínimo 1" }
                    }} errors={errors} />

                <TextareaForm label="Descripción" register={register} name="descripcionMovimiento"
                    validationRules={{
                        maxLength: { value: 250, message: "Máximo 250 caracteres" }
                    }}
                    errors={errors} />

                <div className="col-span-1 sm:col-span-2 flex justify-center mt-4">
                    <ButtonForm name={"Registrar"} type="submit" />
                </div>
            </form>

            {error && <Notificacion type="error" message={error} />}
            {success && <Notificacion type="success" message={success} />}

        </ContenedorRegistrar>
    );
};

export default RegistrarMovimiento;