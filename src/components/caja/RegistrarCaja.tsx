"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { CajaDTO } from "@/dto/CajaDTO";

import { useCajaContext } from "@/context/CajaContext";
import { useSession } from "next-auth/react";

import InputForm from "@/components/form/InputForm";
import SelectForm from "@/components/form/SelectForm";
import Notificacion from "@/components/form/Notificacion";
import ContenedorRegistrar from "@/components/modal/ContenedorRegistrar";
import ButtonForm from "@/components/form/ButtonForm";




const RegistrarCaja = ({ cajaSeleccionada, setModalActualizar, setModalRegistrar }:
    { cajaSeleccionada?: CajaDTO | null, setModalActualizar?: (value: boolean) => void, setModalRegistrar?: (value: boolean) => void }) => {

    const { obtenerCajas } = useCajaContext();

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<CajaDTO>();

    const { data: session } = useSession()
    const idEmpresa = session?.user?.idEmpresa;

    // carga los datos para poder editarlos
    useEffect(() => {
        if (cajaSeleccionada) {
            setValue("nombreCaja", cajaSeleccionada.nombreCaja || '');
            setValue("estadoCaja", cajaSeleccionada.estadoCaja);
        } 
    }, [cajaSeleccionada, setValue]);


    const onSubmit = async (data: CajaDTO) => {
        try {

            if (cajaSeleccionada) {

                //actualizar caja

                const datosModificados = {
                    ...data, 
                    idEmpresa: idEmpresa,
                    estadoCaja: String(data.estadoCaja) === "true"
                };

                const respuesta = await axios.put(`/api/caja/${cajaSeleccionada.idCaja}`, datosModificados);
                setError(null);
                setSuccess(respuesta.data.message);
                setModalActualizar?.(false);
            } else {

                const datosModificados = {
                    ...data, 
                    idEmpresa: idEmpresa,
                    estadoCaja: true
                };

                const respuesta = await axios.post('/api/caja', datosModificados);
                setError(null);
                setSuccess(respuesta.data.message);
                setModalRegistrar?.(false);
            }

            obtenerCajas();

        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                // Capturar el mensaje de error del backend
                const mensajeError = error.response.data?.message;
                setSuccess(null);
                setError(mensajeError);
                console.error("Error de Axios: ", mensajeError, error);
            } else {
                // Error desconocido
                setError("Ocurrió un error al procesar la solicitud");
                console.error("Error desconcido: ", error);
            }
        }

    };


    return (
        <ContenedorRegistrar name={cajaSeleccionada ? "Actualizar caja" : "Registrar caja"} >
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-1 gap-x-6 gap-y-4" >

                <InputForm label=" Nombre " register={register} name="nombreCaja" type="text"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        maxLength: { value: 50, message: "Máximo 50 caracteres" }
                    }}
                    errors={errors}
                />

                {cajaSeleccionada && (
                    <SelectForm label="Estado" register={register} name="estadoCaja"
                        validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                        errors={errors}>
                        <option value="" disabled> Selecione un estado</option>
                        <option value="true"> Activo </option>
                        <option value="false"> Inactivo </option>
                    </SelectForm>
                )}

                <div className="col-span-1 sm:col-span-1 flex justify-center mt-4">
                    <ButtonForm name={cajaSeleccionada ? "Actualizar" : "Registrar"} type="submit" />
                </div>

            </form>

            {/* Notificaciones */}
            {error && <Notificacion type="error" message={error} />}
            {success && <Notificacion type="success" message={success} />}
        </ContenedorRegistrar>

    );

};

export default RegistrarCaja;