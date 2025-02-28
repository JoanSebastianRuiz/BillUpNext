import { TipoPersonaDAO } from "@/dao/TipoPersonaDAO";
import { TipoPersonaDTO } from "@/dto/TipoPersonaDTO";
import { ejecutarQuery } from "@/connection/conexion";

export class TipoPersonaDAOImpl implements TipoPersonaDAO {
    private static instance: TipoPersonaDAOImpl;
    private constructor() { }
    public static getInstance(): TipoPersonaDAOImpl {
        if (!TipoPersonaDAOImpl.instance) {
            TipoPersonaDAOImpl.instance = new TipoPersonaDAOImpl();
        }
        return TipoPersonaDAOImpl.instance;
    }
    public getAll = async (): Promise<Array<TipoPersonaDTO>> => {
        try {
            const query = "SELECT * FROM \"TipoPersona\";";
            const result = await ejecutarQuery(query, []);
            return result;
        } catch (error) {
            throw new Error(`Error en TipoPersonaDAO.getAll: ${error}`);
        }
    }
} 