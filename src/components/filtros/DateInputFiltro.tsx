import { ChangeEvent, forwardRef } from "react";

interface DateInputFiltroProps {
    id: string;
    name: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const DateInputFiltro = forwardRef<HTMLInputElement, DateInputFiltroProps>(({ id, name, onChange }, ref) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                {name}
            </label>
            <div className="relative mt-1">
                <input
                    id={id}
                    type="date"
                    ref={ref}
                    className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-10 text-gray-900 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-600 transition-all duration-200"
                    onChange={onChange}
                />
            </div>
        </div>
    );
});

export default DateInputFiltro;
