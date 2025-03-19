"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { DetalleCajaDTO } from "@/dto/DetalleCajaDTO";

import { useCajaContext } from "@/context/CajaContext";
import { useUsuarioContext } from "@/context/UsuarioContext";
import { useSession } from "next-auth/react";

import InputForm from "../form/InputForm";
import SelectForm from "../form/SelectForm";
import Notificacion from "../form/Notificacion";
import ContenedorRegistrar from "../modal/ContenedorRegistrar";
import ButtonForm from "../form/ButtonForm";


const RegistrarDetalleCaja = ( {idDetalleCaja, obtenerDetallesCaja, setModalActualizar, setModalRegistrar}:
    { idDetalleCaja? : number, obtenerDetallesCaja: () => void, setModalActualizar? : (value : boolean) => void, setModalRegistrar? : (value: boolean)=> void } ) => {
        
    const {cajas} = useCajaContext();
    const {usuarios}= useUsuarioContext();

    const[error, setError] = useState<string | null> (null);
    const[success, setSuccess] = useState<string | null> (null);

    const {register, handleSubmit, formState: {errors}, setValue, reset} = useForm<DetalleCajaDTO>();

    const { data: session } = useSession()
    const idEmpresa = session?.user?.idEmpresa;

    // carga los datos para poder editarlos
    useEffect ( () => {
        const fetchDetalleCaja = async () => {
            try {
                const respuesta = await axios.get(`/api/detalle-caja/${idDetalleCaja}`);
                if (respuesta.status === 200) {
                    const detalleCaja = respuesta.data;

                    setValue("idCaja", detalleCaja.idCaja || 0);
                    setValue("idUsuario", detalleCaja.idDetalleCaja || '');
                    setValue("dineroAperturaDetalleCaja", detalleCaja.dineroAperturaDetalleCaja || 0);
                    setValue("dineroCierreDetalleCaja", detalleCaja.dineroCierreDetalleCaja || 0);
                } else {
                    console.error("Error al obtener los detos de DETALLE CAJA: ", respuesta.data.message);
                }
            } catch (error) {
                console.error("Error al obtener los datos de DETALLE CAJA: ", error);
            }

        };

        fetchDetalleCaja();

    }, [idDetalleCaja, setValue]);


    const onSubmit = async (data: DetalleCajaDTO) => {
        try {
            
            if(idDetalleCaja){

                //actualizar detalle Caja
                let { ...datosModificados} = data;

                datosModificados = {...data, idCaja: parseInt(data.idCaja.toString(),10),
                idUsuario: parseInt(data.idUsuario.toString(),10), 
                dineroAperturaDetalleCaja: parseFloat(data.dineroAperturaDetalleCaja.toString()),
                dineroCierreDetalleCaja: parseFloat(data.dineroCierreDetalleCaja.toString()),
                fechaCierreDetalleCaja: new Date() // Aquí se registra automáticamente la fecha actual
                };

                const respuesta = await axios.put(`/api/detalle-caja/${idDetalleCaja}`, datosModificados);
                setError(null);
                setSuccess(respuesta.data.message);
                setModalActualizar?.(false);
            } else {

                // Crear un nuevo detalle Caja
                let {...datosModificados} = data;

                datosModificados = {...data, idCaja: parseInt(data.idCaja.toString(),10),
                idUsuario: parseInt(data.idUsuario.toString(),10),
                fechaAperturaDetalleCaja: new Date(data.fechaAperturaDetalleCaja),
                fechaCierreDetalleCaja: new Date(), // Se genera automáticamente al crear el detalle caja
                dineroAperturaDetalleCaja: parseFloat(data.dineroAperturaDetalleCaja.toString()),
                dineroCierreDetalleCaja: parseFloat(data.dineroCierreDetalleCaja.toString()),
                dineroCierreSistemaDetalleCaja: parseFloat(data.dineroCierreSistemaDetalleCaja.toString() ) };

                const respuesta = await axios.post('/api/detalle-caja', datosModificados);
                setError(null);
                setSuccess(respuesta.data.message);
                setModalRegistrar?.(false);
            }

            obtenerDetallesCaja();

        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response){
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
        <ContenedorRegistrar name= {idDetalleCaja ? "Actualizar detalle Caja" : "Registrar detalle Caja"} >
            <form onSubmit={ handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4" >

                <SelectForm label=" Caja " register={register} name="idCaja" 
                validationRules={{ required: {value: true, message: "Este campo es obligatorio" } } }
                errors={errors} >
                    <option value="" disabled> Seleccione una caja </option>
                    {cajas.map(caja => <option key={caja.idCaja} value={caja.idCaja}>{caja.nombreCaja}</option>)}
                </SelectForm>

                <SelectForm label=" Usuario " register={register} name="idUsuario"
                validationRules={{required: {value: true, message: "Este campo es obligatorio "}}}
                errors={errors} >
                    <option value="" disabled> Seleccione un usuario </option>
                    {usuarios.map(usu => <option key={usu.idUsuario} value={usu.idUsuario}>{usu.nombreUsuario}</option>)}
                </SelectForm>

                <InputForm label=" Monto Dinero de Apertura Caja" register={register} name="dineroAperturaDetalleCaja" type="text"
                validationRules={{
                    required: {value: true, message: "El monto es obligatorio"},
                    min: { value: 0.01, message: "El monto debe ser mayor a 0" },
                    max: { value: 9999999.99, message: "El monto no puede superar 9,999,999.99" },
                    valueAsNumber: true
                }}
                errors={errors}
                />

                <InputForm label= "Monto Dinero de Cierre Caja " register={register} name="dineroCierreDetalleCaja" type="text"
                validationRules={{
                    required: {value: true, message: "El monto es obligatorio"},
                    min: { value: 0.01, message: "El monto debe ser mayor a 0" },
                    max: { value: 9999999.99, message: "El monto no puede superar 9,999,999.99" },
                    valueAsNumber: true
                }}
                errors={errors}
                />

                <div className="col-span-1 sm:col-span-2 flex justify-center mt-4">
                      <ButtonForm name={idDetalleCaja ? "Actualizar" : "Registrar"} type="submit" />
                </div> 

            </form>

             {/* Notificaciones */}
             {error && <Notificacion type="error" message={error} />}
            {success && <Notificacion type="success" message={success} />}
        </ContenedorRegistrar>


    );


};

export default RegistrarDetalleCaja;

