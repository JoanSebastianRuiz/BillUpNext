import { RolDAO } from "../RolDAO";
import { Rol } from "@/models/Rol";
import { RolDTO } from "@/dto/RolDTO";
import { ejecutarQuery } from "@/connection/conexion";

export class RolDAOImpl implements RolDAO {
    private static instance: RolDAOImpl;
    private constructor() { }
    public static getInstance(): RolDAOImpl {
        if (!RolDAOImpl.instance) {
            RolDAOImpl.instance = new RolDAOImpl();
        }
        return RolDAOImpl.instance;
    }

    public getAll = async(): Promise<RolDTO[]> =>{
        try {
            const roles: RolDTO[] = await ejecutarQuery(
                `SELECT * FROM \"Rol\";`,
                []
            );
            return roles;
        } catch (error) {
            throw new Error(`Error en RolDAO.getAll: ${error}`);
        }
    }
}