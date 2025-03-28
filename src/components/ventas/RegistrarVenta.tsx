"use client";

import axios from 'axios';

import { useForm } from 'react-hook-form';
import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useVentaContext } from '@/context/VentaContext';
import { useProductoContext } from '@/context/ProductoContext';
import { Pencil, Trash } from 'lucide-react';
import { useCajaContext } from '@/context/CajaContext';

import { VentaDTO } from '@/dto/VentaDTO';
import { DetalleVentaDTO } from '@/dto/DetalleVentaDTO';


import Notificacion from '@/components/form/Notificacion';
import ContenedorRegistrar from '../modal/ContenedorRegistrar';
import ButtonForm from '../form/ButtonForm';
import TextareaForm from '../form/TextAreaForm';
import Modal from '../modal/Modal';
import Table from '../common/Table';
import TableRow from '../common/TableRow';
import TableData from '../common/TableData';
import TableMessage from '../common/TableMessage';
import ControlesPaginacion from '../common/ControlesPaginacion';
import BotonAccionCard from '../cards/BotonAccionCard';
import RegistrarDetalleVenta from '@/components/ventas/RegistarDetalleVenta';
import BotonSeleccion from '../common/BotonSeleccion';
import SelectForm from '../form/SelectForm';
import { useTerceroContext } from '@/context/TerceroContext';


