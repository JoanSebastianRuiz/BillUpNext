import React from 'react';

interface SelectFormProps {
    label: string;
    register: any;
    name: string;
    validationRules?: any;
    errors?: any;
    children: React.ReactNode;
}

const SelectForm = ({ label, register, name, validationRules, errors, children }: SelectFormProps) => {
    return (
        <div className="flex flex-col gap-y-2">
            <label htmlFor={name} className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {label}
            </label>

            <select
                name={name}
                id={name}
                className="w-full max-w-md rounded-lg border px-3 py-2 transition-all duration-200
          bg-gray-100 text-gray-900 border-gray-400 focus:ring-2 focus:ring-gray-500
          dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-gray-400"
                defaultValue=""
                {...register(name, validationRules)}
            >
                {children}
            </select>

            {errors[name] && (
                <span className="text-red-500 text-sm font-medium">{errors[name].message}</span>
            )}
        </div>
    )
};

export default SelectForm;