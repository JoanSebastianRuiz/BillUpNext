"use client";

import axios  from "axios";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { TipoMedioPagoDTO } from "@/dto/TipoMedioPagoDTO";

import InputForm from "@/components/form/InputForm";
import Notificacion from "@/components/form/Notificacion";
import ContenedorRegistrar from "@/components/modal/ContenedorRegistrar";
import ButtonForm from "@/components/form/ButtonForm";
import SelectForm from "@/components/form/SelectForm";
import { useTiposMediosPagoContext } from "@/context/TipoMedioPagoContext";

const RegistrarTipoMedioPago = ({ idTipoMedioPago, setModalActualizar , setModalRegistrar }: 
    { idTipoMedioPago? : number, setModalActualizar? : (value: boolean) => void, setModalRegistrar? : (value: boolean) => void}) => {
    const [error, setError] = useState<string | null> (null);
    const [success, setSuccess] = useState<string | null> (null);
    const {obtenerTiposMediosPago } = useTiposMediosPagoContext();

    const { register, handleSubmit, formState: {errors}, setValue} = useForm<TipoMedioPagoDTO>();

    useEffect(() => {
        const fectTipoMedioPago = async() => {
            if(idTipoMedioPago){
                try {
                    const respuesta = await axios.get(`/api/tipo-medio-pago/${idTipoMedioPago}`);
                    if (respuesta.status === 200){
                        const tipoMedioPago = respuesta.data;
                        setValue("nombreTipoMedioPago", tipoMedioPago.nombreTipoMedioPago || ' ');
                        setValue("estadoTipoMedioPago", tipoMedioPago.estadoTipoMedioPago);
                    } else {
                        console.error("Errar al obtener datos del tipo de pago: ", respuesta.data.message);
                    }

                } catch (error) {
                    console.error("Errar al obtener datos del tipo de pago: ", error);
                }
            }
        };

        fectTipoMedioPago();
    }, [idTipoMedioPago, setValue]);


    const onSubmit = async (data: TipoMedioPagoDTO) => {
        try {
            if (idTipoMedioPago) {
                const respuesta = await axios.put(`/api/tipo-medio-pago${idTipoMedioPago}`, data);
                setError(null);
                setSuccess(respuesta.data.message);
                obtenerTiposMediosPago();
                setModalActualizar?.(false);
            } else {
                const respuesta = await axios.post(`/api/tipo-medio-pago`, { ...data, estadoTipoMedioPago : true});
                setError(null);
                setSuccess(respuesta.data.message);
                obtenerTiposMediosPago();
                setModalRegistrar?.(false);
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response ){
                const mensajeError = error.response.data?.message;
                setSuccess(null);
                setError(mensajeError);
                console.error("Error de Axios: ", mensajeError, error);
            }else {
                setError("Ocurrió un error al procesar la solicitud");
                console.error("Error desconocio: ", error);
            }
        }

    };



    return (
        <ContenedorRegistrar name= {idTipoMedioPago ? "Actualizar tipo medio pago" : "Registrar tipo medio pago"}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-x-6 gap-y-4" >
                <InputForm label=" Nombre del tipo de medio de pago " register={register} name="nombreTipoMedioPago" type="text"
                    validationRules={{
                        required: {value: true, message: "Este campo es obligatorio"},
                        maxLength: {value: 50, message: "Máximo 50 caracteres"}
                    }}
                    errors={errors}
                />

                {idTipoMedioPago && (
                    <SelectForm label="Estado" register={register} name="estadoTipoMedioPago"
                        validationRules={{required: { value : true, message: "Este campo es obligatorio"} } }
                    errors={errors}>
                        <option value="" disabled> Selecione un estado</option>
                        <option value= "true"> Activo </option>
                        <option value= "false"> Inactivo </option>             
                    </SelectForm>
                )}

                <div className="col-span-1 flex justify-center mt-4">
                      <ButtonForm name={idTipoMedioPago ? "Actualizar" : "Registrar"} type="submit" />
                </div> 

            </form>

            {error && <Notificacion type="error" message={error} />}
            {success && <Notificacion type="success" message={success} />}
        </ContenedorRegistrar>

    );

};

export default RegistrarTipoMedioPago;
