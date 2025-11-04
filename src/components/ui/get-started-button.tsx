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
      className={`group flex w-[180px] h-[50px] sm:w-[200px] sm:h-14 md:w-[220px] md:h-[60px] lg:w-[251px] lg:h-[68px] justify-center items-center shrink-0 bg-[#8E31FF] mx-auto my-0 p-0.5 sm:p-[3px] md:p-1 rounded-[25px] sm:rounded-[28px] md:rounded-[34px] overflow-hidden transition-all duration-200 hover:bg-[#7A2BE6] focus:outline-none focus:ring-2 focus:ring-[#8E31FF] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label="Get started"
      type="button"
    >
      <div className="flex justify-center items-center gap-1.5 sm:gap-2 whitespace-nowrap pl-4 pr-1.5 sm:pl-5 sm:pr-2 md:pl-6 md:pr-2">
        <span className="text-white text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-normal leading-none">
          Get Started
        </span>
        <div className="flex-shrink-0">
          <ArrowIcon
            size={42}
            className="w-[42px] h-[42px] sm:w-[48px] sm:h-[48px] md:w-[52px] md:h-[52px] lg:w-[58px] lg:h-[58px]"
          />
        </div>
      </div>
    </button>
  );
};

export default GetStartedButton;
