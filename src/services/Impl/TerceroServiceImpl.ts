import { TerceroService } from '@/services/TerceroService';
import { TerceroDAOImpl } from '@/dao/impl/TerceroDAOImpl';
import { NextResponse } from 'next/server';
import { TerceroRequestEmpresaDTO } from '@/dto/TerceroRequestEmpresaDTO';
import { TerceroRequestPersonaDTO } from '@/dto/TerceroRequestPersonaDTO';
import { TerceroResponseEmpresaDTO } from '@/dto/TerceroResponseEmpresaDTO';
import { TerceroResponsePersonaDTO } from '@/dto/TerceroResponsePersonaDTO';

import { isValidCodigoPostal, isValidDigitoVerificacion, isValidNit, isValidLength, isValidPhoneNumber, isValidEmail, isValidDocument } from '@/util/validators/validators';


export class TerceroServiceImpl implements TerceroService {
    private terceroDAO: TerceroDAOImpl = TerceroDAOImpl.getInstancia();
    private static instance: TerceroServiceImpl;
    public static getInstance(): TerceroServiceImpl {
        if (!this.instance) {
            this.instance = new TerceroServiceImpl();
        }
        return this.instance;
    }

    private constructor() { }

    public createEmpresa = async (tercero: TerceroRequestEmpresaDTO): Promise<NextResponse> => {
        try {
            const {
                idEmpresa,
                idTipoPersona,
                idMunicipio,
                idRegimenContribuyente,
                nitTercero,
                digitoVerificacionTercero,
                razonSocialTercero,
                nombreTercero,
                telefonoTercero,
                direccionTercero,
                correoTercero,
                codigoPostalTercero,
                proveedorTercero,
                estadoTercero
            } = tercero;

            if (!idEmpresa || !idTipoPersona || !idMunicipio || !idRegimenContribuyente || !nitTercero || !digitoVerificacionTercero || !razonSocialTercero || !nombreTercero || !telefonoTercero || !direccionTercero || !correoTercero || !codigoPostalTercero || !proveedorTercero || !estadoTercero) {
                return NextResponse.json({ message: 'Faltan datos' }, { status: 400 });
            }

            if (!isValidLength(razonSocialTercero, 250)) {
                return NextResponse.json({ message: 'La razon social no es valida' }, { status: 400 });
            }

            if (!isValidLength(nombreTercero, 250)) {
                return NextResponse.json({ message: 'El nombre no es valido' }, { status: 400 });
            }

            if (!isValidLength(direccionTercero, 250)) {
                return NextResponse.json({ message: 'La direccion no es valida' }, { status: 400 });
            }

            if (!isValidCodigoPostal(codigoPostalTercero)) {
                return NextResponse.json({ message: 'El codigo postal no es valido' }, { status: 400 });
            }

            if (!isValidLength(correoTercero, 250)) {
                return NextResponse.json({ message: 'El correo no es valido' }, { status: 400 });
            }

            if (!isValidNit(nitTercero)) {
                return NextResponse.json({ message: 'El nit no es valido' }, { status: 400 });
            }

            if (await this.terceroDAO.existTerceroNit(nitTercero, idEmpresa, proveedorTercero)) {
                return NextResponse.json({ message: 'El nit ya existe' }, { status: 400 });
            }

            if (!isValidDigitoVerificacion(digitoVerificacionTercero)) {
                return NextResponse.json({ message: 'El digito de verificacion no es valido' }, { status: 400 });
            }

            if (!isValidEmail(correoTercero)) {
                return NextResponse.json({ message: 'El correo no es valido' }, { status: 400 });
            }

            if (await this.terceroDAO.existTerceroCorreo(correoTercero, idEmpresa, proveedorTercero)) {
                return NextResponse.json({ message: 'El correo ya existe' }, { status: 400 });
            }

            if (!isValidPhoneNumber(telefonoTercero)) {
                return NextResponse.json({ message: 'El telefono no es valido' }, { status: 400 });
            }

            if (await this.terceroDAO.existTerceroTelefono(telefonoTercero, idEmpresa, proveedorTercero)) {
                return NextResponse.json({ message: 'El telefono ya existe' }, { status: 400 });
            }

            const response = await this.terceroDAO.createEmpresa(tercero);

            return NextResponse.json(response, { status: 200 });
        } catch (error) {
            throw new Error(`Error en TerceroServiceImpl.createEmpresa: ${error}`);
        }
    }

