import { DepartamentoResponseDTO } from "@/dto/DepartamentoResponseDTO";

export interface DepartamentoDAO {
    getAll(): Promise<DepartamentoResponseDTO[]>;
}