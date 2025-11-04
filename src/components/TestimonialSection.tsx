import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DecorativeElements: React.FC = () => {
  return (
    <>
      {/* Purple rectangle - top right */}
      <div className="w-[60px] h-20 sm:w-20 sm:h-[120px] md:w-[100px] md:h-[140px] lg:w-[120px] lg:h-[160px] xl:w-[143px] xl:h-[178px] absolute bg-[#8638E5] right-[10px] bottom-[20px] sm:right-5 sm:bottom-10 md:right-8 md:bottom-12 lg:right-4 lg:bottom-[60px] xl:right-0 xl:bottom-[72px]" />

      {/* Dark rectangle - center right */}
      <div className="w-[calc(100%_-_200px)] h-auto min-h-[160px] sm:w-[calc(100%_-_270px)] sm:min-h-[180px] md:w-[calc(70%)] md:min-h-[200px] lg:w-[480px] lg:h-[220px] xl:w-[540px] xl:h-[235px] absolute bg-[#1B1B1B] left-[190px] top-[220px] sm:left-[250px] sm:top-[200px] md:left-[310px] md:top-[210px] lg:left-[410px] lg:top-[220px] xl:left-[498px] xl:top-[231px] box-border p-4 sm:p-5" />

      {/* Semi-transparent purple rectangle - bottom left */}
      <div className="w-[calc(55%_-_10px)] h-16 sm:w-[calc(50%_-_20px)] sm:h-20 md:w-[calc(45%)] md:h-[100px] lg:w-[400px] lg:h-[140px] xl:w-[498px] xl:h-[175px] absolute bg-[rgba(134,56,229,0.50)] left-[10px] bottom-[20px] sm:left-5 sm:bottom-10 md:left-8 md:bottom-12 lg:left-4 lg:bottom-[60px] xl:left-0 xl:bottom-[74px]" />
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
      {/* Left Arrow - positioned inside semi-transparent purple area */}
      <button
        onClick={onPrevious}
        className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-[58px] lg:h-[58px] absolute left-[20px] bottom-[30px] sm:left-6 sm:bottom-12 md:left-8 md:bottom-14 lg:left-[31px] lg:bottom-[90px] hover:opacity-80 transition-opacity focus:outline-none z-30"
        aria-label="Previous testimonial"
      >
        <ChevronLeft
          size={40}
          color="#929292"
          strokeWidth={2.5}
          className="w-full h-full"
        />
      </button>

      {/* Right Arrow - positioned inside purple area */}
      <button
        onClick={onNext}
        className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-[58px] lg:h-[58px] absolute right-[20px] bottom-[30px] sm:right-6 sm:bottom-12 md:right-8 md:bottom-14 lg:right-[31px] lg:bottom-[90px] hover:opacity-80 transition-opacity focus:outline-none z-30"
        aria-label="Next testimonial"
      >
        <ChevronRight
          size={40}
          color="white"
          strokeWidth={2.5}
          className="w-full h-full"
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
      {/* Profile Image - positioned right next to black area */}
      <img
        src={imageUrl}
        alt={imageAlt}
        className="w-[130px] h-[195px] sm:w-[170px] sm:h-[255px] md:w-[200px] md:h-[300px] lg:w-[250px] lg:h-[375px] xl:w-[300px] xl:h-[450px] absolute left-[55px] top-[220px] sm:left-[75px] sm:top-[200px] md:left-[105px] md:top-[210px] lg:left-[155px] lg:top-[220px] xl:left-[193px] xl:top-[231px] object-cover z-10"
      />

      {/* Author Name */}
      <cite className="text-white text-[18px] sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[35px] font-bold leading-tight absolute left-[200px] top-[235px] sm:left-[265px] sm:top-[215px] md:left-[325px] md:top-[225px] lg:left-[425px] lg:top-[240px] xl:left-[523px] xl:top-[250px] not-italic whitespace-nowrap z-20">
        {name}
      </cite>

      {/* Testimonial Quote - positioned to align with black background */}
      <blockquote className="w-[calc(100%_-_210px)] sm:w-[calc(100%_-_280px)] md:w-[calc(100%_-_340px)] lg:w-[460px] xl:w-[500px] text-white text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[22px] font-normal leading-snug sm:leading-relaxed md:leading-relaxed lg:leading-7 xl:leading-8 absolute h-auto box-border p-[8px] sm:p-[10px] md:p-3 lg:p-4 xl:p-0 left-[200px] top-[260px] sm:left-[265px] sm:top-[245px] md:left-[325px] md:top-[260px] lg:left-[425px] lg:top-[280px] xl:left-[523px] xl:top-[300px] z-20">
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
      className="relative w-full bg-black py-12 sm:py-14 md:py-16 lg:py-20"
      aria-label="Customer testimonials"
    >
      <div className="relative w-full max-w-[1180px] h-auto min-h-[500px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[539px] mx-auto my-0 px-4 sm:px-5 md:px-6">
        {/* Decorative Background Elements */}
        <DecorativeElements />

        {/* Section Title - positioned to the left of the image */}
        <h2 className="-rotate-90 text-white text-center text-xl sm:text-2xl md:text-[28px] lg:text-[35px] font-normal leading-tight absolute w-[150px] sm:w-40 md:w-44 lg:w-48 h-[30px] left-[-20px] top-[270px] sm:left-[-15px] sm:top-[260px] md:left-[-10px] md:top-[280px] lg:left-[10px] lg:top-[300px] xl:left-[40px] xl:top-[320px] z-5">
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
      </div>
    </section>
  );
};

export default TestimonialSection;
