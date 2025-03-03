export interface TerceroRequestEmpresaDTO {
    idTercero?: number,
    idEmpresa: number,
    idTipoPersona: number,
    idMunicipio: number,
    idRegimenContribuyente: number,
    nitTercero: string,
    digitoVerificacionTercero: string,
    razonSocialTercero: string,
    nombreTercero: string,
    telefonoTercero: string,
    direccionTercero: string,
    correoTercero: string,
    codigoPostalTercero: string,
    proveedorTercero?: boolean,
    estadoTercero: boolean
}