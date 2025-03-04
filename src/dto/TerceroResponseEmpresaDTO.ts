export interface TerceroResponseEmpresaDTO {
    idTercero: number,
    idTipoPersona: number,
    idEmpresa?: number,
    idMunicipio: number,
    idDepartamento: number,
    idRegimenContribuyente: number,
    nitTercero: string,
    digitoVerificacionTercero: string,
    razonSocialTercero: string,
    nombreTercero: string,
    telefonoTercero: string,
    direccionTercero: string,
    correoTercero: string,
    codigoPostalTercero: string,
    proveedorTercero: boolean,
    estadoTercero: boolean
}