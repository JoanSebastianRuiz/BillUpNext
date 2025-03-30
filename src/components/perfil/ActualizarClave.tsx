"use client"

import axios from 'axios';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useUsuarioContext } from '@/context/UsuarioContext';

import { DepartamentoResponseDTO } from '@/dto/DepartamentoResponseDTO';
import { MunicipioResponseDTO } from '@/dto/MunicipioResponseDTO';
import { UsuarioRequestDTO } from '@/dto/UsuarioRequestDTO';
import { isValidEmail } from '@/util/validators/validators';

import InputForm from '@/components/form/InputForm';
import SelectForm from '@/components/form/SelectForm';
import Notificacion from '@/components/form/Notificacion';
import ContenedorRegistrar from '../modal/ContenedorRegistrar';
import ButtonForm from '../form/ButtonForm';


const ActualizarClave = ({ setModalActualizarClave }: { setModalActualizarClave?: (value: boolean) => void }) => {
    const { usuario } = useUsuarioContext();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<UsuarioRequestDTO>();

    const onSubmit = async (data: UsuarioRequestDTO) => {
        try {
            const respuesta = await axios.put(`/api/usuarios/${usuario.idUsuario}/actualizar-clave`, data);
            setError(null);
            setSuccess(respuesta.data.message);
            setModalActualizarClave?.(false);
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                // Capturar el mensaje de error del backend
                const mensajeError = error.response.data?.message;
                setSuccess(null);
                setError(mensajeError);
                console.error("Error de Axios:", mensajeError, error);
            } else {
                // Error desconocido
                setError("Ocurrió un error inesperado");
                console.error("Error desconocido:", error);
            }
        }
    }

    return (
        <ContenedorRegistrar name={"Actualizar contraseña"}>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <InputForm label="Clave actual" register={register} name="claveUsuario" type="text"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        minLength: { value: 8, message: "Mínimo 8 caracteres" },
                        maxLength: { value: 100, message: "Máximo 100 caracteres" },
                        validate: (value: string) => {
                            if (/[A-Z]/.test(value) === false) {
                                return "La contraseña debe contener al menos una letra mayúscula";
                            }
                            if (/[a-z]/.test(value) === false) {
                                return "La contraseña debe contener al menos una letra minúscula";
                            }
                            if (/\d/.test(value) === false) {
                                return "La contraseña debe contener al menos un número";
                            }
                            if (/[!@#$%^&*(),.?":{}|<>]/.test(value) === false) {
                                return "La contraseña debe contener al menos un carácter especial";
                            }
                            if (/\s/.test(value)) {
                                return "La contraseña no debe contener espacios en blanco";
                            }
                            return true;
                        }
                    }}
                    errors={errors} />

                <InputForm label="Contraseña nueva" register={register} name="claveNuevaUsuario" type="text"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        minLength: { value: 8, message: "Mínimo 8 caracteres" },
                        maxLength: { value: 100, message: "Máximo 100 caracteres" },
                        validate: (value: string) => {
                            if (/[A-Z]/.test(value) === false) {
                                return "La contraseña debe contener al menos una letra mayúscula";
                            }
                            if (/[a-z]/.test(value) === false) {
                                return "La contraseña debe contener al menos una letra minúscula";
                            }
                            if (/\d/.test(value) === false) {
                                return "La contraseña debe contener al menos un número";
                            }
                            if (/[!@#$%^&*(),.?":{}|<>]/.test(value) === false) {
                                return "La contraseña debe contener al menos un carácter especial";
                            }
                            if (/\s/.test(value)) {
                                return "La contraseña no debe contener espacios en blanco";
                            }
                            if (value == watch("claveUsuario")) {
                                return "La contraseña nueva no puede ser igual a la contraseña actual";
                            }
                            return true;
                        }
                    }}
                    errors={errors} />

                <InputForm label="Confirmar contraseña" register={register} name="confirmarClaveUsuario" type="text"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        minLength: { value: 8, message: "Mínimo 8 caracteres" },
                        maxLength: { value: 100, message: "Máximo 100 caracteres" },
                        validate: (value: string) => {
                            if (/[A-Z]/.test(value) === false) {
                                return "La contraseña debe contener al menos una letra mayúscula";
                            }
                            if (/[a-z]/.test(value) === false) {
                                return "La contraseña debe contener al menos una letra minúscula";
                            }
                            if (/\d/.test(value) === false) {
                                return "La contraseña debe contener al menos un número";
                            }
                            if (/[!@#$%^&*(),.?":{}|<>]/.test(value) === false) {
                                return "La contraseña debe contener al menos un carácter especial";
                            }
                            if (/\s/.test(value)) {
                                return "La contraseña no debe contener espacios en blanco";
                            }
                            if (value == watch("claveUsuario")) {
                                return "La contraseña nueva no puede ser igual a la contraseña actual";
                            }
                            if (value != watch("claveNuevaUsuario")) {
                                return "Las contraseñas no coinciden";
                            }
                            return true;
                        }
                    }}
                    errors={errors} />

                <div className="col-span-1 sm:col-span-2 flex justify-center mt-4">
                    <ButtonForm name={"Actualizar"} type="submit" />
                </div>
            </form>

            {/* Notificaciones */}
            {error && <Notificacion type="error" message={error} />}
            {success && <Notificacion type="success" message={success} />}

        </ContenedorRegistrar>
    )
};

export default ActualizarClave;

