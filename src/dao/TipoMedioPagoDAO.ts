import { TipoMedioPagoDTO } from "@/dto/TipoMedioPagoDTO";

export interface TipoMedioPagoDAO{
    getAll(): Promise<Array<TipoMedioPagoDTO>>;
    getById(idTipoMedioPago: number): Promise<TipoMedioPagoDTO | null>;
    create(tipoMedioPago: TipoMedioPagoDTO): Promise<boolean>;
    update(tipoMedioPago: TipoMedioPagoDTO): Promise<boolean>;
    delete(idTipoMedioPago: number): Promise<boolean>;
    existNombreTipoMedioPago(nombreTipoMedioPago: string ): Promise<boolean>;
}