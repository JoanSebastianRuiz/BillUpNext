import { EmpresaService } from "@/services/EmpresaService";
import { EmpresaDAOImpl } from "@/dao/impl/EmpresaDAOImpl";
import { NextResponse } from "next/server";
import { EmpresaResponseDTO } from "@/dto/EmpresaResponseDTO";
import { EmpresaRequestDTO } from "@/dto/EmpresaRequestDTO";
import { isValidDigitoVerificacion, isValidNit, isValidPhoneNumber, isValidEmail, isValidCodigoPostal, isValidLength } from "@/util/validators/validators";
import { UsuarioResponseDTO } from "@/dto/UsuarioResponseDTO";

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

    public create = async (empresa: EmpresaRequestDTO): Promise<NextResponse> => {
        try {
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
                estadoEmpresa
            } = empresa;

            if (!idTipoPersona || !idRegimenContribuyente || !idMunicipio || !nitEmpresa || !digitoVerificacionEmpresa || !nombreEmpresa || !razonSocialEmpresa || !direccionEmpresa || !codigoPostalEmpresa || !telefonoEmpresa || !correoEmpresa || !estadoEmpresa) {
                return NextResponse.json({ message: 'Faltan campos por llenar' }, { status: 400 });
            }

            if (!isValidLength(nombreEmpresa, 250)) {
                return NextResponse.json({ message: 'El nombre no es valido' }, { status: 400 });
            }

            if (!isValidLength(razonSocialEmpresa, 250)) {
                return NextResponse.json({ message: 'La razon social no es valida' }, { status: 400 });
            }

            if (!isValidLength(direccionEmpresa, 250)) {
                return NextResponse.json({ message: 'La direccion no es valida' }, { status: 400 });
            }

            if (!isValidLength(correoEmpresa, 250)) {
                return NextResponse.json({ message: 'El correo no es valido' }, { status: 400 });
            }

            if (!isValidNit(nitEmpresa)) {
                return NextResponse.json({ message: 'El nit no es valido' }, { status: 400 });
            }

            if (await this.empresaDAOImpl.existEmpresaNit(nitEmpresa)) {
                return NextResponse.json({ message: 'El nit ya se encuentra registrado' }, { status: 400 });
            }

            if (!isValidDigitoVerificacion(digitoVerificacionEmpresa)) {
                return NextResponse.json({ message: 'El digito de verificacion no es valido' }, { status: 400 });
            }

            if (!isValidPhoneNumber(telefonoEmpresa)) {
                return NextResponse.json({ message: 'El telefono no es valido' }, { status: 400 });
            }

            if (await this.empresaDAOImpl.existEmpresaTelefono(telefonoEmpresa)) {
                return NextResponse.json({ message: 'El telefono ya se encuentra registrado' }, { status: 400 });
            }

            if (!isValidEmail(correoEmpresa)) {
                return NextResponse.json({ message: 'El correo no es valido' }, { status: 400 });
            }

            if (await this.empresaDAOImpl.existEmpresaCorreo(correoEmpresa)) {
                return NextResponse.json({ message: 'El correo ya se encuentra registrado' }, { status: 400 });
            }

            if (!isValidCodigoPostal(codigoPostalEmpresa)) {
                return NextResponse.json({ message: 'El codigo postal no es valido' }, { status: 400 });
            }

            const respuesta = await this.empresaDAOImpl.create(empresa);

            if (respuesta) {
                return NextResponse.json({ message: 'Empresa creada correctamente' }, { status: 200 });
            } else {
                return NextResponse.json({ message: 'Error al crear la empresa' }, { status: 500 });
            }
        } catch (error) {
            throw new Error(`Error en EmpresaService.create: ${error}`);
        }
    }

    public update = async (empresa: EmpresaRequestDTO): Promise<NextResponse> => {
        try {
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
                estadoEmpresa
            } = empresa;

            if (!idEmpresa || !idTipoPersona || !idRegimenContribuyente || !idMunicipio || !nitEmpresa || !digitoVerificacionEmpresa || !nombreEmpresa || !razonSocialEmpresa || !direccionEmpresa || !codigoPostalEmpresa || !telefonoEmpresa || !correoEmpresa || !estadoEmpresa) {
                return NextResponse.json({ message: 'Faltan campos por llenar' }, { status: 400 });
            }

            if (!isValidLength(nombreEmpresa, 250)) {
                return NextResponse.json({ message: 'El nombre no es valido' }, { status: 400 });
            }

            if (!isValidLength(razonSocialEmpresa, 250)) {
                return NextResponse.json({ message: 'La razon social no es valida' }, { status: 400 });
            }

            if (!isValidLength(direccionEmpresa, 250)) {
                return NextResponse.json({ message: 'La direccion no es valida' }, { status: 400 });
            }

            if (!isValidLength(correoEmpresa, 250)) {
                return NextResponse.json({ message: 'El correo no es valido' }, { status: 400 });
            }

            const empresaExistente = await this.empresaDAOImpl.getById(idEmpresa);
            if (!empresaExistente) {
                return NextResponse.json({ message: 'La empresa no existe' }, { status: 400 });
            }

            if (!isValidNit(nitEmpresa)) {
                return NextResponse.json({ message: 'El nit no es valido' }, { status: 400 });
            }

            const empresaNitExistente = await this.empresaDAOImpl.existEmpresaNit(nitEmpresa);

            if (empresaNitExistente && empresaExistente.nitEmpresa !== nitEmpresa) {
                return NextResponse.json({ message: 'El nit ya se encuentra registrado' }, { status: 400 });
            }

            if (!isValidDigitoVerificacion(digitoVerificacionEmpresa)) {
                return NextResponse.json({ message: 'El digito de verificacion no es valido' }, { status: 400 });
            }

            if (!isValidPhoneNumber(telefonoEmpresa)) {
                return NextResponse.json({ message: 'El telefono no es valido' }, { status: 400 });
            }

            const empresaTelefonoExistente = await this.empresaDAOImpl.existEmpresaTelefono(telefonoEmpresa);
            if (empresaTelefonoExistente && empresaExistente.telefonoEmpresa !== telefonoEmpresa) {
                return NextResponse.json({ message: 'El telefono ya se encuentra registrado' }, { status: 400 });
            }

            if (!isValidEmail(correoEmpresa)) {
                return NextResponse.json({ message: 'El correo no es valido' }, { status: 400 });
            }

            const empresaCorreoExistente = await this.empresaDAOImpl.existEmpresaCorreo(correoEmpresa);
            if (empresaCorreoExistente && empresaExistente.correoEmpresa !== correoEmpresa) {
                return NextResponse.json({ message: 'El correo ya se encuentra registrado' }, { status: 400 });
            }

            const respuesta = await this.empresaDAOImpl.update(empresa);

            if (respuesta) {
                return NextResponse.json({ message: 'Empresa actualizada correctamente' }, { status: 200 });
            } else {
                return NextResponse.json({ message: 'Error al actualizar la empresa' }, { status: 500 });
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

    public getUsuarios = async (idEmpresa: number): Promise<UsuarioResponseDTO[]> => {
        try {
            const usuariosResponseDTO = await this.empresaDAOImpl.getUsuarios(idEmpresa);
            if (!usuariosResponseDTO) {
                return Promise.resolve([]);
            }

            return usuariosResponseDTO;
        } catch (error) {
            console.error("Error al obtener los usuarios de la empresa:", error);
            throw new Error(`Error al obtener los usuarios de la empresa ${error}`);
        }
    }

    public getById = async (idEmpresa: number): Promise<EmpresaResponseDTO | null> => {
        try {
            const respuesta = await this.empresaDAOImpl.getById(idEmpresa);

            if (!respuesta) {
                return null;
            }
            return respuesta;
        } catch (error) {
            throw new Error(`Error en EmpresaService.getAll: ${error}`);
        }

    }
}