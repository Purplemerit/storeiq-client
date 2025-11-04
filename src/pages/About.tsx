import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CustomButton from "@/components/ui/custom-button";

interface FAQItem {
  id: number;
  question: string;
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
  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    {
      id: 1,
      question: "How can Storiq transform my content creation game?",
      isOpen: false,
    },
    {
      id: 2,
      question: "Can I cancel my subscription at any time?",
      isOpen: false,
    },
    {
      id: 3,
      question: "What kind of content can I create with Storiq?",
      isOpen: false,
    },
    {
      id: 4,
      question: "Can I cancel my subscription at any time?",
      isOpen: false,
    },
    {
      id: 5,
      question: "How can Storiq transform my content creation game?",
      isOpen: false,
    },
    {
      id: 6,
      question: "What kind of content can I create with Storiq?",
      isOpen: false,
    },
    {
      id: 7,
      question: "How can Storiq transform my content creation game?",
      isOpen: false,
    },
    {
      id: 8,
      question: "Can I cancel my subscription at any time?",
      isOpen: false,
    },
  ]);

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
      <section className="py-20 px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            We're not just a tool —<br />
            we're your co-creator.
          </h1>
          <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
            AI should amplify your creativity, not replace it. Here's how we
            make that happen.
          </p>
          <CustomButton text="Feel the Magic" />
        </div>
      </section>

      {/* Why Creators Love STORIQ */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why creators love STORIQ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyCreatorsLove.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="relative bg-storiq-card-bg border border-storiq-border rounded-2xl p-8 h-48 flex items-center justify-center overflow-hidden transition-all duration-300"
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
                <h3 className="relative text-3xl font-bold text-center z-10">
                  {feature.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rest of your page components remain the same... */}
      {/* Emotion-Driven Creation */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            <div className="flex flex-col justify-center">
              <h2 className="text-[32px] font-bold leading-[36px] mb-6 text-white whitespace-nowrap">
                <span className="underline">Emotion-Driven</span> Creation
              </h2>
              <p className="text-white/60 mb-6">
                Move beyond cut-and-dry edits — think how AI feels that
                resonates. Our AI understands the power of emotionally-driven
                content. Together, impactful creation.
              </p>
              <ul className="space-y-4 text-white/80">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-3">•</span>
                  AI reads nuance, too. Irony, structure, and comedic pacing are
                  all understood.
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-3">•</span>
                  Audio clarity is never sacrificed. Your audience stays fluffy,
                  emotional information.
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-3">•</span>
                  Realize visually storytelling based on the mood and ambience
                  of your narrative.
                </li>
              </ul>
            </div>
            <div className="bg-storiq-card-bg border border-storiq-border rounded-2xl p-8 flex items-center justify-center min-h-full">
              <h3 className="text-2xl font-bold text-center">
                Emotion Driven Creation
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Built for Creators */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            <div className="bg-storiq-card-bg border border-storiq-border rounded-2xl p-8 flex items-center justify-center min-h-full">
              <h3 className="text-2xl font-bold text-center">
                Creator-first philosophy
              </h3>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-[32px] font-bold leading-[36px] mb-6 text-white whitespace-nowrap">
                <span className="underline">Built for Creators</span>, Not
                Corporates
              </h2>
              <p className="text-xl text-white/60 mb-8">
                Our philosophy is human-centered, for efficiency-centric. So
                let's be on human, and keep you human.
              </p>
              <ul className="space-y-6 text-white/80">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-3">•</span>
                  <span>No forced workflow or standardization.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-3">•</span>
                  <span>
                    Functions are tools are designed specifically for the hobby,
                    freely, not talent.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-3">•</span>
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
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="underline">AI With</span> Ethics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ethicsFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-storiq-card-bg border border-storiq-border rounded-2xl p-8"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-4xl">{feature.icon}</div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                </div>
                <p className="text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-8 flex flex-col items-center">
        <h2 className="text-4xl font-bold text-center mb-16">
          <span className="underline">Frequently Asked</span> Questions
        </h2>
        <div className="w-[1180px] max-w-full text-[28px] text-white font-medium text-center leading-loose">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className={`bg-storiq-card-bg flex w-full flex-col overflow-hidden items-stretch justify-center p-7 rounded-[20px] max-md:max-w-full max-md:px-5 ${
                item.id > 1 ? "mt-6" : ""
              }`}
            >
              <button
                className="flex items-center gap-[40px_100px] justify-between flex-wrap max-md:max-w-full text-left"
                onClick={() => toggleFAQ(item.id)}
                aria-expanded={item.isOpen}
                aria-controls={`faq-content-${item.id}`}
              >
                <div className="self-stretch my-auto max-md:max-w-full">
                  {item.question}
                </div>
                <img
                  src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/5174b3c6fbffa0666d0dbde2086ba1eedb2c3817?placeholderIfAbsent=true"
                  className={`aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto transition-transform duration-300 ${
                    item.isOpen ? "rotate-180" : ""
                  }`}
                  alt="Toggle FAQ"
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  item.isOpen
                    ? "grid-rows-[1fr] opacity-100 mt-4"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div
                    id={`faq-content-${item.id}`}
                    className="text-base text-gray-300 leading-relaxed text-left"
                  >
                    This is the answer content for "{item.question}". Here you
                    would typically include detailed information about the
                    question.
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
