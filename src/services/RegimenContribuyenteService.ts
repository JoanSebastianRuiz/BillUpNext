import { RegimenContribuyenteResponseDTO } from '@/dto/RegimenContribuyenteResponseDTO';

export interface RegimenContribuyenteService {
    getAll(): Promise<Array<RegimenContribuyenteResponseDTO>>;
}