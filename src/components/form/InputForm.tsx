import React from 'react';

interface InputFormProps {
    label: string;
    type?: string;
    register: any;
    name: string;
    validationRules?: any;
    errors?: any;
    disabled?: boolean;
    dinero?: boolean;
}

const InputForm = ({ label, type = 'text', dinero = false, disabled = false, register, name, validationRules, errors }: InputFormProps) => {
    return (
        <div className="flex flex-col gap-y-2 w-full">
            <label htmlFor={name} className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {label}
            </label>

            <div className="relative w-full max-w-md">
                {dinero && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 pointer-events-none">
                        $
                    </span>
                )}
                <input
                    type={type}
                    id={name}
                    name={name}
                    disabled={disabled}
                    className={`w-full h-[40px] rounded-lg border px-3 py-2 ${dinero ? 'pl-7' : 'pl-3'} transition-all duration-200
                        bg-gray-100 text-gray-900 border-gray-400 focus:ring-2 focus:ring-gray-500 
                        dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-gray-400`}
                    onWheel={(e) => e.currentTarget.blur()} // Evita el enfoque al hacer scroll
                    autoComplete="off"
                    {...register(name, validationRules)}
                />
            </div>

            <div className="min-h-[25px]">
                {errors[name] && (
                    <span className="text-red-500 text-sm font-medium">{errors[name].message}</span>
                )}
            </div>
        </div>
    );
};

export default InputForm;
