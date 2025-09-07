import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'internal' | 'combat';
    size?: 'sm' | 'md';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className, ...props }) => {
    const baseClasses = 'font-bold rounded-md shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800';
    
    const variantClasses = {
        primary: 'bg-yellow-700 hover:bg-yellow-600 border-2 border-yellow-800 hover:border-yellow-700 text-white focus:ring-yellow-500',
        secondary: 'bg-gray-600 hover:bg-gray-500 border-2 border-gray-700 hover:border-gray-600 text-gray-200 focus:ring-gray-400',
        internal: 'bg-blue-700 hover:bg-blue-600 border-2 border-blue-800 hover:border-blue-700 text-white focus:ring-blue-500',
        combat: 'bg-gray-900 hover:bg-gray-800 border-2 border-red-700 hover:border-red-600 focus:ring-red-500'
    };

    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-4 py-2 text-base'
    };
    
    const disabledClasses = 'disabled:bg-gray-800 disabled:text-gray-500 disabled:border-gray-700 disabled:cursor-not-allowed';

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className ?? ''}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;