import { TipoMedioPagoService } from "@/services/TipoMedioPagoService";
import { TipoMedioPagoDAOImpl } from "@/dao/impl/TipoMedioPagoDAOImpl";
import { NextResponse } from "next/server";
import { TipoMedioPagoDTO } from "@/dto/TipoMedioPagoDTO";


export class TipoMedioPagoServiceImpl implements TipoMedioPagoService {
    private static instancia: TipoMedioPagoServiceImpl;
    private tipoMedioPagoDAOImpl: TipoMedioPagoDAOImpl = TipoMedioPagoDAOImpl.getInstance();
    private constructor() { }
    
    getByid(idTipoMediopago: number): Promise<TipoMedioPagoDTO | null> {
        return this.getById(idTipoMediopago);
    }

    public static getInstance(): TipoMedioPagoServiceImpl {
        if (!TipoMedioPagoServiceImpl.instancia) {
            TipoMedioPagoServiceImpl.instancia = new TipoMedioPagoServiceImpl();
        }
        return TipoMedioPagoServiceImpl.instancia;

    }

    public create = async (tipoMedioPago: TipoMedioPagoDTO): Promise<NextResponse> =>{
        try {
            const {
                nombreTipoMedioPago,
                estadoTipoMedioPago
            } = tipoMedioPago;

            if(!nombreTipoMedioPago || !estadoTipoMedioPago){
                return NextResponse.json({message: 'Faltan campos por llenar'}, {status: 400});
            }

            const respuesta = await this.tipoMedioPagoDAOImpl.create(tipoMedioPago);

            if(respuesta){
                return NextResponse.json({message: 'Tipo de medio de pago creado correctamente'}, {status: 200});
            } else {
                return NextResponse.json({message: 'Error al crear el tipo de medio de pago'}, {status: 500});
            }
        } catch (error) {
            throw new Error(`Error en TipoMedioPagoService.create: ${error}`);
        }
    }

    public update = async (tipoMedioPago : TipoMedioPagoDTO) : Promise<NextResponse> => {
        try {
            const {
                idTipoMedioPago,
                nombreTipoMedioPago,
                estadoTipoMedioPago
            }= tipoMedioPago;
             if (!idTipoMedioPago || !nombreTipoMedioPago || !estadoTipoMedioPago) {
                return NextResponse.json({message: 'Faltan campos por llenar'}, {status: 400});
             }

             const respuesta = await this.tipoMedioPagoDAOImpl.update(tipoMedioPago);
             if ( respuesta) {
                return NextResponse.json({message: 'Tipo de medio de pago actualizado correctamente'}, {status: 200});
             } else {
                return NextResponse.json({message: 'Error al actualizar el tipo de medio de pago'}, {status: 500});
             }

        } catch (error) {
            throw new Error(`Error en TipoMedioPagoService.update: ${error}`);
        }
    } 


    public getAll = async (): Promise<Array<TipoMedioPagoDTO>> => {
        try {
            const respuesta: TipoMedioPagoDTO[] = await this.tipoMedioPagoDAOImpl.getAll();
            return respuesta;
        } catch (error) {
            throw new Error(`Error en TipoMedioPagoService.getAll: ${error}`);
        }
    }

    public getById = async ( idTipoMedioPago: number): Promise<TipoMedioPagoDTO | null> => {
        try {
            const respuesta = await this.tipoMedioPagoDAOImpl.getById(idTipoMedioPago);

            if(!respuesta){
                return null;
            }
            return respuesta;
        } catch (error) {
            throw new Error(`Error en TipoMedioPagoService.getById: ${error}`);
        }
    }
    
}