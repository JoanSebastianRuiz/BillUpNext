"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useVentaContext } from "@/context/VentaContext";
import { useSession } from "next-auth/react";

import { UbicacionVentaDTO } from "@/dto/UbicacionVentaDTO";

import InputForm from "@/components/form/InputForm";
import Notificacion from "@/components/form/Notificacion";
import ContenedorRegistrar from "@/components/modal/ContenedorRegistrar";
import ButtonForm from "@/components/form/ButtonForm";
import SelectForm from "@/components/form/SelectForm";


const RegistrarUbicacionVenta = ({ ubicacionVentaSeleccionada, setModalActualizar, setModalRegistrar }: { ubicacionVentaSeleccionada?: UbicacionVentaDTO, setModalActualizar?: (value: boolean) => void, setModalRegistrar?: (value: boolean) => void }) => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<UbicacionVentaDTO>();

    const { obtenerUbicacionesVenta } = useVentaContext();

    const { data: session } = useSession();
    const idEmpresa = session?.user?.idEmpresa;

    useEffect(() => {
        if (ubicacionVentaSeleccionada) {
            setValue("nombreUbicacionVenta", ubicacionVentaSeleccionada.nombreUbicacionVenta || ' ');
            setValue("estadoUbicacionVenta", ubicacionVentaSeleccionada.estadoUbicacionVenta);
        }
    }, [ubicacionVentaSeleccionada, setValue]);


    const onSubmit = async (data: UbicacionVentaDTO) => {
        try {
            if (ubicacionVentaSeleccionada) {
                const datosModificados = { ...data, estadoUbicacionVenta: String(data.estadoUbicacionVenta) === "true", idEmpresa: idEmpresa };
                const respuesta = await axios.put(`/api/ubicacion-venta/${ubicacionVentaSeleccionada.idUbicacionVenta}`, datosModificados);
                setError(null);
                setSuccess(respuesta.data.message);
                obtenerUbicacionesVenta();
                setModalActualizar?.(false);
            } else {
                const datosModificados = { ...data, estadoUbicacionVenta: true, idEmpresa: idEmpresa };
                const respuesta = await axios.post('/api/ubicacion-venta', datosModificados);
                setError(null);
                setSuccess(respuesta.data.message);
                obtenerUbicacionesVenta();
                setModalRegistrar?.(false);
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const mensajeError = error.response.data?.message;
                setSuccess(null);
                setError(mensajeError);
                console.error("Error de Axios:", mensajeError, error);
            } else {
                setError("Ocurrió un error al procesar la solicitud");
                console.error("Error desconocido:", error);
            }
        }
    };




    return (
        <ContenedorRegistrar name={ubicacionVentaSeleccionada ? "Actualizar ubicacion" : "Registrar ubicacion"}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-x-6 gap-y-4">
                <InputForm label="Nombre" register={register} name="nombreUbicacionVenta" type="text"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        maxLength: { value: 50, message: "Máximo 50 caracteres" }
                    }}
                    errors={errors} />

                {ubicacionVentaSeleccionada && (
                    <SelectForm label="Estado" register={register} name="estadoUbicacionVenta"
                        validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                        errors={errors}>
                        <option value="" disabled> Selecione un estado</option>
                        <option value="true"> Activo </option>
                        <option value="false"> Inactivo </option>
                    </SelectForm>
                )}

                <div className="col-span-1 flex justify-center mt-4">
                    <ButtonForm name={ubicacionVentaSeleccionada ? "Actualizar" : "Registrar"} type="submit" />
                </div>
            </form>

            {error && <Notificacion type="error" message={error} />}
            {success && <Notificacion type="success" message={success} />}
        </ContenedorRegistrar>

    );

};

export default RegistrarUbicacionVenta;