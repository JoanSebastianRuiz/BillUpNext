const ContenedorRegistrar = ({ children, name}: { children: React.ReactNode, name: string }) => {
    return (
        <section className="flex justify-center items-center">
            <div className={"w-full bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 border border-gray-300 dark:border-gray-700"}>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">
                    {name}
                </h2>

                {children}
            </div>
        </section>
    );
}

export default ContenedorRegistrar;