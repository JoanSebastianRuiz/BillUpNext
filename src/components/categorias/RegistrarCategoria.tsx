"use client";

import axios from 'axios';

import { set, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useEmpresaContext } from '@/context/EmpresaContext';
import { useSession } from 'next-auth/react';

import { CategoriaDTO } from '@/dto/CategoriaDTO';

import InputForm from '@/components/form/InputForm';
import SelectForm from '@/components/form/SelectForm';
import Notificacion from '@/components/form/Notificacion';
import ContenedorRegistrar from '../modal/ContenedorRegistrar';
import ButtonForm from '../form/ButtonForm';
import { useProductoContext } from '@/context/ProductoContext';

const RegistrarCategoria = ({ categoriaSeleccionada, setModalActualizar, setModalRegistrar }: { categoriaSeleccionada?: CategoriaDTO | null, setModalActualizar?: (value: boolean) => void, setModalRegistrar?: (value: boolean) => void }) => {

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<CategoriaDTO>();
    const { obtenerCategorias } = useProductoContext();

    const { data: session } = useSession();
    const idEmpresa = session?.user?.idEmpresa;

    useEffect(() => {
        if (categoriaSeleccionada) {
            setValue("nombreCategoria", categoriaSeleccionada.nombreCategoria || '');
            setValue("estadoCategoria", categoriaSeleccionada.estadoCategoria ? true : false);
        }
    }, [categoriaSeleccionada, setValue]);

    const onSubmit = async (data: CategoriaDTO) => {
        try {
            if (categoriaSeleccionada) {
                const datosModificados = { ...data, idEmpresa: idEmpresa, estadoCategoria: String(data.estadoCategoria) === "true" }
                const respuesta = await axios.put(`/api/categorias/${categoriaSeleccionada?.idCategoria}`, datosModificados);
                setError(null);
                setSuccess(respuesta.data.message);
                obtenerCategorias();
                setModalActualizar?.(false);
            } else {
                const datosModificados = { ...data, idEmpresa: idEmpresa, estadoCategoria: true }
                const respuesta = await axios.post('/api/categorias', datosModificados);
                setError(null);
                setSuccess(respuesta.data.message);
                obtenerCategorias();
                setModalRegistrar?.(false);
            }
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
        <ContenedorRegistrar name={categoriaSeleccionada ? "Actualizar categoría" : "Registrar categoría"}>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-1 gap-x-6 gap-y-4">
                <InputForm label="Nombre" register={register} name="nombreCategoria" type="text"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        maxLength: { value: 50, message: "Máximo 50 caracteres" }
                    }}
                    errors={errors} />

                {categoriaSeleccionada && (
                    <SelectForm label="Estado" register={register} name="estadoCategoria"
                        validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                        errors={errors} >
                        <option value="" disabled>Seleccione un estado</option>
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </SelectForm>
                )}

                <div className="col-span-1 sm:col-span-2 flex justify-center mt-4">
                    <ButtonForm name={categoriaSeleccionada ? "Actualizar" : "Registrar"} type="submit" />
                </div>
            </form>

            {error && <Notificacion type="error" message={error} />}
            {success && <Notificacion type="success" message={success} />}

        </ContenedorRegistrar>
    );
};

export default RegistrarCategoria;