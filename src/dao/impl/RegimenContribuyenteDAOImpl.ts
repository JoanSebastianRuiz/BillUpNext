import { RegimenContribuyenteDAO } from "../RegimenContribuyenteDAO";
import { RegimenContribuyenteResponseDTO } from "@/dto/RegimenContribuyenteResponseDTO";
import { ejecutarQuery } from "@/connection/conexion";

export class RegimenContribuyenteDAOImpl implements RegimenContribuyenteDAO {
    private static instance: RegimenContribuyenteDAOImpl;
    private constructor() { }
    public static getInstance(): RegimenContribuyenteDAOImpl {
        if (!RegimenContribuyenteDAOImpl.instance) {
            RegimenContribuyenteDAOImpl.instance = new RegimenContribuyenteDAOImpl();
        }
        return RegimenContribuyenteDAOImpl.instance;
    }
    public getAll = async (): Promise<Array<RegimenContribuyenteResponseDTO>> => {
        try {
            const query = "SELECT \"idRegimenContribuyente\", \"nombreRegimenContribuyente\" FROM \"RegimenContribuyente\";";
            const result = await ejecutarQuery(query, []);
            return result;
        } catch (error) {
            throw new Error(`Error en RegimenContribuyenteDAO.getAll: ${error}`);
        }
    }
}