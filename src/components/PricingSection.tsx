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
      className={`w-full max-w-[314px] h-auto min-h-[500px] sm:min-h-[550px] md:min-h-[580px] md:max-w-[280px] lg:min-h-[600px] lg:max-w-[300px] xl:h-[613px] xl:max-w-[314px] flex flex-col items-center box-border relative bg-black px-6 sm:px-8 md:px-6 lg:px-7 xl:px-[42px] py-8 sm:py-9 md:py-8 lg:py-9 xl:py-10 border-2 sm:border-3 md:border-3 lg:border-3 xl:border-4 border-solid border-white rounded-2xl md:rounded-[16px] ${className}`}
    >
      <header className="text-center mb-8 sm:mb-9 md:mb-8 lg:mb-9 xl:mb-11">
        <h3 className="text-white text-center text-2xl sm:text-[28px] md:text-2xl lg:text-[28px] xl:text-[32px] font-bold leading-tight underline decoration-solid decoration-auto underline-offset-auto mb-3 sm:mb-3.5 md:mb-3 lg:mb-3.5 xl:mb-4">
          {title}
        </h3>
        <p className="text-white text-center text-base sm:text-[17px] md:text-[15px] lg:text-base xl:text-lg font-normal leading-relaxed w-full">
          {description}
        </p>
      </header>

      <div className="text-white text-lg sm:text-xl md:text-base lg:text-lg xl:text-xl font-normal leading-relaxed md:leading-7 lg:leading-8 xl:leading-10 flex-1 flex flex-col w-full">
        {features.map((feature, index) => (
          <div key={index} className="mb-1">
            • {feature}
          </div>
        ))}
        <button
          onClick={onCtaClick}
          className="mt-4 sm:mt-4.5 md:mt-4 lg:mt-4.5 xl:mt-5 text-left hover:text-purple-300 transition-colors duration-200 focus:outline-none focus:text-purple-300"
          aria-label={`${ctaText} for ${title} plan`}
        >
          [{ctaText}]
        </button>
      </div>

      <footer className="w-full max-w-[206px] h-8 flex items-center justify-center bg-[#8E31FF] mt-auto rounded-lg hover:bg-[#7A2BE6] transition-colors duration-200">
        <div className="text-white text-lg sm:text-xl md:text-lg lg:text-xl xl:text-[22px] font-medium leading-5">
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
    <div className={`max-md:hidden ${className}`}>
      <svg
        className="w-16 md:h-[580px] lg:h-[600px] xl:h-[613px] fill-[#D9D9D9] flex-shrink-0"
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
    <section className="w-full min-h-[931px] relative flex flex-col items-center box-border bg-black px-4 sm:px-6 md:px-8 pt-10 sm:pt-12 md:pt-16 lg:pt-[72px] pb-6 sm:pb-8 md:pb-10 lg:pb-12">
      <header className="text-center mb-12 sm:mb-14 md:mb-16 lg:mb-20 max-w-[1180px]">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-medium leading-tight underline decoration-solid decoration-auto underline-offset-auto text-center mb-1 sm:mb-0.5">
          Pricing
        </h1>
        <p className="text-white text-lg sm:text-xl md:text-2xl lg:text-[28px] font-normal leading-relaxed text-center">
          Flexible plans that grow with your content.
        </p>
      </header>

      <div className="flex flex-col md:flex-row items-center justify-center relative gap-5 md:gap-0 w-full max-w-[1180px]">
        <PricingCard
          title={pricingPlans[0].title}
          description={pricingPlans[0].description}
          features={pricingPlans[0].features}
          price={pricingPlans[0].price}
          ctaText={pricingPlans[0].ctaText}
          onCtaClick={() => handlePlanSelect(pricingPlans[0].title)}
          className="md:rounded-[16px_0_0_16px]"
        />

        <PricingConnector direction="left" />

        <PricingCard
          title={pricingPlans[1].title}
          description={pricingPlans[1].description}
          features={pricingPlans[1].features}
          price={pricingPlans[1].price}
          ctaText={pricingPlans[1].ctaText}
          onCtaClick={() => handlePlanSelect(pricingPlans[1].title)}
          className="md:rounded-2xl md:border-x-[none]"
        />

        <PricingConnector direction="right" />

        <PricingCard
          title={pricingPlans[2].title}
          description={pricingPlans[2].description}
          features={pricingPlans[2].features}
          price={pricingPlans[2].price}
          ctaText={pricingPlans[2].ctaText}
          onCtaClick={() => handlePlanSelect(pricingPlans[2].title)}
          className="md:rounded-[0px_16px_16px_0px]"
        />
      </div>
    </section>
  );
};

export default PricingSection;
