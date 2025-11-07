import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CustomButton from "@/components/ui/custom-button";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  isOpen: boolean;
}

// 1. Updated imports to match your new video files
const editingVideo =
  "https://store-iq-video-bucket.s3.ap-south-1.amazonaws.com/lightning-editing.mp4";
const aiVideo =
  "https://store-iq-video-bucket.s3.ap-south-1.amazonaws.com/ai-gets-you.mp4";
const creativityVideo =
  "https://store-iq-video-bucket.s3.ap-south-1.amazonaws.com/effortless-creativity.mp4";
const growthVideo =
  "https://store-iq-video-bucket.s3.ap-south-1.amazonaws.com/built-for-growth.mp4";

const About = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const faqData = [
    {
      id: 1,
      question: "How can Storiq transform my content creation game?",
      answer:
        "STORIQ is your AI-powered co-creator for modern storytelling — turning raw ideas into scroll-stopping content effortlessly. From smart scripting to polished visuals, it helps creators plan, repurpose, and publish engaging content that actually connects.",
    },
    {
      id: 2,
      question: "Can I cancel my subscription at any time?",
      answer:
        "Yes, you can cancel your subscription at any time. You can do so by going to your account settings. And if you need help with anything, our (human) support team is here to assist you.",
    },
    {
      id: 3,
      question: "What kind of content can I create with Storiq?",
      answer:
        "Whatever you imagine, STORIQ brings it to life. Repurpose blogs, transform podcasts, craft viral shorts, or auto-generate product demos — all from a single prompt. Just drop in your idea, and let AI do the rest — script, edit, design, and publish.",
    },
  ];

  const [faqItems, setFaqItems] = useState<FAQItem[]>(
    faqData.map((item) => ({ ...item, isOpen: false }))
  );

  const toggleFAQ = (id: number) => {
    setFaqItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  // The 'videoSrc' properties are now correctly linked to your videos
  const whyCreatorsLove = [
    {
      title: "Lightning-Fast Editing",
      videoSrc: editingVideo,
    },
    {
      title: "AI That Gets You",
      videoSrc: aiVideo,
    },
    {
      title: "Effortless Creativity",
      videoSrc: creativityVideo,
    },
    {
      title: "Built For Growth",
      videoSrc: growthVideo,
    },
  ];

  const ethicsFeatures = [
    {
      icon: "🔒",
      title: "Data Privacy",
      description: "Your content stays yours. No AI training on personal data.",
    },
    {
      icon: "🏷️",
      title: "No Watermarks",
      description: "All outputs are watermark-free and copyright friendly.",
    },
    {
      icon: "👑",
      title: "Creator Ownership",
      description:
        "You retain full ownership of everything you create with us.",
    },
  ];

  return (
    <div className="min-h-screen bg-storiq-dark text-white">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
            We're not just a tool —<br />
            we're your co-creator.
          </h1>
          <p className="text-base md:text-xl text-white/60 mb-6 md:mb-8 max-w-2xl mx-auto">
            AI should amplify your creativity, not replace it. Here's how we
            make that happen.
          </p>
          <CustomButton text="Feel the Magic" />
        </div>
      </section>

      {/* Why Creators Love STORIQ */}
      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16">
            Why creators love STORIQ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {whyCreatorsLove.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="relative bg-storiq-card-bg border border-storiq-border rounded-2xl p-6 md:p-8 h-40 md:h-48 flex items-center justify-center overflow-hidden transition-all duration-300"
              >
                <video
                  src={feature.videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out
                    ${
                      hoveredFeature === index
                        ? "opacity-100 scale-110"
                        : "opacity-0 scale-100"
                    }`}
                />
                <div className="absolute inset-0 bg-storiq-dark/60" />
                <h3 className="relative text-xl md:text-2xl lg:text-3xl font-bold text-center z-10 px-2">
                  {feature.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rest of your page components remain the same... */}
      {/* Emotion-Driven Creation */}
      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-stretch">
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl md:text-[32px] font-bold leading-tight md:leading-[36px] mb-4 md:mb-6 text-white">
                <span className="underline">Emotion-Driven</span> Creation
              </h2>
              <p className="text-sm md:text-base text-white/60 mb-4 md:mb-6">
                Move beyond cut-and-dry edits — think how AI feels that
                resonates. Our AI understands the power of emotionally-driven
                content. Together, impactful creation.
              </p>
              <ul className="space-y-3 md:space-y-4 text-sm md:text-base text-white/80">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2 md:mr-3 flex-shrink-0">
                    •
                  </span>
                  <span>
                    AI reads nuance, too. Irony, structure, and comedic pacing
                    are all understood.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2 md:mr-3 flex-shrink-0">
                    •
                  </span>
                  <span>
                    Audio clarity is never sacrificed. Your audience stays
                    fluffy, emotional information.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2 md:mr-3 flex-shrink-0">
                    •
                  </span>
                  <span>
                    Realize visually storytelling based on the mood and ambience
                    of your narrative.
                  </span>
                </li>
              </ul>
            </div>
            <div className="relative bg-storiq-card-bg border border-storiq-border rounded-2xl p-6 md:p-8 flex items-center justify-center min-h-[200px] md:min-h-full overflow-hidden">
              <video
                src="https://store-iq-video-bucket.s3.ap-south-1.amazonaws.com/about-emotion.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-40"
              />
              <h3 className="relative text-xl md:text-2xl font-bold text-center z-10">
                Emotion Driven Creation
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Built for Creators */}
      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-stretch">
            <div className="relative bg-storiq-card-bg border border-storiq-border rounded-2xl p-6 md:p-8 flex items-center justify-center min-h-[200px] md:min-h-full order-2 lg:order-1 overflow-hidden">
              <video
                src="https://store-iq-video-bucket.s3.ap-south-1.amazonaws.com/about-creator.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-40"
              />
              <h3 className="relative text-xl md:text-2xl font-bold text-center z-10">
                Creator-first philosophy
              </h3>
            </div>
            <div className="flex flex-col justify-center order-1 lg:order-2">
              <h2 className="text-2xl md:text-[32px] font-bold leading-tight md:leading-[36px] mb-4 md:mb-6 text-white">
                <span className="underline">Built for Creators</span>, Not
                Corporates
              </h2>
              <p className="text-base md:text-xl text-white/60 mb-6 md:mb-8">
                Our philosophy is human-centered, for efficiency-centric. So
                let's be on human, and keep you human.
              </p>
              <ul className="space-y-4 md:space-y-6 text-sm md:text-base text-white/80">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2 md:mr-3 flex-shrink-0">
                    •
                  </span>
                  <span>No forced workflow or standardization.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2 md:mr-3 flex-shrink-0">
                    •
                  </span>
                  <span>
                    Functions are tools are designed specifically for the hobby,
                    freely, not talent.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2 md:mr-3 flex-shrink-0">
                    •
                  </span>
                  <span>
                    We build features based on a direct feedback loop from our
                    creator community.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AI With Ethics */}
      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16">
            <span className="underline">AI With</span> Ethics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {ethicsFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-storiq-card-bg border border-storiq-border rounded-2xl p-5 sm:p-6 md:p-7 lg:p-8"
              >
                <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="text-2xl sm:text-3xl md:text-4xl flex-shrink-0 leading-none">
                    {feature.icon}
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold leading-tight">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm md:text-base text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16">
          <span className="underline">Frequently Asked</span> Questions
        </h2>
        <div className="w-full max-w-[1180px] text-lg sm:text-xl md:text-2xl lg:text-[28px] text-white font-medium text-center leading-relaxed md:leading-loose">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className={`bg-storiq-card-bg flex w-full flex-col overflow-hidden items-stretch justify-center p-4 sm:p-5 md:p-7 rounded-[20px] ${
                item.id > 1 ? "mt-4 md:mt-6" : ""
              }`}
            >
              <button
                className="flex items-center gap-4 md:gap-8 justify-between text-left"
                onClick={() => toggleFAQ(item.id)}
                aria-expanded={item.isOpen}
                aria-controls={`faq-content-${item.id}`}
              >
                <div
                  className={`flex-1 my-auto text-left ${
                    item.isOpen ? "underline" : ""
                  }`}
                >
                  {item.question}
                </div>
                <img
                  src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/5174b3c6fbffa0666d0dbde2086ba1eedb2c3817?placeholderIfAbsent=true"
                  className={`aspect-[1] object-contain w-5 md:w-6 flex-shrink-0 my-auto transition-transform duration-300 ${
                    item.isOpen ? "rotate-180" : ""
                  }`}
                  alt="Toggle FAQ"
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  item.isOpen
                    ? "grid-rows-[1fr] opacity-100 mt-3 md:mt-4"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div
                    id={`faq-content-${item.id}`}
                    className="text-sm md:text-base text-gray-300 leading-relaxed text-left"
                  >
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
