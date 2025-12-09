import * as React from "react";
import { useNavigate } from "react-router-dom";

interface ArrowIconProps {
  size?: number;
  className?: string;
}

export const ArrowIcon: React.FC<ArrowIconProps> = ({
  size = 24,
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
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate("/signup");
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`group flex w-auto h-11 sm:h-12 md:h-[52px] justify-center items-center shrink-0 bg-[#8E31FF] mx-auto my-0 px-5 sm:px-6 md:px-8 rounded-full overflow-hidden transition-all duration-200 hover:bg-[#7A2BE6] focus:outline-none focus:ring-2 focus:ring-[#8E31FF] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label="Get started"
      type="button"
    >
      <div className="flex justify-center items-center gap-2 sm:gap-2.5 whitespace-nowrap">
        <span className="text-white text-base sm:text-lg md:text-xl font-medium leading-none">
          Get Started
        </span>
        <div className="flex-shrink-0">
          <ArrowIcon
            size={27}
            className="w-5 h-5 sm:w-6 sm:h-6"
          />
        </div>
      </div>
    </button>
  );
};

export default GetStartedButton;
