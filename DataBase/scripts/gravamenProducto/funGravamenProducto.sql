CREATE OR REPLACE FUNCTION insertarGravamenProducto(
    _idProducto "GravamenProducto"."idProducto"%TYPE,
    _idGravamen "GravamenProducto"."idGravamen"%TYPE,
    _porcentajeGravamenProducto "GravamenProducto"."porcentajeGravamenProducto"%TYPE,
    _estadoGravamenProducto "GravamenProducto"."estadoGravamenProducto"%TYPE)
    RETURNS BOOLEAN AS
$$
DECLARE
    _idGravamenProducto "GravamenProducto"."idGravamenProducto"%TYPE;
BEGIN
    INSERT INTO "GravamenProducto" ("idProducto", "idGravamen", "porcentajeGravamenProducto", "estadoGravamenProducto")
    VALUES (_idProducto, _idGravamen, _porcentajeGravamenProducto, _estadoGravamenProducto);

    IF FOUND THEN
        RAISE NOTICE 'Se insertó correctamente el gravamen del producto';
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Ocurrió un error';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION actualizarGravamenProducto(
    _idGravamenProducto "GravamenProducto"."idGravamenProducto"%TYPE,
    _idProducto "GravamenProducto"."idProducto"%TYPE,
    _idGravamen "GravamenProducto"."idGravamen"%TYPE,
    _porcentajeGravamenProducto "GravamenProducto"."porcentajeGravamenProducto"%TYPE,
    _estadoGravamenProducto "GravamenProducto"."estadoGravamenProducto"%TYPE)
    RETURNS BOOLEAN AS
$$
BEGIN
    UPDATE "GravamenProducto"
    SET "idProducto" = _idProducto,
        "idGravamen" = _idGravamen,
        "porcentajeGravamenProducto" = _porcentajeGravamenProducto,
        "estadoGravamenProducto" = _estadoGravamenProducto
    WHERE "idGravamenProducto" = _idGravamenProducto;

    IF FOUND THEN
        RAISE NOTICE 'Se actualizó correctamente el gravamen del producto';
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al actualizar el gravamen del producto';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;
