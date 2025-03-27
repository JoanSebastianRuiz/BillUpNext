import { ChangeEventHandler, RefObject } from "react";
import { Search } from "lucide-react";

interface InputFiltroProps {
    id: string;
    name: string;
    ref: RefObject<HTMLInputElement | null>;
    onChange: ChangeEventHandler<HTMLInputElement>;
}

const InputFiltro = ({ id, name, ref, onChange }: InputFiltroProps) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                {name}
            </label>
            <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
                <input
                    id={id}
                    type="text"
                    ref={ref}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-10 py-2.5 text-gray-900 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-600 transition-all duration-200"
                    onChange={onChange}
                    placeholder="Buscar..."
                />
            </div>
        </div>
    );
};

export default InputFiltro;
