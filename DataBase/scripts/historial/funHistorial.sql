--Trigger que se encarga de insertar un registro en la tabla historial cada vez que se realice una operacion de insert, update o delete en una tabla de la base de datos
CREATE OR REPLACE FUNCTION insertHistorial()
RETURNS TRIGGER AS 
$$
DECLARE
    clavePrimaria TEXT;
    idModificado TEXT;
    descripcion TEXT;
    Usuario TEXT:= current_user;
    fecha TIMESTAMP:= now();

BEGIN
    --Obtenemos la clave primaria de la tabla
    SELECT a.attname INTO clavePrimaria
    FROM pg_index i 
    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
    WHERE i.indrelid = TG_RELID AND i.indisprimary;

    --Obtenemos el id del registro modificado
    IF TG_OP = 'INSERT' THEN
        EXECUTE format('SELECT ($1).%I', clavePrimaria) INTO idModificado USING NEW;
        descripcion := format(' Se Insertó un nuevo registro con ID: %s',idModificado);

    ELSIF TG_OP = 'UPDATE' THEN
        EXECUTE format('SELECT ($1).%I', clavePrimaria) INTO idModificado USING NEW;
        descripcion := format('Se Actualizó un nuevo registro con ID: %s',idModificado);

    ELSIF TG_OP = 'DELETE' THEN
        EXECUTE format('SELECT ($1).%I', clavePrimaria) INTO idModificado USING OLD;
        descripcion := format('Se eliminó un nuevo registro con ID: %s',idModificado);
    END IF;

    --Insertar informacion en la tabla historial
    INSERT INTO "Historial" ("nombreTabla", "accion", "descripcion", "usuario", "fecha")
    VALUES (TG_TABLE_NAME, TG_OP, descripcion, usuario, fecha);

    RETURN NULL;

END;
$$ 
LANGUAGE PLPGSQL;

-- Crea triggers  a todas las tablas de la base de datos, excepto a la tabla Historial
DO $$
DECLARE
    tabla TEXT;
BEGIN
    FOR tabla IN
        SELECT tablename   FROM pg_tables
        WHERE schemaname = 'public' AND tablename != 'Historial'
    LOOP
        EXECUTE format(
            'CREATE TRIGGER trigger_log_historial_%s
            AFTER INSERT OR UPDATE OR DELETE ON %s
            FOR EACH ROW
            EXECUTE FUNCTION insertHistorial();', 
            tabla, quote_ident(tabla) 
        );
    END LOOP;
END $$;