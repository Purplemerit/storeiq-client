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
      className={`w-[314px] h-[613px] flex flex-col items-center box-border relative bg-black px-[42px] py-10 border-4 border-solid border-white max-md:w-full max-md:max-w-[400px] max-md:h-auto max-md:min-h-[500px] max-md:rounded-2xl max-md:border-4 max-md:border-solid max-md:border-white max-sm:min-h-[450px] max-sm:px-6 max-sm:py-[30px] ${className}`}
    >
      <header className="text-center mb-11 max-sm:mb-[30px]">
        <h3 className="text-white text-center text-[32px] font-bold leading-[30px] underline decoration-solid decoration-auto underline-offset-auto mb-4 max-sm:text-[28px] max-sm:leading-7">
          {title}
        </h3>
        <p className="text-white text-center text-lg font-normal leading-[30px] w-full max-sm:text-base max-sm:leading-6">
          {description}
        </p>
      </header>

      <div className="text-white text-2xl font-normal leading-10 flex-1 flex flex-col w-full max-md:text-xl max-md:leading-8 max-sm:text-lg max-sm:leading-7">
        {features.map((feature, index) => (
          <div key={index}>• {feature}</div>
        ))}
        <button
          onClick={onCtaClick}
          className="mt-5 text-left hover:text-purple-300 transition-colors duration-200 focus:outline-none focus:text-purple-300"
          aria-label={`${ctaText} for ${title} plan`}
        >
          [{ctaText}]
        </button>
      </div>

      <footer className="w-[206px] h-8 flex items-center justify-center bg-[#8E31FF] mt-auto rounded-lg max-sm:w-full hover:bg-[#7A2BE6] transition-colors duration-200">
        <div className="text-white text-[22px] font-medium leading-5 max-sm:text-xl">
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
        width="64"
        height="613"
        viewBox="0 0 64 613"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-16 h-[613px] fill-[#D9D9D9] flex-shrink-0"
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
    <section className="w-full min-h-[931px] relative flex flex-col items-center box-border bg-black px-0 py-[72px] max-md:min-h-[auto] max-md:px-5 max-md:py-10 max-sm:px-4 max-sm:py-[30px]">
      <header className="text-center mb-20 max-md:mb-[60px] max-sm:mb-10">
        <h1 className="text-white text-5xl font-medium leading-[60px] underline decoration-solid decoration-auto underline-offset-auto text-center mb-0.5 max-md:text-4xl max-md:leading-[44px] max-sm:text-[28px] max-sm:leading-9">
          Pricing
        </h1>
        <p className="text-white text-[28px] font-normal leading-8 text-center max-md:text-[22px] max-md:leading-7 max-sm:text-lg max-sm:leading-6">
          Flexible plans that grow with your content.
        </p>
      </header>

      <div className="flex items-center justify-center relative max-md:flex-col max-md:gap-5">
        <PricingCard
          title={pricingPlans[0].title}
          description={pricingPlans[0].description}
          features={pricingPlans[0].features}
          price={pricingPlans[0].price}
          ctaText={pricingPlans[0].ctaText}
          onCtaClick={() => handlePlanSelect(pricingPlans[0].title)}
          className="rounded-[16px_0_0_16px] max-md:rounded-2xl"
        />

        <PricingConnector direction="left" />

        <PricingCard
          title={pricingPlans[1].title}
          description={pricingPlans[1].description}
          features={pricingPlans[1].features}
          price={pricingPlans[1].price}
          ctaText={pricingPlans[1].ctaText}
          onCtaClick={() => handlePlanSelect(pricingPlans[1].title)}
          className="rounded-2xl border-x-[none] max-md:border-4 max-md:border-solid max-md:border-white"
        />

        <PricingConnector direction="right" />

        <PricingCard
          title={pricingPlans[2].title}
          description={pricingPlans[2].description}
          features={pricingPlans[2].features}
          price={pricingPlans[2].price}
          ctaText={pricingPlans[2].ctaText}
          onCtaClick={() => handlePlanSelect(pricingPlans[2].title)}
          className="rounded-[0_16px_16px_0] max-md:rounded-2xl"
        />
      </div>
    </section>
  );
};

export default PricingSection;
