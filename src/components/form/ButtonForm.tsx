interface ButtonFormProps {
    name: string;
    type: "submit" | "reset" | "button";
    onClick?: () => void;
}

const ButtonForm = ({ name, type, onClick }: ButtonFormProps) => {
    return (
        <button
            type={type}
            className="bg-indigo-600 text-white py-3 px-6 min-w-40 text-lg rounded-lg w-full 
        border-2 border-indigo-700 font-semibold transition-all duration-200 
        hover:bg-indigo-700 hover:border-indigo-600 hover:shadow-xl transform hover:scale-105 
        focus:outline-none focus:ring-2 focus:ring-indigo-400 
        dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600
        dark:hover:bg-gray-700 dark:hover:border-gray-500 dark:focus:ring-gray-400"
            onClick={onClick}
        >
            {name}
        </button>
    );
};

export default ButtonForm;