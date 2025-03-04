CREATE OR REPLACE FUNCTION insertarGravamen(
    _nombreGravamen "Gravamen"."nombreGravamen"%TYPE,
    _estadoGravamen "Gravamen"."estadoGravamen"%TYPE,
    _negativoGravamen "Gravamen"."negativoGravamen"%TYPE,
    _porcentajeGravamen "Gravamen"."porcentajeGravamen"%TYPE)
    RETURNS BOOLEAN AS
$$
DECLARE
    _idGravamen "Gravamen"."idGravamen"%TYPE;
BEGIN
    INSERT INTO "Gravamen" ("nombreGravamen", "estadoGravamen", "negativoGravamen", "porcentajeGravamen")
    VALUES (_nombreGravamen, _estadoGravamen, _negativoGravamen, _porcentajeGravamen);

    IF FOUND THEN
        RAISE NOTICE 'Se insertó correctamente el gravamen'
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Ocurrió un error';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION actualizarGravamen(
    _idGravamen "Gravamen"."idGravamen"%TYPE,
    _nombreGravamen "Gravamen"."nombreGravamen"%TYPE,
    _estadoGravamen "Gravamen"."estadoGravamen"%TYPE,
    _negativoGravamen "Gravamen"."negativoGravamen"%TYPE,
    _porcentajeGravamen "Gravamen"."porcentajeGravamen"%TYPE)
    RETURNS BOOLEAN AS
$$
BEGIN
    UPDATE "Gravamen"
    SET "nombreGravamen" = _nombreGravamen,
        "estadoGravamen" = _estadoGravamen,
        "negativoGravamen" = _negativoGravamen,
        "porcentajeGravamen" = _porcentajeGravamen
    WHERE "idGravamen" = _idGravamen;

    IF FOUND THEN
        RAISE NOTICE 'Se actualizó correctamente el gravamen';
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al actualizar el gravamen';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION existeGravamenNombre(
    _nombreGravamen "Gravamen"."nombreGravamen"%TYPE,
    _idGravamen "Gravamen"."idGravamen"%TYPE DEFAULT NULL
)
RETURNS BOOLEAN AS
$$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM "Gravamen"
        WHERE LOWER("nombreGravamen") = LOWER(_nombreGravamen)
        AND (_idGravamen IS NULL OR "idGravamen" != _idGravamen)
    );
END;
$$
LANGUAGE PLPGSQL;