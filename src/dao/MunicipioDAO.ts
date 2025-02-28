import { MunicipioResponseDTO } from "@/dto/MunicipioResponseDTO";

export interface MunicipioDAO {
    getAll(): Promise<MunicipioResponseDTO[]>;
}