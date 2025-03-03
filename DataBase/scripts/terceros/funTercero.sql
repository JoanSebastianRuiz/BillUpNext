CREATE OR REPLACE FUNCTION insertarTerceroPersona(
    _idEmpresa "Tercero"."idEmpresa"%TYPE, 
    _idTipoDocumento "Tercero"."idTipoDocumento"%TYPE, 
    _idMunicipio "Tercero"."idMunicipio"%TYPE, 
    _numeroDocumentoTercero "Tercero"."numeroDocumentoTercero"%TYPE, 
    _nombreTercero "Tercero"."nombreTercero"%TYPE, 
    _apellidoTercero "Tercero"."apellidoTercero"%TYPE, 
    _telefonoTercero "Tercero"."telefonoTercero"%TYPE,
    _direccionTercero "Tercero"."direccionTercero"%TYPE,   
    _correoTercero "Tercero"."correoTercero"%TYPE,
    _proveedorTercero "Tercero"."proveedorTercero"%TYPE, 
    _estadoTercero "Tercero"."estadoTercero"%TYPE
)
RETURNS BOOLEAN AS
$$
DECLARE 
    id INTEGER;
BEGIN
    INSERT INTO "Tercero" (
        "idEmpresa", 
        "idTipoDocumento", 
        "idMunicipio",
        "numeroDocumentoTercero", 
        "nombreTercero", 
        "apellidoTercero",  
        "telefonoTercero", 
        "direccionTercero", 
        "correoTercero",
        "proveedorTercero", 
        "estadoTercero"
    ) 
    VALUES (
        _idEmpresa, 
        _idTipoDocumento, 
        _idMunicipio, 
        _numeroDocumentoTercero, 
        _nombreTercero, 
        _apellidoTercero, 
        _telefonoTercero, 
        _direccionTercero, 
        _correoTercero, 
        _proveedorTercero, 
        _estadoTercero
    )
    RETURNING "idTercero" INTO id;

    IF id IS NOT NULL THEN
        RAISE NOTICE 'Se insertó correctamente el tercero con ID %', id;
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al insertar el tercero';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION actualizarTerceroPersona(
    _idTercero "Tercero"."idTercero"%TYPE, 
    _idEmpresa "Tercero"."idEmpresa"%TYPE, 
    _idTipoDocumento "Tercero"."idTipoDocumento"%TYPE,
    _idMunicipio "Tercero"."idMunicipio"%TYPE, 
    _numeroDocumentoTercero "Tercero"."numeroDocumentoTercero"%TYPE, 
    _nombreTercero "Tercero"."nombreTercero"%TYPE, 
    _apellidoTercero "Tercero"."apellidoTercero"%TYPE, 
    _telefonoTercero "Tercero"."telefonoTercero"%TYPE,  
    _direccionTercero "Tercero"."direccionTercero"%TYPE, 
    _correoTercero "Tercero"."correoTercero"%TYPE, 
    _estadoTercero "Tercero"."estadoTercero"%TYPE)
RETURNS BOOLEAN AS
$$
BEGIN
    UPDATE "Tercero" SET 
        "idTipoDocumento" = COALESCE(_idTipoDocumento, "idTipoDocumento"),
        "idMunicipio" = COALESCE(_idMunicipio, "idMunicipio"),
        "numeroDocumentoTercero" = COALESCE(_numeroDocumentoTercero, "numeroDocumentoTercero"),
        "nombreTercero" = COALESCE(_nombreTercero, "nombreTercero"),
        "apellidoTercero" = COALESCE(_apellidoTercero, "apellidoTercero"),
        "correoTercero" = COALESCE(_correoTercero, "correoTercero"),
        "telefonoTercero" = COALESCE(_telefonoTercero, "telefonoTercero"),
        "direccionTercero" = COALESCE(_direccionTercero, "direccionTercero"),
        "estadoTercero" = COALESCE(_estadoTercero, "estadoTercero")
    WHERE "idTercero" = _idTercero and "idEmpresa" = _idEmpresa;

    IF FOUND THEN
        RAISE NOTICE 'Se actualizó correctamente el tercero';
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al actualizar el tercero';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION insertarTerceroEmpresa(
    _idEmpresa "Tercero"."idEmpresa"%TYPE,
    _idTipoPersona "Tercero"."idTipoPersona"%TYPE,
    _idRegimenContribuyente "Tercero"."idRegimenContribuyente"%TYPE, 
    _idMunicipio "Tercero"."idMunicipio"%TYPE, 
    _nitTercero "Tercero"."nitTercero"%TYPE,
    _digitoVerificacionTercero "Tercero"."digitoVerificacionTercero"%TYPE, 
    _nombreTercero "Tercero"."nombreTercero"%TYPE, 
    _razonSocialTercero "Tercero"."razonSocialTercero"%TYPE,
    _direccionTercero "Tercero"."direccionTercero"%TYPE,
    _codigoPostalTercero "Tercero"."codigoPostalTercero"%TYPE,   
    _telefonoTercero "Tercero"."telefonoTercero"%TYPE,  
    _correoTercero "Tercero"."correoTercero"%TYPE,
    _proveedorTercero "Tercero"."proveedorTercero"%TYPE, 
    _estadoTercero "Tercero"."estadoTercero"%TYPE)
RETURNS BOOLEAN AS
$$
DECLARE 
    id INTEGER;
