import { MunicipioService } from "@/services/MunicipioService";
import { MunicipioDAOImpl } from "@/dao/impl/MunicipioDAOImpl";
import { Municipio } from "@/models/Municipio";
import { NextResponse } from "next/server";
import { MunicipioResponseDTO } from "@/dto/MunicipioResponseDTO";

export class MunicipioServiceImpl implements MunicipioService {
    private static instance: MunicipioServiceImpl;
    private municipioDAOImpl: MunicipioDAOImpl = MunicipioDAOImpl.getInstance();

    private constructor() { }

    public static getInstance(): MunicipioServiceImpl {
        if (!MunicipioServiceImpl.instance) {
            MunicipioServiceImpl.instance = new MunicipioServiceImpl();
        }

        return MunicipioServiceImpl.instance;
    }

    public getAll = async (): Promise<MunicipioResponseDTO[]> => {
        try {
            const municipiosDatabase: MunicipioResponseDTO[] = await this.municipioDAOImpl.getAll();
            return municipiosDatabase;
        } catch (error) {
            throw new Error(`Error en MunicipioService.getAll: ${error}`);
        }
    }
}