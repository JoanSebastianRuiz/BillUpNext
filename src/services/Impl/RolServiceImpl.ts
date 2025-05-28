import { RolService } from "../RolService";
import { NextResponse } from "next/server";
import { RolDAOImpl } from "@/dao/impl/RolDAOImpl";
import { RolDTO } from "@/dto/RolDTO";
import { plainToInstance } from 'class-transformer';

export class RolServiceImpl implements RolService {
    private static instance: RolServiceImpl;
    private rolDAOImpl: RolDAOImpl = RolDAOImpl.getInstance();
    private constructor() { }
    public static getInstance(): RolServiceImpl {
        if (!RolServiceImpl.instance) {
            RolServiceImpl.instance = new RolServiceImpl();
        }
        return RolServiceImpl.instance;
    }

    public getAll = async (): Promise<RolDTO[]> =>{
        try {
            const respuesta: RolDTO[] = await this.rolDAOImpl.getAll();
            return respuesta;
        } catch (error) {
            throw new Error(`Error en RolService.getAll: ${error}`);
        }
    }
}