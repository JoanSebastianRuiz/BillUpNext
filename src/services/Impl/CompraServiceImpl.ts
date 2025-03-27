import { CompraService } from "@/services/CompraService";
import { CompraDAOImpl } from "@/dao/impl/CompraDAOImpl";
import { NextResponse } from "next/server";
import { CompraDTO } from "@/dto/CompraDTO";
import { isValidLength, isValidDinero, isValidNum } from "@/util/validators/validators";

export class CompraServiceImpl implements CompraService {
    private static instancia: CompraServiceImpl;
    private compraDAOImpl: CompraDAOImpl = CompraDAOImpl.getInstance();
    private constructor() { }

    public static getInstance(): CompraServiceImpl {
        if (!CompraServiceImpl.instancia) {
            CompraServiceImpl.instancia = new CompraServiceImpl();
        }
        return CompraServiceImpl.instancia;
    }

    public create = async (compra: CompraDTO): Promise<NextResponse> => {
        try {
            const { idUsuario, observacionCompra, valorTotalCompra, detallesCompra } = compra;

            if (!idUsuario || !valorTotalCompra || !detallesCompra) {
                return NextResponse.json(
                    { message: "Faltan campos por llenar" },
                    { status: 400 }
                );
            }

            if(observacionCompra && !isValidLength(observacionCompra, 250)) {
                return NextResponse.json(
                    { message: "La observación debe tener entre 1 y 250 caracteres" },
                    { status: 400 }
                );
            }

            if(!isValidDinero(valorTotalCompra.toString())) {
                return NextResponse.json(
                    { message: "El valor total de la compra debe ser un número positivo" },
                    { status: 400 }
                );
            }

            for (let detalle of detallesCompra) {
                const { idTercero, idProducto, cantidadDetalleCompra, valorDetalleCompra } = detalle;
                if(!idTercero || !idProducto || !cantidadDetalleCompra|| !valorDetalleCompra) {
                    return NextResponse.json(
                        { message: "Faltan campos por llenar" },
                        { status: 400 }
                    );
                }

                if(!isValidDinero(valorDetalleCompra.toString())) {
                    return NextResponse.json(
                        { message: "El valor de un producto debe ser un número positivo" },
                        { status: 400 }
                    );
                }

                if(!isValidNum(cantidadDetalleCompra.toString())) {
                    return NextResponse.json(
                        { message: "La cantidad de un producto debe ser un número positivo" },
                        { status: 400 }
                    );
                }
            }

            const respuesta = await this.compraDAOImpl.create(compra);
            if (respuesta) {
                return NextResponse.json(
                    { message: "Compra creada correctamente" },
                    { status: 200 }
                );
            } else {
                return NextResponse.json(
                    { message: "Error al crear la compra" },
                    { status: 500 }
                )
            }
        } catch (error) {
            throw new Error(`Error en CompraService.create: ${error}`);
        }
    };

    public cancel = async (compra: CompraDTO): Promise<NextResponse> => {
        try {
            const { idCompra, motivoCancelacionCompra, idUsuarioCancelacionCompra } = compra;

            if (!idCompra || !motivoCancelacionCompra || !idUsuarioCancelacionCompra) {
                return NextResponse.json(
                    { message: "Faltan campos por llenar" },
                    { status: 400 }
                );
            }

            if(!isValidLength(motivoCancelacionCompra, 250)) {
                return NextResponse.json(
                    { message: "El motivo debe tener entre 1 y 250 caracteres" },
                    { status: 400 }
                );
            }

            const respuesta = await this.compraDAOImpl.cancel(compra);
            if (respuesta) {
                return NextResponse.json(
                    { message: "Compra cancelada correctamente" },
                    { status: 200 }
                );
            } else {
                return NextResponse.json(
                    { message: "Error al cancelar la compra" },
                    { status: 500 }
                );
            }
        } catch (error) {
            throw new Error(`Error en CompraService.update: ${error}`);
        }
    };

    public getAll = async (idEmpresa: number): Promise<Array<CompraDTO>> => {
        try {
            const respuesta: CompraDTO[] = await this.compraDAOImpl.getAll(idEmpresa);
            return respuesta;
        } catch (error) {
            throw new Error(`Error en CompraService.getAll: ${error}`);
        }
    };

    public getById = async (idCompra: number): Promise<CompraDTO | null> => {
        try {
            const respuesta = await this.compraDAOImpl.getById(idCompra);

            if (!respuesta) {
                return null;
            }
            return respuesta
        } catch (error) {
            throw new Error(`Error en CompraService.getById: ${error}`);
        }
    };
}
