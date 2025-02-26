import { EmpresaService } from "@/services/EmpresaService";
import { EmpresaDAOImpl } from "@/dao/impl/EmpresaDAOImpl";
import { NextResponse } from "next/server";
import { EmpresaResponseDTO } from "@/dto/EmpresaResponseDTO";
import { EmpresaRequestDTO } from "@/dto/EmpresaRequestDTO";
import { isValidDigitoVerificacion, isValidNit, isValidPhoneNumber, isValidEmail } from "@/util/validators/validators";

export class EmpresaServiceImpl implements EmpresaService {
    private static instancia: EmpresaServiceImpl;
    private empresaDAOImpl: EmpresaDAOImpl = EmpresaDAOImpl.getInstance();
    private constructor() { }

    public static getInstance(): EmpresaServiceImpl {
        if (!EmpresaServiceImpl.instancia) {
            EmpresaServiceImpl.instancia = new EmpresaServiceImpl();
        }
        return EmpresaServiceImpl.instancia;
    }

    public create = async (empresa: EmpresaRequestDTO): Promise<NextResponse> =>{
        try{
            const { idTipoPersona, 
                idRegimenContribuyente,
                idMunicipio,
                nitEmpresa,
                digitoVerificacionEmpresa,
                nombreEmpresa,
                razonSocialEmpresa,
                direccionEmpresa,
                codigoPostalEmpresa,
                telefonoEmpresa,
                correoEmpresa,
                logoEmpresa,
                estadoEmpresa   
            } = empresa;

            if(!idTipoPersona || !idRegimenContribuyente || !idMunicipio || !nitEmpresa || !digitoVerificacionEmpresa || !nombreEmpresa || !razonSocialEmpresa || !direccionEmpresa || !codigoPostalEmpresa || !telefonoEmpresa || !correoEmpresa || !logoEmpresa || !estadoEmpresa){
                return NextResponse.json({message: 'Faltan campos por llenar'}, {status: 400});
            }

            if(!isValidNit(nitEmpresa)){
                return NextResponse.json({message: 'El nit no es valido'}, {status: 400});
            }

            if( await this.empresaDAOImpl.existEmpresaNit(nitEmpresa)){
                return NextResponse.json({message: 'El nit ya se encuentra registrado'}, {status: 400});
            }

            if(!isValidDigitoVerificacion(digitoVerificacionEmpresa)){
                return NextResponse.json({message: 'El digito de verificacion no es valido'}, {status: 400});
            }

            if(!isValidPhoneNumber(telefonoEmpresa)){
                return NextResponse.json({message: 'El telefono no es valido'}, {status: 400});
            }

            if(await this.empresaDAOImpl.existEmpresaTelefono(telefonoEmpresa)){
                return NextResponse.json({message: 'El telefono ya se encuentra registrado'}, {status: 400});
            }

            if(!isValidEmail(correoEmpresa)){
                return NextResponse.json({message: 'El correo no es valido'}, {status: 400});
            }

            if(await this.empresaDAOImpl.existEmpresaCorreo(correoEmpresa)){
                return NextResponse.json({message: 'El correo ya se encuentra registrado'}, {status: 400});
            }

            const respuesta = await this.empresaDAOImpl.create(empresa);
            
            if(respuesta){
                return NextResponse.json({message: 'Empresa creada correctamente'}, {status: 200});
            } else{
                return NextResponse.json({message: 'Error al crear la empresa'}, {status: 500});
            }
        } catch (error) {
            throw new Error(`Error en EmpresaService.create: ${error}`);
        }
    }

    public update = async (empresa: EmpresaRequestDTO): Promise<NextResponse> =>{
        try{
            const { 
                idEmpresa,
                idTipoPersona, 
                idRegimenContribuyente,
                idMunicipio,
                nitEmpresa,
                digitoVerificacionEmpresa,
                nombreEmpresa,
                razonSocialEmpresa,
                direccionEmpresa,
                codigoPostalEmpresa,
                telefonoEmpresa,
                correoEmpresa,
                logoEmpresa,
                estadoEmpresa   
            } = empresa;

            if(!idEmpresa || !idTipoPersona || !idRegimenContribuyente || !idMunicipio || !nitEmpresa || !digitoVerificacionEmpresa || !nombreEmpresa || !razonSocialEmpresa || !direccionEmpresa || !codigoPostalEmpresa || !telefonoEmpresa || !correoEmpresa || !logoEmpresa || !estadoEmpresa){
                return NextResponse.json({message: 'Faltan campos por llenar'}, {status: 400});
            }

            if(!isValidNit(nitEmpresa)){
                return NextResponse.json({message: 'El nit no es valido'}, {status: 400});
            }

            if( await this.empresaDAOImpl.existEmpresaNit(nitEmpresa)){
                return NextResponse.json({message: 'El nit ya se encuentra registrado'}, {status: 400});
            }

            if(!isValidDigitoVerificacion(digitoVerificacionEmpresa)){
                return NextResponse.json({message: 'El digito de verificacion no es valido'}, {status: 400});
            }

            if(!isValidPhoneNumber(telefonoEmpresa)){
                return NextResponse.json({message: 'El telefono no es valido'}, {status: 400});
            }

            if(await this.empresaDAOImpl.existEmpresaTelefono(telefonoEmpresa)){
                return NextResponse.json({message: 'El telefono ya se encuentra registrado'}, {status: 400});
            }

            if(!isValidEmail(correoEmpresa)){
                return NextResponse.json({message: 'El correo no es valido'}, {status: 400});
            }

            if(await this.empresaDAOImpl.existEmpresaCorreo(correoEmpresa)){
                return NextResponse.json({message: 'El correo ya se encuentra registrado'}, {status: 400});
            }

            const respuesta = await this.empresaDAOImpl.update(empresa);
            
            if(respuesta){
                return NextResponse.json({message: 'Empresa actualizada correctamente'}, {status: 200});
            } else{
                return NextResponse.json({message: 'Error al actualizar la empresa'}, {status: 500});
            }
        } catch (error) {
            throw new Error(`Error en EmpresaService.update: ${error}`);
        }
    }

    public getAll = async (): Promise<Array<EmpresaResponseDTO>> => {
        try { 
            const respuesta: EmpresaResponseDTO[] = await this.empresaDAOImpl.getAll();
            return respuesta;
        } catch (error) {
            throw new Error(`Error en EmpresaService.getAll: ${error}`);
        }

    }

    public getById = async (idEmpresa: number): Promise<EmpresaResponseDTO | null> => {
        try { 
            const respuesta = await this.empresaDAOImpl.getById(idEmpresa);

            if(!respuesta){
                return null;
            }
            return respuesta;
        } catch (error) {
            throw new Error(`Error en EmpresaService.getAll: ${error}`);
        }

    }
}