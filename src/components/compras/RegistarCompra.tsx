"use client";

import axios from 'axios';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCompraContext } from '@/context/CompraContext';
import { useTerceroContext } from '@/context/TerceroContext';
import { useProductoContext } from '@/context/ProductoContext';
import { Pencil, Trash } from 'lucide-react';

import { CompraDTO } from '@/dto/CompraDTO';
import { DetalleCompraDTO } from '@/dto/DetalleCompraDTO';


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
import RegistrarDetalleCompra from './RegistrarDetalleCompra';
import BotonSeleccion from '../common/BotonSeleccion';


const RegistrarCompra = ({ setModal }: { setModal?: (value: boolean) => void }) => {
    const [modalRegistrarDetalle, setModalRegistrarDetalle] = useState(false);
    const [modalActualizarDetalle, setModalActualizarDetalle] = useState(false);
    const [contadorDetalles, setContadorDetalles] = useState(0);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const { proveedoresEmpresa, proveedoresPersona } = useTerceroContext();
    const { productos } = useProductoContext();
    const [detallesCompra, setDetallesCompra] = useState<DetalleCompraDTO[]>([]);
    const [detalleSeleccionado, setDetalleSeleccionado] = useState<DetalleCompraDTO | null>(null);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<CompraDTO>();
    const { obtenerCompras, obtenerDetallesCompras } = useCompraContext();
    const { obtenerProductos } = useProductoContext();

    const { data: session } = useSession();
    const idUsuario = session?.user?.idUsuario;

    const onSubmit = async (data: CompraDTO) => {
        try {
            if (!detallesCompra.length) {
                setError("Debe agregar al menos un producto");
                return;
            }
            const detallesCompraModificados = detallesCompra.map((detalle) => {
                const detalleCompraSinId = { ...detalle };
                delete detalleCompraSinId.idDetalleCompra;
                return detalleCompraSinId;
            });

            const valorTotalCompra = detallesCompra.reduce((acc, detalle) => acc + detalle.valorDetalleCompra, 0);
            const datosModificados = { ...data, idUsuario, valorTotalCompra, detallesCompra: detallesCompraModificados };
            const respuesta = await axios.post('/api/compras', datosModificados);
            setError(null);
            setSuccess(respuesta.data.message);
            obtenerCompras();
            obtenerDetallesCompras();
            obtenerProductos();
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
        { titulo: "Proveedor", center: false },
        { titulo: "Cantidad", center: false },
        { titulo: "Valor", center: false },
        { titulo: "Acciones", center: true }
    ]

    // Paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(4); // Número de detalles de detalle por página
    const indexOfLastDetalle = currentPage * itemsPerPage;
    const indexOfFirstDetalle = indexOfLastDetalle - itemsPerPage;
    const detallesCompraActuales = detallesCompra.slice(indexOfFirstDetalle, indexOfLastDetalle);
    const totalPages = Math.ceil(detallesCompra.length / itemsPerPage);



    return (
        <ContenedorRegistrar name={"Registrar compra"}>

            {/* Botón "Agregar producto" alineado a la derecha */}
            <div className="flex justify-end mb-4">
                <BotonSeleccion seleccion={true} name={"Agregar producto"} onClick={() => setModalRegistrarDetalle(true)} />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <TextareaForm label="Observación" register={register} name="observacionCompra"
                    validationRules={{
                        maxLength: { value: 250, message: "Máximo 250 caracteres" }
                    }}
                    errors={errors} />

                <div className="col-span-1 sm:col-span-2">
                    <Table titulos={titulosTabla}>
                        {detallesCompraActuales.length > 0 ? (
                            detallesCompraActuales.map((detalle) => {
                                const producto = productos.find((producto) => producto.idProducto == detalle.idProducto);
                                const proveedorEmpresa = proveedoresEmpresa.find((proveedor) => proveedor.idTercero == detalle.idTercero);
                                let proveedorPersona;
                                if (!proveedorEmpresa) {
                                    proveedorPersona = proveedoresPersona.find((proveedor) => proveedor.idTercero == detalle.idTercero);
                                }

                                return (
                                    <TableRow key={detalle.idDetalleCompra}>
                                        <TableData center={false} width='25%' smallText={true}> {producto?.nombreProducto}</TableData>
                                        <TableData center={false} width='25%' smallText={true}>{proveedorEmpresa ? proveedorEmpresa.nombreTercero : `${proveedorPersona?.nombreTercero} ${proveedorPersona?.apellidoTercero}`}</TableData>
                                        <TableData center={true} width='10%' smallText={true}>{detalle.cantidadDetalleCompra}</TableData>
                                        <TableData center={false} width='25%' smallText={true}>{`$ ${detalle.valorDetalleCompra}`}</TableData>
                                        <TableData center={true} width='15%'>

                                            {/* Botones de acción mejor organizados */}
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
                                                        setDetallesCompra(detallesCompra.filter((detalleCompra) => detalleCompra.idDetalleCompra !== detalle.idDetalleCompra
                                                        ));
                                                    }}
                                                    h={5}
                                                />
                                            </div>

                                        </TableData>
                                    </TableRow>)
                            })) : (

                            <TableMessage colSpan={5} message="No se han agregado productos" />
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
            
            {/* Modal para registrar detalle de compra */}
            <Modal isOpen={modalRegistrarDetalle} setIsOpen={() => setModalRegistrarDetalle(false)}>
                <RegistrarDetalleCompra contadorDetalles={contadorDetalles} setModal={setModalRegistrarDetalle} detallesCompra={detallesCompra} setDetallesCompra={setDetallesCompra} setContadorDetalles={setContadorDetalles} />
            </Modal>

            {/* Modal para actualizar detalle de compra */}                
            <Modal isOpen={modalActualizarDetalle} setIsOpen={() => setModalActualizarDetalle(false)} size='small'>
                <RegistrarDetalleCompra contadorDetalles={contadorDetalles} detalleCompra={detalleSeleccionado} setModal={setModalActualizarDetalle} detallesCompra={detallesCompra} setDetallesCompra={setDetallesCompra} setContadorDetalles={setContadorDetalles} />
            </Modal>

        </ContenedorRegistrar>
    );
};

export default RegistrarCompra;