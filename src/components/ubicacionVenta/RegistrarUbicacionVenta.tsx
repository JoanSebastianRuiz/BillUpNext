"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { UbicacionVentaDTO } from "@/dto/UbicacionVentaDTO";

import InputForm from "@/components/form/InputForm";
import Notificacion from "@/components/form/Notificacion";
import ContenedorRegistrar from "@/components/modal/ContenedorRegistrar";
import ButtonForm from "@/components/form/ButtonForm";
import SelectForm from "@/components/form/SelectForm";


const RegistrarUbicacionVenta = ({ idUbicacionVenta, obtenerUbicacionesVenta, setModalActualizar, setModalRegistrar } : { idUbicacionVenta? : number, obtenerUbicacionesVenta: () => void, setModalActualizar? : (value: boolean) => void, setModalRegistrar? : (value: boolean)=> void }) => {
    const [error, setError] = useState<string | null> (null);
    const [success, setSuccess] = useState<string | null> (null);

    const {register, handleSubmit, formState: {errors}, setValue} = useForm<UbicacionVentaDTO>();

    useEffect(() => {
        const fetchUbicacionVenta = async() => {
            if(idUbicacionVenta){
                try {
                    const respuesta = await axios.get(`/api/ubicacion-venta/${idUbicacionVenta}`);
                    if (respuesta.status === 200) {
                        const ubicacionVenta = respuesta.data;
                        setValue("nombreUbicacionVenta", ubicacionVenta.nombreUbicacionVenta || ' ');
                        setValue("estadoUbicacionVenta", ubicacionVenta.estadoUbicacionVenta);
                    }else {
                        console.error("Error al obtener datos de la ubicación de venta:", respuesta.data.message);
                    }
                } catch (error) {
                    console.error("Error al obtener datos de la ubicación de venta:", error);
                }
            }
        };

        fetchUbicacionVenta();
    }, [idUbicacionVenta, setValue]);


    const onSubmit = async (data: UbicacionVentaDTO) => {
        try {
            if (idUbicacionVenta) {
                const respuesta = await axios.put(`/api/ubicacion-venta/${idUbicacionVenta}`, data);
                setError(null);
                setSuccess(respuesta.data.message);
                obtenerUbicacionesVenta();
                setModalActualizar?.(false);
            } else {
                const respuesta = await axios.post('/api/ubicacion-venta', { ...data, estadoUbicacionVenta: true });
                setError(null);
                setSuccess(respuesta.data.message);
                obtenerUbicacionesVenta();
                setModalRegistrar?.(false);
            }
        } catch (error: unknown) {
            if(axios.isAxiosError(error) && error.response){
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
        <ContenedorRegistrar name= {idUbicacionVenta ? "Actualizar ubicacionVenta" : "Registrar ubicacion Venta"}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-x-6 gap-y-4">
                <InputForm label="Nombre de la ubicacion de Venta" register={register} name="nombreUbicacionVenta" type="text"
                    validationRules={{
                        required: {value: true, message: "Este campo es obligatorio"},
                        maxLength: {value: 50, message: "Máximo 50 caracteres"}
                    }}
                    errors={errors} />

                    {idUbicacionVenta && (
                        <SelectForm label="Estado" register={register} name="estadoUbicacionVenta"
                        validationRules={{ required: { value : true, message: "Este campo es obligatorio"} } }
                        errors={errors}>
                            <option value="" disabled> Selecione un estado</option>
                            <option value= "true"> Activo </option>
                            <option value= "false"> Inactivo </option>
                        </SelectForm>
                    )}

                    <div className="col-span-1 flex justify-center mt-4">
                        <ButtonForm name={idUbicacionVenta ? "Actualizar" : "Registrar"} type="submit" />
                    </div>
            </form>

            {error && <Notificacion type="error" message={error} />}
            {success && <Notificacion type="success" message={success} />}
        </ContenedorRegistrar>

    );

};

export default RegistrarUbicacionVenta;