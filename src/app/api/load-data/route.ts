import { NextRequest, NextResponse } from "next/server";
import { CajaServiceImpl } from "@/services/Impl/CajaServiceImpl";
import { TipoPersonaServiceImpl } from "@/services/Impl/TipoPersonaServiceImpl";
import { RegimenContribuyenteServiceImpl } from "@/services/Impl/RegimenContribuyenteServiceImpl";
import { EmpresaServiceImpl } from "@/services/Impl/EmpresaServiceImpl";
import { DepartamentoServiceImpl } from "@/services/Impl/DepartamentoServiceImpl";
import { MunicipioServiceImpl } from "@/services/Impl/MunicipioServiceImpl";
import { RolServiceImpl } from "@/services/Impl/RolServiceImpl";
import { TipoDocumentoServiceImpl } from "@/services/Impl/TipoDocumentoServiceImpl";
import { UsuarioServiceImpl } from "@/services/Impl/UsuarioServiceImpl";
import { UbicacionVentaServiceImpl } from "@/services/Impl/UbicacionVentaServiceImpl";
import { VentaServiceImpl } from "@/services/Impl/VentaServiceImpl";
import { DetalleVentaServiceImpl } from "@/services/Impl/DetalleVentaServiceImpl";
import { DetalleCajaServiceImpl } from "@/services/Impl/DetalleCajaServiceImpl";
import { MovimientoServiceImpl } from "@/services/Impl/MovimientoServiceImpl";
import { CompraServiceImpl } from "@/services/Impl/CompraServiceImpl";
import { DetalleCompraServiceImpl } from "@/services/Impl/DetalleCompraServiceImpl";
import { CategoriaServiceImpl } from "@/services/Impl/CategoriaServiceImpl";
import { ProductoServiceImpl } from "@/services/Impl/ProductoServiceImpl";
import { GravamenProductoServiceImpl } from "@/services/Impl/GravamenProductoServiceImpl";
import { TerceroServiceImpl } from "@/services/Impl/TerceroServiceImpl";
import { TerceroProductoServiceImpl } from "@/services/Impl/TerceroProductoServiceImpl";
import { TipoMedioPagoServiceImpl } from "@/services/Impl/TipoMedioPagoServiceImpl";
import { GravamenServiceImpl } from "@/services/Impl/GravamenServiceImpl";

