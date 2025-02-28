import { MunicipioResponseDTO } from "@/dto/MunicipioResponseDTO";

export interface MunicipioService{
    getAll(): Promise<MunicipioResponseDTO[]>;
}