// MemeGenerator.tsx
import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Image as ImageIcon,
  Upload,
  Sparkles,
  Copy,
  Download,
  X,
  RefreshCw,
  Smile,
  Link as LinkIcon,
  Share2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/lib/authFetch";

type Status = "idle" | "loading" | "success" | "error";

interface MemeCaption {
  topText: string;
  bottomText: string;
  caption: string;
  context: string;
}

const MemeGenerator: React.FC = () => {
  const { user } = useAuth();

  // Image upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const memeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generation state
  const [generatedCaptions, setGeneratedCaptions] = useState<MemeCaption[]>([]);
  const [selectedCaption, setSelectedCaption] = useState<MemeCaption | null>(
    null
  );
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  // Queue state
  const [jobId, setJobId] = useState<string | null>(null);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [queueLength, setQueueLength] = useState<number | null>(null);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number | null>(
    null
  );
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Options
  const [memeStyle, setMemeStyle] = useState<
    "classic" | "sarcastic" | "wholesome" | "absurd" | "relatable"
  >("classic");
  const [captionCount, setCaptionCount] = useState<number>(3);
  const [selectedModel, setSelectedModel] = useState<
    "gemini-2.5-flash" | "gemini-2.5-flash-lite"
  >("gemini-2.5-flash");

  const memeStyleOptions = [
    {
      value: "classic",
      label: "Classic",
      emoji: "😄",
      description: "Timeless meme format",
    },
    {
      value: "sarcastic",
      label: "Sarcastic",
      emoji: "😏",
      description: "Witty and ironic",
    },
    {
      value: "wholesome",
      label: "Wholesome",
      emoji: "🥰",
      description: "Positive and uplifting",
    },
    {
      value: "absurd",
      label: "Absurd",
      emoji: "🤪",
      description: "Weird and random",
    },
    {
      value: "relatable",
      label: "Relatable",
      emoji: "😅",
      description: "Everyday situations",
    },
  ];

  const modelOptions = [
    {
      value: "gemini-2.5-flash",
      label: "Gemini 2.5 Flash",
      description: "Best quality",
    },
    {
      value: "gemini-2.5-flash-lite",
      label: "Gemini 2.5 Flash Lite",
      description: "Fastest",
    },
  ];

  // Cleanup polling on unmount
  React.useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Update canvas when caption or image changes
  React.useEffect(() => {
    const drawMemeOnCanvas = () => {
      if (!memeCanvasRef.current || !imagePreview || !selectedCaption) return;

      const canvas = memeCanvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imagePreview;

      img.onload = () => {
        // Set canvas size to image size
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image
        ctx.drawImage(img, 0, 0);

        // Configure text style
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.textAlign = "center";
        ctx.font = `bold ${Math.max(
          img.height / 15,
          30
        )}px Impact, Arial Black, sans-serif`;
        ctx.textBaseline = "top";

        // Draw top text
        if (selectedCaption.topText) {
          const topY = img.height * 0.05;
          ctx.strokeText(
            selectedCaption.topText.toUpperCase(),
            img.width / 2,
            topY
          );
          ctx.fillText(
            selectedCaption.topText.toUpperCase(),
            img.width / 2,
            topY
          );
        }

        // Draw bottom text
        if (selectedCaption.bottomText) {
          const bottomY = img.height * 0.9;
          ctx.strokeText(
            selectedCaption.bottomText.toUpperCase(),
            img.width / 2,
            bottomY
          );
          ctx.fillText(
            selectedCaption.bottomText.toUpperCase(),
            img.width / 2,
            bottomY
          );
        }

        // Draw caption (if no top/bottom text)
        if (
          !selectedCaption.topText &&
          !selectedCaption.bottomText &&
          selectedCaption.caption
        ) {
          const captionY = img.height * 0.9;
          ctx.font = `bold ${Math.max(
            img.height / 20,
            24
          )}px Arial, sans-serif`;
          ctx.strokeText(selectedCaption.caption, img.width / 2, captionY);
          ctx.fillText(selectedCaption.caption, img.width / 2, captionY);
        }
      };
    };

    if (selectedCaption && imagePreview) {
      drawMemeOnCanvas();
    }
  }, [selectedCaption, imagePreview]);

  // Poll for job status
  const pollJobStatus = async (currentJobId: string) => {
    try {
      const res = await authFetch(`/api/ai/meme-status/${currentJobId}`, {
        method: "GET",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to get job status.");
      }

      const data = await res.json();
      console.log("📊 Meme generation job status:", data);

      // Update queue info
      if (data.position !== undefined) setQueuePosition(data.position);
      if (data.queueLength !== undefined) setQueueLength(data.queueLength);
      if (data.estimatedWaitTime !== undefined)
        setEstimatedWaitTime(data.estimatedWaitTime);

      // Check if completed
      if (data.status === "completed") {
        console.log("✅ Meme generation completed!");

        // Stop polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }

        setGeneratedCaptions(data.captions || []);
        if (data.captions && data.captions.length > 0) {
          setSelectedCaption(data.captions[0]);
        }
        setStatus("success");
        setJobId(null);
        setQueuePosition(null);
        setQueueLength(null);
        setEstimatedWaitTime(null);
      } else if (data.status === "failed") {
        console.error("❌ Meme generation failed");

        // Stop polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }

        setError(data.error || "Meme generation failed");
        setStatus("error");
        setJobId(null);
        setQueuePosition(null);
        setQueueLength(null);
        setEstimatedWaitTime(null);
      }
    } catch (err: unknown) {
      console.error("❌ Error polling job status:", err);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file (PNG, JPEG, JPG)");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size should be less than 10MB");
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageUrl("");
      setError(null);
      setGeneratedCaptions([]);
      setSelectedCaption(null);
    }
  };

  // Handle URL input
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    if (e.target.value) {
      setSelectedFile(null);
      setImagePreview(e.target.value);
      setError(null);
      setGeneratedCaptions([]);
      setSelectedCaption(null);
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setImageUrl("");
    setGeneratedCaptions([]);
    setSelectedCaption(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Generate meme captions
  const handleGenerateMeme = async () => {
    if (!selectedFile && !imageUrl) {
      setError("Please upload an image or provide an image URL");
      return;
    }

    setStatus("loading");
    setError(null);
    setGeneratedCaptions([]);
    setSelectedCaption(null);
    setQueuePosition(null);
    setQueueLength(null);
    setEstimatedWaitTime(null);

    try {
      console.log("🎭 Requesting meme generation...");

      // If using uploaded file, send directly in FormData (no S3 upload)
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("memeStyle", memeStyle);
        formData.append("captionCount", captionCount.toString());
        formData.append("modelName", selectedModel);

        const res = await authFetch("/api/ai/generate-meme", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Meme generation failed");
        }

        const data = await res.json();
        console.log("✅ Job created:", data);

        setJobId(data.jobId);
        setQueuePosition(data.position);
        setQueueLength(data.queueLength);
        setEstimatedWaitTime(data.estimatedWaitTime);

        // Start polling for job status
        pollingIntervalRef.current = setInterval(() => {
          pollJobStatus(data.jobId);
        }, 2000);
      } else if (imageUrl) {
        // If using URL, send as JSON
        const payload = {
          memeStyle,
          captionCount,
          modelName: selectedModel,
          imageUrl,
        };

        const res = await authFetch("/api/ai/generate-meme", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Meme generation failed");
        }

        const data = await res.json();
        console.log("✅ Job created:", data);

        setJobId(data.jobId);
        setQueuePosition(data.position);
        setQueueLength(data.queueLength);
        setEstimatedWaitTime(data.estimatedWaitTime);

        // Start polling for job status
        pollingIntervalRef.current = setInterval(() => {
          pollJobStatus(data.jobId);
        }, 2000);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to generate meme";
      setError(message);
      setStatus("error");

      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }
  };

  // Download meme
  const handleDownloadMeme = () => {
    if (!memeCanvasRef.current) return;

    const canvas = memeCanvasRef.current;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `meme-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Copy caption to clipboard
  const handleCopyCaption = () => {
    if (selectedCaption) {
      const text =
        selectedCaption.caption ||
        `${selectedCaption.topText}\n${selectedCaption.bottomText}`.trim();
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8 text-center px-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2 sm:gap-3">
            <Smile className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-storiq-purple flex-shrink-0" />
            <span>AI Meme Generator</span>
          </h1>
          <p className="text-white/60 text-sm sm:text-base md:text-lg">
            Upload an image and let AI generate hilarious meme captions
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:items-start">
          {/* Left Column - Upload & Controls */}
          <div className="w-full xl:w-[45%] 2xl:w-[40%] space-y-4 sm:space-y-5 md:space-y-6 xl:overflow-y-auto xl:max-h-[calc(100vh-12rem)] xl:pr-2 scrollbar-hide">
            {/* Image Upload */}
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-3 sm:p-4 md:p-5 lg:p-6">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-storiq-purple" />
                Upload Image
              </h3>

              <div className="space-y-3 sm:space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-storiq-border hover:border-storiq-purple rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-colors bg-storiq-card-bg/30"
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-12 h-12 mx-auto text-white/40" />
                      <p className="text-white/60 text-sm">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-white/40 text-xs">
                        PNG, JPG, JPEG (max 10MB)
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* OR Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-storiq-border"></div>
                  <span className="text-white/40 text-xs">OR</span>
                  <div className="flex-1 h-px bg-storiq-border"></div>
                </div>

                {/* URL Input */}
                <div className="space-y-2">
                  <label className="text-white/80 text-sm flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-storiq-purple" />
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={handleUrlChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-storiq-card-bg border border-storiq-border text-white placeholder:text-white/40 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg focus:outline-none focus:border-storiq-purple text-sm sm:text-base"
                  />
                </div>
              </div>
            </Card>

            {/* Meme Style */}
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-3 sm:p-4 md:p-5 lg:p-6">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-storiq-purple" />
                Meme Style
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {memeStyleOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setMemeStyle(
                        option.value as
                          | "classic"
                          | "sarcastic"
                          | "wholesome"
                          | "absurd"
                          | "relatable"
                      )
                    }
                    className={`p-3 rounded-lg border transition-all ${
                      memeStyle === option.value
                        ? "border-storiq-purple bg-storiq-purple/10 text-white"
                        : "border-storiq-border bg-storiq-card-bg/30 text-white/60 hover:text-white"
                    }`}
                  >
                    <div className="text-2xl mb-1">{option.emoji}</div>
                    <div className="text-xs font-semibold">{option.label}</div>
                    <div className="text-[10px] text-white/40 mt-1">
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Caption Count */}
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-3 sm:p-4 md:p-5 lg:p-6">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4">
                Number of Captions
              </h3>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((count) => (
                  <button
                    key={count}
                    onClick={() => setCaptionCount(count)}
                    className={`flex-1 py-2 rounded-lg border transition-all ${
                      captionCount === count
                        ? "border-storiq-purple bg-storiq-purple/10 text-white"
                        : "border-storiq-border bg-storiq-card-bg/30 text-white/60 hover:text-white"
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </Card>

            {/* AI Model */}
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-3 sm:p-4 md:p-5 lg:p-6">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-storiq-purple" />
                AI Model
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {modelOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setSelectedModel(
                        option.value as
                          | "gemini-2.5-flash"
                          | "gemini-2.5-flash-lite"
                      )
                    }
                    className={`p-3 rounded-lg border transition-all text-left ${
                      selectedModel === option.value
                        ? "border-storiq-purple bg-storiq-purple/10 text-white"
                        : "border-storiq-border bg-storiq-card-bg/30 text-white/60 hover:text-white"
                    }`}
                  >
                    <div className="text-sm font-semibold">{option.label}</div>
                    <div className="text-xs text-white/40 mt-1">
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Generate Button */}
            <Button
              onClick={handleGenerateMeme}
              disabled={status === "loading" || (!selectedFile && !imageUrl)}
              className="w-full bg-gradient-to-r from-storiq-purple to-storiq-purple/80 hover:from-storiq-purple/90 hover:to-storiq-purple/70 text-white font-semibold py-6 text-base rounded-xl transition-all disabled:opacity-50"
            >
              {status === "loading" ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating Memes...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Generate Meme Captions
                </div>
              )}
            </Button>
          </div>

          {/* Right Column - Results */}
          <div className="w-full xl:w-[55%] 2xl:w-[60%] xl:sticky xl:top-4 xl:self-start">
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-3 sm:p-4 md:p-5 lg:p-6 min-h-[600px] xl:max-h-[calc(100vh-8rem)] flex flex-col overflow-hidden">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2 flex-shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-storiq-purple" />
                Your Meme
              </h3>

              {/* Loading State */}
              {status === "loading" && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-storiq-purple"></div>
                  <p className="text-white/60 text-sm">
                    Analyzing image and generating funny captions...
                  </p>
                  {queuePosition !== null && queueLength !== null && (
                    <div className="text-center space-y-2">
                      <div className="text-white/60 text-sm">
                        Position in queue: {queuePosition} / {queueLength}
                      </div>
                      {estimatedWaitTime !== null && (
                        <div className="text-white/40 text-xs">
                          Estimated wait: ~{Math.ceil(estimatedWaitTime / 60)}{" "}
                          min
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Error State */}
              {error && status === "error" && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                    <X className="w-8 h-8 text-red-500" />
                  </div>
                  <p className="text-red-400 text-sm text-center">{error}</p>
                  <Button
                    onClick={handleGenerateMeme}
                    className="bg-storiq-purple hover:bg-storiq-purple/80"
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {/* Success State */}
              {generatedCaptions.length > 0 && status === "success" && (
                <div className="space-y-4 overflow-y-auto flex-1 scrollbar-hide">
                  {/* Meme Preview */}
                  <div className="bg-storiq-card-bg/30 rounded-lg p-4 flex-shrink-0">
                    <canvas
                      ref={memeCanvasRef}
                      className="w-full rounded-lg"
                      style={{ maxHeight: "400px", objectFit: "contain" }}
                    />
                  </div>

                  {/* Caption Options */}
                  <div className="space-y-2 flex-shrink-0">
                    <h4 className="text-white/80 text-sm font-semibold">
                      Choose a Caption:
                    </h4>
                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto scrollbar-hide">
                      {generatedCaptions.map((caption, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedCaption(caption)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            selectedCaption === caption
                              ? "border-storiq-purple bg-storiq-purple/10"
                              : "border-storiq-border bg-storiq-card-bg/30 hover:border-storiq-purple/50"
                          }`}
                        >
                          <div className="text-white text-sm font-semibold">
                            {caption.caption ||
                              `${caption.topText} / ${caption.bottomText}`}
                          </div>
                          <div className="text-white/40 text-xs mt-1">
                            {caption.context}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 flex-shrink-0">
                    <Button
                      onClick={handleDownloadMeme}
                      className="flex-1 bg-storiq-purple hover:bg-storiq-purple/80 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={handleCopyCaption}
                      className="flex-1 bg-storiq-card-bg border border-storiq-border hover:bg-storiq-border text-white"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Text
                    </Button>
                    <Button
                      onClick={() => {
                        setGeneratedCaptions([]);
                        setSelectedCaption(null);
                        setStatus("idle");
                      }}
                      className="flex-1 bg-storiq-card-bg border border-storiq-border hover:bg-storiq-border text-white"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      New Meme
                    </Button>
                  </div>
                </div>
              )}

              {/* Idle State */}
              {status === "idle" && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-storiq-purple/10 flex items-center justify-center">
                    <Smile className="w-10 h-10 text-storiq-purple" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-white/60 text-sm sm:text-base">
                      Upload an image to generate memes
                    </p>
                    <p className="text-white/40 text-xs">
                      AI will analyze the image and create hilarious captions
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <Sparkles className="w-3 h-3" />
            Powered by Google Gemini Vision • Free AI Meme Generation
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MemeGenerator;
