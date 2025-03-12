CREATE OR REPLACE FUNCTION insertarCategoria(
    _idEmpresa "Categoria"."idEmpresa"%TYPE,
    _nombreCategoria "Categoria"."nombreCategoria"%TYPE,
    _estadoCategoria "Categoria"."estadoCategoria"%TYPE) RETURNS BOOLEAN AS
$BODY$
DECLARE
    _idCategoria "Categoria"."idCategoria"%TYPE;
BEGIN
    IF EXISTS (SELECT 1 FROM "Categoria" WHERE LOWER("nombreCategoria") = LOWER(_nombreCategoria)) THEN
        RAISE EXCEPTION 'El nombre de la categoria % ya existe. Inserción cancelada.',_nombreCategoria;
    END IF;

        INSERT INTO "Categoria" ("idEmpresa","nombreCategoria", "estadoCategoria")
        VALUES (_idEmpresa,_nombreCategoria,_estadoCategoria);

        IF FOUND THEN
            RAISE NOTICE 'Se insertó correctamente la categoria';
			RETURN TRUE;
		ELSE
            RAISE NOTICE 'Ocurrió un error';
			RETURN FALSE;
        END IF;
     
END;
$BODY$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION actualizarCategoria(
    _idCategoria "Categoria"."idCategoria"%TYPE,
    _idEmpresa "Categoria"."idEmpresa"%TYPE,
    _nombreCategoria "Categoria"."nombreCategoria"%TYPE,
    _estadoCategoria "Categoria"."estadoCategoria"%TYPE) 
    RETURNS BOOLEAN AS
$BODY$
BEGIN
    UPDATE "Categoria"
    SET   "idEmpresa" = _idEmpresa,
          "nombreCategoria" = _nombreCategoria,
          "estadoCategoria" = _estadoCategoria
    WHERE "idCategoria"  = _idCategoria;

    IF FOUND THEN
        RAISE NOTICE 'Se actualizó correctamente la categoria';
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al actualizar la categoria';
        RETURN FALSE;
    END IF;
END;
$BODY$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION existeCategoriaNombre(
    _nombreCategoria "Categoria"."nombreCategoria"%TYPE,
    _idEmpresa "Categoria"."idEmpresa"%TYPE,
    _idCategoria "Categoria"."idCategoria"%TYPE DEFAULT NULL
)
RETURNS BOOLEAN AS
$BODY$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM "Categoria"
        WHERE LOWER("nombreCategoria") = LOWER(_nombreCategoria)
        AND "idEmpresa" = _idEmpresa
        AND (_idCategoria IS NULL OR "idCategoria" != _idCategoria)
    );
END;
$BODY$
LANGUAGE PLPGSQL;