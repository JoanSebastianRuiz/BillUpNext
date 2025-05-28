"use client";

import { useEffect, useState, useRef } from "react";
import { List, PlusCircle, XCircle, Ban, Unlock, Lock, FileDown } from "lucide-react";

import { VentaDTO } from "@/dto/VentaDTO";
import { useUsuarioContext } from "@/context/UsuarioContext";
import { useVentaContext } from "@/context/VentaContext";

import ContenedorFiltros from "@/components/filtros/ContenedorFiltros";
import ContenedorBotonesFiltros from "@/components/filtros/ContenedorBotonesFiltros";
import BotonFiltro from "@/components/filtros/BotonFiltro";
import ContenedorSelectores from "@/components/filtros/ContenedorSelectores";
import SelectFiltro from "@/components/filtros/SelectFiltro";
import BotonAccionCard from "@/components/cards/BotonAccionCard";
import Modal from "@/components/modal/Modal";
import ContenedorPrincipal from "@/components/common/ContenedorPrincipal";
import ControlesPaginacion from "@/components/common/ControlesPaginacion";
import Table from "@/components/common/Table";
import TableRow from "@/components/common/TableRow";
import TableData from "@/components/common/TableData";
import TableMessage from "@/components/common/TableMessage";
import DateInputFiltro from "@/components/filtros/DateInputFiltro";
import MostrarInfoVenta from "@/components/ventas/MostrarInfoVenta";
import CancelarVenta from "@/components/ventas/CancelarVenta";
import RegistrarVenta from "@/components/ventas/RegistrarVenta";
import { useCajaContext } from "@/context/CajaContext";
import AbrirCaja from "@/components/cajas/AbrirCaja";
import CerrarCaja from "@/components/cajas/CerrarCaja";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useTerceroContext } from "@/context/TerceroContext";
import { useProductoContext } from "@/context/ProductoContext";
import { useEmpresaContext } from "@/context/EmpresaContext";