export const GET = async (request: NextRequest) => {
    try {
        const params = request.nextUrl.searchParams;
        const idRol = params.get("idRol");
        const idEmpresa = params.get("idEmpresa");
        const idUsuario = params.get("idUsuario");

        if (!idRol) {
            return NextResponse.json({ message: "idRol es requerido" }, { status: 400 });
        }

        if (!idEmpresa) {
            return NextResponse.json({ message: "idEmpresa es requerido" }, { status: 400 });
        }

        if (!idUsuario) {
            return NextResponse.json({ message: "idUsuario es requerido" }, { status: 400 });
        }

        const tipoPersonaService = TipoPersonaServiceImpl.getInstance();
        const regimenContribuyenteService = RegimenContribuyenteServiceImpl.getInstance();
        const empresaService = EmpresaServiceImpl.getInstance();
        const departamentoService = DepartamentoServiceImpl.getInstance();
        const municipioService = MunicipioServiceImpl.getInstance();
        const rolService = RolServiceImpl.getInstance();
        const tipoDocumentoService = TipoDocumentoServiceImpl.getInstance();
        const usuarioService = UsuarioServiceImpl.getInstance();
        const ubicacionVentaService = UbicacionVentaServiceImpl.getInstance();
        const ventaService = VentaServiceImpl.getInstance();
        const detalleVentaService = DetalleVentaServiceImpl.getInstance();
        const cajaService = CajaServiceImpl.getInstance();
        const detalleCajaService = DetalleCajaServiceImpl.getInstance();
        const movimientoService = MovimientoServiceImpl.getInstance();
        const compraService = CompraServiceImpl.getInstance();
        const detalleCompraService = DetalleCompraServiceImpl.getInstance();
        const categoriaService = CategoriaServiceImpl.getInstance();
        const productoService = ProductoServiceImpl.getInstance();
        const gravamenProductoService = GravamenProductoServiceImpl.getInstance();
        const terceroService = TerceroServiceImpl.getInstance();
        const proveedorProductoService = TerceroProductoServiceImpl.getInstance();
        const tipoMedioPagoService = TipoMedioPagoServiceImpl.getInstance();
        const gravamenSevice = GravamenServiceImpl.getInstance();


        if (idRol === "1" || idRol === "2") {
            const [
                tiposPersona,
                regimenesContribuyente,
                empresas,
                departamentos,
                municipios,
                roles,
                tiposDocumento,
                usuarios,
                ubicacionesVenta,
                ventas,
                detallesVentas,
                cajas,
                detallesCajas,
                movimientos,
                compras,
                detallesCompras,
                categorias,
                productos,
                gravamenesProducto,
                clientesPersona,
                clientesEmpresa,
                proveedoresPersona,
                proveedoresEmpresa,
                proveedoresProducto,
                usuario,
                gravamenes,
            ] = await Promise.all([
                tipoPersonaService.getAll(),
                regimenContribuyenteService.getAll(),
                empresaService.getAll(),
                departamentoService.getAll(),
                municipioService.getAll(),
                rolService.getAll(),
                tipoDocumentoService.getAll(),
                usuarioService.getAll(),
                ubicacionVentaService.getAll(Number(idEmpresa)),
                ventaService.getAll(Number(idEmpresa)),
                detalleVentaService.getAll(Number(idEmpresa)),
                cajaService.getAll(Number(idEmpresa)),
                detalleCajaService.getAll(Number(idEmpresa)),
                movimientoService.getAll(Number(idEmpresa)),
                compraService.getAll(Number(idEmpresa)),
                detalleCompraService.getAll(Number(idEmpresa)),
                categoriaService.getAll(Number(idEmpresa)),
                productoService.getAll(Number(idEmpresa)),
                gravamenProductoService.getAll(Number(idEmpresa)),
                terceroService.getAllPersona(Number(idEmpresa), false),
                terceroService.getAllEmpresa(Number(idEmpresa), false),
                terceroService.getAllPersona(Number(idEmpresa), true),
                terceroService.getAllEmpresa(Number(idEmpresa), true),
                proveedorProductoService.getAll(Number(idEmpresa)),
                usuarioService.getByIdUser(Number(idUsuario)),
                gravamenSevice.getAll(),
            ]);

            return NextResponse.json({
                tiposPersona,
                regimenesContribuyente,
                empresas,
                departamentos,
                municipios,
                roles: idRol === '1' ? roles : roles.filter((rol) => rol.idRol !== 1),
                tiposDocumento,
                usuarios: idRol === '1' ? usuarios : usuarios.filter((usuario) => usuario.idUsuario !== Number(idUsuario) && usuario.idRol !== 1 && usuario.idEmpresa === Number(idEmpresa)),
                ubicacionesVenta,
                ventas,
                detallesVentas,
                cajas,
                detallesCajas,
                movimientos,
                compras,
                detallesCompras,
                categorias,
                productos,
                gravamenesProducto,
                clientesPersona,
                clientesEmpresa,
                proveedoresPersona,
                proveedoresEmpresa,
                proveedoresProducto,
                usuario,
                gravamenes,
            }, { status: 200 });

        } else if (idRol === "3") {
            const [
                tiposPersona,
                regimenesContribuyente,
                empresas,
                departamentos,
                municipios,
                roles,
                tiposDocumento,
                ubicacionesVenta,
                ventas,
                detallesVentas,
                tiposMedioPago,
                cajas,
                detallesCajas,
                movimientos,
                productos,
                clientesPersona,
                clientesEmpresa,
                usuario,
                gravamenes,
            ] = await Promise.all([
                tipoPersonaService.getAll(),
                regimenContribuyenteService.getAll(),
                empresaService.getAll(),
                departamentoService.getAll(),
                municipioService.getAll(),
                rolService.getAll(),
                tipoDocumentoService.getAll(),
                ubicacionVentaService.getAll(Number(idEmpresa)),
                ventaService.getAll(Number(idEmpresa)),
                detalleVentaService.getAll(Number(idEmpresa)),
                tipoMedioPagoService.getAll(),
                cajaService.getAll(Number(idEmpresa)),
                detalleCajaService.getAll(Number(idEmpresa)),
                movimientoService.getAll(Number(idEmpresa)),
                productoService.getAll(Number(idEmpresa)),
                terceroService.getAllPersona(Number(idEmpresa), false),
                terceroService.getAllEmpresa(Number(idEmpresa), false),
                usuarioService.getByIdUser(Number(idUsuario)),         
                gravamenSevice.getAll(),
            ]);

            return NextResponse.json({
                tiposPersona,
                regimenesContribuyente,
                empresas,
                departamentos,
                municipios,
                roles,
                tiposDocumento,
                ubicacionesVenta,
                ventas,
                detallesVentas,
                tiposMedioPago,
                cajas,
                detallesCajas: detallesCajas.filter(detalle => detalle.idUsuario === Number(idUsuario)),
                movimientos: movimientos.filter(movimiento => movimiento.idUsuario === Number(idUsuario)),
                productos,
                clientesPersona,
                clientesEmpresa,
                usuario,
                gravamenes,
            }, { status: 200 });

        } else if (idRol === "4") {
            const [
                tiposPersona,
                regimenesContribuyente,
                empresas,
                departamentos,
                municipios,
                roles,
                tiposDocumento,
                productos,
                clientesPersona,
                clientesEmpresa,
                usuario,
                gravamenes,
            ] = await Promise.all([
                tipoPersonaService.getAll(),
                regimenContribuyenteService.getAll(),
                empresaService.getAll(),
                departamentoService.getAll(),
                municipioService.getAll(),
                rolService.getAll(),
                tipoDocumentoService.getAll(),
                productoService.getAll(Number(idEmpresa)),
                terceroService.getAllPersona(Number(idEmpresa), false),
                terceroService.getAllEmpresa(Number(idEmpresa), false),
                usuarioService.getByIdUser(Number(idUsuario)),
                gravamenSevice.getAll(),
            ]);

            return NextResponse.json({
                tiposPersona,
                regimenesContribuyente,
                empresas,
                departamentos,
                municipios,
                roles,
                tiposDocumento,
                productos,
                clientesPersona,
                clientesEmpresa,
                usuario,
                gravamenes,
            }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Rol no reconocido" }, { status: 400 });
        }


    } catch (error) {
        console.error("Error al cargar la información inicial", error);
        return NextResponse.json({ message: "Error al cargar la información del idRol" }, { status: 500 });
    }
};
