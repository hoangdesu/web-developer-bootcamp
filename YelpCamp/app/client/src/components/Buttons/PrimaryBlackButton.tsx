import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    px?: number;
    py?: number;
}

const PrimaryBlackButton: React.FunctionComponent<ButtonProps> = ({ children, px = 5, py = 2 }) => {
    return (
        <button
            className={`my-3 
                        bg-primary-dark-color 
                        text-primary-color 
                        transition 
                        ease-in-out 
                        outline-0 
                        px-${px} 
                        py-${py}
                        border-0 
                        hover:text-white 
                        hover:bg-black 
                        duration-300 
                        place-self-end`}
            type="submit"
        >
            {children}
        </button>
    );
};

export default PrimaryBlackButton;
