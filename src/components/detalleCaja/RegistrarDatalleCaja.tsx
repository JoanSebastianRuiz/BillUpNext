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
import { data } from "framer-motion/client";


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

                

            }


        } catch (error) {
            
        }

    }


}

