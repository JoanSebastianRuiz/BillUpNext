"use client";

import { useEffect, useState } from "react";
import { useCajaContext } from "./CajaContext";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useCompraContext } from "./CompraContext";
import { useEmpresaContext } from "./EmpresaContext";
import { useProductoContext } from "./ProductoContext";
import { useTerceroContext } from "./TerceroContext";
import { useUsuarioContext } from "./UsuarioContext";
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
            if (status !== "authenticated" || idEmpresa == undefined || idRol === undefined || idUsuario === undefined) return;
            if (!session) return;

            setLoading(true);
            try {
                const params = new URLSearchParams();
                params.append('idEmpresa', idEmpresa.toString());
                params.append('idRol', idRol.toString());
                params.append('idUsuario', idUsuario.toString());
                const data = await axios.get(` /api/load-data?${params.toString()}`);
                if (data.status === 200) {
                    const {
                        cajas,
                        detallesCajas,
                        movimientos,
                        compras,
                        detallesCompras,
                        tiposPersona,
                        regimenesContribuyente,
                        empresas,
                        categorias,
                        productos,
                        gravamenesProducto,
                        clientesPersona,
                        clientesEmpresa,
                        proveedoresPersona,
                        proveedoresEmpresa,
                        proveedoresProducto,
                        departamentos,
                        municipios,
                        roles,
                        tiposDocumento,
                        usuario,
                        usuarios,
                        detallesVentas,
                        tiposMedioPago,
                        ubicacionesVenta,
                        ventas
                    } = data.data;

                    setCajas(cajas);
                    setDetallesCajas(detallesCajas);
                    setMovimientos(movimientos);
                    setCompras(compras);
                    setDetallesCompras(detallesCompras);
                    setTiposPersona(tiposPersona);
                    setRegimenesContribuyente(regimenesContribuyente);
                    setEmpresas(empresas);
                    setCategorias(categorias);
                    setProductos(productos);
                    setGravamenesProducto(gravamenesProducto);
                    setClientesPersona(clientesPersona);
                    setClientesEmpresa(clientesEmpresa);
                    setProveedoresPersona(proveedoresPersona);
                    setProveedoresEmpresa(proveedoresEmpresa);
                    setProveedoresProducto(proveedoresProducto);
                    setDepartamentos(departamentos);
                    setMunicipios(municipios);
                    setRoles(roles);
                    setTiposDocumento(tiposDocumento);
                    setUsuario(usuario as UsuarioResponseDTO);
                    setUsuarios(usuarios as UsuarioResponseDTO[]);
                    setDetallesVentas(detallesVentas as DetalleVentaDTO[]);
                    setTiposMedioPago(tiposMedioPago as TipoMedioPagoDTO[]);
                    setUbicacionesVenta(ubicacionesVenta as UbicacionVentaDTO[]);
                    setVentas(ventas as VentaDTO[]);
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


