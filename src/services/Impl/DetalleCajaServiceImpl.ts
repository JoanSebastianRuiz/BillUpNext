import { DetalleCajaService } from "@/services/DetalleCajaService";
import { DetalleCajaDAOImpl } from "@/dao/impl/DetalleCajaDAOImpl";
import { NextResponse } from "next/server";
import { DetalleCajaDTO } from "@/dto/DetalleCajaDTO";
import { isValidDinero } from "@/util/validators/validators";

export class DetalleCajaServiceImpl implements DetalleCajaService {
    private static instancia: DetalleCajaServiceImpl;
    private detalleCajaDAOImpl: DetalleCajaDAOImpl = DetalleCajaDAOImpl.getInstance();
    private constructor() { }

    public static getInstance(): DetalleCajaServiceImpl {
        if (!DetalleCajaServiceImpl.instancia) {
            DetalleCajaServiceImpl.instancia = new DetalleCajaServiceImpl();
        }
        return DetalleCajaServiceImpl.instancia;
    }

    public create = async (detalleCaja: DetalleCajaDTO):  Promise<NextResponse> => {
        try {
            const { idCaja,
                idUsuario,
                fechaAperturaDetalleCaja,
                fechaCierreDetalleCaja,
                dineroAperturaDetalleCaja,
                dineroCierreDetalleCaja
            } = detalleCaja;

            if(!idCaja || !idUsuario || !fechaAperturaDetalleCaja || !fechaCierreDetalleCaja || !dineroAperturaDetalleCaja || !dineroCierreDetalleCaja){
                return NextResponse.json({ message: 'Faltan campos por llenar' }, { status: 400 });
               
            }

            if(!isValidDinero(dineroAperturaDetalleCaja.toString()) || !isValidDinero(dineroCierreDetalleCaja.toString())){
                return NextResponse.json({ message: 'El dinero debe ser un número positivo' }, { status: 400 });
            }

            const respuesta = await this.detalleCajaDAOImpl.create(detalleCaja);

            if (respuesta) {
                return NextResponse.json({ message: 'El detalle de caja fue creado correctamente' }, { status: 200 });
            } else {
                return NextResponse.json({ message: 'Error al crear el detalle de caja' }, { status: 500 });
            }
        } catch (error) {
            throw new Error(`Error en EmpresaService.create: ${error}`);
        }
    }

    public update = async (detalleCaja: DetalleCajaDTO): Promise<NextResponse> => {
        try {
            const { idDetalleCaja,
                idCaja,
                idUsuario,
                fechaAperturaDetalleCaja,
                fechaCierreDetalleCaja,
                dineroAperturaDetalleCaja,
                dineroCierreDetalleCaja
            } = detalleCaja;

            if(!idDetalleCaja || !idCaja || !idUsuario || !fechaAperturaDetalleCaja || !fechaCierreDetalleCaja || !dineroAperturaDetalleCaja || !dineroCierreDetalleCaja){
                return NextResponse.json({ message: 'Faltan campos por llenar' }, { status: 400 });
            }

            if(!isValidDinero(dineroAperturaDetalleCaja.toString()) || !isValidDinero(dineroCierreDetalleCaja.toString())){
                return NextResponse.json({ message: 'El dinero debe ser un número positivo' }, { status: 400 });
            }

            const respuesta = await this.detalleCajaDAOImpl.update(detalleCaja);

            if (respuesta) {
                return NextResponse.json({ message: 'El detalle de caja fue actualizado correctamente' }, { status: 200 });
            } else {
                return NextResponse.json({ message: 'Error al actualizar el detalle de caja' }, { status: 500 });
            }
        } catch (error) {
            throw new Error(`Error en EmpresaService.update: ${error}`);
        }
    }

    public getAll = async (): Promise<Array<DetalleCajaDTO>> => {
        try {
            const respuesta: DetalleCajaDTO[] = await this.detalleCajaDAOImpl.getAll();
            return respuesta;
        } catch (error) {
            throw new Error(`Error en DetallaCajaService.getAll: ${error}`);
        }
    }

    public getById = async (idDetalleCaja: number): Promise<DetalleCajaDTO | null> => {
        try {
            const respuesta = await this.detalleCajaDAOImpl.getById(idDetalleCaja);
            
            if (!respuesta) {
                return null;
            }
            return respuesta;
        } catch (error) {
            throw new Error(`Error en DetalleCajaService.getById: ${error}`);
        }
    }

}