"use client";

import axios from 'axios';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useProductoContext } from '@/context/ProductoContext';
import { useSession } from 'next-auth/react';

import { ProductoRequestDTO } from '@/dto/ProductoRequestDTO';

import InputForm from '@/components/form/InputForm';
import SelectForm from '@/components/form/SelectForm';
import Notificacion from '@/components/form/Notificacion';
import ContenedorRegistrar from '../modal/ContenedorRegistrar';
import ButtonForm from '../form/ButtonForm';
import { ProductoResponseDTO } from '@/dto/ProductoResponseDTO';

const RegistrarProducto = ({ productoSeleccionado, setModalActualizar, setModalRegistrar }: { productoSeleccionado?: ProductoResponseDTO | null, setModalActualizar?: (value: boolean) => void, setModalRegistrar?: (value: boolean) => void }) => {

    const { categorias } = useProductoContext();
    const { obtenerProductos } = useProductoContext();

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProductoRequestDTO>();

    const { data: session } = useSession();
    const idEmpresa = session?.user?.idEmpresa;

    useEffect(() => {
        if (productoSeleccionado) {
            setValue("idEmpresa", productoSeleccionado.idEmpresa || 0);
            setValue("idCategoria", productoSeleccionado.idCategoria || 0);
            setValue("nombreProducto", productoSeleccionado.nombreProducto || '');
            setValue("descripcionProducto", productoSeleccionado.descripcionProducto || '');
            setValue("precioVentaProducto", productoSeleccionado.precioVentaProducto || 0);
            setValue("porcentajeDescuentoProducto", productoSeleccionado.porcentajeDescuentoProducto || 0);
            setValue("stockMinimoProducto", productoSeleccionado.stockMinimoProducto || 0);
            setValue("stockMaximoProducto", productoSeleccionado.stockMaximoProducto || 0);
            setValue("estadoProducto", productoSeleccionado.estadoProducto);
        }
    }, [productoSeleccionado, setValue]);

    const onSubmit = async (data: ProductoRequestDTO) => {
        try {
            if (productoSeleccionado) {
                const datosModificados = { ...data, idEmpresa: idEmpresa, estadoProducto: String(data.estadoProducto) === "true" };
                const respuesta = await axios.put(`/api/productos/${productoSeleccionado.idProducto}`, datosModificados);
                setError(null);
                setSuccess(respuesta.data.message);
                obtenerProductos();
                setModalActualizar?.(false);
            } else {
                const datosModificados = { ...data, idEmpresa: idEmpresa, estadoProducto: true };
                const respuesta = await axios.post('/api/productos', datosModificados);
                setError(null);
                setSuccess(respuesta.data.message);
                obtenerProductos();
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
        <ContenedorRegistrar name={productoSeleccionado ? "Actualizar producto" : "Registrar producto"}>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">

                <InputForm label="Nombre" register={register} name="nombreProducto" type="text"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        maxLength: { value: 50, message: "Máximo 50 caracteres" }
                    }}
                    errors={errors} />

                <SelectForm label="Categoría" register={register} name="idCategoria"
                    validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                    errors={errors} >
                    <option value="" disabled>Seleccione una categoría</option>
                    {categorias.map(categoria => <option key={categoria.idCategoria} value={categoria.idCategoria}>{categoria.nombreCategoria}</option>)}
                </SelectForm>

                <InputForm label="Descripción del producto" register={register} name="descripcionProducto" type="text"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        maxLength: { value: 250, message: "Máximo 250 caracteres" }
                    }}
                    errors={errors} />

                <InputForm label="Precio de venta" register={register} name="precioVentaProducto" type="number"
                    validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                    errors={errors} />

                <InputForm label="Porcentaje de descuento" register={register} name="porcentajeDescuentoProducto" type="number"
                    errors={errors} />

                <InputForm label="Stock mínimo" register={register} name="stockMinimoProducto" type="number"
                    validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                    errors={errors} />

                <InputForm label="Stock máximo" register={register} name="stockMaximoProducto" type="number"
                    validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                    errors={errors} />

                {productoSeleccionado && (
                    <SelectForm label="Estado" register={register} name="estadoProducto"
                        validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                        errors={errors} >
                        <option value="" disabled>Seleccione un estado</option>
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </SelectForm>
                )}

                <div className="col-span-1 sm:col-span-2 flex justify-center mt-4">
                    <ButtonForm name={productoSeleccionado ? "Actualizar" : "Registrar"} type="submit" />
                </div>
            </form>

            {error && <Notificacion type="error" message={error} />}
            {success && <Notificacion type="success" message={success} />}

        </ContenedorRegistrar>
    );
};

export default RegistrarProducto;