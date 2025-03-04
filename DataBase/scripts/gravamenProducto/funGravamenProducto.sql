CREATE OR REPLACE FUNCTION insertarGravamenProducto(
    _idProducto "GravamenProducto"."idProducto"%TYPE,
    _idGravamen "GravamenProducto"."idGravamen"%TYPE,
    _compraGravamenProducto "GravamenProducto"."compraGravamenProducto"%TYPE,
    _ventaGravamenProducto "GravamenProducto"."ventaGravamenProducto"%TYPE)
    RETURNS BOOLEAN AS
$$
DECLARE
    _idGravamenProducto "GravamenProducto"."idGravamenProducto"%TYPE;
BEGIN
    INSERT INTO "GravamenProducto" ("idProducto", "idGravamen", "compraGravamenProducto", "ventaGravamenProducto")
    VALUES (_idProducto, _idGravamen, _compraGravamenProducto, _ventaGravamenProducto);

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
    _compraGravamenProducto "GravamenProducto"."compraGravamenProducto"%TYPE,
    _ventaGravamenProducto "GravamenProducto"."ventaGravamenProducto"%TYPE)
    RETURNS BOOLEAN AS
$$
BEGIN
    UPDATE "GravamenProducto"
    SET "idProducto" = _idProducto,
        "idGravamen" = _idGravamen,
        "compraGravamenProducto" = _compraGravamenProducto,
        "ventaGravamenProducto" = _ventaGravamenProducto
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