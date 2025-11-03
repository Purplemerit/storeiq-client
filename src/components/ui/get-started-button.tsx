import * as React from "react";

interface ArrowIconProps {
  size?: number;
  className?: string;
}

export const ArrowIcon: React.FC<ArrowIconProps> = ({
  size = 60,
  className = "",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`get-started-icon transition-transform duration-300 group-hover:rotate-[90deg] ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      <circle cx="30" cy="30" r="30" fill="black" />
      <path
        d="M18.3331 42.3734L42.2504 18.4561M42.2504 36.207L42.3748 18.3318L24.4995 18.4575"
        stroke="white"
        strokeWidth="0.833333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

interface GetStartedButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const GetStartedButton: React.FC<GetStartedButtonProps> = ({
  onClick,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group flex w-[251px] h-[68px] justify-center items-center shrink-0 bg-[#8E31FF] mx-auto my-0 p-1 rounded-[34px] overflow-hidden max-md:w-[200px] max-md:h-14 max-md:p-[3px] max-sm:w-[180px] max-sm:h-[50px] max-sm:p-0.5 max-sm:rounded-[25px] transition-all duration-200 hover:bg-[#7A2BE6] focus:outline-none focus:ring-2 focus:ring-[#8E31FF] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label="Get started"
      type="button"
    >
      <div className="flex justify-center items-center gap-2 whitespace-nowrap pl-6 pr-2 max-md:gap-2 max-md:pl-4 max-md:pr-2 max-sm:gap-1 max-sm:pl-3 max-sm:pr-1">
        <span className="text-white text-[32px] font-normal leading-none max-md:text-[26px] max-sm:text-[22px]">
          Get Started
        </span>
        <div className="flex-shrink-0">
          <ArrowIcon />
        </div>
      </div>
    </button>
  );
};

export default GetStartedButton;
