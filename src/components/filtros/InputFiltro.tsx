import { ChangeEventHandler, RefObject } from 'react';

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
            <input
                id={id}
                type="text"
                ref={ref}
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-600 transition-all duration-200"
                onChange={onChange}
            />
        </div>
    )
}

export default InputFiltro;