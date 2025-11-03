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
      className={`group flex w-[352px] h-[68px] justify-center items-center shrink-0 ${variantStyles[variant]} mx-auto my-0 p-1 rounded-[34px] overflow-hidden max-md:w-[280px] max-md:h-14 max-md:p-[3px] max-sm:w-[240px] max-sm:h-[50px] max-sm:p-0.5 max-sm:rounded-[25px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label={text}
      type="button"
    >
      <div className="flex justify-center items-center whitespace-nowrap px-8 max-md:px-6 max-sm:px-4">
        <span className="text-white text-[32px] font-normal leading-none max-md:text-[26px] max-sm:text-[22px]">
          {text}
        </span>
      </div>
    </button>
  );
};

export default CustomButton;
