import { NextResponse } from "next/server";
import { TipoMedioPagoDTO } from "@/dto/TipoMedioPagoDTO";

export interface TipoMedioPagoService {
    getAll(): Promise<Array<TipoMedioPagoDTO>>;
    create(tipoMedioPago: TipoMedioPagoDTO): Promise<NextResponse>;
    update(tipoMedioPago: TipoMedioPagoDTO): Promise<NextResponse>;
    getByid(idTipoMediopago: number): Promise<TipoMedioPagoDTO | null>;
}