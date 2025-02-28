import { RegimenContribuyenteResponseDTO } from "@/dto/RegimenContribuyenteResponseDTO";

export interface RegimenContribuyenteDAO {
    getAll(): Promise<Array<RegimenContribuyenteResponseDTO>>;
}