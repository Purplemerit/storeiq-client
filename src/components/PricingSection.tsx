import React from "react";

interface PricingCardProps {
  title: string;
  description: string;
  features: string[];
  price: string;
  ctaText: string;
  onCtaClick: () => void;
  className?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  description,
  features,
  price,
  ctaText,
  onCtaClick,
  className = "",
}) => {
  return (
    <article
      className={`w-full max-w-[100px] sm:max-w-[160px] md:max-w-[280px] lg:max-w-[300px] xl:max-w-[314px] h-auto min-h-[280px] sm:min-h-[340px] md:min-h-[580px] lg:min-h-[600px] xl:h-[613px] flex flex-col items-center box-border relative bg-black px-2 sm:px-3 md:px-6 lg:px-7 xl:px-[42px] py-3 sm:py-4 md:py-8 lg:py-9 xl:py-10 border-[1.5px] sm:border-2 md:border-3 lg:border-3 xl:border-4 border-solid border-white ${className}`}
    >
      <header className="text-center mb-2 sm:mb-3 md:mb-8 lg:mb-9 xl:mb-11">
        <h3 className="text-white text-center text-[10px] sm:text-sm md:text-2xl lg:text-[28px] xl:text-[32px] font-bold leading-tight underline decoration-solid decoration-auto underline-offset-auto mb-1 sm:mb-1.5 md:mb-3 lg:mb-3.5 xl:mb-4">
          {title}
        </h3>
        <p className="text-white text-center text-[8px] sm:text-[10px] md:text-[15px] lg:text-base xl:text-lg font-normal leading-snug sm:leading-relaxed w-full">
          {description}
        </p>
      </header>

      <div className="text-white text-[7px] sm:text-[9px] md:text-base lg:text-lg xl:text-xl font-normal leading-tight sm:leading-snug md:leading-7 lg:leading-8 xl:leading-10 flex-1 flex flex-col w-full">
        {features.map((feature, index) => (
          <div key={index} className="mb-0.5 sm:mb-1">
            • {feature}
          </div>
        ))}
        <button
          onClick={onCtaClick}
          className="mt-1.5 sm:mt-2 md:mt-4 lg:mt-4.5 xl:mt-5 text-left hover:text-purple-300 transition-colors duration-200 focus:outline-none focus:text-purple-300"
          aria-label={`${ctaText} for ${title} plan`}
        >
          [{ctaText}]
        </button>
      </div>

      <footer className="w-full max-w-[80px] sm:max-w-[120px] md:max-w-[206px] h-5 sm:h-6 md:h-8 flex items-center justify-center bg-[#8E31FF] mt-auto rounded-sm sm:rounded-md md:rounded-lg hover:bg-[#7A2BE6] transition-colors duration-200">
        <div className="text-white text-[9px] sm:text-xs md:text-lg lg:text-xl xl:text-[22px] font-medium leading-5">
          {price}
        </div>
      </footer>
    </article>
  );
};

interface PricingConnectorProps {
  direction: "left" | "right";
  className?: string;
}

export const PricingConnector: React.FC<PricingConnectorProps> = ({
  direction,
  className = "",
}) => {
  return (
    <div className={className}>
      <svg
        className="w-3 h-[280px] sm:w-6 sm:h-[340px] md:w-16 md:h-[580px] lg:h-[600px] xl:h-[613px] fill-[#D9D9D9] flex-shrink-0"
        width="64"
        height="613"
        viewBox="0 0 64 613"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        role="presentation"
        aria-hidden="true"
      >
        <path
          d={
            direction === "left"
              ? "M0 0L64 42V571L0 613V0Z"
              : "M64 0L0 42V571L64 613V0Z"
          }
          fill="#D9D9D9"
        />
      </svg>
    </div>
  );
};

const pricingPlans = [
  {
    title: "STARTER",
    description: "Perfect for trying STORIQ",
    features: [
      "5 AI edits / month",
      "Basic templates",
      "Standard export quality",
    ],
    price: "₹0 / month",
    ctaText: "Get Started",
  },
  {
    title: "PRO",
    description: "Creators who need more power.",
    features: [
      "Unlimited AI edits",
      "Premium templates & styles",
      "4K exports",
      "Priority support",
    ],
    price: "₹999 / month",
    ctaText: "Go Pro",
  },
  {
    title: "STUDIO",
    description: "For agencies & serious creators.",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Brand kits & custom fonts",
      "Dedicated success manager",
    ],
    price: "₹2,499 / month",
    ctaText: "Contact Us",
  },
];

export const PricingSection: React.FC = () => {
  const handlePlanSelect = (planTitle: string) => {
    console.log(`Selected plan: ${planTitle}`);
    // Here you would typically handle the plan selection logic
    // such as redirecting to a signup form or opening a modal
  };

  return (
    <section className="w-full relative flex flex-col items-center box-border bg-black px-4 sm:px-6 md:px-8 pt-0 sm:pt-2 md:pt-4 lg:pt-6 pb-0">
      <header className="text-center mb-2 sm:mb-3 md:mb-6 lg:mb-8 max-w-[1180px]">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-medium leading-tight underline decoration-solid decoration-auto underline-offset-auto text-center mb-1 sm:mb-0.5">
          Pricing
        </h1>
        <p className="text-white text-lg sm:text-xl md:text-2xl lg:text-[28px] font-normal leading-relaxed text-center">
          Flexible plans that grow with your content.
        </p>
      </header>

      <div className="flex flex-row items-center justify-center relative gap-0 w-full max-w-[1180px] overflow-x-auto md:overflow-visible">
        <PricingCard
          title={pricingPlans[0].title}
          description={pricingPlans[0].description}
          features={pricingPlans[0].features}
          price={pricingPlans[0].price}
          ctaText={pricingPlans[0].ctaText}
          onCtaClick={() => handlePlanSelect(pricingPlans[0].title)}
          className="rounded-[12px_0_0_12px] sm:rounded-[14px_0_0_14px] md:rounded-[16px_0_0_16px] flex-shrink-0"
        />

        <PricingConnector direction="left" />

        <PricingCard
          title={pricingPlans[1].title}
          description={pricingPlans[1].description}
          features={pricingPlans[1].features}
          price={pricingPlans[1].price}
          ctaText={pricingPlans[1].ctaText}
          onCtaClick={() => handlePlanSelect(pricingPlans[1].title)}
          className="rounded-none border-x-[none] flex-shrink-0"
        />

        <PricingConnector direction="right" />

        <PricingCard
          title={pricingPlans[2].title}
          description={pricingPlans[2].description}
          features={pricingPlans[2].features}
          price={pricingPlans[2].price}
          ctaText={pricingPlans[2].ctaText}
          onCtaClick={() => handlePlanSelect(pricingPlans[2].title)}
          className="rounded-[0_12px_12px_0] sm:rounded-[0_14px_14px_0] md:rounded-[0_16px_16px_0] flex-shrink-0"
        />
      </div>
    </section>
  );
};

export default PricingSection;
