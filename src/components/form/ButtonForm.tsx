interface ButtonFormProps {
    name: string;
    type: "submit" | "reset" | "button";
    onClick?: () => void;
}

const ButtonForm = ({ name, type, onClick }: ButtonFormProps) => {
    return (
        <button
            type={type}
            className="bg-brandBlue text-white py-3 px-6 min-w-40 text-lg rounded-lg w-full 
        border-2  font-semibold transition-all duration-200 
        hover:bg-brandBlueHover hover:shadow-xl transform hover:scale-105 
        focus:outline-none focus:ring-2 focus:ring-brandBlue
        dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600
        dark:hover:bg-gray-700 dark:hover:border-gray-500 dark:focus:ring-gray-400"
            onClick={onClick}
        >
            {name}
        </button>
    );
};

export default ButtonForm;