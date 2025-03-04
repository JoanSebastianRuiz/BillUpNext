export interface TerceroRequestPersonaDTO {
    idTercero?: number,
    idEmpresa: number,
    idTipoDocumento: number,
    idMunicipio: number,
    idDepartamento?: number,
    numeroDocumentoTercero: string,
    nombreTercero: string,
    apellidoTercero: string,
    telefonoTercero: string,
    direccionTercero: string,
    correoTercero: string,
    proveedorTercero: boolean,
    estadoTercero: boolean
}