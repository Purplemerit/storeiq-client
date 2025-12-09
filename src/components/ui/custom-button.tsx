import * as React from "react";

interface CustomButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary";
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onClick,
  disabled = false,
  className = "",
  variant = "primary",
}) => {
  const variantStyles = {
    primary: "bg-[#8E31FF] hover:bg-[#7A2BE6] focus:ring-[#8E31FF]",
    secondary: "bg-gray-800 hover:bg-gray-700 focus:ring-gray-800",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group flex w-full max-w-[240px] h-12 justify-center items-center shrink-0 ${variantStyles[variant]} mx-auto my-0 px-6 rounded-full overflow-hidden sm:h-14 sm:max-w-[280px] sm:px-8 md:h-[52px] md:max-w-[320px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label={text}
      type="button"
    >
      <div className="flex justify-center items-center whitespace-nowrap">
        <span className="text-white text-base font-medium leading-none sm:text-lg md:text-xl">
          {text}
        </span>
      </div>
    </button>
  );
};

export default CustomButton;
