import { TipoDocumentoService } from '@/services/TipoDocumentoService';
import { TipoDocumentoDAOImpl } from '@/dao/impl/TipoDocumentoDAOImpl';
import { TipoDocumento } from '@/models/TipoDocumento';
import { NextResponse } from 'next/server';
import { TipoDocumentoResponseDTO } from '@/dto/TipoDocumentoResponseDTO';
import { plainToInstance } from 'class-transformer';

export class TipoDocumentoServiceImpl implements TipoDocumentoService {
    private static instance: TipoDocumentoServiceImpl;
    private tipoDocumentoDAOImpl: TipoDocumentoDAOImpl;

    private constructor() {
        this.tipoDocumentoDAOImpl = TipoDocumentoDAOImpl.getInstance();
    }

    public static getInstance(): TipoDocumentoServiceImpl {
        if (!TipoDocumentoServiceImpl.instance) {
            TipoDocumentoServiceImpl.instance = new TipoDocumentoServiceImpl();
        }

        return TipoDocumentoServiceImpl.instance;
    }
   
    public getAll = async(): Promise<Array<TipoDocumentoResponseDTO>> => {
        try {
            const tipoDocumentos: TipoDocumentoResponseDTO[] = await this.tipoDocumentoDAOImpl.getAll();
            return tipoDocumentos;
        } catch (error) {
            throw new Error(`Error al obtener los tipos de documento: ${error}`);
        }
    }
}