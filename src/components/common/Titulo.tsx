const Titulo = ({ name } : {name: string}) => {
    return (
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6">
            {name}
        </h1>
    );
}

export default Titulo;