import { UbicacionVentaService } from "../UbicacionVentaService";
import { UbicacionVentaDAOImpl } from "@/dao/impl/UbicacionVentaDAOImpl"; 
import { NextResponse } from "next/server";
import { UbicacionVentaDTO } from "@/dto/UbicacionVentaDTO";
import { UbicacionVenta } from "@/models/UbicacionVenta";

export class UbicacionVentaServiceImpl implements UbicacionVentaService {
    private static instancia: UbicacionVentaServiceImpl;
    private ubicacionVentaDAOImpl: UbicacionVentaDAOImpl = UbicacionVentaDAOImpl.getInstance();
    private constructor() { }

    public static gerInstance(): UbicacionVentaServiceImpl {
        if(!UbicacionVentaServiceImpl.instancia){
            UbicacionVentaServiceImpl.instancia = new UbicacionVentaServiceImpl();
        }
        return UbicacionVentaServiceImpl.instancia;
    }


    public create = async (ubicacionVenta: UbicacionVentaDTO): Promise<NextResponse> =>{
        try {
            const {
                nombreUbicacionVenta,
                estadoUbicacionVenta
            } = ubicacionVenta;

            if(!nombreUbicacionVenta || !estadoUbicacionVenta){
                return NextResponse.json({message: 'Faltan campos por llenar'}, {status: 400});
            }

            const respuesta = await this.ubicacionVentaDAOImpl.create(ubicacionVenta);

            if(respuesta){
                return NextResponse.json({message: 'Ubicacion de venta creada correctamente'}, {status: 200});
            } else {
                return NextResponse.json({message: 'Error al crear la Ubicacion de venta'}, {status: 400});
            }
        } catch (error) {
            throw new Error(`Error en UbicacionVentaService.create: ${error}`);
        }
    }

    public update = async (ubicacionVenta : UbicacionVentaDTO): Promise<NextResponse> =>{
        try {
            const {
                idUbicacionVenta,
                nombreUbicacionVenta,
                estadoUbicacionVenta
            } = ubicacionVenta;

            if(!idUbicacionVenta || !nombreUbicacionVenta || !estadoUbicacionVenta){
                return NextResponse.json({message: 'Faltan campos por llenar'}, {status: 400});
            }

            const respuesta = await this.ubicacionVentaDAOImpl.update(ubicacionVenta);

            if(respuesta){
                return NextResponse.json({message: 'Ubicacion de venta actualizada correctamente'}, {status: 200});
            } else {
                return NextResponse.json({message: 'Error al actualizar la Ubicacion de venta'}, {status: 500});
            }
        } catch (error) {
            throw new Error(`Error en UbicacionVentaService.update: ${error}`);
        }
    }

    public getAll = async (): Promise<Array<UbicacionVentaDTO>> => {
        try {
            const respuesta: UbicacionVentaDTO[] = await this.ubicacionVentaDAOImpl.getAll();
            return respuesta;
        } catch (error) {
            throw new Error(`Error en UbicacionVentaService.getAll: ${error}`);
        }
    }


    public getById = async (idUbicacionVenta: number): Promise<UbicacionVentaDTO | null> => {
        try {
            const respuesta = await this.ubicacionVentaDAOImpl.getById(idUbicacionVenta);

            if(!respuesta){
                return null;
            }
            return respuesta;
        } catch (error) {
            throw new Error(`Error en UbicacionVentaService.getById: ${error}`);
        }
    }


}
