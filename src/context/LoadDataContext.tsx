"use client";

import { useEffect, useState } from "react";
import { useCajaContext } from "./CajaContext";
import { useSession } from "next-auth/react";
import { DetalleCajaDTO } from "@/dto/DetalleCajaDTO";
import { MovimientoDTO } from "@/dto/MovimientoDTO";
import { CajaDTO } from "@/dto/CajaDTO";
import axios from "axios";
import { CompraDTO } from "@/dto/CompraDTO";
import { DetalleCompraDTO } from "@/dto/DetalleCompraDTO";
import { useCompraContext } from "./CompraContext";
import { useEmpresaContext } from "./EmpresaContext";
import { TipoPersonaDTO } from "@/dto/TipoPersonaDTO";
import { RegimenContribuyenteResponseDTO } from "@/dto/RegimenContribuyenteResponseDTO";
import { EmpresaResponseDTO } from "@/dto/EmpresaResponseDTO";
import { useGravamenContext } from "./GravamenContext";
import { useProductoContext } from "./ProductoContext";
import { TerceroResponsePersonaDTO } from "@/dto/TerceroResponsePersonaDTO";
import { TerceroResponseEmpresaDTO } from "@/dto/TerceroResponseEmpresaDTO";
import { TerceroProductoDTO } from "@/dto/TerceroProductoDTO";
import { useTerceroContext } from "./TerceroContext";
import { useUsuarioContext } from "./UsuarioContext";
import { TipoDocumentoResponseDTO } from "@/dto/TipoDocumentoResponseDTO";
import { RolDTO } from "@/dto/RolDTO";
import { UsuarioResponseDTO } from "@/dto/UsuarioResponseDTO";
import { useVentaContext } from "./VentaContext";
import { UbicacionVentaDTO } from "@/dto/UbicacionVentaDTO";
import { VentaDTO } from "@/dto/VentaDTO";
import { DetalleVentaDTO } from "@/dto/DetalleVentaDTO";
import { TipoMedioPagoDTO } from "@/dto/TipoMedioPagoDTO";

