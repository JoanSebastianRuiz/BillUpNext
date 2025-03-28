"use client";

import axios from 'axios';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

import InputForm from '@/components/form/InputForm';
import Notificacion from '@/components/form/Notificacion';
import ContenedorRegistrar from '../modal/ContenedorRegistrar';
import ButtonForm from '../form/ButtonForm';
import { useCajaContext } from '@/context/CajaContext';
import { DetalleCajaDTO } from '@/dto/DetalleCajaDTO';

const CerrarCaja = ({ setModal }: { setModal?: (value: boolean) => void }) => {

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const { detalleCajaActual, setCajaSeleccionada, setDetalleCajaActual } = useCajaContext();

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<DetalleCajaDTO>();

    const { data: session } = useSession();
    const idUsuario = session?.user?.idUsuario;

    const onSubmit = async (data: DetalleCajaDTO) => {
        try {
            const datosModificados = { ...data, idUsuario, idCaja: Number(data.idCaja)}
            const respuesta = await axios.put(`/api/detalles-caja/${detalleCajaActual?.idDetalleCaja}`, datosModificados);
            setError(null);
            setSuccess(respuesta.data.message);
            setCajaSeleccionada(null);
            setDetalleCajaActual(null);
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
        <ContenedorRegistrar name={"Cerrar caja"}>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-1 gap-x-6 gap-y-4">

                <InputForm label="Dinero de cierre" register={register} name="dineroCierreDetalleCaja" type="number"
                    validationRules={{ 
                        required: { value: true, message: "Este campo es obligatorio" },
                        min: { value: 0, message: "El valor debe ser mayor o igual a 0" }
                     }}
                    errors={errors} />

                <div className="col-span-1 sm:col-span-2 flex justify-center mt-4">
                    <ButtonForm name={"Cerrar"} type="submit" />
                </div>
            </form>

            {error && <Notificacion type="error" message={error} />}
            {success && <Notificacion type="success" message={success} />}

        </ContenedorRegistrar>
    );
};

export default CerrarCaja;