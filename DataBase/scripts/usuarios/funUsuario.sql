CREATE OR REPLACE FUNCTION actualizarUsuario(
    _idUsuario "Usuario"."idUsuario"%TYPE, 
    _idEmpresa "Usuario"."idEmpresa"%TYPE, 
    _idTipoDocumento "Usuario"."idTipoDocumento"%TYPE,
    _idMunicipio "Usuario"."idMunicipio"%TYPE, 
    _idRol "Usuario"."idRol"%TYPE, 
    _numeroDocumentoUsuario "Usuario"."numeroDocumentoUsuario"%TYPE, 
    _nombreUsuario "Usuario"."nombreUsuario"%TYPE, 
    _apellidoUsuario "Usuario"."apellidoUsuario"%TYPE, 
    _correoUsuario "Usuario"."correoUsuario"%TYPE, 
    _telefonoUsuario "Usuario"."telefonoUsuario"%TYPE,  
    _direccionUsuario "Usuario"."direccionUsuario"%TYPE, 
    _estadoUsuario "Usuario"."estadoUsuario"%TYPE)
RETURNS BOOLEAN AS
$$
BEGIN
    UPDATE "Usuario" SET 
        "idEmpresa" = COALESCE(_idEmpresa, "idEmpresa"),
        "idTipoDocumento" = COALESCE(_idTipoDocumento, "idTipoDocumento"),
        "idMunicipio" = COALESCE(_idMunicipio, "idMunicipio"),
        "idRol" = COALESCE(_idRol, "idRol"),
        "numeroDocumentoUsuario" = COALESCE(_numeroDocumentoUsuario, "numeroDocumentoUsuario"),
        "nombreUsuario" = COALESCE(_nombreUsuario, "nombreUsuario"),
        "apellidoUsuario" = COALESCE(_apellidoUsuario, "apellidoUsuario"),
        "correoUsuario" = COALESCE(_correoUsuario, "correoUsuario"),
        "telefonoUsuario" = COALESCE(_telefonoUsuario, "telefonoUsuario"),
        "direccionUsuario" = COALESCE(_direccionUsuario, "direccionUsuario"),
        "estadoUsuario" = COALESCE(_estadoUsuario, "estadoUsuario")
    WHERE "idUsuario" = _idUsuario;

    IF FOUND THEN
        RAISE NOTICE 'Se actualizó correctamente el usuario';
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al actualizar el usuario';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION insertarUsuario(
    _idEmpresa "Usuario"."idEmpresa"%TYPE, 
    _idTipoDocumento "Usuario"."idTipoDocumento"%TYPE, 
    _idMunicipio "Usuario"."idMunicipio"%TYPE, 
    _idRol "Usuario"."idRol"%TYPE, 
    _numeroDocumentoUsuario "Usuario"."numeroDocumentoUsuario"%TYPE, 
    _nombreUsuario "Usuario"."nombreUsuario"%TYPE, 
    _apellidoUsuario "Usuario"."apellidoUsuario"%TYPE, 
    _correoUsuario "Usuario"."correoUsuario"%TYPE, 
    _telefonoUsuario "Usuario"."telefonoUsuario"%TYPE,  
    _direccionUsuario "Usuario"."direccionUsuario"%TYPE, 
    _claveUsuario "Usuario"."claveUsuario"%TYPE, 
    _estadoUsuario "Usuario"."estadoUsuario"%TYPE
)
RETURNS BOOLEAN AS
$$
DECLARE 
    id INTEGER;
BEGIN
    INSERT INTO "Usuario" (
        "idEmpresa", 
        "idTipoDocumento", 
        "idMunicipio", 
        "idRol", 
        "numeroDocumentoUsuario", 
        "nombreUsuario", 
        "apellidoUsuario", 
        "correoUsuario", 
        "telefonoUsuario", 
        "direccionUsuario", 
        "claveUsuario", 
        "estadoUsuario"
    ) 
    VALUES (
        _idEmpresa, 
        _idTipoDocumento, 
        _idMunicipio, 
        _idRol, 
        _numeroDocumentoUsuario, 
        _nombreUsuario, 
        _apellidoUsuario, 
        _correoUsuario, 
        _telefonoUsuario, 
        _direccionUsuario, 
        _claveUsuario, 
        _estadoUsuario
    )
    RETURNING "idUsuario" INTO id;

    IF id IS NOT NULL THEN
        RAISE NOTICE 'Se insertó correctamente el usuario con ID %', id;
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al insertar el usuario';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION validarExisteUsuarioCorreo(
    _correoUsuario "Usuario"."correoUsuario"%TYPE
) 
RETURNS BOOLEAN AS
$$
BEGIN
    -- Validar si el usuario existe
    RETURN EXISTS (
        SELECT 1
        FROM "Usuario"
        WHERE "correoUsuario" = _correoUsuario
    );
END;
$$
LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION validarExisteUsuarioDoc(
    _numeroDocumentoUsuario "Usuario"."numeroDocumentoUsuario"%TYPE
) 
RETURNS BOOLEAN AS
$$
BEGIN
    -- Validar si el usuario existe
    RETURN EXISTS (
        SELECT 1
        FROM "Usuario"
        WHERE "numeroDocumentoUsuario" = _numeroDocumentoUsuario
    );
END;
$$
LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION validarExisteUsuarioTelefono(
    _telefonoUsuario "Usuario"."telefonoUsuario"%TYPE
) 
RETURNS BOOLEAN AS
$$
BEGIN
    -- Validar si el usuario existe
    RETURN EXISTS (
        SELECT 1
        FROM "Usuario"
        WHERE "telefonoUsuario" = _telefonoUsuario
    );
END;
$$
LANGUAGE PLPGSQL;

