export interface UsuarioRequestDTO {
    idUsuario?: number,
    idEmpresa: number,
    idTipoDocumento: number,
    idMunicipio: number,
    idDepartamento?: number,
    idRol: number,
    numeroDocumentoUsuario: string,
    nombreUsuario: string,
    apellidoUsuario: string,
    correoUsuario: string,
    telefonoUsuario: string,
    direccionUsuario: string,
    claveUsuario: string,
    estadoUsuario: boolean
}