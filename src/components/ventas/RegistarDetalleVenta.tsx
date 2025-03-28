"use client"

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import InputForm from '@/components/form/InputForm';
import SelectForm from '@/components/form/SelectForm';
import Notificacion from '@/components/form/Notificacion';
import ContenedorRegistrar from '../modal/ContenedorRegistrar';
import ButtonForm from '../form/ButtonForm';
import { useProductoContext } from '@/context/ProductoContext';
import { DetalleVentaDTO } from '@/dto/DetalleVentaDTO';

interface RegistrarDetalleVentaProps {
    detalleVenta?: DetalleVentaDTO | null;
    setModal: (value: boolean) => void;
    detallesVenta: DetalleVentaDTO[];
    setDetallesVenta: (detalles: DetalleVentaDTO[]) => void;
    contadorDetalles: number;
    setContadorDetalles: (numero: number) => void;
}

const RegistrarDetalleVenta = ({ detalleVenta, detallesVenta, setDetallesVenta, setModal, contadorDetalles, setContadorDetalles }: RegistrarDetalleVentaProps) => {

    const { productos } = useProductoContext();
    const [productosFiltrados, setProductosFiltrados] = useState(productos);
    const [success, setSuccess] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<DetalleVentaDTO>();
    const idProducto = watch("idProducto");
    const cantidadDetalleVenta = watch("cantidadDetalleVenta");

    useEffect(() => {
        let filtrados = [...productos]
        for (const detalle of detallesVenta) {
            filtrados = filtrados.filter(producto => producto.idProducto !== detalle.idProducto);
        }
        setProductosFiltrados(filtrados);

        const valor = cantidadDetalleVenta * (productos.find(producto => producto.idProducto === idProducto)?.valorTotalProducto || 0);
        setValue("valorTotalDetalleVenta", valor);
    }, [productos, idProducto, cantidadDetalleVenta]);

    useEffect(() => {
        if (detalleVenta) {
            setValue("idProducto", detalleVenta.idProducto);
            setValue("cantidadDetalleVenta", detalleVenta.cantidadDetalleVenta);
            setValue("valorTotalDetalleVenta", detalleVenta.valorTotalDetalleVenta);
        }
    }, [detalleVenta, setValue]);


    const onSubmit = async (data: DetalleVentaDTO) => {
        const producto = productos.find(producto => producto.idProducto === parseInt(data.idProducto.toString()));
        const valorDescuentoDetalleVenta = (producto?.valorDescuentoProducto ?? 0) * data.cantidadDetalleVenta;
        const valorImpuestosDetalleVenta = (producto?.valorImpuestoProducto ?? 0) * data.cantidadDetalleVenta;

        if (detalleVenta) {
            const dataModificada = { ...data, idDetalleVenta: contadorDetalles + 1, idProducto: parseInt(data.idProducto.toString()), cantidadDetalleVenta: parseInt(data.cantidadDetalleVenta.toString()), valorDescuentoDetalleVenta, valorImpuestosDetalleVenta };

            const detallesVentaActualizados = detallesVenta.map(detalle =>
                detalle.idDetalleVenta === detalleVenta.idDetalleVenta ? dataModificada : detalle
            );
            setDetallesVenta(detallesVentaActualizados);
            setSuccess("Producto actualizado");
            setModal(false);

        } else {
            const dataModificada = { ...data, idDetalleVenta: contadorDetalles + 1, idProducto: parseInt(data.idProducto.toString()), cantidadDetalleVenta: parseInt(data.cantidadDetalleVenta.toString()), valorDescuentoDetalleVenta, valorImpuestosDetalleVenta };
            setContadorDetalles(contadorDetalles + 1);
            const detallesVentaActualizados: DetalleVentaDTO[] = [...detallesVenta, dataModificada];
            setDetallesVenta(detallesVentaActualizados);
            setSuccess("Producto agregado");
            setModal(false);
            reset();
        }
    }


    return (
        <ContenedorRegistrar name={detalleVenta ? "Actualizar producto" : "Registrar producto"}>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">

                <SelectForm label="Producto" register={register} name="idProducto"
                    validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                    errors={errors}>
                    <option value="" disabled>Seleccione un producto</option>
                    {productosFiltrados.map(producto => (
                        <option key={producto.idProducto} value={producto.idProducto}>{producto.nombreProducto}</option>
                    ))}
                </SelectForm>


                <InputForm label="Cantidad" register={register} name="cantidadDetalleVenta" type="number"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        min: { value: 1, message: "Mínimo 1" }
                    }} errors={errors} />


                <InputForm label="Valor" register={register} name="valorTotalDetalleVenta" type="number" disabled={true} dinero={true}
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        min: { value: 1, message: "Mínimo 1" }
                    }} errors={errors} />


                <div className="col-span-1 sm:col-span-2 flex justify-center mt-4">
                    <ButtonForm name={detalleVenta ? "Actualizar" : "Registrar"} type="submit" />
                </div>
            </form>

            {/* Notificaciones */}
            {success && <Notificacion type="success" message={success} />}

        </ContenedorRegistrar>
    )
};

export default RegistrarDetalleVenta;

