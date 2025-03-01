export interface EmpresaRequestDTO {
    idEmpresa?: number,
    idTipoPersona: number,
    idRegimenContribuyente: number,
    idMunicipio: number,
    nitEmpresa: string,
    digitoVerificacionEmpresa: string,
    nombreEmpresa: string,
    razonSocialEmpresa: string,
    direccionEmpresa: string,
    codigoPostalEmpresa: string,
    telefonoEmpresa: string,
    correoEmpresa: string,
    logoEmpresa: string,
    estadoEmpresa: boolean,
    idDepartamento?: number
}