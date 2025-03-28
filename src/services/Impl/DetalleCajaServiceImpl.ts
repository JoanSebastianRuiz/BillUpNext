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

    public create = async (detalleCaja: DetalleCajaDTO): Promise<NextResponse> => {
        try {
            const {
                idCaja,
                idUsuario,
                dineroAperturaDetalleCaja
            } = detalleCaja;

            if (!idCaja || !idUsuario || !dineroAperturaDetalleCaja) {
                return NextResponse.json({ message: 'Faltan campos por llenar' }, { status: 400 });

            }

            if (!isValidDinero(dineroAperturaDetalleCaja.toString())) {
                return NextResponse.json({ message: 'El dinero debe ser un número positivo' }, { status: 400 });
            }

            const respuesta = await this.detalleCajaDAOImpl.create(detalleCaja);

            if (respuesta) {
                return NextResponse.json({ message: 'Se abrio la caja correctamente' }, { status: 200 });
            } else {
                return NextResponse.json({ message: 'Error al abrir la caja' }, { status: 500 });
            }
        } catch (error) {
            throw new Error(`Error en DetalleCajaService.create: ${error}`);
        }
    }

    public update = async (detalleCaja: DetalleCajaDTO): Promise<NextResponse> => {
        try {
            const {
                idDetalleCaja,
                dineroCierreDetalleCaja
            } = detalleCaja;

            if (!idDetalleCaja || !dineroCierreDetalleCaja) {
                return NextResponse.json({ message: 'Faltan campos por llenar' }, { status: 400 });
            }

            if (!isValidDinero(dineroCierreDetalleCaja.toString())) {
                return NextResponse.json({ message: 'El dinero debe ser un número positivo' }, { status: 400 });
            }

            const respuesta = await this.detalleCajaDAOImpl.update(detalleCaja);

            if (respuesta) {
                return NextResponse.json({ message: 'Se cerro la caja correctamente' }, { status: 200 });
            } else {
                return NextResponse.json({ message: 'Error al cerrar la caja' }, { status: 500 });
            }
        } catch (error) {
            throw new Error(`Error en DetalleCajaService.update: ${error}`);
        }
    }

    public getAll = async (idEmpresa: number): Promise<Array<DetalleCajaDTO>> => {
        try {
            const respuesta: DetalleCajaDTO[] = await this.detalleCajaDAOImpl.getAll(idEmpresa);
            return respuesta;
        } catch (error) {
            throw new Error(`Error en DetalleCajaService.getAll: ${error}`);
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