export const LoadDataContextProvider = () => {
    const { setCajas, setDetallesCajas, setMovimientos } = useCajaContext();
    const { setCompras, setDetallesCompras } = useCompraContext()
    const { setTiposPersona, setRegimenesContribuyente, setEmpresas, obtenerEmpresas } = useEmpresaContext();
    const { obtenerGravamenes } = useGravamenContext();
    const { setCategorias, setProductos, setGravamenesProducto } = useProductoContext();
    const { setClientesPersona, setClientesEmpresa, setProveedoresPersona, setProveedoresEmpresa, setProveedoresProducto } = useTerceroContext();
    const { setDepartamentos, setMunicipios, setRoles, setTiposDocumento, setUsuario, setUsuarios } = useUsuarioContext();
    const { setDetallesVentas, setTiposMedioPago, setUbicacionesVenta, setVentas } = useVentaContext();

    const { data: session, status } = useSession();
    const idEmpresa = session?.user?.idEmpresa;
    const idRol = session?.user?.idRol;
    const idUsuario = session?.user?.idUsuario;
    const [loading, setLoading] = useState(false);

        useEffect(() => {
            const fetchData = async () => {
                if (status !== "authenticated" || idEmpresa == undefined || idRol === undefined) return;
                if (!session) return;

                setLoading(true);
                try {
                    // --- Promesas generales ---
                    const promesasBase = [
                        axios.get<TipoPersonaDTO[]>("/api/tipos-persona"),
                        axios.get<RegimenContribuyenteResponseDTO[]>("/api/regimenes-contribuyente"),
                        axios.get<EmpresaResponseDTO[]>("/api/empresas"),
                        axios.get("/api/departamentos"),
                        axios.get("/api/municipios"),
                        axios.get("/api/roles"),
                        axios.get("/api/tipos-documento"),
                        (idRol === 2 || idRol === 3)
                            ? axios.get(`/api/empresas/${idEmpresa}/usuarios`)
                            : axios.get("/api/usuarios")
                    ] as const;

                    const [
                        tiposPersonaRes,
                        regimenesContribuyenteRes,
                        empresasRes,
                        departamentosRes,
                        municipiosRes,
                        rolesRes,
                        tiposDocumentoRes,
                        usuariosRes
                    ] = await Promise.all(promesasBase);

                    // Set generales
                    if (tiposPersonaRes.status === 200) setTiposPersona(tiposPersonaRes.data);
                    if (regimenesContribuyenteRes.status === 200) setRegimenesContribuyente(regimenesContribuyenteRes.data);
                    if (empresasRes.status === 200) setEmpresas(empresasRes.data);
                    if (departamentosRes.status === 200) setDepartamentos(departamentosRes.data);
                    if (municipiosRes.status === 200) setMunicipios(municipiosRes.data);

                    if (tiposDocumentoRes.status === 200) {
                        setTiposDocumento(tiposDocumentoRes.data.filter(
                            (tipo: TipoDocumentoResponseDTO) => tipo.estadoTipoDocumento === true
                        ));
                    }

                    if (rolesRes.status === 200) {
                        const rolesFiltrados = rolesRes.data.filter((rol: RolDTO) => {
                            if (idRol === 1) return rol.idRol !== 3;
                            if (idRol === 2) return rol.idRol !== 1;
                            if (idRol === 3) return rol.idRol === 3;
                            return true;
                        });
                        setRoles(rolesFiltrados);
                    }

                    if (usuariosRes.status === 200) {
                        const usuariosFiltrados = usuariosRes.data.filter(
                            (usuario: UsuarioResponseDTO) =>
                                usuario.idUsuario !== session.user.idUsuario &&
                                (idRol !== 1 || usuario.idRol !== 3)
                        );
                        setUsuarios(usuariosFiltrados);
                        setUsuario(
                            usuariosRes.data.find((usuario: UsuarioResponseDTO) => usuario.idUsuario === idUsuario) || {} as UsuarioResponseDTO
                        );
                    }

                    // --- Datos según rol ---
                    if (idRol === 1 || idRol === 2) {
                        obtenerGravamenes();

                        const [
                            ubicacionesVentaRes,
                            ventasRes,
                            detallesVentasRes,
                            cajasRes,
                            detallesCajasRes,
                            movimientosRes,
                            comprasRes,
                            detallesComprasRes,
                            categoriasRes,
                            productosRes,
                            gravamenesProductoRes,
                            clientesPersonaRes,
                            clientesEmpresaRes,
                            proveedoresPersonaRes,
                            proveedoresEmpresaRes,
                            proveedoresProductoRes
                        ] = await Promise.all([
                            axios.get<UbicacionVentaDTO[]>(`/api/empresas/${idEmpresa}/ubicaciones-venta`),
                            axios.get<VentaDTO[]>(`/api/empresas/${idEmpresa}/ventas`),
                            axios.get<DetalleVentaDTO[]>(`/api/empresas/${idEmpresa}/detalles-ventas`),
                            axios.get<CajaDTO[]>(`/api/empresas/${idEmpresa}/cajas`),
                            axios.get<DetalleCajaDTO[]>(`/api/empresas/${idEmpresa}/detalles-cajas`),
                            axios.get<MovimientoDTO[]>(`/api/empresas/${idEmpresa}/movimientos`),
                            axios.get<CompraDTO[]>(`/api/empresas/${idEmpresa}/compras`),
                            axios.get<DetalleCompraDTO[]>(`/api/empresas/${idEmpresa}/detalles-compras`),
                            axios.get(`/api/empresas/${idEmpresa}/categorias`),
                            axios.get(`/api/empresas/${idEmpresa}/productos`),
                            axios.get(`/api/empresas/${idEmpresa}/gravamen-producto`),
                            axios.get<TerceroResponsePersonaDTO[]>(`/api/empresas/${idEmpresa}/clientes?tipo=persona`),
                            axios.get<TerceroResponseEmpresaDTO[]>(`/api/empresas/${idEmpresa}/clientes?tipo=empresa`),
                            axios.get<TerceroResponsePersonaDTO[]>(`/api/empresas/${idEmpresa}/proveedores?tipo=persona`),
                            axios.get<TerceroResponseEmpresaDTO[]>(`/api/empresas/${idEmpresa}/proveedores?tipo=empresa`),
                            axios.get<TerceroProductoDTO[]>(`/api/empresas/${idEmpresa}/tercero-producto`)
                        ]);

                        if (ubicacionesVentaRes.status === 200) setUbicacionesVenta(ubicacionesVentaRes.data);
                        if (ventasRes.status === 200) setVentas(ventasRes.data);
                        if (detallesVentasRes.status === 200) setDetallesVentas(detallesVentasRes.data);

                        if (cajasRes.status === 200) setCajas(cajasRes.data);
                        if (detallesCajasRes.status === 200) setDetallesCajas(detallesCajasRes.data);
                        if (movimientosRes.status === 200) setMovimientos(movimientosRes.data);
                        if (comprasRes.status === 200) setCompras(comprasRes.data);
                        if (detallesComprasRes.status === 200) setDetallesCompras(detallesComprasRes.data);

                        if (categoriasRes.status === 200) setCategorias(categoriasRes.data);
                        if (productosRes.status === 200) setProductos(productosRes.data);
                        if (gravamenesProductoRes.status === 200) setGravamenesProducto(gravamenesProductoRes.data);

                        if (clientesPersonaRes.status === 200) setClientesPersona(clientesPersonaRes.data);
                        if (clientesEmpresaRes.status === 200) setClientesEmpresa(clientesEmpresaRes.data);
                        if (proveedoresPersonaRes.status === 200) setProveedoresPersona(proveedoresPersonaRes.data);
                        if (proveedoresEmpresaRes.status === 200) setProveedoresEmpresa(proveedoresEmpresaRes.data);
                        if (proveedoresProductoRes.status === 200) setProveedoresProducto(proveedoresProductoRes.data);
                    }

                    else if (idRol === 3) {
                        const [
                            ubicacionesVentaRes,
                            ventasRes,
                            detallesVentasRes,
                            tiposMedioPagoRes,
                            cajasRes,
                            detallesCajasRes,
                            movimientosRes,
                            productosRes,
                            clientesPersonaRes,
                            clientesEmpresaRes
                        ] = await Promise.all([
                            axios.get<UbicacionVentaDTO[]>(`/api/empresas/${idEmpresa}/ubicaciones-venta`),
                            axios.get<VentaDTO[]>(`/api/empresas/${idEmpresa}/ventas`),
                            axios.get<DetalleVentaDTO[]>(`/api/empresas/${idEmpresa}/detalles-ventas`),
                            axios.get<TipoMedioPagoDTO[]>("/api/tipos-medio-pago"),
                            axios.get<CajaDTO[]>(`/api/empresas/${idEmpresa}/cajas`),
                            axios.get<DetalleCajaDTO[]>(`/api/empresas/${idEmpresa}/detalles-cajas`),
                            axios.get<MovimientoDTO[]>(`/api/empresas/${idEmpresa}/movimientos`),
                            axios.get(`/api/empresas/${idEmpresa}/productos`),
                            axios.get<TerceroResponsePersonaDTO[]>(`/api/empresas/${idEmpresa}/clientes?tipo=persona`),
                            axios.get<TerceroResponseEmpresaDTO[]>(`/api/empresas/${idEmpresa}/clientes?tipo=empresa`)
                        ]);

                        if (ubicacionesVentaRes.status === 200) setUbicacionesVenta(ubicacionesVentaRes.data.filter(u => u.estadoUbicacionVenta));
                        if (ventasRes.status === 200) setVentas(ventasRes.data.filter(v => v.idUsuario === session.user.idUsuario));
                        if (detallesVentasRes.status === 200) setDetallesVentas(detallesVentasRes.data);
                        if (tiposMedioPagoRes.status === 200) setTiposMedioPago(tiposMedioPagoRes.data.filter(m => m.estadoTipoMedioPago));

                        if (cajasRes.status === 200) setCajas(cajasRes.data);
                        if (detallesCajasRes.status === 200) setDetallesCajas(detallesCajasRes.data.filter(det => det.idUsuario === idUsuario));
                        if (movimientosRes.status === 200) setMovimientos(movimientosRes.data.filter(mov => mov.idUsuario === idUsuario));
                        if (productosRes.status === 200) setProductos(productosRes.data);
                        if (clientesPersonaRes.status === 200) setClientesPersona(clientesPersonaRes.data);
                        if (clientesEmpresaRes.status === 200) setClientesEmpresa(clientesEmpresaRes.data);
                    }

                    else if (idRol === 4) {
                        const [
                            productosRes,
                            clientesPersonaRes,
                            clientesEmpresaRes
                        ] = await Promise.all([
                            axios.get(`/api/empresas/${idEmpresa}/productos`),
                            axios.get<TerceroResponsePersonaDTO[]>(`/api/empresas/${idEmpresa}/clientes?tipo=persona`),
                            axios.get<TerceroResponseEmpresaDTO[]>(`/api/empresas/${idEmpresa}/clientes?tipo=empresa`)
                        ]);

                        if (productosRes.status === 200) setProductos(productosRes.data);
                        if (clientesPersonaRes.status === 200) setClientesPersona(clientesPersonaRes.data);
                        if (clientesEmpresaRes.status === 200) setClientesEmpresa(clientesEmpresaRes.data);
                    }

                    else {
                        obtenerEmpresas();
                    }

                } catch (error) {
                    console.error("Error general al obtener datos del contexto:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }, [status, idEmpresa, idRol]);



    return null;
};


