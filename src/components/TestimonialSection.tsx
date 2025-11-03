import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DecorativeElements: React.FC = () => {
  return (
    <>
      {/* Purple rectangle - top right */}
      <div className="w-[143px] h-[178px] absolute bg-[#8638E5] right-0 bottom-[72px] max-md:w-20 max-md:h-[120px] max-md:right-5 max-md:bottom-10 max-sm:w-[60px] max-sm:h-20 max-sm:right-[15px] max-sm:bottom-[30px]" />

      {/* Dark rectangle - center right */}
      <div className="w-[540px] h-[235px] absolute bg-[#1B1B1B] left-[498px] top-[231px] max-md:w-[calc(100%_-_40px)] max-md:h-auto max-md:min-h-[200px] max-md:box-border max-md:p-5 max-md:left-5 max-md:top-[180px] max-sm:w-[calc(100%_-_30px)] max-sm:min-h-[180px] max-sm:left-[15px] max-sm:top-[250px]" />

      {/* Semi-transparent purple rectangle - bottom left */}
      <div className="w-[498px] h-[175px] absolute bg-[rgba(134,56,229,0.50)] left-0 bottom-[74px] max-md:w-[calc(50%_-_20px)] max-md:h-[120px] max-md:left-5 max-md:bottom-10 max-sm:w-[calc(60%_-_15px)] max-sm:h-20 max-sm:left-[15px] max-sm:bottom-[30px]" />
    </>
  );
};

interface NavigationArrowsProps {
  onPrevious?: () => void;
  onNext?: () => void;
}

const NavigationArrows: React.FC<NavigationArrowsProps> = ({
  onPrevious,
  onNext,
}) => {
  return (
    <>
      {/* Left Arrow */}
      <button
        onClick={onPrevious}
        className="w-[58px] h-[58px] absolute left-[31px] top-[349px] max-md:left-5 max-md:top-auto max-md:bottom-5 max-sm:w-10 max-sm:h-10 max-sm:left-[15px] max-sm:bottom-[15px] hover:opacity-80 transition-opacity focus:outline-none"
        aria-label="Previous testimonial"
      >
        <ChevronLeft
          size={58}
          color="#929292"
          strokeWidth={2.5}
          className="w-full h-full max-sm:w-10 max-sm:h-10"
        />
      </button>

      {/* Right Arrow */}
      <button
        onClick={onNext}
        className="w-[58px] h-[58px] absolute right-[58px] top-[349px] max-md:right-5 max-md:top-auto max-md:bottom-5 max-sm:w-10 max-sm:h-10 max-sm:right-[15px] max-sm:bottom-[15px] hover:opacity-80 transition-opacity focus:outline-none"
        aria-label="Next testimonial"
      >
        <ChevronRight
          size={58}
          color="white"
          strokeWidth={2.5}
          className="w-full h-full max-sm:w-10 max-sm:h-10"
        />
      </button>
    </>
  );
};

interface TestimonialCardProps {
  name: string;
  quote: string;
  imageUrl: string;
  imageAlt?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  quote,
  imageUrl,
  imageAlt = "Profile image",
}) => {
  return (
    <>
      {/* Profile Image */}
      <img
        src={imageUrl}
        alt={imageAlt}
        className="w-[300px] h-[450px] absolute left-[200px] top-[80px] max-md:w-[220px] max-md:h-[330px] max-md:left-[80px] max-md:top-[60px] max-sm:w-[160px] max-sm:h-[240px] max-sm:left-[60px] max-sm:top-[50px] object-cover z-10"
      />

      {/* Author Name */}
      <cite className="text-white text-[35px] font-bold leading-[30px] absolute left-[523px] top-[151px] max-md:text-[28px] max-md:left-[320px] max-md:top-[120px] max-sm:text-[22px] max-sm:left-[240px] max-sm:top-[100px] not-italic whitespace-nowrap z-20">
        {name}
      </cite>

      {/* Testimonial Quote */}
      <blockquote className="w-[520px] text-white text-[26px] font-normal leading-9 absolute h-40 left-[523px] top-[240px] max-md:w-[calc(100%_-_340px)] max-md:text-xl max-md:leading-7 max-md:h-auto max-md:box-border max-md:p-5 max-md:left-[320px] max-md:top-[180px] max-sm:w-[calc(100%_-_260px)] max-sm:text-base max-sm:leading-[24px] max-sm:box-border max-sm:p-[15px] max-sm:left-[240px] max-sm:top-[150px] z-20">
        {quote}
      </blockquote>
    </>
  );
};

interface Testimonial {
  id: number;
  name: string;
  quote: string;
  imageUrl: string;
  imageAlt?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Meera Rajput",
    quote:
      '"The AI tools are spot-on. From script generation to export, every step feels effortless and saves me hours each week."',
    imageUrl: "/girl-stickerr.png",
    imageAlt: "Meera Rajput profile image",
  },
  {
    id: 2,
    name: "Alex Johnson",
    quote:
      '"This platform has revolutionized my workflow. The intuitive interface and powerful features make content creation a breeze."',
    imageUrl: "/alex_johnson.jpg",
    imageAlt: "Alex Johnson profile image",
  },
  {
    id: 3,
    name: "Sarah Chen",
    quote:
      "\"I've tried many tools, but nothing comes close to this level of automation and quality. It's a game-changer for creators.\"",
    imageUrl: "/sarah_chen.jpg",
    imageAlt: "Sarah Chen profile image",
  },
];

const TestimonialSection: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const handlePrevious = () => {
    setCurrentTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentTestimonial((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const currentData = testimonials[currentTestimonial];

  return (
    <section
      className="relative w-full max-w-[1180px] h-[539px] mx-auto my-0 max-md:h-auto max-md:min-h-[400px] max-md:p-5 max-sm:h-auto max-sm:min-h-[500px] max-sm:p-[15px]"
      aria-label="Customer testimonials"
    >
      {/* Decorative Background Elements */}
      <DecorativeElements />

      {/* Section Title */}
      <h2 className="-rotate-90 text-white text-center text-[35px] font-normal leading-[30px] absolute w-48 h-[30px] left-[85px] top-[240px] max-md:text-[28px] max-md:left-[10px] max-md:top-[200px] max-sm:text-xl max-sm:w-[150px] max-sm:left-[5px] max-sm:top-[150px] z-5">
        Testimonials
      </h2>

      {/* Current Testimonial */}
      <TestimonialCard
        name={currentData.name}
        quote={currentData.quote}
        imageUrl={currentData.imageUrl}
        imageAlt={currentData.imageAlt}
      />

      {/* Navigation Arrows */}
      <NavigationArrows onPrevious={handlePrevious} onNext={handleNext} />

      {/* Screen Reader Navigation Info */}
      <div className="sr-only" aria-live="polite">
        Showing testimonial {currentTestimonial + 1} of {testimonials.length}
      </div>
    </section>
  );
};

export default TestimonialSection;
