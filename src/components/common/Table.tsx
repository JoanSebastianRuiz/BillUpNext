interface Titulo {
    titulo: string;
    center: boolean;
}

const Table = ({ titulos, children }: { titulos: Titulo[], children: React.ReactNode }) => {
    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full table-fixed border-collapse rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800">
                <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    <tr>
                        {titulos.map((t, index) => (
                            <th key={index} className={`px-4 py-3 ${t.center ? "text-center" : "text-left"} whitespace-nowrap`}>
                                {t.titulo}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {children}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
