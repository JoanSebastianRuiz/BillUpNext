export interface TerceroRequestPersonaDTO {
    idTercero?: number,
    idEmpresa: number,
    idTipoDocumento: number | string,
    idMunicipio: number | string,
    idDepartamento?: number | string,
    numeroDocumentoTercero: string,
    nombreTercero: string,
    apellidoTercero: string,
    telefonoTercero: string,
    direccionTercero: string,
    correoTercero: string,
    proveedorTercero: boolean,
    estadoTercero: boolean | string
}