BEGIN
    INSERT INTO "Tercero" (
        "idEmpresa",
        "idTipoPersona", 
        "idRegimenContribuyente", 
        "idMunicipio", 
        "nitTercero",
        "digitoVerificacionTercero", 
        "nombreTercero", 
        "razonSocialTercero", 
        "direccionTercero", 
        "codigoPostalTercero", 
        "telefonoTercero", 
        "correoTercero",
        "proveedorTercero",
        "estadoTercero"
    ) 
    VALUES (
        _idEmpresa,
        _idTipoPersona, 
        _idRegimenContribuyente, 
        _idMunicipio, 
        _nitTercero,
        _digitoVerificacionTercero, 
        _nombreTercero, 
        _razonSocialTercero, 
        _direccionTercero, 
        _codigoPostalTercero, 
        _telefonoTercero, 
        _correoTercero,
        _proveedorTercero,
        _estadoTercero
    )
    RETURNING "idTercero" INTO id;

    IF FOUND THEN
        RAISE NOTICE 'Se insertó correctamente el Tercero con ID %', id;
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al insertar el Tercero';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION actualizarTerceroEmpresa(
    _idTercero "Tercero"."idTercero"%TYPE, 
    _idEmpresa "Tercero"."idEmpresa"%TYPE,
    _idTipoPersona "Tercero"."idTipoPersona"%TYPE,
    _idRegimenContribuyente "Tercero"."idRegimenContribuyente"%TYPE, 
    _idMunicipio "Tercero"."idMunicipio"%TYPE, 
    _nitTercero "Tercero"."nitTercero"%TYPE,
    _digitoVerificacionTercero "Tercero"."digitoVerificacionTercero"%TYPE, 
    _nombreTercero "Tercero"."nombreTercero"%TYPE, 
    _razonSocialTercero "Tercero"."razonSocialTercero"%TYPE,
    _direccionTercero "Tercero"."direccionTercero"%TYPE,
    _codigoPostalTercero "Tercero"."codigoPostalTercero"%TYPE,   
    _telefonoTercero "Tercero"."telefonoTercero"%TYPE,  
    _correoTercero "Tercero"."correoTercero"%TYPE,
    _estadoTercero "Tercero"."estadoTercero"%TYPE
)
RETURNS BOOLEAN AS
$$
BEGIN
    UPDATE "Tercero" SET 
        "idTipoPersona" = COALESCE(_idTipoPersona, "idTipoPersona"),
        "idRegimenContribuyente" = COALESCE(_idRegimenContribuyente, "idRegimenContribuyente"),
        "idMunicipio" = COALESCE(_idMunicipio, "idMunicipio"),
        "nitTercero" = COALESCE(_nitTercero, "nitTercero"),
        "digitoVerificacionTercero" = COALESCE(_digitoVerificacionTercero, "digitoVerificacionTercero"),
        "nombreTercero" = COALESCE(_nombreTercero, "nombreTercero"),
        "razonSocialTercero" = COALESCE(_razonSocialTercero, "razonSocialTercero"),
        "direccionTercero" = COALESCE(_direccionTercero, "direccionTercero"),
        "codigoPostalTercero" = COALESCE(_codigoPostalTercero, "codigoPostalTercero"),
        "telefonoTercero" = COALESCE(_telefonoTercero, "telefonoTercero"),
        "correoTercero" = COALESCE(_correoTercero, "correoTercero"),
        "estadoTercero" = COALESCE(_estadoTercero, "estadoTercero")
    WHERE "idTercero" = _idTercero and "idEmpresa" = _idEmpresa;

    IF FOUND THEN
        RAISE NOTICE 'Se actualizó correctamente el tercero con ID %', _idTercero;
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'No se encontró el tercero con ID %, no se realizó ninguna actualización', _idTercero;
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION validarExisteTerceroCorreo(
    _correoTercero "Tercero"."correoTercero"%TYPE,
    _idEmpresa "Tercero"."idEmpresa"%TYPE
) 
RETURNS BOOLEAN AS
$$
BEGIN
    -- Validar si el tercero existe
    RETURN EXISTS (
        SELECT 1
        FROM "Tercero"
        WHERE "correoTercero" = _correoTercero and "idEmpresa" = _idEmpresa
    );
END;
$$
LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION validarExisteTerceroDoc(
    _numeroDocumentoTercero "Tercero"."numeroDocumentoTercero"%TYPE,
    _idEmpresa "Tercero"."idEmpresa"%TYPE
) 
RETURNS BOOLEAN AS
$$
BEGIN
    -- Validar si el tercero existe
    RETURN EXISTS (
        SELECT 1
        FROM "Tercero"
        WHERE "numeroDocumentoTercero" = _numeroDocumentoTercero and "idEmpresa" = _idEmpresa
    );
END;
$$
LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION validarExisteTerceroTelefono(
    _telefonoTercero "Tercero"."telefonoTercero"%TYPE,
    _idEmpresa "Tercero"."idEmpresa"%TYPE
) 
RETURNS BOOLEAN AS
$$
BEGIN
    -- Validar si el tercero existe
    RETURN EXISTS (
        SELECT 1
        FROM "Tercero"
        WHERE "telefonoTercero" = _telefonoTercero and "idEmpresa" = _idEmpresa
    );
END;
$$
LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION validarExisteTerceroNit(
    _nitTercero "Tercero"."nitTercero"%TYPE,
    _idEmpresa "Tercero"."idEmpresa"%TYPE
) 
RETURNS BOOLEAN AS
$$
BEGIN
    -- Validar si el Tercero existe
    RETURN EXISTS (
        SELECT 1
        FROM "Tercero"
        WHERE "nitTercero" = _nitEmpresa and "idEmpresa" = _idEmpresa
    );
END;
$$
LANGUAGE PLPGSQL;