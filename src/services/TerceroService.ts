import { NextResponse } from 'next/server';
import { TerceroRequestEmpresaDTO } from '../dto/TerceroRequestEmpresaDTO';
import { TerceroRequestPersonaDTO } from '../dto/TerceroRequestPersonaDTO';
import { TerceroResponseEmpresaDTO } from '../dto/TerceroResponseEmpresaDTO';
import { TerceroResponsePersonaDTO } from '../dto/TerceroResponsePersonaDTO';

export interface TerceroService {
    createEmpresa(tercero: TerceroRequestEmpresaDTO): Promise<NextResponse>;
    createPersona(tercero: TerceroRequestPersonaDTO): Promise<NextResponse>;
    updateEmpresa(tercero: TerceroRequestEmpresaDTO): Promise<NextResponse>;
    updatePersona(tercero: TerceroRequestPersonaDTO): Promise<NextResponse>;
    getAllEmpresa(idEmpresa: number): Promise<Array<TerceroResponseEmpresaDTO>>;
    getAllPersona(idEmpresa: number): Promise<Array<TerceroResponsePersonaDTO>>;
    getByIdTerceroPersona(idTercero: number, idEmpresa: number): Promise<TerceroResponsePersonaDTO | null>;
    getByIdTerceroEmpresa(idTercero: number, idEmpresa: number): Promise<TerceroResponseEmpresaDTO | null>;
}





