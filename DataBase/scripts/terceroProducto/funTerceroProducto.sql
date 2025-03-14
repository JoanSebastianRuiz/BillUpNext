CREATE OR REPLACE FUNCTION insertarTerceroProducto(
    _idTercero "TerceroProducto"."idTercero"%TYPE,
    _idProducto "TerceroProducto"."idProducto"%TYPE,
    _precioCompraTerceroProducto "TerceroProducto"."precioCompraTerceroProducto"%TYPE) 
    RETURNS BOOLEAN AS
$BODY$
BEGIN
    INSERT INTO "TerceroProducto" ("idTercero", "idProducto", "precioCompraTerceroProducto")
    VALUES (_idTercero,_idProducto,_precioCompraTerceroProducto);

    IF FOUND THEN
        RAISE NOTICE 'Se insertó correctamente';
		RETURN TRUE;
	ELSE
        RAISE NOTICE 'Ocurrió un error';
		RETURN FALSE;
    END IF;
END;
$BODY$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION actualizarTerceroProducto(
    _idTerceroProducto "TerceroProducto"."idTerceroProducto"%TYPE,
    _idTercero "TerceroProducto"."idTercero"%TYPE,
    _idProducto "TerceroProducto"."idProducto"%TYPE,
    _precioCompraTerceroProducto "TerceroProducto"."precioCompraTerceroProducto"%TYPE,
    _estadoTerceroProducto "TerceroProducto"."estadoTerceroProducto"%TYPE),
     RETURNS BOOLEAN AS
$BODY$
BEGIN 
    UPDATE "TerceroProducto"
    SET "idTercero" = _idTercero,
        "idProducto" = _idProducto,
        "precioCompraTerceroProducto" = _precioCompraTerceroProducto,
        "estadoTerceroProducto" = _precioCompraTerceroProducto
    WHERE "idTerceroProducto"  = _idTerceroProducto;

    IF FOUND THEN
        RAISE NOTICE 'Se actualizó correctamente';
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al actualizar';
        RETURN FALSE;
    END IF;
END;
$BODY$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION validarRelacionTerceroProducto(
    _idProducto "TerceroProducto"."idProducto"%TYPE,
    _idTercero "TerceroProducto"."idTercero"%TYPE,
    _idTerceroProducto "TerceroProducto"."idTerceroProducto"%TYPE DEFAULT NULL
)
RETURNS BOOLEAN AS
$$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM "TerceroProducto"
        WHERE "idProducto" = _idProducto
            AND "idTercero" = _idTercero
            AND (_idTerceroProducto IS NULL OR "idTerceroProducto" != _idTerceroProducto)
    );
END;
$$ 
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION validarPrecioTerceroProducto(
    _precioCompraTerceroProducto "TerceroProducto"."precioCompraTerceroProducto"%TYPE
)
RETURNS BOOLEAN AS
$$
BEGIN
    RETURN _precioCompraTerceroProducto > 0;   
END;
$$ LANGUAGE PLPGSQL