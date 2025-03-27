import React from 'react';

interface TextareaFormProps {
    label: string;
    register: any;
    name: string;
    validationRules?: any;
    errors?: any;
    rows?: number;
}

const TextareaForm = ({ label, register, name, validationRules, errors, rows = 4 }: TextareaFormProps) => {
    return (
        <div className="flex flex-col gap-y-2 col-span-1 sm:col-span-2 w-full">
            <label htmlFor={name} className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {label}
            </label>
            <textarea
                id={name}
                name={name}
                rows={rows}
                className="w-full  rounded-lg border px-3 py-2 transition-all duration-200
              bg-gray-100 text-gray-900 border-gray-400 focus:ring-2 focus:ring-gray-500 
              dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-gray-400 resize-none"
                autoComplete="off"
                {...register(name, validationRules)}
            />
            <div className="min-h-[25px]">
                {errors?.[name] && (
                    <span className="text-red-500 text-sm font-medium">{errors[name].message}</span>
                )}
            </div>
        </div>
    );
};

export default TextareaForm;