const VentasPage: React.FC = () => {
    const [modalRegistrar, setModalRegistrar] = useState(false);
    const [modalInfo, setModalInfo] = useState(false);
    const [modalCancelar, setModalCancelar] = useState(false);
    const [modalAbrirCaja, setModalAbrirCaja] = useState(false);
    const [modalCerrarCaja, setModalCerrarCaja] = useState(false);
    const [ventaSeleccionada, setVentaSeleccionada] = useState<VentaDTO | null>(null);

    const { ventas } = useVentaContext()
    const { usuarios, usuario } = useUsuarioContext()
    const { cajaSeleccionada, cajas } = useCajaContext()
    const [ventasFiltradas, setVentasFiltradas] = useState<VentaDTO[]>([]);
    const { clientesPersona, clientesEmpresa } = useTerceroContext()
    const { detallesVentas } = useVentaContext()
    const { productos } = useProductoContext()
    const { empresas } = useEmpresaContext()
    const [usuariosFiltrados, setUsuariosFiltrados] = useState(usuarios);

    const fechaVentaRef = useRef<HTMLInputElement | null>(null);
    const estadoVentaRef = useRef<HTMLSelectElement>(null);
    const valorTotalVentaRef = useRef<HTMLSelectElement>(null);
    const idUsuarioRef = useRef<HTMLSelectElement>(null);
    const idCajaRef = useRef<HTMLSelectElement>(null);

    // Paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Número de ventas por página
    const indexOfLastVenta = currentPage * itemsPerPage;
    const indexOfFirstVenta = indexOfLastVenta - itemsPerPage;
    const ventasActuales = ventasFiltradas.slice(indexOfFirstVenta, indexOfLastVenta);
    const totalPages = Math.ceil(ventasFiltradas.length / itemsPerPage);

    const filtrarVentas = () => {
        const fechaVenta = fechaVentaRef.current?.value || "";
        const estadoVenta = estadoVentaRef.current?.value;
        const valorTotalVenta = valorTotalVentaRef.current?.value;
        const idUsuario = idUsuarioRef.current?.value;
        const idCaja = idCajaRef.current?.value;

        let ventasFiltradas = [...ventas];

        // Filtrar por estado de venta
        if (estadoVenta !== undefined && estadoVenta !== "") {
            const estadoBooleano = estadoVenta === "true";
            ventasFiltradas = ventasFiltradas.filter(venta => venta.estadoVenta === estadoBooleano);
        }

        // Filtrar por fecha de venta o cancelación
        if (fechaVenta !== "") {
            ventasFiltradas = ventasFiltradas.filter(venta => {
                const fecha = estadoVenta === "true"
                    ? venta.fechaVenta
                    : venta.fechaCancelacionVenta;

                const fechaFormateada = fecha ? new Date(fecha).toLocaleDateString("sv") : "";
                return fechaFormateada === fechaVenta;
            });
        }

        // Filtrar por valor total de venta
        if (valorTotalVenta && valorTotalVenta !== "0") {
            ventasFiltradas = ventasFiltradas.filter(venta => {
                const valor = Number(venta.valorTotalVenta) || 0;
                const [min, max] = valorTotalVenta.includes("+")
                    ? [parseInt(valorTotalVenta), Infinity]
                    : valorTotalVenta.split("-").map(Number);

                return valor >= min && valor <= max;
            });
        }

        // Filtrar por caja
        if (idCaja && idCaja !== "0") {
            ventasFiltradas = ventasFiltradas.filter(venta => venta.idCaja === Number(idCaja));
        }

        // Filtrar por usuario
        if (idUsuario && idUsuario !== "0" && usuario.idRol == 2) {
            ventasFiltradas = ventasFiltradas.filter(venta => venta.idUsuario === Number(idUsuario));
        }

        setVentasFiltradas(ventasFiltradas);
    };


    const limpiarFiltros = () => {
        if (fechaVentaRef.current) fechaVentaRef.current.value = "";
        if (estadoVentaRef.current) estadoVentaRef.current.value = "true";
        if (valorTotalVentaRef.current) valorTotalVentaRef.current.value = "0";
        filtrarVentas();
    };

    useEffect(() => {
        filtrarVentas();
    }, [ventas]);

    useEffect(() => {
        if (usuario.idRol === 2) {
            const usuariosFiltrados = usuarios.filter(usuario => usuario.idRol === 3);
            setUsuariosFiltrados(usuariosFiltrados);
        }
    }, [usuarios]);

    const titulosTabla = [
        { titulo: estadoVentaRef.current?.value == "true" ? "Registrada por" : "Cancelada por", center: false },
        { titulo: "Fecha", center: false },
        { titulo: "Valor", center: false },
        { titulo: "Acciones", center: false }
    ]

    const generarFacturaPDF = (venta: VentaDTO) => {
        const empresa = empresas.find(empresa => empresa.idEmpresa === usuario.idEmpresa);
        let cajero;
        if (usuario.idRol === 2) {
            cajero = usuarios.find(usuario => usuario.idUsuario === venta.idUsuarioCancelacionVenta);
        } else {
            cajero = usuario;
        }
        let nombreCliente = "N/A";
        const detalles = detallesVentas.filter(detalle => detalle.idVenta === venta.idVenta);
        let cliente;

        if (venta.idTercero) {
            cliente = clientesEmpresa.find(cliente => cliente.idTercero === venta.idTercero);
            if (!cliente) {
                cliente = clientesPersona.find(cliente => cliente.idTercero === venta.idTercero);
                nombreCliente = `${cliente?.nombreTercero} ${cliente?.apellidoTercero || ""}`;
            } else {
                nombreCliente = cliente?.nombreTercero || "N/A";
            }
        }

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth(); // Obtener ancho de la página

        // Título centrado
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        const titulo = `Factura de Venta - ${empresa?.nombreEmpresa}`;
        const titleX = (pageWidth - doc.getTextWidth(titulo)) / 2; // Centrar texto
        doc.text(titulo, titleX, 20);

        // Información de la empresa
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Factura No. ${venta.idVenta}`, 14, 35);
        doc.text(`Fecha: ${venta?.fechaVenta ? new Date(venta.fechaVenta).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }) : 'N/A'}`, 14, 45);

        // Información del cliente y cajero alineados a la derecha
        const infoX = pageWidth - 80; // Alineación derecha
        doc.text(`Cliente: ${nombreCliente}`, infoX, 35);
        doc.text(`Cajero: ${cajero?.nombreUsuario} ${cajero?.apellidoUsuario}`, infoX, 45);

        // Total en negrita y resaltado
        doc.setFont("helvetica", "bold");
        doc.text(`Total: $${venta.valorTotalVenta.toFixed(2)}`, 14, 60);

        // Línea separadora
        doc.setLineWidth(0.5);
        doc.line(14, 65, 190, 65);

        // Tabla de productos
        autoTable(doc, {
            startY: 75,
            head: [["Producto", "Cantidad", "Subtotal", "Descuento", "Impuesto", "Total"]],
            body: detalles.map((d) => {
                const producto = productos.find(p => p.idProducto === d.idProducto);
                return [
                    producto?.nombreProducto || "N/A",
                    d.cantidadDetalleVenta,
                    `$${(d.valorTotalDetalleVenta + d.valorDescuentoDetalleVenta - d.valorImpuestosDetalleVenta).toFixed(2)}`,
                    `$${d.valorDescuentoDetalleVenta.toFixed(2)}`,
                    `$${d.valorImpuestosDetalleVenta.toFixed(2)}`,
                    `$${d.valorTotalDetalleVenta.toFixed(2)}`,
                ];
            }),
            theme: "striped",
            styles: {
                fontSize: 10,
                halign: "center",
                valign: "middle",
            },
            headStyles: {
                fillColor: [44, 62, 80],
                textColor: [255, 255, 255],
                fontSize: 11,
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240],
            },
        });

        // Guardar o descargar
        doc.save(`Factura_${venta.idVenta}.pdf`);
    };

    const exportarDatosPDF = () => {
        const empresa = empresas.find(empresa => empresa.idEmpresa === usuario.idEmpresa);
        const detalles = detallesVentas.filter(detalle => detalle.idVenta === ventaSeleccionada?.idVenta);
        const descuentosTotales = detalles.reduce((total, detalle) => total + detalle.valorDescuentoDetalleVenta, 0);
        const impuestosTotales = detalles.reduce((total, detalle) => total + detalle.valorImpuestosDetalleVenta, 0);

        const doc = new jsPDF({
            orientation: "landscape", //  Orientación horizontal
        });

        const pageWidth = doc.internal.pageSize.getWidth();

        // Fecha alineada a la derecha
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        const fechaTexto = `Fecha: ${new Date().toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })}`;
        const paddingRight = 14;
        const fechaX = pageWidth - doc.getTextWidth(fechaTexto) - paddingRight;
        doc.text(fechaTexto, fechaX, 15); // Parte superior derecha

        // Título centrado
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        const titulo = `Ventas - ${empresa?.nombreEmpresa}`;
        const titleX = (pageWidth - doc.getTextWidth(titulo)) / 2;
        doc.text(titulo, titleX, 20);

        // Línea separadora
        doc.setLineWidth(0.5);
        doc.line(14, 30, pageWidth - 14, 30); // ajustado a landscape

        // Tabla de ventas
        autoTable(doc, {
            startY: 40, // ajustado por la línea separadora
            head: [["Cajero", "Fecha", "Subtotal", "Descuentos", "Impuestos", "Total", "Estado"]],
            body: ventasFiltradas.map((v) => {
                const cajero = usuarios.find(usuario => usuario.idUsuario === v.idUsuario);

                return [
                    `${cajero?.nombreUsuario || ''} ${cajero?.apellidoUsuario || ''}`,
                    v.fechaVenta
                        ? new Date(v.fechaVenta).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        })
                        : "No registrada",
                    `$ ${v.valorTotalVenta || 0 + descuentosTotales - impuestosTotales}`,
                    `$ ${descuentosTotales}`,
                    `$ ${impuestosTotales}`,
                    `$ ${v.valorTotalVenta}`,
                    v.estadoVenta ? "Registrada" : "Cancelada",
                ]
            }),
            theme: "striped",
            styles: {
                fontSize: 10,
                halign: "center",
                valign: "middle",
            },
            headStyles: {
                fillColor: [44, 62, 80],
                textColor: [255, 255, 255],
                fontSize: 11,
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240],
            },
        });

        // Fecha actual para el nombre del archivo
        const fechaActual = new Date();
        const dia = String(fechaActual.getDate()).padStart(2, '0');
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
        const año = fechaActual.getFullYear();
        const fechaNombre = `${dia}_${mes}_${año}`;

        doc.save(`Reporte_ventas_${fechaNombre}.pdf`);
    };


    return (
        <ContenedorPrincipal>
            <ContenedorFiltros title="Ventas">
                <ContenedorBotonesFiltros>
                    {usuario.idRol === 3 && (
                        cajaSeleccionada == 0 ?
                            <BotonFiltro
                                onClick={() => setModalAbrirCaja(true)}
                                Symbol={Unlock}
                                name="Abrir caja"
                            />
                            :
                            (<>
                                <BotonFiltro
                                    onClick={() => setModalCerrarCaja(true)}
                                    Symbol={Lock}
                                    name="Cerrar caja"
                                />

                                <BotonFiltro
                                    onClick={() => setModalRegistrar(true)}
                                    Symbol={PlusCircle}
                                    name="Registrar venta"
                                />
                            </>)
                    )}

                    <BotonFiltro
                        onClick={limpiarFiltros}
                        Symbol={XCircle}
                        name="Limpiar filtros"
                    />

                    {usuario.idUsuario == 2 &&
                        (<BotonFiltro
                            onClick={exportarDatosPDF}
                            Symbol={FileDown}
                            name="Exportar datos" />)}
                </ContenedorBotonesFiltros>

                <ContenedorSelectores>
                    <DateInputFiltro
                        id="fechaVenta"
                        name="Fecha"
                        onChange={filtrarVentas}
                        ref={fechaVentaRef}
                    />


                    <SelectFiltro
                        id="valorTotalVenta"
                        name="Valor"
                        onChange={filtrarVentas}
                        ref={valorTotalVentaRef}
                    >
                        <option value="0-100000">Menos de $100.000</option>
                        <option value="100000-500000">$100.000 - $500.000</option>
                        <option value="500000-1000000">$500.000 - $1.000.000</option>
                        <option value="1000000+">Más de $1.000.000</option>
                    </SelectFiltro>


                    {usuario.idRol === 2 && (
                        <>
                            <SelectFiltro
                                id="idCaja"
                                name="Caja"
                                onChange={filtrarVentas}
                                ref={idCajaRef}
                            >
                                {cajas.map(caja => (
                                    <option key={caja.idCaja} value={caja.idCaja}>
                                        {caja.nombreCaja}
                                    </option>
                                ))}
                            </SelectFiltro>

                            <SelectFiltro
                                id="idUsuario"
                                name="Cajero"
                                onChange={filtrarVentas}
                                ref={idUsuarioRef}
                            >
                                {usuariosFiltrados.map(usuario => (
                                    <option key={usuario.idUsuario} value={usuario.idUsuario}>
                                        {usuario.nombreUsuario}
                                    </option>
                                ))}
                            </SelectFiltro>
                        </>
                    )}


                    <SelectFiltro
                        id="estadoVenta"
                        name="Estado"
                        onChange={filtrarVentas}
                        ref={estadoVentaRef}
                        selectEstado={true}
                        defaultValue="true"
                    >
                        <option value="true">Registrada</option>
                        <option value="false">Cancelada</option>
                    </SelectFiltro>
                </ContenedorSelectores>
            </ContenedorFiltros>

            <div className="">
                <Table titulos={titulosTabla}>
                    {ventasActuales.length > 0 ? (
                        ventasActuales.map((venta) => {
                            let u;
                            let fecha;
                            if (venta.estadoVenta) {
                                if (usuario.idUsuario === venta.idUsuario) {
                                    u = usuario;
                                }
                                else {
                                    u = usuarios.find(usuario => usuario.idUsuario === venta.idUsuario)
                                }
                                fecha = venta.fechaVenta;
                            } else {
                                if (usuario.idUsuario === venta.idUsuarioCancelacionVenta) {
                                    u = usuario;
                                }
                                else {
                                    u = usuarios.find(usuario => usuario.idUsuario === venta.idUsuarioCancelacionVenta)
                                }
                                fecha = venta.fechaCancelacionVenta;
                            }

                            return (
                                <TableRow key={venta.idVenta}>
                                    <TableData center={false} width="30%">{`${u?.nombreUsuario} ${u?.apellidoUsuario}`}</TableData>
                                    <TableData center={false} noWrap={true} width="30%">
                                        {fecha
                                            ? new Date(fecha).toLocaleString('es-ES', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                            })
                                            : 'N/A'}
                                    </TableData>
                                    <TableData center={false} noWrap={true} width="20%">$ {venta.valorTotalVenta || 'N/A'}</TableData>
                                    <TableData center={false} width="20%">
                                        <div className="flex gap-2">
                                            <BotonAccionCard
                                                Symbol={List}
                                                onClick={() => {
                                                    setVentaSeleccionada(venta);
                                                    setModalInfo(true);
                                                }}
                                                h={5}
                                            />

                                            {usuario.idRol == 2 && venta.estadoVenta && (
                                                <BotonAccionCard
                                                    Symbol={Ban}
                                                    onClick={() => {
                                                        setVentaSeleccionada(venta);
                                                        setModalCancelar(true);
                                                    }}
                                                    h={5}
                                                />
                                            )}

                                            <BotonAccionCard
                                                Symbol={FileDown}
                                                onClick={() => generarFacturaPDF(venta)}
                                                h={5}
                                            />

                                        </div>
                                    </TableData>
                                </TableRow>)
                        })) : (

                        <TableMessage message="No hay ventas registradas" colSpan={4} />
                    )}
                </Table>
            </div>

            <ControlesPaginacion
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />

            <Modal isOpen={modalRegistrar} setIsOpen={() => setModalRegistrar(false)} size="large">
                <RegistrarVenta setModal={setModalRegistrar} />
            </Modal>

            <Modal isOpen={modalInfo} setIsOpen={() => setModalInfo(false)} size="large">
                <MostrarInfoVenta venta={ventaSeleccionada} />
            </Modal>

            <Modal isOpen={modalCancelar} setIsOpen={() => setModalCancelar(false)}>
                <CancelarVenta venta={ventaSeleccionada} setModal={setModalCancelar} />
            </Modal>

            <Modal isOpen={modalAbrirCaja} setIsOpen={() => setModalAbrirCaja(false)} size="small">
                <AbrirCaja setModal={setModalAbrirCaja} />
            </Modal>

            <Modal isOpen={modalCerrarCaja} setIsOpen={() => setModalCerrarCaja(false)} size="small">
                <CerrarCaja setModal={setModalCerrarCaja} />
            </Modal>

        </ContenedorPrincipal >
    );
};

export default VentasPage;