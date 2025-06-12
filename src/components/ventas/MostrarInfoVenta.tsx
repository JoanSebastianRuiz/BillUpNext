"use client";

import { useEffect, useState } from 'react';
import { useProductoContext } from '@/context/ProductoContext';
import { useUsuarioContext } from '@/context/UsuarioContext';
import { useVentaContext } from '@/context/VentaContext';

import { VentaDTO } from '@/dto/VentaDTO';

import Table from '../common/Table';
import TableRow from '../common/TableRow';
import TableData from '../common/TableData';
import TableMessage from '../common/TableMessage';
import ControlesPaginacion from '../common/ControlesPaginacion';
import ParrafoMostrarInfo from '../modal/ParrafoMostrarInfo';
import ContenedorMostrarInfo from '../modal/ContenedorMostrarInfo';
import EstadoMostrarInfo from '../modal/EstadoMostrarInfo';


const MostrarInfoVenta = ({ venta }: { venta: VentaDTO | null }) => {
    const { productos } = useProductoContext();
    const { usuarios, usuario } = useUsuarioContext();
    const { detallesVentas } = useVentaContext();
    const [detallesVenta, setDetallesVenta] = useState(detallesVentas);

    let usuarioVendio;
    let usuarioCancelo;
    let descuentosTotales = 0;
    let impuestosTotales = 0;

    if (usuario.idUsuario === venta?.idUsuario) {
        usuarioVendio = usuario;
    }
    else {
        usuarioVendio = usuarios.find(usuario => usuario.idUsuario === venta?.idUsuario)
    }

    if (!venta?.estadoVenta) {
        if (usuario.idUsuario === venta?.idUsuarioCancelacionVenta) {
            usuarioCancelo = usuario;
        }
        else {
            usuarioCancelo = usuarios.find(usuario => usuario.idUsuario === venta?.idUsuarioCancelacionVenta)
        }
    }

    for (let detalle of detallesVenta) {
        descuentosTotales += detalle?.valorDescuentoDetalleVenta;
        impuestosTotales += detalle?.valorImpuestosDetalleVenta;
    }

    const titulosTabla = [
        { titulo: "Producto", center: false },
        { titulo: "Cantidad", center: false },
        { titulo: "Detalles", center: false },
    ];

    // Paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(4); // Número de detalles de detalle por página
    const indexOfLastDetalle = currentPage * itemsPerPage;
    const indexOfFirstDetalle = indexOfLastDetalle - itemsPerPage;
    const detallesVentaActuales = detallesVenta.slice(indexOfFirstDetalle, indexOfLastDetalle);
    const totalPages = Math.ceil(detallesVenta.length / itemsPerPage);

    useEffect(() => {
        setDetallesVenta(detallesVentas.filter(detalle => detalle.idVenta === venta?.idVenta));
    }, [detallesVentas, venta])

    return (
        <ContenedorMostrarInfo name="">
            {usuario.idRol == 2 && <ParrafoMostrarInfo
                subtitle="Cajero"
                text={`${usuarioVendio?.nombreUsuario} ${usuarioVendio?.apellidoUsuario}`}
            />}
            <ParrafoMostrarInfo
                subtitle="Fecha de venta"
                text={`${venta?.fechaVenta
                    ? new Date(venta.fechaVenta).toLocaleString('es-ES', {
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
                    text={venta?.observacionVenta || "No hay observaciones"}
                />
            </div>

            <ParrafoMostrarInfo
                subtitle="Subtotal"
                text={`$ ${venta?.valorTotalVenta || 0 + descuentosTotales - impuestosTotales}`} />

            <ParrafoMostrarInfo
                subtitle="Descuentos totales"
                text={`$ ${descuentosTotales}`}
            />

            <ParrafoMostrarInfo
                subtitle="Impuestos totales"
                text={`$ ${impuestosTotales}`}
            />

            <ParrafoMostrarInfo
                subtitle="Valor total"
                text={`$ ${venta?.valorTotalVenta}`} />

            <EstadoMostrarInfo estado={venta?.estadoVenta ?? true} facturacion={true} />

            {venta?.estadoVenta == false && (
                <>
                    <ParrafoMostrarInfo
                        subtitle="Cancelada por"
                        text={`${usuarioCancelo?.nombreUsuario} ${usuarioCancelo?.apellidoUsuario}`}
                    />

                    <ParrafoMostrarInfo
                        subtitle="Fecha de cancelación"
                        text={`${venta?.fechaCancelacionVenta
                            ? new Date(venta.fechaCancelacionVenta).toLocaleString('es-ES', {
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
                            text={venta?.motivoCancelacionVenta || "No hay motivo de cancelación"}
                        />
                    </div>
                </>
            )}

            <div className="col-span-1 sm:col-span-2">
                <h1 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                    Productos
                </h1>
                <Table titulos={titulosTabla}>
                    {detallesVentaActuales.length > 0 ? (
                        detallesVentaActuales.map((detalle) => {
                            const producto = productos.find((producto) => producto.idProducto == detalle.idProducto);

                            return (
                                <TableRow key={detalle.idDetalleVenta}>
                                    <TableData center={false} width='33%' smallText={true}>{producto?.nombreProducto}</TableData>
                                    <TableData center={false} width='33%' smallText={true}>{detalle.cantidadDetalleVenta}</TableData>
                                    <TableData center={false} width='33%' smallText={true}>
                                        <div className="flex flex-col">
                                            <span>Descuento: ${detalle.valorDescuentoDetalleVenta}</span>
                                            <span>Impuestos: ${detalle.valorImpuestosDetalleVenta}</span>
                                            <span>Valor: ${detalle.valorTotalDetalleVenta}</span>
                                        </div>
                                    </TableData>
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableMessage message="No hay productos relacionados a la venta" />
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

export default MostrarInfoVenta;