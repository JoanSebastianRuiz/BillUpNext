import { MunicipioDAO } from "@/dao/MunicipioDAO";
import { MunicipioResponseDTO } from "@/dto/MunicipioResponseDTO";
import { ejecutarQuery } from "@/connection/conexion";

export class MunicipioDAOImpl implements MunicipioDAO {
    private static instance: MunicipioDAOImpl;
    private constructor() { }
    public static getInstance(): MunicipioDAOImpl {
        if (!MunicipioDAOImpl.instance) {
            MunicipioDAOImpl.instance = new MunicipioDAOImpl();
        }
        return MunicipioDAOImpl.instance;
    }

    public getAll = async (): Promise<MunicipioResponseDTO[]> => {
        try{
            const municipios: MunicipioResponseDTO[] = await ejecutarQuery(
                `SELECT \"idMunicipio\", \"idDepartamento\", \"nombreMunicipio\" FROM \"Municipio\";`,
                []
            );
            return municipios;
        } catch (error) {
            throw new Error(`Error en MunicipioDAO.getAll: ${error}`);
        }   
    }
}