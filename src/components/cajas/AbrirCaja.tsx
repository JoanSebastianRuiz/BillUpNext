"use client";

import axios from 'axios';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { CajaDTO } from '@/dto/CajaDTO';

import InputForm from '@/components/form/InputForm';
import SelectForm from '@/components/form/SelectForm';
import Notificacion from '@/components/form/Notificacion';
import ContenedorRegistrar from '../modal/ContenedorRegistrar';
import ButtonForm from '../form/ButtonForm';
import { useCajaContext } from '@/context/CajaContext';
import { DetalleCajaDTO } from '@/dto/DetalleCajaDTO';

const AbrirCaja = ({ setModal }: { setModal?: (value: boolean) => void }) => {

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const { cajas, setCajaSeleccionada, obtenerDetalleCajaActual } = useCajaContext();
    const [cajasFiltradas, setCajasFiltradas] = useState<CajaDTO[]>([]);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<DetalleCajaDTO>();

    const { data: session } = useSession();
    const idUsuario = session?.user?.idUsuario;

    useEffect(() => {
        setCajasFiltradas(cajas.filter(caja => caja.estadoCaja === true && caja.openCaja === false));
    }, [cajas]);

    const onSubmit = async (data: DetalleCajaDTO) => {
        try {
            const datosModificados = { ...data, idUsuario, idCaja: Number(data.idCaja)}
            const respuesta = await axios.post('/api/detalles-caja', datosModificados);
            setError(null);
            setSuccess(respuesta.data.message);
            setCajaSeleccionada(cajasFiltradas.find(caja => caja.idCaja === Number(data.idCaja))?.idCaja ?? 0);
            obtenerDetalleCajaActual(data.idCaja);
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
        <ContenedorRegistrar name={"Abrir caja"}>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-1 gap-x-6 gap-y-4">

                <SelectForm label="Caja" register={register} name="idCaja"
                    validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                    errors={errors} >
                    {cajasFiltradas.map((caja) => (
                        <option key={caja.idCaja} value={caja.idCaja}>{caja.nombreCaja}</option>
                    ))}
                </SelectForm>

                <InputForm label="Dinero de apertura" register={register} name="dineroAperturaDetalleCaja" type="number"
                    validationRules={{ 
                        required: { value: true, message: "Este campo es obligatorio" },
                        min: { value: 0, message: "El valor debe ser mayor o igual a 0" }
                     }}
                    errors={errors} />

                <div className="col-span-1 sm:col-span-1 flex justify-center mt-4">
                    <ButtonForm name={"Abrir"} type="submit" />
                </div>
            </form>

            {error && <Notificacion type="error" message={error} />}
            {success && <Notificacion type="success" message={success} />}

        </ContenedorRegistrar>
    );
};

export default AbrirCaja;