import { TipoDocumentoResponseDTO } from "@/dto/TipoDocumentoResponseDTO";

export interface TipoDocumentoService {
    getAll(): Promise<Array<TipoDocumentoResponseDTO>>;
}