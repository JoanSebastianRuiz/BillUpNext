CREATE OR REPLACE FUNCTION actualizarEmpresa(
    _idEmpresa "Empresa"."idEmpresa"%TYPE, 
    _idTipoPersona "Empresa"."idTipoPersona"%TYPE,
    _idRegimenContribuyente "Empresa"."idRegimenContribuyente"%TYPE, 
    _idMunicipio "Empresa"."idMunicipio"%TYPE, 
    _nitEmpresa "Empresa"."nitEmpresa"%TYPE,
    _digitoVerificacionEmpresa "Empresa"."digitoVerificacionEmpresa"%TYPE, 
    _nombreEmpresa "Empresa"."nombreEmpresa"%TYPE, 
    _razonSocialEmpresa "Empresa"."razonSocialEmpresa"%TYPE,
    _direccionEmpresa "Empresa"."direccionEmpresa"%TYPE,
    _codigoPostalEmpresa "Empresa"."codigoPostalEmpresa"%TYPE,   
    _telefonoEmpresa "Empresa"."telefonoEmpresa"%TYPE,  
    _correoEmpresa "Empresa"."correoEmpresa"%TYPE,
    _estadoEmpresa "Empresa"."estadoEmpresa"%TYPE
)
RETURNS BOOLEAN AS
$$
BEGIN
    UPDATE "Empresa" SET 
        "idTipoPersona" = COALESCE(_idTipoPersona, "idTipoPersona"),
        "idRegimenContribuyente" = COALESCE(_idRegimenContribuyente, "idRegimenContribuyente"),
        "idMunicipio" = COALESCE(_idMunicipio, "idMunicipio"),
        "nitEmpresa" = COALESCE(_nitEmpresa, "nitEmpresa"),
        "digitoVerificacionEmpresa" = COALESCE(_digitoVerificacionEmpresa, "digitoVerificacionEmpresa"),
        "nombreEmpresa" = COALESCE(_nombreEmpresa, "nombreEmpresa"),
        "razonSocialEmpresa" = COALESCE(_razonSocialEmpresa, "razonSocialEmpresa"),
        "direccionEmpresa" = COALESCE(_direccionEmpresa, "direccionEmpresa"),
        "codigoPostalEmpresa" = COALESCE(_codigoPostalEmpresa, "codigoPostalEmpresa"),
        "telefonoEmpresa" = COALESCE(_telefonoEmpresa, "telefonoEmpresa"),
        "correoEmpresa" = COALESCE(_correoEmpresa, "correoEmpresa"),
        "estadoEmpresa" = COALESCE(_estadoEmpresa, "estadoEmpresa")
    WHERE "idEmpresa" = _idEmpresa;

    IF FOUND THEN
        RAISE NOTICE 'Se actualizó correctamente la empresa con ID %', _idEmpresa;
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'No se encontró la empresa con ID %, no se realizó ninguna actualización', _idEmpresa;
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION insertarEmpresa( 
    _idTipoPersona "Empresa"."idTipoPersona"%TYPE,
    _idRegimenContribuyente "Empresa"."idRegimenContribuyente"%TYPE, 
    _idMunicipio "Empresa"."idMunicipio"%TYPE, 
    _nitEmpresa "Empresa"."nitEmpresa"%TYPE,
    _digitoVerificacionEmpresa "Empresa"."digitoVerificacionEmpresa"%TYPE, 
    _nombreEmpresa "Empresa"."nombreEmpresa"%TYPE, 
    _razonSocialEmpresa "Empresa"."razonSocialEmpresa"%TYPE,
    _direccionEmpresa "Empresa"."direccionEmpresa"%TYPE,
    _codigoPostalEmpresa "Empresa"."codigoPostalEmpresa"%TYPE,   
    _telefonoEmpresa "Empresa"."telefonoEmpresa"%TYPE,  
    _correoEmpresa "Empresa"."correoEmpresa"%TYPE, 
    _estadoEmpresa "Empresa"."estadoEmpresa"%TYPE)
RETURNS BOOLEAN AS
$$
DECLARE 
    id INTEGER;
BEGIN
    INSERT INTO "Empresa" (
        "idTipoPersona", 
        "idRegimenContribuyente", 
        "idMunicipio", 
        "nitEmpresa",
        "digitoVerificacionEmpresa", 
        "nombreEmpresa", 
        "razonSocialEmpresa", 
        "direccionEmpresa", 
        "codigoPostalEmpresa", 
        "telefonoEmpresa", 
        "correoEmpresa", 
        "estadoEmpresa"
    ) 
    VALUES (
        _idTipoPersona, 
        _idRegimenContribuyente, 
        _idMunicipio, 
        _nitEmpresa,
        _digitoVerificacionEmpresa, 
        _nombreEmpresa, 
        _razonSocialEmpresa, 
        _direccionEmpresa, 
        _codigoPostalEmpresa, 
        _telefonoEmpresa, 
        _correoEmpresa,
        _estadoEmpresa
    )
    RETURNING "idEmpresa" INTO id;

    IF FOUND THEN
        RAISE NOTICE 'Se insertó correctamente la Empresa con ID %', id;
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al insertar la Empresa';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION validarExisteEmpresaCorreo(
    _correoEmpresa "Empresa"."correoEmpresa"%TYPE
) 
RETURNS BOOLEAN AS
$$
BEGIN
    -- Validar si el Empresa existe
    RETURN EXISTS (
        SELECT 1
        FROM "Empresa"
        WHERE "correoEmpresa" = _correoEmpresa
    );
END;
$$
LANGUAGE PLPGSQL;




CREATE OR REPLACE FUNCTION validarExisteEmpresaNit(
    _nitEmpresa "Empresa"."nitEmpresa"%TYPE
) 
RETURNS BOOLEAN AS
$$
BEGIN
    -- Validar si el Empresa existe
    RETURN EXISTS (
        SELECT 1
        FROM "Empresa"
        WHERE "nitEmpresa" = _nitEmpresa
    );
END;
$$
LANGUAGE PLPGSQL;





CREATE OR REPLACE FUNCTION validarExisteEmpresaTelefono(
    _telefonoEmpresa "Empresa"."telefonoEmpresa"%TYPE
) 
RETURNS BOOLEAN AS
$$
BEGIN
    -- Validar si el Empresa existe
    RETURN EXISTS (
        SELECT 1
        FROM "Empresa"
        WHERE "telefonoEmpresa" = _telefonoEmpresa
    );
END;
$$
LANGUAGE PLPGSQL;