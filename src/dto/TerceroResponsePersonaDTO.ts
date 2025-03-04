export interface TerceroResponsePersonaDTO {
    idTercero: number,
    idTipoDocumento: number,
    idEmpresa?: number,
    idMunicipio: number,
    idDepartamento: number,
    numeroDocumentoTercero: string,
    nombreTercero: string,
    apellidoTercero: string,
    telefonoTercero: string,
    direccionTercero: string,
    correoTercero: string,
    proveedorTercero: boolean,
    estadoTercero: boolean
}