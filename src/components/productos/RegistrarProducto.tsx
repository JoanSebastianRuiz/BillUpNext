"use client";

import axios from 'axios';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useProductoContext } from '@/context/ProductoContext';

import { ProductoRequestDTO } from '@/dto/ProductoRequestDTO';

import InputForm from '@/components/form/InputForm';
import SelectForm from '@/components/form/SelectForm';
import Notificacion from '@/components/form/Notificacion';
import ContenedorRegistrar from '../modal/ContenedorRegistrar';
import ButtonForm from '../form/ButtonForm';

const RegistrarProducto = ({ idProducto, obtenerProductos, setModalActualizar, setModalRegistrar }: { idProducto?: number, obtenerProductos: () => void, setModalActualizar?: (value: boolean) => void, setModalRegistrar?: (value: boolean) => void }) => {

    const { categorias } = useProductoContext();

    const [empresas, setEmpresas] = useState<{ idEmpresa: number; nombreEmpresa: string }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProductoRequestDTO>();

    useEffect(() => {
        const fetchProducto = async () => {
            if (idProducto) {
                try {
                    const response = await axios.get(`/api/productos/${idProducto}`);
                    if (response.status === 200) {
                        const producto = response.data;

                        setValue("idEmpresa", producto.idEmpresa || 0);
                        setValue("idCategoria", producto.idCategoria || 0);
                        setValue("nombreProducto", producto.nombreProducto || '');
                        setValue("descripcionProducto", producto.descripcionProducto || '');
                        setValue("precioVentaProducto", producto.precioVentaProducto || 0);
                        setValue("porcentajeDescuentoProducto", producto.porcentajeDescuentoProducto || 0);
                        setValue("stockMinimoProducto", producto.stockMinimoProducto || 0);
                        setValue("stockMaximoProducto", producto.stockMaximoProducto || 0);
                        setValue("estadoProducto", producto.estadoProducto ? producto.estadoProducto.toString() : '');
                    } else {
                        console.error("Error al obtener datos del producto:", response.data.message);
                    }
                } catch (error) {
                    console.error("Error al obtener datos del producto:", error);
                }
            }
        };

        const fetchEmpresas = async () => {
            try {
                const response = await axios.get("/api/empresas");
                if (response.status === 200) {
                    setEmpresas(response.data.map((empresa: { idEmpresa: number; nombreEmpresa: string }) => ({
                        idEmpresa: empresa.idEmpresa,
                        nombreEmpresa: empresa.nombreEmpresa,
                    })));
                } else {
                    console.error("Error al obtener datos de las empresas:", response.data.message);
                }
            } catch (error) {
                console.error("Error al obtener datos de las empresas:", error);
            }
        };

        fetchProducto();
        fetchEmpresas();
    }, [idProducto, setValue]);

    const onSubmit = async (data: ProductoRequestDTO) => {
        try {
            if (idProducto) {
                const respuesta = await axios.put(`/api/productos/${idProducto}`, data);
                setError(null);
                setSuccess(respuesta.data.message);
                obtenerProductos();
                setModalActualizar?.(false);
            } else {
                const respuesta = await axios.post('/api/productos', { ...data, estadoProducto: true });
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
        <ContenedorRegistrar name={idProducto ? "Actualizar producto" : "Registrar producto"}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">

                <SelectForm label="Empresa" register={register} name="idEmpresa"
                    validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                    errors={errors} >
                    <option value="" disabled>Seleccione una empresa</option>
                    {empresas.map(empresa => <option key={empresa.idEmpresa} value={empresa.idEmpresa}>{empresa.nombreEmpresa}</option>)}
                </SelectForm>

                <SelectForm label="Categoría" register={register} name="idCategoria"
                    validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                    errors={errors} >
                    <option value="" disabled>Seleccione una categoría</option>
                    {categorias.map(categoria => <option key={categoria.idCategoria} value={categoria.idCategoria}>{categoria.nombreCategoria}</option>)}
                </SelectForm>

                <InputForm label="Nombre del producto" register={register} name="nombreProducto" type="text"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        maxLength: { value: 50, message: "Máximo 50 caracteres" }
                    }}
                    errors={errors} />

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

                {idProducto && (
                    <SelectForm label="Estado" register={register} name="estadoProducto"
                        validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                        errors={errors} >
                        <option value="" disabled>Seleccione un estado</option>
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </SelectForm>
                )}

                <div className="col-span-1 sm:col-span-2 flex justify-center mt-4">
                    <ButtonForm name={idProducto ? "Actualizar" : "Registrar"} type="submit" />
                </div>
            </form>

            {error && <Notificacion type="error" message={error} />}
            {success && <Notificacion type="success" message={success} />}

        </ContenedorRegistrar>
    );
};

export default RegistrarProducto;