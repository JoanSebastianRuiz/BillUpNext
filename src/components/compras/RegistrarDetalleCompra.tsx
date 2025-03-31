"use client"

import { useForm } from 'react-hook-form';
import { useEffect, useState, useRef } from 'react';

import InputForm from '@/components/form/InputForm';
import SelectForm from '@/components/form/SelectForm';
import Notificacion from '@/components/form/Notificacion';
import ContenedorRegistrar from '../modal/ContenedorRegistrar';
import ButtonForm from '../form/ButtonForm';
import { DetalleCompraDTO } from '@/dto/DetalleCompraDTO';
import { useTerceroContext } from '@/context/TerceroContext';
import { useProductoContext } from '@/context/ProductoContext';

interface RegistrarDetalleCompraProps {
    detalleCompra?: DetalleCompraDTO | null;
    setModal: (value: boolean) => void;
    detallesCompra: DetalleCompraDTO[];
    setDetallesCompra: (detalles: DetalleCompraDTO[]) => void;
    contadorDetalles: number;
    setContadorDetalles: (numero: number) => void;
}

const RegistrarDetalleCompra = ({ detalleCompra, detallesCompra, setDetallesCompra, setModal, contadorDetalles, setContadorDetalles }: RegistrarDetalleCompraProps) => {

    const { proveedoresProducto, proveedoresEmpresa, proveedoresPersona } = useTerceroContext();
    const { productos } = useProductoContext();
    const [success, setSuccess] = useState<string | null>(null);
    const [proveedorEmpresa, setProveedorEmpresa] = useState<boolean>(true);
    const tipoProveedorRef = useRef<HTMLSelectElement>(null);
    const [tipoProveedor, setTipoProveedor] = useState<string>("");

    const cambiarTipoProveedor = () => {
        const tipo = tipoProveedorRef.current?.value;
        if (tipo !== undefined && tipo !== "") {
            setTipoProveedor(tipo);
            setProveedorEmpresa(tipo === "true");
        }
    };

    useEffect(() => {
        // Se activa cuando tipoProveedor cambia, forzando la actualización del select de proveedores
    }, [tipoProveedor]);

    useEffect(() => {
        if (tipoProveedorRef.current?.value === "true") {
            setProveedorEmpresa(true);
        } else if (tipoProveedorRef.current?.value === "false") {
            setProveedorEmpresa(false);
        }
    }, [tipoProveedorRef.current?.value]);

    const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<DetalleCompraDTO>();
    const idTercero = watch("idTercero");
    const idProducto = watch("idProducto");
    const cantidadDetalleCompra = watch("cantidadDetalleCompra");
    const [proveedoresProductoFiltrados, setProveedoresProductoFiltrados] = useState(proveedoresProducto);

    useEffect(() => {
        let filtrados = proveedoresProducto.filter(pp => pp.idTercero == idTercero);
        for (const detalle of detallesCompra) {
            if (detalle.idTercero == idTercero) {
                filtrados = filtrados.filter(pp => pp.idProducto !== detalle.idProducto);
            }
        }
        setProveedoresProductoFiltrados(filtrados);

        const valor = cantidadDetalleCompra * (proveedoresProducto.find(pp => pp.idTercero == idTercero && pp.idProducto == idProducto)?.precioCompraTerceroProducto || 0);
        setValue("valorDetalleCompra", valor);
    }, [idTercero, proveedoresProducto, idProducto, cantidadDetalleCompra]);

    useEffect(() => {
        if (detalleCompra) {
            setProveedoresProductoFiltrados(proveedoresProducto.filter(pp => pp.idTercero === detalleCompra.idTercero));
            setValue("idTercero", detalleCompra.idTercero);
            setValue("idProducto", detalleCompra.idProducto);
            setValue("cantidadDetalleCompra", detalleCompra.cantidadDetalleCompra);
            setValue("valorDetalleCompra", detalleCompra.valorDetalleCompra);
        } else {
            setValue("idProducto", "");
            setValue("idTercero", "");
            tipoProveedorRef.current!.value = "";
        }
    }, [detalleCompra, setValue]);


    const onSubmit = async (data: DetalleCompraDTO) => {
        if (detalleCompra) {
            const dataModificada = { ...data, idDetalleCompra: detalleCompra.idDetalleCompra, idTercero: parseInt(detalleCompra.idTercero.toString()), idProducto: parseInt(detalleCompra.idProducto.toString()), cantidadDetalleCompra: parseInt(data.cantidadDetalleCompra.toString()) };

            const detallesCompraActualizados = detallesCompra.map(detalle =>
                detalle.idDetalleCompra === detalleCompra.idDetalleCompra ? dataModificada : detalle
            );
            setDetallesCompra(detallesCompraActualizados);
            setSuccess("Producto actualizado");
            setModal(false);
        } else {
            const dataModificada = { ...data, idDetalleCompra: contadorDetalles + 1, idTercero: parseInt(data.idTercero.toString()), idProducto: parseInt(data.idProducto.toString()), cantidadDetalleCompra: parseInt(data.cantidadDetalleCompra.toString()) };
            setContadorDetalles(contadorDetalles + 1);
            const detallesCompraActualizados: DetalleCompraDTO[] = [...detallesCompra, dataModificada];
            setDetallesCompra(detallesCompraActualizados);
            setSuccess("Producto agregado");
            setModal(false);
            reset();
        }
    }



    return (
        <ContenedorRegistrar name={detalleCompra ? "Actualizar producto" : "Registrar producto"}>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {!detalleCompra &&
                    <div className="flex flex-col gap-y-2 w-full">
                        <label htmlFor="tipoProveedor" className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                            Tipo de proveedor
                        </label>

                        <select
                            id="tipoProveedor"
                            className="w-full max-w-md h-[40px] rounded-lg border px-3 py-2 transition-all duration-200
                    bg-gray-100 text-gray-900 border-gray-400 focus:ring-2 focus:ring-gray-500
                    dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-gray-400"
                            onChange={cambiarTipoProveedor}
                            ref={tipoProveedorRef}
                        >
                            <option value="" disabled>Seleccione un tipo de proveedor</option>
                            <option value="true">Empresa</option>
                            <option value="false">Persona</option>
                        </select>
                    </div>}

                {!detalleCompra &&
                    <SelectForm label="Proveedor" register={register} name="idTercero"
                        validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                        errors={errors}>
                        <option value="" disabled>
                            {tipoProveedor === ""
                                ? "Seleccione un tipo de proveedor"
                                : tipoProveedor === "true"
                                    ? proveedoresEmpresa.length > 0
                                        ? "Seleccione un proveedor"
                                        : "No hay proveedores disponibles"
                                    : proveedoresPersona.length > 0
                                        ? "Seleccione un proveedor"
                                        : "No hay proveedores disponibles"}
                        </option>
                        {tipoProveedorRef.current?.value === "" ?
                            <option value="" disabled>Seleccione un tipo de proveedor</option> :
                            proveedorEmpresa ?
                                proveedoresEmpresa.map(proveedor => <option key={proveedor.idTercero} value={proveedor.idTercero}>{proveedor.nombreTercero}</option>) :
                                proveedoresPersona.map(proveedor => <option key={proveedor.idTercero} value={proveedor.idTercero}>{`${proveedor.nombreTercero} ${proveedor.apellidoTercero}`}</option>)}
                    </SelectForm>}


                {!detalleCompra &&
                    <SelectForm label="Producto" register={register} name="idProducto"
                        validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                        errors={errors}>
                        <option value="" disabled>{proveedoresProductoFiltrados.length > 0 ? "Seleccione un producto" : "No hay productos disponibles"}</option>
                        {proveedoresProductoFiltrados.map(pp => {
                            const producto = productos.find(producto => producto.idProducto === pp.idProducto);
                            return <option key={pp.idTerceroProducto} value={pp.idProducto}>{producto?.nombreProducto}</option>
                        })}
                    </SelectForm>}


                <InputForm label="Cantidad" register={register} name="cantidadDetalleCompra" type="number"
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        min: { value: 1, message: "Mínimo 1" }
                    }} errors={errors} />


                <InputForm label="Valor" register={register} name="valorDetalleCompra" type="number" disabled={true} dinero={true}
                    validationRules={{
                        required: { value: true, message: "Este campo es obligatorio" },
                        min: { value: 1, message: "Mínimo 1" }
                    }} errors={errors} />


                <div className="col-span-1 sm:col-span-2 flex justify-center mt-4">
                    <ButtonForm name={detalleCompra ? "Actualizar" : "Registrar"} type="submit" />
                </div>
            </form>

            {/* Notificaciones */}
            {success && <Notificacion type="success" message={success} />}

        </ContenedorRegistrar>
    )
};

export default RegistrarDetalleCompra;

