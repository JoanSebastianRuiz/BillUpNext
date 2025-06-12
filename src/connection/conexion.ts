const { Pool } = require("pg");  // Importar la clase Pool de pg, para poder conectarnos a la base de datos

// Singleton para la conexión con la base de datos
class Database{
    private static instance : typeof Pool;
    
    private constructor(){} // Constructor privado para evitar instanciación

    public static getInstance(): typeof Pool {
        if (!Database.instance) {
            const { USER, HOST, DATABASE, PASSWORD, PORTPOSTGRES } = process.env;// Obtener las variables de entorno

            // Validar que las variables de entorno necesarias estén definidas
            if (!USER || !HOST || !DATABASE || !PASSWORD || !PORTPOSTGRES) {
                throw new Error('Faltan variables de entorno para la conexión con la base de datos.');
            }

            Database.instance = new Pool({
                user: USER,
                host: HOST,
                database: DATABASE,
                password: PASSWORD,
                port: parseInt(PORTPOSTGRES || '5432'),
            });
        }
        return Database.instance;
    }
}

// Usar la instancia singleton para obtener la conexión a la base de datos
const pool = Database.getInstance();

// Definir el tipo de retorno para las filas del resultado
type QueryParams = any[]; // Parámetros pueden ser de cualquier tipo
type QueryResultRows<T = any> = T[]; // Los resultados serán un arreglo de filas genéricas

const ejecutarQuery = async <T = any>(query: string, params: QueryParams = []): Promise< QueryResultRows<T>> => {
    try {
        const res = await pool.query(query, params);
        return res.rows;
    } catch (err : any) {
        console.error("Error ejecutando la consulta:", err.message, { query, params });
        return [];
    }
}

const finalizarPool = async (): Promise<void> => {
    try {
        await pool.end(); // Cierra todas las conexiones
    } catch (error) {
        console.error('Error al cerrar la conexión:', error);
    }
}

process.on('SIGINT', async () => {
    await finalizarPool();
});

export { ejecutarQuery, finalizarPool}; // Exportar la función de ejecutarQuery y el tipo QueryResultRows