    public createPersona = async (tercero: TerceroRequestPersonaDTO): Promise<NextResponse> => {
        try {
            const {
                idEmpresa,
                idTipoDocumento,
                idMunicipio,
                numeroDocumentoTercero,
                nombreTercero,
                apellidoTercero,
                telefonoTercero,
                direccionTercero,
                correoTercero,
                proveedorTercero,
                estadoTercero
            } = tercero;

            if (!idEmpresa || !idTipoDocumento || !idMunicipio || !numeroDocumentoTercero || !nombreTercero || !apellidoTercero || !telefonoTercero || !direccionTercero || !correoTercero || !proveedorTercero || !estadoTercero) {
                return NextResponse.json({ message: 'Faltan datos' }, { status: 400 });
            }

            if (!isValidDocument(numeroDocumentoTercero)) {
                return NextResponse.json({ message: 'El documento no es valido' }, { status: 400 });
            }

            if (!isValidLength(nombreTercero, 100)) {
                return NextResponse.json({ message: 'El nombre no es valido' }, { status: 400 });
            }

            if (!isValidLength(apellidoTercero, 100)) {
                return NextResponse.json({ message: 'El apellido no es valido' }, { status: 400 });
            }

            if (!isValidLength(direccionTercero, 250)) {
                return NextResponse.json({ message: 'La direccion no es valida' }, { status: 400 });
            }

            if (!isValidLength(correoTercero, 250)) {
                return NextResponse.json({ message: 'El correo no es valido' }, { status: 400 });
            }

            if (!isValidPhoneNumber(telefonoTercero)) {
                return NextResponse.json({ message: 'El telefono no es valido' }, { status: 400 });
            }

            if (!isValidEmail(correoTercero)) {
                return NextResponse.json({ message: 'El correo no es valido' }, { status: 400 });
            }

            if (!isValidLength(correoTercero, 250)) {
                return NextResponse.json({ message: 'El correo no es valido' }, { status: 400 });
            }

            if (await this.terceroDAO.existTerceroCorreo(correoTercero, idEmpresa, proveedorTercero)) {
                return NextResponse.json({ message: 'El correo ya existe' }, { status: 400 });
            }

            if (await this.terceroDAO.existTerceroDoc(numeroDocumentoTercero, idEmpresa, proveedorTercero)) {
                return NextResponse.json({ message: 'El documento ya existe' }, { status: 400 });
            }

            if (await this.terceroDAO.existTerceroTelefono(telefonoTercero, idEmpresa, proveedorTercero)) {
                return NextResponse.json({ message: 'El telefono ya existe' }, { status: 400 });
            }

            const response = await this.terceroDAO.createPersona(tercero);

            return NextResponse.json(response, { status: 200 });
        } catch (error) {
            throw new Error(`Error en TerceroServiceImpl.createPersona: ${error}`);
        }
    }

