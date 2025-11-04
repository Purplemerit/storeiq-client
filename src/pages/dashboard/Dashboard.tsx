"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Play, Sparkles, Zap } from "lucide-react";

// Import images from assets
import aiVideoPlaceholder from "@/assets/images/ai-video-placeholder.png";
import aiImagePlaceholder from "@/assets/images/ai-image-placeholder.png";
import aiImageEditorPlaceholder from "@/assets/images/ai-imageeditor-placeholder.png";
import aiScriptPlaceholder from "@/assets/images/ai-script-placeholder.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<unknown[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setData([]);
    setLoading(false);
  }, []);

  const quickOptions = [
    {
      superTitle: "YouTube",
      title: "Search Viral Videos",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute top-6 right-6 text-gray-400 group-hover:text-white transition-colors"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      ),
      image:
        "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      href: "/dashboard/search-videos",
    },
    {
      superTitle: "4k images",
      title: "Search Images",
      image:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      href: "/dashboard/search-images",
    },
    {
      superTitle: "",
      title: "Setup Auto Mode",
      image:
        "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      href: "/dashboard/publish",
    },
  ];

  const tools = [
    {
      title: "Video Generator",
      subtitle: "Turn text into videos with AI",
      image: aiVideoPlaceholder,
      buttonText: "Try Now",
      link: "/dashboard/create-video",
    },
    {
      title: "Image Generator",
      subtitle: "Create images from your imagination",
      image: aiImagePlaceholder,
      buttonText: "Try Now",
      link: "/dashboard/create-image",
    },
    {
      title: "Image Editor",
      subtitle: "Edit images with AI",
      image: aiImageEditorPlaceholder,
      buttonText: "Try Now",
      link: "/dashboard/edit-image",
    },
    {
      title: "Script Generator",
      subtitle: "Generate creative video scripts",
      image: aiScriptPlaceholder,
      buttonText: "Try Now",
      link: "/dashboard/create-prompt",
    },
    {
      title: "Ai-Audio Mounting",
      subtitle: "Help to Mount AI Audio to Video",
      image: "./ai-voice-mounting.jpeg",
      buttonText: "Try Now",
      link: "/dashboard/aitextmounting",
    },
    {
      title: "Image mobing tool",
      subtitle: "Add object to other background scene",
      image:
        "https://store-iq-bucket.s3.ap-south-1.amazonaws.com/dashboard-images-static/WhatsApp+Image+2025-09-24+at+15.54.32.jpeg",
      buttonText: "Try Now",
      link: "/dashboard/aitools/Mobimage",
    },
    {
      title: "Script to Live Analyzer",
      subtitle: "Generate audio automatically",
      image:
        "https://store-iq-bucket.s3.ap-south-1.amazonaws.com/dashboard-images-static/Screenshot+2025-09-26+110713.png",
      buttonText: "Try Now",
      link: "/dashboard/aitools/tts",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 bg-storiq-dark min-h-screen">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Start Creating!
          </h1>
          <p className="text-gray-400">Choose how you want to get started</p>
        </div>

        {/* Quick Options */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 mb-10">
          {quickOptions.map((option, index) =>
            option.href ? (
              <div
                key={index}
                className="relative overflow-hidden rounded-2xl bg-storiq-card-bg border border-storiq-border p-6 min-h-[180px] flex flex-col justify-end group cursor-pointer transition-all duration-300 hover:border-storiq-purple/60 hover:shadow-lg hover:shadow-storiq-purple/20"
                onClick={() => navigate(option.href)}
                role="button"
                tabIndex={0}
                style={{ outline: "none" }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-300"
                  style={{ backgroundImage: `url(${option.image})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                {option.icon}
                <div className="relative z-10">
                  {option.superTitle && (
                    <p className="text-gray-300 text-[10px] md:text-xs font-semibold uppercase tracking-wider mb-1">
                      {option.superTitle}
                    </p>
                  )}
                  <h3 className="text-white text-sm md:text-xl font-bold">
                    {option.title}
                  </h3>
                </div>
              </div>
            ) : (
              <div
                key={index}
                className="relative overflow-hidden rounded-2xl bg-storiq-card-bg border border-storiq-border p-6 min-h-[180px] flex flex-col justify-end group cursor-pointer transition-all duration-300 hover:border-storiq-purple/60 hover:shadow-lg hover:shadow-storiq-purple/20"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-300"
                  style={{ backgroundImage: `url(${option.image})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                {option.icon}
                <div className="relative z-10">
                  {option.superTitle && (
                    <p className="text-gray-300 text-[10px] md:text-xs font-semibold uppercase tracking-wider mb-1">
                      {option.superTitle}
                    </p>
                  )}
                  <h3 className="text-white text-sm md:text-xl font-bold">
                    {option.title}
                  </h3>
                </div>
              </div>
            )
          )}
        </div>

        {/* Tabs */}
        <div className="relative inline-flex bg-storiq-card-bg border border-storiq-border rounded-xl p-1 mb-8">
          {/* Animated slider background */}
          <div
            className="absolute top-1 bottom-1 bg-storiq-purple rounded-lg transition-all duration-300 ease-in-out"
            style={{
              left: `${activeTab * 33.333}%`,
              width: "33.333%",
            }}
          />

          {["Home", "Creation", "Inspiration"].map((tab, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveTab(index);
                if (tab === "Creation") {
                  navigate("/dashboard/videos");
                } else if (tab === "Inspiration") {
                  navigate("/dashboard/create-prompt");
                }
              }}
              className={`relative z-10 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-300 flex-1 ${
                activeTab === index
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="relative border border-storiq-border rounded-2xl overflow-hidden group transition-all duration-300 hover:border-storiq-purple/50 hover:transform hover:-translate-y-1"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={tool.image || "/placeholder.svg"}
                  alt={tool.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 min-h-[280px] flex flex-col justify-end">
                <h3 className="text-white text-lg font-bold mb-1 drop-shadow-lg">
                  {tool.title}
                </h3>
                <p className="text-gray-200 text-sm mb-4 drop-shadow-md">
                  {tool.subtitle}
                </p>
                <Button
                  variant="outline"
                  className="w-auto px-5 py-2 bg-black/50 backdrop-blur-sm border border-storiq-border text-white text-sm font-semibold rounded-lg hover:bg-storiq-purple hover:border-storiq-purple transition-colors"
                  onClick={() => navigate(tool.link)}
                >
                  {tool.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
