import React from 'react';

interface SelectFormProps {
    label: string;
    register: any;
    name: string;
    validationRules?: any;
    errors?: any;
    children: React.ReactNode;
}

const SelectForm = ({ label, register, name, validationRules, errors, children}: SelectFormProps) => {
    return (
        <div className="flex flex-col gap-y-2 w-full">
            <label htmlFor={name} className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {label}
            </label>

            <select
                name={name}
                id={name}
                className="w-full max-w-md h-[40px] rounded-lg border px-3 py-2 transition-all duration-200
                    bg-gray-100 text-gray-900 border-gray-400 focus:ring-2 focus:ring-gray-500
                    dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-gray-400"
                {...register(name, validationRules)}
            >
                {children}
            </select>

            <div className="min-h-[25px]">
                {errors[name] && (
                    <span className="text-red-500 text-sm font-medium">{errors[name].message}</span>
                )}
            </div>
        </div>
    )
};

export default SelectForm;