    public updateEmpresa = async (tercero: TerceroRequestEmpresaDTO): Promise<NextResponse> => {
        try {
            const {
                idTercero,
                idEmpresa,
                idTipoPersona,
                idMunicipio,
                idRegimenContribuyente,
                nitTercero,
                digitoVerificacionTercero,
                razonSocialTercero,
                nombreTercero,
                telefonoTercero,
                direccionTercero,
                correoTercero,
                codigoPostalTercero,
                proveedorTercero,
                estadoTercero
            } = tercero;

            if (!idTercero || !idEmpresa || !idTipoPersona || !idMunicipio || !idRegimenContribuyente || !nitTercero || !digitoVerificacionTercero || !razonSocialTercero || !nombreTercero || !telefonoTercero || !direccionTercero || !correoTercero || !codigoPostalTercero || !proveedorTercero || !estadoTercero) {
                return NextResponse.json({ message: 'Faltan datos' }, { status: 400 });
            }

            const empresaExiste = await this.getByIdTerceroEmpresa(idTercero, idEmpresa);

            if (!empresaExiste) {
                return NextResponse.json({ message: 'Empresa no encontrada' }, { status: 404 });
            }

            if (!isValidLength(razonSocialTercero, 250)) {
                return NextResponse.json({ message: 'La razon social no es valida' }, { status: 400 });
            }

            if (!isValidLength(nombreTercero, 250)) {
                return NextResponse.json({ message: 'El nombre no es valido' }, { status: 400 });
            }

            if (!isValidLength(direccionTercero, 250)) {
                return NextResponse.json({ message: 'La direccion no es valida' }, { status: 400 });
            }

            if (!isValidCodigoPostal(codigoPostalTercero)) {
                return NextResponse.json({ message: 'El codigo postal no es valido' }, { status: 400 });
            }

            if (!isValidLength(correoTercero, 250)) {
                return NextResponse.json({ message: 'El correo no es valido' }, { status: 400 });
            }

            if (!isValidNit(nitTercero)) {
                return NextResponse.json({ message: 'El nit no es valido' }, { status: 400 });
            }

            if (await this.terceroDAO.existTerceroNit(nitTercero, idEmpresa, proveedorTercero) && nitTercero !== empresaExiste?.nitTercero) {
                return NextResponse.json({ message: 'El nit ya existe' }, { status: 400 });
            }

            if (!isValidDigitoVerificacion(digitoVerificacionTercero)) {
                return NextResponse.json({ message: 'El digito de verificacion no es valido' }, { status: 400 });
            }

            if (!isValidEmail(correoTercero)) {
                return NextResponse.json({ message: 'El correo no es valido' }, { status: 400 });
            }

            if (await this.terceroDAO.existTerceroCorreo(correoTercero, idEmpresa, proveedorTercero) && correoTercero !== empresaExiste?.correoTercero) {
                return NextResponse.json({ message: 'El correo ya existe' }, { status: 400 });
            }

            if (!isValidPhoneNumber(telefonoTercero)) {
                return NextResponse.json({ message: 'El telefono no es valido' }, { status: 400 });
            }

            if (await this.terceroDAO.existTerceroTelefono(telefonoTercero, idEmpresa, proveedorTercero) && telefonoTercero !== empresaExiste?.telefonoTercero) {
                return NextResponse.json({ message: 'El telefono ya existe' }, { status: 400 });
            }

            const response = await this.terceroDAO.updateEmpresa(tercero);

            return NextResponse.json(response, { status: 200 });
        } catch (error) {
            throw new Error(`Error en TerceroServiceImpl.updateEmpresa: ${error}`);
        }
    }

