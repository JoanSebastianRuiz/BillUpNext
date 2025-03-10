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

const RegistrarTipoMedioPago = ({ idTipoMedioPago, obtenerTiposMedioPago, setModalActualizar , setModalRegistrar }: { idTipoMedioPago? : number, obtenerTiposMedioPago: () => void, setModalActualizar? : (value: boolean) => void, setModalRegistrar? : (value: boolean) => void}) => {
    const [error, setError] = useState<string | null> (null);
    const [success, setSuccess] = useState<string | null> (null);

    


};