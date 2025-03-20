CREATE OR REPLACE FUNCTION insertarGravamen(
    _nombreGravamen "Gravamen"."nombreGravamen"%TYPE,
    _estadoGravamen "Gravamen"."estadoGravamen"%TYPE)
    RETURNS BOOLEAN AS
$$
DECLARE
    _idGravamen "Gravamen"."idGravamen"%TYPE;
BEGIN
    INSERT INTO "Gravamen" ("nombreGravamen", "estadoGravamen")
    VALUES (_nombreGravamen, _estadoGravamen);

    IF FOUND THEN
        RAISE NOTICE 'Se insertó correctamente el gravamen';
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
    _estadoGravamen "Gravamen"."estadoGravamen"%TYPE)
    RETURNS BOOLEAN AS
$$
BEGIN
    UPDATE "Gravamen"
    SET "nombreGravamen" = _nombreGravamen,
        "estadoGravamen" = _estadoGravamen
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
    _nombreGravamen "Gravamen"."nombreGravamen"%TYPE
)
RETURNS BOOLEAN AS
$$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM "Gravamen"
        WHERE LOWER("nombreGravamen") = LOWER(_nombreGravamen)
    );
END;
$$
LANGUAGE PLPGSQL;