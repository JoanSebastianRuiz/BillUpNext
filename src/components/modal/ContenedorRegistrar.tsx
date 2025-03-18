const ContenedorRegistrar = ({ children, name, maxW="max-w-4xl" }: { children: React.ReactNode, name: string, maxW?: string }) => {
    return (
        <section className="flex justify-center items-center min-h-screen px-4">
            <div className={`w-full ${maxW} bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 border border-gray-300 dark:border-gray-700`}>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">
                    {name}
                </h2>

                {children}
            </div>
        </section>
    );
}

export default ContenedorRegistrar;