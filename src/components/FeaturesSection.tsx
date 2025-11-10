import React from "react";

interface FeatureIconProps {
  type:
    | "sparkles"
    | "swatch-book"
    | "trending-up"
    | "bot"
    | "lock-keyhole"
    | "workflow";
  className?: string;
}

const FeatureIcon: React.FC<FeatureIconProps> = ({ type, className = "" }) => {
  const iconPaths = {
    sparkles:
      "M39.9999 4.00088V12.0009M43.9999 8.00088H35.9999M22.0339 5.62888C22.1196 5.17009 22.3631 4.75571 22.7221 4.45752C23.0811 4.15933 23.5332 3.99609 23.9999 3.99609C24.4666 3.99609 24.9187 4.15933 25.2777 4.45752C25.6368 4.75571 25.8802 5.17009 25.9659 5.62888L28.0679 16.7449C28.2172 17.5352 28.6013 18.2621 29.17 18.8308C29.7387 19.3995 30.4656 19.7836 31.2559 19.9329L42.3719 22.0349C42.8307 22.1206 43.2451 22.364 43.5433 22.7231C43.8415 23.0821 44.0047 23.5342 44.0047 24.0009C44.0047 24.4676 43.8415 24.9196 43.5433 25.2787C43.2451 25.6377 42.8307 25.8812 42.3719 25.9669L31.2559 28.0689C30.4656 28.2182 29.7387 28.6022 29.17 29.1709C28.6013 29.7396 28.2172 30.4666 28.0679 31.2569L25.9659 42.3729C25.8802 42.8317 25.6368 43.246 25.2777 43.5442C24.9187 43.8424 24.4666 44.0057 23.9999 44.0057C23.5332 44.0057 23.0811 43.8424 22.7221 43.5442C22.3631 43.246 22.1196 42.8317 22.0339 42.3729L19.9319 31.2569C19.7826 30.4666 19.3986 29.7396 18.8298 29.1709C18.2611 28.6022 17.5342 28.2182 16.7439 28.0689L5.62791 25.9669C5.16911 25.8812 4.75474 25.6377 4.45654 25.2787C4.15835 24.9196 3.99512 24.4676 3.99512 24.0009C3.99512 23.5342 4.15835 23.0821 4.45654 22.7231C4.75474 22.364 5.16911 22.1206 5.62791 22.0349L16.7439 19.9329C17.5342 19.7836 18.2611 19.3995 18.8298 18.8308C19.3986 18.2621 19.7826 17.5352 19.9319 16.7449L22.0339 5.62888ZM11.9999 40.0009C11.9999 42.21 10.209 44.0009 7.99991 44.0009C5.79077 44.0009 3.99991 42.21 3.99991 40.0009C3.99991 37.7917 5.79077 36.0009 7.99991 36.0009C10.209 36.0009 11.9999 37.7917 11.9999 40.0009Z",
    "swatch-book":
      "M14 42C16.1217 42 18.1566 41.1571 19.6569 39.6569C21.1571 38.1566 22 36.1217 22 34V10C22 8.93913 21.5786 7.92172 20.8284 7.17157C20.0783 6.42143 19.0609 6 18 6H10C8.93913 6 7.92172 6.42143 7.17157 7.17157C6.42143 7.92172 6 8.93913 6 10V34C6 36.1217 6.84285 38.1566 8.34315 39.6569C9.84344 41.1571 11.8783 42 14 42ZM14 42H38C39.0609 42 40.0783 41.5786 40.8284 40.8284C41.5786 40.0783 42 39.0609 42 38V30C42 28.9391 41.5786 27.9217 40.8284 27.1716C40.0783 26.4214 39.0609 26 38 26H33.4M14 34H14.02M22 16L26.6 11.4C27.0466 10.9518 27.5774 10.5964 28.1619 10.3541C28.7464 10.1118 29.373 9.98745 30.0057 9.98819C30.6384 9.98894 31.2647 10.1148 31.8486 10.3584C32.4325 10.6021 32.9624 10.9588 33.408 11.408L37.2 15.2C37.6612 15.6436 38.029 16.175 38.2819 16.7628C38.5347 17.3507 38.6675 17.9831 38.6723 18.623C38.6772 19.2629 38.554 19.8974 38.3101 20.489C38.0662 21.0806 37.7064 21.6175 37.252 22.068L19.8 39.6",
    "trending-up": "M32 14H44M44 14V26M44 14L27 31L17 21L4 34",
    bot: "M24 16V8H16M4 28H8M40 28H44M30 26V30M18 26V30M12 16H36C38.2091 16 40 17.7909 40 20V36C40 38.2091 38.2091 40 36 40H12C9.79086 40 8 38.2091 8 36V20C8 17.7909 9.79086 16 12 16Z",
    "lock-keyhole":
      "M14 20V14C14 11.3478 15.0536 8.8043 16.9289 6.92893C18.8043 5.05357 21.3478 4 24 4C26.6522 4 29.1957 5.05357 31.0711 6.92893C32.9464 8.8043 34 11.3478 34 14V20M26 32C26 33.1046 25.1046 34 24 34C22.8954 34 22 33.1046 22 32C22 30.8954 22.8954 30 24 30C25.1046 30 26 30.8954 26 32ZM10 20H38C40.2091 20 42 21.7909 42 24V40C42 42.2091 40.2091 44 38 44H10C7.79086 44 6 42.2091 6 40V24C6 21.7909 7.79086 20 10 20Z",
    workflow: "M32 14H44M44 14V26M44 14L27 31L17 21L4 34",
  };

  if (type === "workflow") {
    return (
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/4749010bf758f21050e6a3a813ffa43ce7c9d5cd?width=96"
        alt="workflow icon"
        className={`absolute w-12 h-12 shrink-0 left-1/2 -translate-x-1/2 top-[44px] max-sm:w-8 max-sm:h-8 max-sm:top-[28px] ${className}`}
      />
    );
  }

  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute w-12 h-12 shrink-0 left-1/2 -translate-x-1/2 top-[44px] max-sm:w-8 max-sm:h-8 max-sm:top-[28px] ${className}`}
      aria-hidden="true"
    >
      <path
        d={iconPaths[type]}
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

interface FeatureCardProps {
  icon:
    | "sparkles"
    | "swatch-book"
    | "trending-up"
    | "bot"
    | "lock-keyhole"
    | "workflow";
  title: string;
  description: string;
  isLeftColumn?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  isLeftColumn = false,
}) => {
  return (
    <article className="w-full h-52 relative shrink-0 max-md:max-w-[538px] md:h-[200px] lg:h-52 max-sm:h-[120px] group cursor-pointer">
      {/* Animated glow effect */}
      <div className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-sm:rounded-[18px] max-sm:group-hover:opacity-70">
        <div className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-[#8638E5] via-[#CCA2FF] to-[#8638E5] blur-xl animate-pulse max-sm:rounded-[18px] max-sm:blur-lg" />
      </div>

      {/* Hover animation lines for left column */}
      {isLeftColumn && (
        <>
          {/* Purple line - bottom */}
          <div
            className="absolute bottom-0 right-0 w-0 h-[2px] bg-[#8638E5] transition-all duration-500 ease-out group-hover:w-[120px] origin-right max-sm:group-hover:w-[60px]"
            style={{ transform: "translateY(12px)" }}
          />
          {/* Purple line - right side */}
          <div
            className="absolute bottom-0 right-0 w-[2px] h-0 bg-[#8638E5] transition-all duration-500 ease-out group-hover:h-[120px] origin-bottom delay-100 max-sm:group-hover:h-[60px]"
            style={{ transform: "translateX(12px)" }}
          />

          {/* White line - bottom */}
          <div
            className="absolute bottom-0 right-0 w-0 h-[2px] bg-white transition-all duration-500 ease-out group-hover:w-[120px] origin-right delay-200 max-sm:group-hover:w-[60px]"
            style={{ transform: "translateY(20px)" }}
          />
          {/* White line - right side */}
          <div
            className="absolute bottom-0 right-0 w-[2px] h-0 bg-white transition-all duration-500 ease-out group-hover:h-[120px] origin-bottom delay-300 max-sm:group-hover:h-[60px]"
            style={{ transform: "translateX(20px)" }}
          />
        </>
      )}

      {/* Hover animation lines for right column */}
      {!isLeftColumn && (
        <>
          {/* Purple line - bottom */}
          <div
            className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#8638E5] transition-all duration-500 ease-out group-hover:w-[120px] origin-left max-sm:group-hover:w-[60px]"
            style={{ transform: "translateY(12px)" }}
          />
          {/* Purple line - left side */}
          <div
            className="absolute bottom-0 left-0 w-[2px] h-0 bg-[#8638E5] transition-all duration-500 ease-out group-hover:h-[120px] origin-bottom delay-100 max-sm:group-hover:h-[60px]"
            style={{ transform: "translateX(-12px)" }}
          />

          {/* White line - bottom */}
          <div
            className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-500 ease-out group-hover:w-[120px] origin-left delay-200 max-sm:group-hover:w-[60px]"
            style={{ transform: "translateY(20px)" }}
          />
          {/* White line - left side */}
          <div
            className="absolute bottom-0 left-0 w-[2px] h-0 bg-white transition-all duration-500 ease-out group-hover:h-[120px] origin-bottom delay-300 max-sm:group-hover:h-[60px]"
            style={{ transform: "translateX(-20px)" }}
          />
        </>
      )}

      {/* Purple shadow layer */}
      <div className="absolute w-[calc(100%_-_12px)] h-[204px] shrink-0 bg-[#8638E5] rounded-[28px] left-1.5 top-0.5 max-sm:h-[calc(100%_-_4px)] max-sm:rounded-[18px] md:h-[192px] lg:h-[204px] transition-all duration-300 group-hover:translate-x-[4px] group-hover:translate-y-[4px] group-hover:scale-[1.02] max-sm:group-hover:translate-x-[2px] max-sm:group-hover:translate-y-[2px] max-sm:group-hover:scale-[1.01] md:group-hover:translate-x-[3px] md:group-hover:translate-y-[3px]" />

      {/* White background layer */}
      <div className="absolute w-[calc(100%_-_12px)] h-[204px] shrink-0 bg-white rounded-[28px] left-1.5 top-0.5 max-sm:h-[calc(100%_-_4px)] max-sm:rounded-[18px] md:h-[192px] lg:h-[204px] transition-all duration-300 group-hover:scale-[1.01] max-sm:group-hover:scale-[1.005]" />

      {/* Main dark card with border */}
      <div className="absolute w-full h-52 border shrink-0 bg-neutral-900 rounded-[28px] border-solid border-[#CCA2FF] left-0 top-0 max-sm:h-full max-sm:rounded-[18px] md:h-[200px] lg:h-52 transition-all duration-300 group-hover:scale-[1.03] group-hover:border-[#8638E5] group-hover:shadow-2xl group-hover:shadow-[#8638E5]/50 max-sm:group-hover:scale-[1.015] max-sm:group-hover:shadow-xl max-sm:group-hover:shadow-[#8638E5]/40 md:group-hover:scale-[1.02]" />

      {/* Icon */}
      <div className="transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 max-sm:group-hover:scale-105 max-sm:group-hover:-rotate-3 md:group-hover:scale-[1.07] md:group-hover:-rotate-4">
        <FeatureIcon type={icon} />
      </div>

      {/* Title */}
      <h2 className="absolute text-white text-center text-[28px] font-medium leading-[30px] -translate-x-2/4 w-full box-border px-5 py-0 left-2/4 top-[109px] md:text-2xl md:leading-7 md:top-[99px] lg:text-[26px] lg:leading-[28px] lg:top-[104px] max-sm:text-lg max-sm:leading-5 max-sm:px-3 max-sm:py-0 max-sm:top-[68px] transition-all duration-300 group-hover:text-[#CCA2FF] max-sm:group-hover:text-[#B48FE0]">
        {title}
      </h2>

      {/* Description */}
      <p className="absolute text-neutral-900 text-center text-base font-light leading-5 -translate-x-2/4 w-full box-border px-5 py-0 left-2/4 top-[149px] md:text-sm md:leading-[18px] md:top-[134px] lg:text-[15px] lg:leading-[19px] lg:top-[144px] max-sm:text-[11px] max-sm:leading-[14px] max-sm:px-3 max-sm:py-0 max-sm:top-[94px] transition-all duration-300 group-hover:font-normal max-sm:group-hover:font-medium">
        {description}
      </p>
    </article>
  );
};

const FeaturesSection: React.FC = () => {
  const featuresData = [
    {
      icon: "sparkles" as const,
      title: "Designed to Impress",
      description:
        "Beautiful, minimal, and distraction-free workspace you'll love.",
    },
    {
      icon: "swatch-book" as const,
      title: "Built for Creators",
      description:
        "Designed with modern creators in mind — simple, fast, and powerful.",
    },
    {
      icon: "trending-up" as const,
      title: "Always Improving",
      description:
        "Constant updates and features shaped by our community feedback.",
    },
    {
      icon: "bot" as const,
      title: "AI That Understands You",
      description: "Personalized recommendations that match your unique style.",
    },
    {
      icon: "lock-keyhole" as const,
      title: "Your Data, Your Control",
      description: "Privacy-first design — your content stays yours, always.",
    },
    {
      icon: "workflow" as const,
      title: "Seamless Experience",
      description: "From concept to publish, everything works like magic.",
    },
  ];

  return (
    <section className="w-full min-h-[1002px] relative box-border bg-black px-4 sm:px-6 md:px-8 py-[72px] max-md:py-[60px] max-sm:py-10 overflow-x-hidden">
      <header className="text-center mb-[60px] max-md:mb-10 max-sm:mb-[30px]">
        <h1 className="text-white text-5xl font-medium leading-[60px] underline decoration-solid decoration-auto underline-offset-auto mb-0.5 max-md:text-[40px] max-md:leading-[48px] max-sm:text-[32px] max-sm:leading-10">
          Features
        </h1>
        <p className="text-white text-[28px] font-normal leading-8 max-md:text-2xl max-md:leading-7 max-sm:text-lg max-sm:leading-6 whitespace-nowrap">
          From concept to content — we've got your back.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 max-w-[1180px] mx-auto my-0 md:gap-5 lg:gap-6 xl:gap-8 max-md:grid-cols-[1fr] max-md:gap-[30px] max-md:max-w-[538px] max-sm:gap-8 overflow-visible px-0">
        {featuresData.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            isLeftColumn={index % 2 === 0}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
export { FeatureIcon, FeatureCard };