    public updatePersona = async (tercero: TerceroRequestPersonaDTO): Promise<NextResponse> => {
        try {
            const {
                idTercero,
                idEmpresa,
                idTipoDocumento,
                idMunicipio,
                numeroDocumentoTercero,
                nombreTercero,
                apellidoTercero,
                telefonoTercero,
                direccionTercero,
                correoTercero,
                proveedorTercero,
                estadoTercero
            } = tercero;

            if (!idTercero || !idEmpresa || !idTipoDocumento || !idMunicipio || !numeroDocumentoTercero || !nombreTercero || !apellidoTercero || !telefonoTercero || !direccionTercero || !correoTercero || !proveedorTercero || !estadoTercero) {
                return NextResponse.json({ message: 'Faltan datos' }, { status: 400 });
            }

            const personaExiste = await this.getByIdTerceroPersona(idTercero, idEmpresa);

            if (!personaExiste) {
                return NextResponse.json({ message: 'Persona no encontrada' }, { status: 404 });
            }

            if (!isValidDocument(numeroDocumentoTercero)) {
                return NextResponse.json({ message: 'El documento no es valido' }, { status: 400 });
            }

            if (!isValidLength(nombreTercero, 100)) {
                return NextResponse.json({ message: 'El nombre no es valido' }, { status: 400 });
            }

            if (!isValidLength(apellidoTercero, 100)) {
                return NextResponse.json({ message: 'El apellido no es valido' }, { status: 400 });
            }

            if (!isValidLength(direccionTercero, 250)) {
                return NextResponse.json({ message: 'La direccion no es valida' }, { status: 400 });
            }

            if (!isValidLength(correoTercero, 250)) {
                return NextResponse.json({ message: 'El correo no es valido' }, { status: 400 });
            }

            if (!isValidPhoneNumber(telefonoTercero)) {
                return NextResponse.json({ message: 'El telefono no es valido' }, { status: 400 });
            }

            if (!isValidEmail(correoTercero)) {
                return NextResponse.json({ message: 'El correo no es valido' }, { status: 400 });
            }

            if (!isValidLength(correoTercero, 250)) {
                return NextResponse.json({ message: 'El correo no es valido' }, { status: 400 });
            }

            if (await this.terceroDAO.existTerceroCorreo(correoTercero, idEmpresa, proveedorTercero) && correoTercero !== personaExiste?.correoTercero) {
                return NextResponse.json({ message: 'El correo ya existe' }, { status: 400 });
            }

            if (await this.terceroDAO.existTerceroDoc(numeroDocumentoTercero, idEmpresa, proveedorTercero) && numeroDocumentoTercero !== personaExiste?.numeroDocumentoTercero) {
                return NextResponse.json({ message: 'El documento ya existe' }, { status: 400 });
            }

            if (await this.terceroDAO.existTerceroTelefono(telefonoTercero, idEmpresa, proveedorTercero) && telefonoTercero !== personaExiste?.telefonoTercero) {
                return NextResponse.json({ message: 'El telefono ya existe' }, { status: 400 });
            }

            const response = await this.terceroDAO.updatePersona(tercero);

            return NextResponse.json(response, { status: 200 });
        } catch (error) {
            throw new Error(`Error en TerceroServiceImpl.updatePersona: ${error}`);
        }
    }

    public getAllEmpresa = async (idEmpresa: number): Promise<Array<TerceroResponseEmpresaDTO>> => {
        try {
            const response = await this.terceroDAO.getAllEmpresa(idEmpresa);

            return response;
        } catch (error) {
            throw new Error(`Error en TerceroServiceImpl.getAllEmpresa: ${error}`);
        }
    }

    public getAllPersona = async (idEmpresa: number): Promise<Array<TerceroResponsePersonaDTO>> => {
        try {
            const response = await this.terceroDAO.getAllPersona(idEmpresa);

            return response;
        } catch (error) {
            throw new Error(`Error en TerceroServiceImpl.getAllPersona: ${error}`);
        }
    }

    public getByIdTerceroPersona = async (idTercero: number, idEmpresa: number): Promise<TerceroResponsePersonaDTO | null> => {
        try {
            const response = await this.terceroDAO.getByIdTerceroPersona(idTercero, idEmpresa);

            return response;
        } catch (error) {
            throw new Error(`Error en TerceroServiceImpl.getByIdTerceroPersona: ${error}`);
        }
    }
    public getByIdTerceroEmpresa = async (idTercero: number, idEmpresa: number): Promise<TerceroResponseEmpresaDTO | null> => {
        try {
            const response = await this.terceroDAO.getByIdTerceroEmpresa(idTercero, idEmpresa);

            return response;
        } catch (error) {
            throw new Error(`Error en TerceroServiceImpl.getByIdTerceroEmpresa: ${error}`);
        }
    }

}