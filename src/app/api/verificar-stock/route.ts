import { NextRequest, NextResponse } from "next/server";
import { VentaDAOImpl } from "@/dao/impl/VentaDAOImpl";

export const POST = async (request: NextRequest) => {
    try {
        const { idProducto, cantidadDetalleVenta } = await request.json();

        if (!idProducto || !cantidadDetalleVenta) {
            return NextResponse.json(
                { message: "Faltan datos para verificar el stock" },
                { status: 400 }
            );
        }

        const ventaDAO = VentaDAOImpl.getInstance();
        const tieneStock = await ventaDAO.stockProducto(idProducto, cantidadDetalleVenta);

        return NextResponse.json({ tieneStock }, { status: 200 });

    } catch (error) {
        console.error("Error al verificar stock:", error);
        return NextResponse.json(
            { message: "Error interno al verificar stock" },
            { status: 500 }
        );
    }
};
