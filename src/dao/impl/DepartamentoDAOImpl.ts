import { DepartamentoDAO } from "../DepartamentoDAO";
import { DepartamentoResponseDTO } from "@/dto/DepartamentoResponseDTO";
import { ejecutarQuery } from "@/connection/conexion";

export class DepartamentoDAOImpl implements DepartamentoDAO{
    private static instance: DepartamentoDAOImpl;

    private constructor(){}

    public static getInstance(): DepartamentoDAOImpl{
        if(!DepartamentoDAOImpl.instance){
            DepartamentoDAOImpl.instance = new DepartamentoDAOImpl();
        }
        return DepartamentoDAOImpl.instance;
    }

    public getAll = async (): Promise<DepartamentoResponseDTO[]> =>{
        try{
            const departamentos: DepartamentoResponseDTO[] = await ejecutarQuery(
                `SELECT \"idDepartamento\", \"nombreDepartamento\" FROM \"Departamento\";`,
                []
            );
            return departamentos;
        } catch (error) {
            throw new Error("Error in DepartamentoDAOImpl.getAll: " + error);
        }
    }
}