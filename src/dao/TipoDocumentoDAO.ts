import { TipoDocumentoResponseDTO } from "@/dto/TipoDocumentoResponseDTO";

export interface TipoDocumentoDAO{
    getAll(): Promise<Array<TipoDocumentoResponseDTO>>;
}