const RegistrarVenta = ({ setModal }: { setModal?: (value: boolean) => void }) => {
    const [modalRegistrarDetalle, setModalRegistrarDetalle] = useState(false);
    const [modalActualizarDetalle, setModalActualizarDetalle] = useState(false);
    const [contadorDetalles, setContadorDetalles] = useState(0);
    const [clienteEmpresa, setClienteEmpresa] = useState<boolean>(false);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const { productos } = useProductoContext();
    const [detallesVenta, setDetallesVenta] = useState<DetalleVentaDTO[]>([]);
    const [detalleSeleccionado, setDetalleSeleccionado] = useState<DetalleVentaDTO | null>(null);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<VentaDTO>();
    const { obtenerVentas, obtenerDetallesVentas, ubicacionesVenta, tiposMedioPago } = useVentaContext();
    const { cajaSeleccionada } = useCajaContext();
    const { clientesEmpresa, clientesPersona } = useTerceroContext();
    const tipoClienteRef = useRef<HTMLSelectElement>(null);

    const { data: session } = useSession();
    const idUsuario = session?.user?.idUsuario;

    const onSubmit = async (data: VentaDTO) => {
        try {
            if (!detallesVenta.length) {
                setError("Debe agregar al menos un producto");
                return;
            }
            const detallesVentaModificados = detallesVenta.map((detalle) => {
                const detalleVentaSinId = { ...detalle };
                delete detalleVentaSinId.idDetalleVenta;
                return detalleVentaSinId;
            });

            const valorTotalVenta = detallesVenta.reduce((acc, detalle) => acc + detalle.valorTotalDetalleVenta, 0);
            const datosModificados = { ...data, idUsuario, valorTotalVenta, detallesVenta: detallesVentaModificados, idCaja: cajaSeleccionada?.idCaja, idUbicacionVenta: Number(data.idUbicacionVenta), idTipoMedioPago: Number(data.idTipoMedioPago), idTercero: Number(data.idTercero) };
            const respuesta = await axios.post('/api/ventas', datosModificados);
            setError(null);
            setSuccess(respuesta.data.message);
            obtenerVentas();
            obtenerDetallesVentas();
            setModal?.(false);
            setContadorDetalles(0);

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

    const titulosTabla = [
        { titulo: "Producto", center: false },
        { titulo: "Cantidad", center: false },
        { titulo: "Detalles", center: false },
        { titulo: "Acciones", center: true },
    ];

    // Paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(4); // Número de detalles de detalle por página
    const indexOfLastDetalle = currentPage * itemsPerPage;
    const indexOfFirstDetalle = indexOfLastDetalle - itemsPerPage;
    const detallesVentaActuales = detallesVenta.slice(indexOfFirstDetalle, indexOfLastDetalle);
    const totalPages = Math.ceil(detallesVenta.length / itemsPerPage);

    const cambiarTipoProveedor = () => {
        const tipoCliente = tipoClienteRef.current?.value;

        if (tipoCliente !== undefined && tipoCliente !== "") {
            setClienteEmpresa(tipoCliente === "true");
        }
    };


    return (
        <ContenedorRegistrar name={"Registrar venta"}>

            {/* Botón "Agregar producto" alineado a la derecha */}
            <div className="flex justify-end mb-4">
                <BotonSeleccion seleccion={true} name={"Agregar producto"} onClick={() => setModalRegistrarDetalle(true)} />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div className="flex flex-col gap-y-2 w-full">
                    <label htmlFor="tipoCliente" className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        Tipo de cliente
                    </label>

                    <select
                        id="tipoCliente"
                        className="w-full max-w-md h-[40px] rounded-lg border px-3 py-2 transition-all duration-200
                    bg-gray-100 text-gray-900 border-gray-400 focus:ring-2 focus:ring-gray-500
                    dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-gray-400"
                        onChange={cambiarTipoProveedor}
                        ref={tipoClienteRef}
                        defaultValue="false"
                    >
                        <option value="true">Empresa</option>
                        <option value="false">Persona</option>
                    </select>
                </div>


                <SelectForm label="Cliente" register={register} name="idTercero"
                    validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                    errors={errors}>
                    <option value="" disabled>Seleccione un cliente</option>
                    {clienteEmpresa ?
                        clientesEmpresa.map(cliente => <option key={cliente.idTercero} value={cliente.idTercero}>{cliente.nombreTercero}</option>) :
                        clientesPersona.map(cliente => <option key={cliente.idTercero} value={cliente.idTercero}>{`${cliente.nombreTercero} ${cliente.apellidoTercero}`}</option>)}
                </SelectForm>

                <SelectForm label="Ubicación de venta" register={register} name="idUbicacionVenta"
                    validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                    errors={errors} >
                    <option value="" disabled>Seleccione una ubicacion</option>
                    {ubicacionesVenta.map(ubicacion => <option key={ubicacion.idUbicacionVenta} value={ubicacion.idUbicacionVenta}>{ubicacion.nombreUbicacionVenta}</option>)}
                </SelectForm>

                <SelectForm label="Medio de pago" register={register} name="idTipoMedioPago"
                    validationRules={{ required: { value: true, message: "Este campo es obligatorio" } }}
                    errors={errors} >
                    <option value="" disabled>Seleccione una medio de pago</option>
                    {tiposMedioPago.map(tipoMedioPago => <option key={tipoMedioPago.idTipoMedioPago} value={tipoMedioPago.idTipoMedioPago}>{tipoMedioPago.nombreTipoMedioPago}</option>)}
                </SelectForm>

                <TextareaForm label="Observación" register={register} name="observacionVenta"
                    validationRules={{
                        maxLength: { value: 250, message: "Máximo 250 caracteres" }
                    }}
                    errors={errors} />

                <div className="col-span-1 sm:col-span-2">
                    <Table titulos={titulosTabla}>
                        {detallesVentaActuales.length > 0 ? (
                            detallesVentaActuales.map((detalle) => {
                                const producto = productos.find((producto) => producto.idProducto == detalle.idProducto);

                                return (
                                    <TableRow key={detalle.idDetalleVenta}>
                                        <TableData center={false} width='20%' smallText={true}>
                                            {producto?.nombreProducto}
                                        </TableData>
                                        <TableData center={true} width='15%' smallText={true}>
                                            {detalle.cantidadDetalleVenta}
                                        </TableData>
                                        <TableData center={false} width='30%' smallText={true}>
                                            <div className="flex flex-col">
                                                <span><strong>Valor:</strong> ${detalle.valorTotalDetalleVenta}</span>
                                                <span><strong>Descuento:</strong> ${detalle.valorDescuentoDetalleVenta}</span>
                                                <span><strong>Impuestos:</strong> ${detalle.valorImpuestosDetalleVenta}</span>
                                            </div>
                                        </TableData>
                                        <TableData center={true} width='15%'>
                                            <div className="flex justify-center gap-2">
                                                <BotonAccionCard
                                                    Symbol={Pencil}
                                                    onClick={() => {
                                                        setDetalleSeleccionado(detalle);
                                                        setModalActualizarDetalle(true);
                                                    }}
                                                    h={5}
                                                />
                                                <BotonAccionCard
                                                    Symbol={Trash}
                                                    onClick={() => {
                                                        setDetalleSeleccionado(detalle);
                                                        setDetallesVenta(detallesVenta.filter((detalleCompra) => detalleCompra.idDetalleVenta !== detalle.idDetalleVenta));
                                                    }}
                                                    h={5}
                                                />
                                            </div>
                                        </TableData>
                                    </TableRow>)
                            })) : (

                            <TableMessage message="No se han agregado productos" colSpan={4} />
                        )}
                    </Table>
                </div>

                <div className="col-span-1 sm:col-span-2 flex justify-center">
                    <ControlesPaginacion
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                    />
                </div>

                <div className="col-span-1 sm:col-span-2 flex justify-center mt-4">
                    <ButtonForm name={"Registrar"} type="submit" />
                </div>
            </form>

            {error && <Notificacion type="error" message={error} />}
            {success && <Notificacion type="success" message={success} />}

            <Modal isOpen={modalRegistrarDetalle} setIsOpen={() => setModalRegistrarDetalle(false)}>
                <RegistrarDetalleVenta contadorDetalles={contadorDetalles} setModal={setModalRegistrarDetalle} detallesVenta={detallesVenta} setDetallesVenta={setDetallesVenta} setContadorDetalles={setContadorDetalles} />
            </Modal>

            <Modal isOpen={modalActualizarDetalle} setIsOpen={() => setModalActualizarDetalle(false)}>
                <RegistrarDetalleVenta contadorDetalles={contadorDetalles} detalleVenta={detalleSeleccionado} setModal={setModalActualizarDetalle} detallesVenta={detallesVenta} setDetallesVenta={setDetallesVenta} setContadorDetalles={setContadorDetalles} />
            </Modal>

        </ContenedorRegistrar>
    );
};

export default RegistrarVenta;