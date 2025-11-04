import React from "react";

interface StepCardProps {
  stepNumber: string;
  title: string;
  description: string;
}

export const StepCard: React.FC<StepCardProps> = ({
  stepNumber,
  title,
  description,
}) => {
  return (
    <article className="w-full max-w-[1164px] h-auto min-h-[185px] relative flex flex-col md:flex-row items-center bg-neutral-900 mb-6 sm:mb-8 md:mb-10 p-4 sm:p-5 md:p-0 rounded-3xl sm:rounded-[40px] md:rounded-[56px] text-center md:text-left">
      <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-[120px] md:h-[120px] lg:w-[169px] lg:h-[169px] flex items-center justify-center shrink-0 bg-white rounded-3xl sm:rounded-[40px] md:rounded-[50px] mb-4 md:mb-0 md:ml-2 md:mr-0 md:absolute md:left-2 md:top-2">
        <span className="text-black text-2xl sm:text-3xl md:text-4xl lg:text-[56px] font-medium leading-tight">
          {stepNumber}
        </span>
      </div>
      <div className="flex flex-col justify-center flex-1 md:ml-[200px] lg:ml-[271px] md:pr-10">
        <h3 className="text-white text-xl sm:text-2xl md:text-[28px] lg:text-[40px] font-medium leading-tight mb-2 md:mb-3">
          {title}
        </h3>
        <p className="text-white text-sm sm:text-base md:text-lg font-light leading-relaxed">
          {description}
        </p>
      </div>
    </article>
  );
};

interface Step {
  id: string;
  number: string;
  title: string;
  description: string;
}

const stepsData: Step[] = [
  {
    id: "upload",
    number: "01",
    title: "Upload or Import",
    description:
      "Bring in your clips, images, or even a URL — our AI gets to work instantly.",
  },
  {
    id: "edit",
    number: "02",
    title: "Auto-Magic Editing",
    description:
      "AI finds the perfect cuts, adds captions, and matches your style — no timeline needed.",
  },
  {
    id: "export",
    number: "03",
    title: "Export & Share",
    description:
      "Download in high quality or post directly to your favorite platforms in one click.",
  },
];

export const Steps: React.FC = () => {
  return (
    <section
      className="w-full min-h-[933px] box-border relative flex flex-col items-center bg-black px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16 lg:py-[72px]"
      aria-labelledby="steps-title"
    >
      <header className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-[60px] max-w-[1180px]">
        <h1
          id="steps-title"
          className="text-white text-3xl sm:text-4xl md:text-5xl font-medium leading-tight underline decoration-solid decoration-auto underline-offset-auto text-center mb-3 sm:mb-4 md:mb-5"
        >
          Steps to Edit
        </h1>
        <p className="text-white text-lg sm:text-xl md:text-2xl lg:text-[28px] font-normal leading-relaxed text-center">
          Edit like a pro, without touching a timeline.
        </p>
      </header>

      <div
        className="w-full max-w-[1180px] flex flex-col items-center"
        role="list"
        aria-label="Video editing steps"
      >
        {stepsData.map((step) => (
          <div
            key={step.id}
            role="listitem"
            className="w-full flex justify-center"
          >
            <StepCard
              stepNumber={step.number}
              title={step.title}
              description={step.description}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Steps;
