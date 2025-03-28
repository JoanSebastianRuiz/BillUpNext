"use client";

import axios from 'axios';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useVentaContext } from '@/context/VentaContext';

import { VentaDTO } from '@/dto/VentaDTO';

import Notificacion from '@/components/form/Notificacion';
import ContenedorRegistrar from '../modal/ContenedorRegistrar';
import ButtonForm from '../form/ButtonForm';
import TextareaForm from '../form/TextAreaForm';


const CancelarVenta = ({ venta, setModal }: { venta: VentaDTO | null, setModal: (value: boolean) => void }) => {

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<VentaDTO>();
    const { obtenerVentas } = useVentaContext();

    const { data: session } = useSession();
    const idUsuario = session?.user?.idUsuario;

    const onSubmit = async (data: VentaDTO) => {
        try {
            
            const datosModificados = { ...data, idUsuarioCancelacionVenta: idUsuario };
            const respuesta = await axios.put(`/api/ventas/${venta?.idVenta}`, datosModificados);
            setError(null);
            setSuccess(respuesta.data.message);
            obtenerVentas();
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
        <ContenedorRegistrar name={"Cancelar venta"}>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <TextareaForm label="Motivo" register={register} name="motivoCancelacionVenta"
                    validationRules={{
                        required: { value: true, message: "Campo requerido" },
                        maxLength: { value: 250, message: "Máximo 250 caracteres" }
                    }}
                    errors={errors} />

                <div className="col-span-1 sm:col-span-2 flex justify-center mt-4">
                    <ButtonForm name={"Cancelar"} type="submit" />
                </div>
            </form>

            {error && <Notificacion type="error" message={error} />}
            {success && <Notificacion type="success" message={success} />}

        </ContenedorRegistrar>
    );
};

export default CancelarVenta;