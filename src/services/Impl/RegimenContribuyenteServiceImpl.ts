import { RegimenContribuyenteDAOImpl } from "@/dao/impl/RegimenContribuyenteDAOImpl";
import { RegimenContribuyenteResponseDTO } from "@/dto/RegimenContribuyenteResponseDTO";

export class RegimenContribuyenteServiceImpl {
    private static instance: RegimenContribuyenteDAOImpl;
    private constructor() { }
    public static getInstance(): RegimenContribuyenteServiceImpl {
        if (!RegimenContribuyenteServiceImpl.instance) {
            RegimenContribuyenteServiceImpl.instance = new RegimenContribuyenteServiceImpl();
        }
        return RegimenContribuyenteServiceImpl.instance;
    }
    public getAll = async (): Promise<Array<RegimenContribuyenteResponseDTO>> => {
        try {
            return await RegimenContribuyenteDAOImpl.getInstance().getAll();
        } catch (error) {
            throw new Error(`Error en RegimenContribuyenteService.getAll: ${error}`);
        }
    }
}