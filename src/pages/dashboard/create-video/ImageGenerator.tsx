// ImageGenerator.tsx
import React, { useState, useEffect, useRef } from "react";
import henryPrompt from "@/assets/images/henry-prompt.webp";
import bearPrompt from "@/assets/images/bear-prompt.webp";
import spritePrompt from "@/assets/images/sprite-prompt.webp";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import { authFetch } from "@/lib/authFetch";
import { Download, RefreshCw, Sparkles, Wand2, Maximize2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Aspect ratio options
  const aspectRatioOptions = [
    { value: "1:1", label: "Square (1:1)", description: "1024x1024" },
    { value: "16:9", label: "Landscape (16:9)", description: "1344x768" },
    { value: "9:16", label: "Portrait (9:16)", description: "768x1344" },
    { value: "4:3", label: "Standard (4:3)", description: "1152x896" },
    { value: "3:4", label: "Portrait (3:4)", description: "896x1152" },
  ];

  // Default images
  const defaultImages = [
    {
      src: henryPrompt,
      description:
        "Close-up hyper-realistic portrait of Henry Cavill in a blue suit, frozen battleground, falling snow, cinematic lighting.",
    },
    {
      src: bearPrompt,
      description:
        "A majestic bear standing in a dense forest, sun rays filtering through the trees, mystical and powerful vibe.",
    },
    {
      src: spritePrompt,
      description:
        "Dynamic digital artwork of a Sprite can split into floating segments with ice cubes, lime & lemon splashes on vibrant green background.",
    },
  ];

  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [nextImageIdx, setNextImageIdx] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const promptSuggestions = [
    "A mystical forest with glowing mushrooms and fireflies",
    "Cyberpunk cityscape at night with neon lights",
    "Majestic dragon soaring above medieval castle",
    "Underwater temple with sunbeams filtering through",
    "Steampunk airship flying through clouds",
  ];

  // Smooth image transition effect
  useEffect(() => {
    if (imageUrl || loading || error) return;

    const transitionImages = () => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIdx(nextImageIdx);
        setNextImageIdx((nextImageIdx + 1) % defaultImages.length);
        setTimeout(() => setIsTransitioning(false), 100);
      }, 500);
    };

    const interval = setInterval(transitionImages, 5000);
    return () => clearInterval(interval);
  }, [imageUrl, loading, error, nextImageIdx, defaultImages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setImageUrl(null);
    setImageLoaded(false);

    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    setLoading(true);
    try {
      const res = await authFetch("/api/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, aspectRatio }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || "Failed to generate image.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      // imageUrl is now a signed download URL from backend
      if (data?.imageUrl) {
        setImageUrl(data.imageUrl);
        setGenerationCount((prev) => prev + 1);
      } else {
        setError("No image returned from server.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => setPrompt(suggestion);

  const handleRegenerate = () => {
    if (prompt.trim()) {
      const fakeEvent = {
        preventDefault: () => {},
      } as React.FormEvent;
      handleSubmit(fakeEvent);
    }
  };

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleImageLoad = () => setImageLoaded(true);

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto overflow-x-hidden">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8 text-center px-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
            <span className="inline-flex items-center gap-2 sm:gap-3">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-storiq-purple animate-pulse flex-shrink-0" />
              AI Image Generator
            </span>
          </h1>
          <p className="text-white/60 text-sm sm:text-base md:text-lg">
            Transform your imagination into stunning visuals with AI
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-8 overflow-x-hidden">
          {/* Left Column */}
          <div className="w-full xl:w-[45%] 2xl:w-[40%] space-y-4 sm:space-y-5 md:space-y-6 order-2 xl:order-1 max-w-full">
            <div className="bg-storiq-card-bg/60 border border-storiq-border rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 backdrop-blur-lg">
              <form
                onSubmit={handleSubmit}
                className="space-y-4 sm:space-y-5 md:space-y-6"
              >
                <div className="space-y-2 sm:space-y-3">
                  <label
                    htmlFor="prompt"
                    className="text-white font-medium text-sm sm:text-base flex items-center gap-2"
                  >
                    <Wand2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-storiq-purple flex-shrink-0" />
                    Describe your vision
                  </label>
                  <Textarea
                    id="prompt"
                    placeholder="A beautiful landscape with mountains at sunset..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={loading}
                    autoFocus
                    className="bg-black/40 border border-gray-700 text-white placeholder:text-white/40 min-h-[100px] sm:min-h-[120px] text-sm sm:text-base rounded-xl focus:ring-2 focus:ring-storiq-purple/50 focus:border-storiq-purple transition resize-none px-3 py-2 sm:px-4 sm:py-3 scrollbar-hide"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  />
                </div>

                {/* Aspect Ratio Selector */}
                <div className="space-y-2 sm:space-y-3">
                  <label
                    htmlFor="aspectRatio"
                    className="text-white font-medium text-sm sm:text-base flex items-center gap-2"
                  >
                    <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-storiq-purple flex-shrink-0" />
                    Aspect Ratio
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {aspectRatioOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setAspectRatio(option.value)}
                        disabled={loading}
                        className={`p-2.5 sm:p-3 rounded-lg border-2 transition-all text-left ${
                          aspectRatio === option.value
                            ? "border-storiq-purple bg-storiq-purple/10 text-white"
                            : "border-gray-700 bg-gray-900/60 text-gray-300 hover:border-gray-600"
                        } disabled:opacity-50`}
                      >
                        <div className="font-semibold text-xs sm:text-sm">
                          {option.label}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                          {option.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                <div className="space-y-2 sm:space-y-3">
                  <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 flex-shrink-0" />
                    Try these ideas:
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {promptSuggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        disabled={loading}
                        className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-900/60 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 hover:border-storiq-purple/40 hover:scale-105 transition disabled:opacity-50"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-storiq-purple to-storiq-purple/80 hover:from-storiq-purple/90 hover:to-storiq-purple/70 text-white font-semibold h-11 sm:h-12 text-sm sm:text-base rounded-xl transition-transform transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span className="hidden xs:inline">Generating...</span>
                      <span className="xs:hidden">Creating...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Create Image
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full xl:w-[55%] 2xl:w-[60%] order-1 xl:order-2 max-w-full">
            <div className="bg-storiq-card-bg/60 border border-storiq-border rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 backdrop-blur-lg flex flex-col min-h-[400px] sm:min-h-[500px] md:min-h-[600px] max-w-full overflow-hidden">
              {/* Loading */}
              {loading && (
                <div className="flex flex-col items-center justify-center flex-1 space-y-3 sm:space-y-4 min-h-[350px] sm:min-h-[450px] md:min-h-[550px]">
                  <Loader message="Painting your vision..." size="small" />
                  <p className="text-gray-400 text-xs sm:text-sm animate-pulse">
                    This may take a few moments...
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex flex-col items-center justify-center flex-1 space-y-3 sm:space-y-4">
                  <div className="p-2.5 sm:p-3 bg-red-500/10 rounded-full animate-bounce">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-white text-xs sm:text-sm font-bold">
                        !
                      </span>
                    </div>
                  </div>
                  <div className="text-red-400 text-center font-medium text-sm sm:text-base px-2">
                    {error}
                  </div>
                  <Button
                    onClick={handleRegenerate}
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 transition h-9 sm:h-10 text-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              )}

              {/* Generated Image */}
              {imageUrl && !loading && (
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div className="relative group">
                    <div className="rounded-xl overflow-hidden border border-gray-700 bg-black/40">
                      <img
                        src={imageUrl}
                        alt={`Generated: ${prompt}`}
                        className={`w-full h-auto max-h-[300px] sm:max-h-[350px] md:max-h-96 object-contain transition-all duration-700 ${
                          imageLoaded
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-105"
                        }`}
                        onLoad={handleImageLoad}
                      />
                      {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-storiq-purple"></div>
                        </div>
                      )}
                    </div>

                    {/* Floating Actions */}
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex gap-1.5 sm:gap-2 opacity-0 group-hover:opacity-100 transition">
                      <Button
                        onClick={handleDownload}
                        size="sm"
                        className="bg-black/70 hover:bg-black text-white border border-gray-600 hover:scale-110 transition h-8 sm:h-9 px-2 sm:px-3"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        onClick={handleRegenerate}
                        size="sm"
                        className="bg-black/70 hover:bg-black text-white border border-gray-600 hover:scale-110 transition h-8 sm:h-9 px-2 sm:px-3"
                        title="Regenerate"
                      >
                        <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
                      <span className="bg-gray-800/60 px-2.5 sm:px-3 py-1 rounded-full">
                        Generation #{generationCount}
                      </span>
                      <a
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-storiq-purple hover:text-storiq-purple/80 underline"
                      >
                        View full resolution
                      </a>
                    </div>
                    <Button
                      onClick={handleRegenerate}
                      variant="outline"
                      className="border-storiq-purple/50 text-storiq-purple hover:bg-storiq-purple/10 transition h-8 sm:h-9 text-xs sm:text-sm w-full sm:w-auto"
                    >
                      <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                      Generate Another
                    </Button>
                  </div>

                  {/* Prompt */}
                  <div className="bg-gray-900/40 rounded-lg p-3 sm:p-4 border border-gray-800 hover:border-gray-700 transition">
                    <p className="text-xs text-gray-400 mb-1.5 sm:mb-2 flex items-center gap-1">
                      <Wand2 className="w-3 h-3 flex-shrink-0" />
                      Prompt used:
                    </p>
                    <p className="text-xs sm:text-sm text-gray-300 font-medium">
                      {prompt}
                    </p>
                  </div>
                </div>
              )}

              {/* Default Carousel */}
              {!imageUrl && !loading && !error && (
                <div className="flex flex-col items-center justify-center flex-1 text-center space-y-4 sm:space-y-6 overflow-auto">
                  <div className="relative w-full max-w-md">
                    <div
                      ref={imageContainerRef}
                      className="relative bg-gradient-to-br from-storiq-purple/10 to-blue-500/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 transition-all"
                    >
                      <div className="relative h-52 sm:h-64 md:h-80">
                        <img
                          src={defaultImages[currentImageIdx].src}
                          alt="Prompt example"
                          className={`absolute inset-0 w-full h-full object-contain rounded-xl transition-all duration-500 ${
                            isTransitioning
                              ? "opacity-0 scale-95"
                              : "opacity-100 scale-100"
                          }`}
                        />
                        <img
                          src={defaultImages[nextImageIdx].src}
                          alt="Next prompt example"
                          className={`absolute inset-0 w-full h-full object-contain rounded-xl transition-all duration-500 ${
                            isTransitioning
                              ? "opacity-100 scale-100"
                              : "opacity-0 scale-105"
                          }`}
                        />
                      </div>
                      <div className="mt-4 sm:mt-5 md:mt-6 px-2">
                        <h4 className="text-white/70 text-sm sm:text-base font-semibold mb-2 sm:mb-3 flex items-center justify-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-storiq-purple flex-shrink-0" />
                          Example Prompt
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                          {defaultImages[currentImageIdx].description}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center mt-3 sm:mt-4 space-x-1.5 sm:space-x-2">
                      {defaultImages.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (i !== currentImageIdx) {
                              setIsTransitioning(true);
                              setTimeout(() => {
                                setCurrentImageIdx(i);
                                setNextImageIdx((i + 1) % defaultImages.length);
                                setTimeout(
                                  () => setIsTransitioning(false),
                                  100
                                );
                              }, 500);
                            }
                          }}
                          className={`h-2 rounded-full transition ${
                            i === currentImageIdx
                              ? "bg-storiq-purple w-6"
                              : "bg-gray-600 hover:bg-gray-500 w-2"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm animate-pulse px-4">
                    ✨ Enter your prompt above to create amazing images
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {(imageUrl || loading) && (
          <div className="text-center mt-4 sm:mt-5 md:mt-6">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-2 px-2">
              <Sparkles className="w-3 h-3 flex-shrink-0" />
              Powered by AI • Images are generated on-demand
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ImageGenerator;
