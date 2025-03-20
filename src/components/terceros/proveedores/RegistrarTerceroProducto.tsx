"use client"

import axios from 'axios';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useTerceroContext } from '@/context/TerceroContext';

import InputForm from '@/components/form/InputForm';
import SelectForm from '@/components/form/SelectForm';
import Notificacion from '@/components/form/Notificacion';
import ContenedorRegistrar from '../../modal/ContenedorRegistrar';
import ButtonForm from '../../form/ButtonForm';
import { TerceroProductoDTO } from '@/dto/TerceroProductoDTO';
import { useProductoContext } from '@/context/ProductoContext';


const RegistrarTerceroProducto = ({ idTerceroProductoSeleccionado, setModalActualizar, setModalRegistrar, idTercero }: { idTerceroProductoSeleccionado?: number, setModalActualizar?: (value: boolean) => void, setModalRegistrar?: (value: boolean) => void, idTercero?: number }) => {

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<TerceroProductoDTO>();

    const { obtenerProveedoresProducto, proveedoresProducto } = useTerceroContext();
    const terceroProductoSeleccionado = proveedoresProducto.find(p => p.idTerceroProducto === idTerceroProductoSeleccionado);
    const { productos } = useProductoContext();

    const productosFiltrados = productos.filter(
        p => !proveedoresProducto.some(pp => pp.idProducto === p.idProducto && pp.idTercero === idTercero)
    );


    useEffect(() => {
        if (terceroProductoSeleccionado) {
            setValue("precioCompraTerceroProducto", terceroProductoSeleccionado?.precioCompraTerceroProducto ?? 0);
            setValue("estadoTerceroProducto", terceroProductoSeleccionado?.estadoTerceroProducto ?? true);
        }

    }, [terceroProductoSeleccionado, setValue]);


    const onSubmit = async (data: TerceroProductoDTO) => {
        try {
            if (terceroProductoSeleccionado) {
                const datosModificados = { ...data, idTercero: idTercero ? parseInt(idTercero.toString()) : undefined, idProducto: terceroProductoSeleccionado.idProducto, estadoTerceroProducto: String(data.estadoTerceroProducto) === "true", precioCompraTerceroProducto: parseFloat(data.precioCompraTerceroProducto.toString()) };

                const respuesta = await axios.put(`/api/tercero-producto/${terceroProductoSeleccionado.idTerceroProducto}`, datosModificados);
                setError(null);
                setSuccess(respuesta.data.message);
                obtenerProveedoresProducto();
                setModalActualizar?.(false);
            } else {
                const datosModificados = { ...data, idTercero: idTercero ? parseInt(idTercero.toString()) : undefined, estadoTerceroProducto: true, precioCompraTerceroProducto: parseFloat(data.precioCompraTerceroProducto.toString()) };

                const respuesta = await axios.post("/api/tercero-producto", datosModificados);
                setError(null);
                setSuccess(respuesta.data.message);
                obtenerProveedoresProducto();
                setModalRegistrar?.(false);
            }
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
        <ContenedorRegistrar name={
            terceroProductoSeleccionado ? "Actualizar información" : "Registrar producto"}>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-1 gap-x-6 gap-y-4">
                {!terceroProductoSeleccionado && (
                    <SelectForm label="Producto" register={register} name="idProducto"
                        validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                        errors={errors} >
                        <option value="" disabled>Seleccione un producto</option>
                        {productosFiltrados.length > 0?(
                            productosFiltrados.map(proveedorProducto => {
                                const producto = productos.find(p => p.idProducto === proveedorProducto.idProducto);
                                return <option key={proveedorProducto.idProducto} value={proveedorProducto.idProducto}>{producto?.nombreProducto}</option>
                            })
                        ) : (
                            <option value="" disabled>No hay productos disponibles</option>
                        )}
                        
                    </SelectForm>
                )}

                <InputForm label="Precio de compra" type="number" register={register} name="precioCompraTerceroProducto"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        min: { value: 0, message: "El precio de compra debe ser mayor a 0" }
                    }} errors={errors} />

                {terceroProductoSeleccionado && (
                    <SelectForm label="Estado" register={register} name="estadoTerceroProducto"
                        validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                        errors={errors} >
                        <option value="" disabled>Seleccione un estado</option>
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </SelectForm>
                )}

                <div className="col-span-1 sm:col-span-1 flex justify-center mt-4">
                    <ButtonForm name={terceroProductoSeleccionado ? "Actualizar" : "Registrar"} type="submit" />
                </div>
            </form>

            {/* Notificaciones */}
            {error && <Notificacion type="error" message={error} />}
            {success && <Notificacion type="success" message={success} />}

        </ContenedorRegistrar >
    )
};

export default RegistrarTerceroProducto;

