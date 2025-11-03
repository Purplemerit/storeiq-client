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
    <article className="w-[1164px] h-[185px] relative flex items-center bg-neutral-900 mb-10 p-0 rounded-[56px] max-md:w-full max-md:max-w-full max-md:h-auto max-md:min-h-40 max-md:flex-col max-md:text-center max-md:mb-[30px] max-md:p-5 max-md:rounded-[40px] max-sm:mb-5 max-sm:px-4 max-sm:py-6 max-sm:rounded-3xl">
      <div className="w-[226px] h-[169px] absolute flex items-center justify-center shrink-0 bg-white rounded-[50px] left-2 top-2 max-md:w-[120px] max-md:h-[120px] max-md:relative max-md:mb-5 max-md:left-auto max-md:top-auto max-sm:w-20 max-sm:h-20 max-sm:mb-4">
        <span className="text-black text-[56px] font-medium leading-[60px] max-md:text-4xl max-md:leading-10 max-sm:text-2xl max-sm:leading-7">
          {stepNumber}
        </span>
      </div>
      <div className="flex flex-col justify-center flex-1 ml-[271px] pr-10 max-md:ml-0 max-md:text-center max-md:pr-0">
        <h3 className="text-white text-[40px] font-medium leading-[50px] mb-3 max-md:text-[28px] max-md:leading-9 max-md:mb-2 max-sm:text-xl max-sm:leading-7 max-sm:mb-2">
          {title}
        </h3>
        <p className="text-white text-lg font-light leading-6 max-md:text-base max-md:leading-5 max-sm:text-sm max-sm:leading-[18px]">
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
      className="w-full min-h-[933px] box-border relative flex flex-col items-center bg-black px-[138px] py-[72px] max-md:px-[60px] max-md:py-10 max-sm:px-5 max-sm:py-[30px]"
      aria-labelledby="steps-title"
    >
      <header className="text-center mb-[60px] max-md:mb-10 max-sm:mb-[30px]">
        <h1
          id="steps-title"
          className="text-white text-5xl font-medium leading-[60px] underline decoration-solid decoration-auto underline-offset-auto text-center mb-5 max-md:text-4xl max-md:leading-[44px] max-sm:text-[28px] max-sm:leading-[34px]"
        >
          Steps to Edit
        </h1>
        <p className="text-white text-[28px] font-normal leading-8 text-center max-md:text-[22px] max-md:leading-[26px] max-sm:text-lg max-sm:leading-[22px]">
          Edit like a pro, without touching a timeline.
        </p>
      </header>

      <div
        className="w-full flex flex-col items-center"
        role="list"
        aria-label="Video editing steps"
      >
        {stepsData.map((step) => (
          <div key={step.id} role="listitem">
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
