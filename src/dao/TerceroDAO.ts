import { TerceroRequestEmpresaDTO } from "@/dto/TerceroRequestEmpresaDTO";
import { TerceroRequestPersonaDTO } from "@/dto/TerceroRequestPersonaDTO";
import { TerceroResponseEmpresaDTO } from "@/dto/TerceroResponseEmpresaDTO";
import { TerceroResponsePersonaDTO } from "@/dto/TerceroResponsePersonaDTO";

export interface TerceroDAO {
    createEmpresa(tercero: TerceroRequestEmpresaDTO): Promise<boolean>;
    createPersona(tercero: TerceroRequestPersonaDTO): Promise<boolean>;
    updateEmpresa(tercero: TerceroRequestEmpresaDTO): Promise<boolean>;
    updatePersona(tercero: TerceroRequestPersonaDTO): Promise<boolean>;
    getAllEmpresa(idEmpresa: number, proveedorTercero: boolean): Promise<Array<TerceroResponseEmpresaDTO>>;
    getAllPersona(idEmpresa: number, proveedorTercero: boolean): Promise<Array<TerceroResponsePersonaDTO>>;
    getByIdTerceroPersona(idTercero: number): Promise<TerceroResponsePersonaDTO | null>;
    getByIdTerceroEmpresa(idTercero: number): Promise<TerceroResponseEmpresaDTO | null>;
    existTerceroDoc(numeroDocumentoTercero: string, idEmpresa: number, proveedorTercero: boolean): Promise<boolean>;
    existTerceroNit(nitTercero: string, idEmpresa: number, proveedorTercero: boolean): Promise<boolean>;
    existTerceroCorreo(correoTercero: string, idEmpresa: number, proveedorTercero: boolean): Promise<boolean>;
    existTerceroTelefono(telefonoTercero: string, idEmpresa: number, proveedorTercero: boolean): Promise<boolean>;
}