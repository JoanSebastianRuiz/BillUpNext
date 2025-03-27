"use client";

import { useEffect, useState } from 'react';
import { useTerceroContext } from '@/context/TerceroContext';
import { useProductoContext } from '@/context/ProductoContext';
import { useUsuarioContext } from '@/context/UsuarioContext';
import { useCompraContext } from '@/context/CompraContext';

import { CompraDTO } from '@/dto/CompraDTO';

import Table from '../common/Table';
import TableRow from '../common/TableRow';
import TableData from '../common/TableData';
import TableMessage from '../common/TableMessage';
import ControlesPaginacion from '../common/ControlesPaginacion';
import ParrafoMostrarInfo from '../modal/ParrafoMostrarInfo';
import ContenedorMostrarInfo from '../modal/ContenedorMostrarInfo';
import EstadoMostrarInfo from '../modal/EstadoMostrarInfo';


const MostrarInfoCompra = ({ compra }: { compra: CompraDTO | null }) => {
    const { proveedoresEmpresa, proveedoresPersona } = useTerceroContext();
    const { productos } = useProductoContext();
    const { usuarios, usuario } = useUsuarioContext();
    const { detallesCompras } = useCompraContext();
    const [detallesCompra, setDetallesCompra] = useState(detallesCompras);

    let usuarioCompro;
    let usuarioCancelo;

    if (usuario.idUsuario === compra?.idUsuario) {
        usuarioCompro = usuario;
    }
    else {
        usuarioCompro = usuarios.find(usuario => usuario.idUsuario === compra?.idUsuario)
    }

    if (!compra?.estadoCompra) {
        if (usuario.idUsuario === compra?.idUsuarioCancelacionCompra) {
            usuarioCancelo = usuario;
        }
        else {
            usuarioCancelo = usuarios.find(usuario => usuario.idUsuario === compra?.idUsuarioCancelacionCompra)
        }
    }

    const titulosTabla = [
        { titulo: "Producto", center: false },
        { titulo: "Proveedor", center: false },
        { titulo: "Cantidad", center: false },
        { titulo: "Valor", center: false }
    ]

    // Paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(4); // Número de detalles de detalle por página
    const indexOfLastDetalle = currentPage * itemsPerPage;
    const indexOfFirstDetalle = indexOfLastDetalle - itemsPerPage;
    const detallesCompraActuales = detallesCompra.slice(indexOfFirstDetalle, indexOfLastDetalle);
    const totalPages = Math.ceil(detallesCompra.length / itemsPerPage);

    useEffect(() => {
        setDetallesCompra(detallesCompras.filter(detalle => detalle.idCompra === compra?.idCompra));
    }, [detallesCompras, compra])

    return (
        <ContenedorMostrarInfo name="">
            <ParrafoMostrarInfo
                subtitle="Realizada por"
                text={`${usuarioCompro?.nombreUsuario} ${usuarioCompro?.apellidoUsuario}`}
            />
            <ParrafoMostrarInfo
                subtitle="Fecha de compra"
                text={`${compra?.fechaCompra
                    ? new Date(compra.fechaCompra).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    })
                    : 'N/A'}`}
            />

            <div className="col-span-1 sm:col-span-2">
                <ParrafoMostrarInfo
                    subtitle="Observación"
                    justify={true}
                    text={compra?.observacionCompra || "No hay observaciones"}
                />
            </div>

            {compra?.estadoCompra == false && (
                <>
                    <ParrafoMostrarInfo
                        subtitle="Cancelada por"
                        text={`${usuarioCancelo?.nombreUsuario} ${usuarioCancelo?.apellidoUsuario}`}
                    />

                    <ParrafoMostrarInfo
                        subtitle="Fecha de cancelación"
                        text={`${compra?.fechaCancelacionCompra
                            ? new Date(compra.fechaCancelacionCompra).toLocaleString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                            })
                            : 'N/A'}`}
                    />

                    <div className="col-span-1 sm:col-span-2">
                        <ParrafoMostrarInfo
                            subtitle="Motivo de cancelación"
                            justify={true}
                            text={compra?.motivoCancelacionCompra || "No hay motivo de cancelación"}
                        />
                    </div>
                </>
            )}

            <ParrafoMostrarInfo
                subtitle="Valor total"
                text={`$ ${compra?.valorTotalCompra}`} />

            <EstadoMostrarInfo estado={compra?.estadoCompra ?? true} facturacion={true} />

            <div className="col-span-1 sm:col-span-2">
                <h1 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                    Productos
                </h1>
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
                                    <TableData center={true} width='25%' smallText={true}>{detalle.cantidadDetalleCompra}</TableData>
                                    <TableData center={false} width='25%' smallText={true}>{`$ ${detalle.valorDetalleCompra}`}</TableData>

                                </TableRow>)
                        })) : (

                        <TableMessage message="No hay productos relacionados a la compra" />
                    )}
                </Table>
                
                <ControlesPaginacion
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                />
            </div>




        </ContenedorMostrarInfo >
    );
};

export default MostrarInfoCompra;