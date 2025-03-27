import { ChangeEventHandler, ReactNode, RefObject } from 'react';

interface SelectFiltroProps {
    id: string;
    name: string;
    ref: RefObject<HTMLSelectElement | null>;
    onChange: ChangeEventHandler<HTMLSelectElement>;
    children: ReactNode;
    defaultValue?: string;
    selectEstado?: boolean;
}

const SelectFiltro = ({ id, name, ref, onChange, children, defaultValue, selectEstado=false }: SelectFiltroProps) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                {name}
            </label>
            <select
                id={id}
                ref={ref}
                className="mt-1 block w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-10 text-gray-900 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-600 transition-all duration-200"
                onChange={onChange}
                defaultValue={defaultValue}
            >
                {!selectEstado && <option value="0">Sin aplicar</option>}
                {children}
            </select>
        </div>
    );
}

export default SelectFiltro;
