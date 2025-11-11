// ThumbnailGenerator.tsx
import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Image as ImageIcon,
  Upload,
  Sparkles,
  Download,
  X,
  RefreshCw,
  FileVideo,
  Type,
  Palette,
  Layout,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/lib/authFetch";

type Status = "idle" | "loading" | "success" | "error";

interface ThumbnailDesign {
  id: number;
  title: string;
  description: string;
  textElements: Array<{
    text: string;
    position: string;
    size: string;
    color: string;
  }>;
  colorPalette: string[];
  imageData?: string;
  layout: string;
  error?: string;
}

const ThumbnailGenerator: React.FC = () => {
  const { user } = useAuth();

  // Image/Video upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Generation state
  const [generatedThumbnails, setGeneratedThumbnails] = useState<
    ThumbnailDesign[]
  >([]);
  const [selectedThumbnail, setSelectedThumbnail] =
    useState<ThumbnailDesign | null>(null);
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
  const [thumbnailStyle, setThumbnailStyle] = useState<
    "engaging" | "bold" | "minimal" | "dramatic" | "playful"
  >("engaging");
  const [textOverlay, setTextOverlay] = useState<string>("");
  const [includeEmoji, setIncludeEmoji] = useState(true);
  const [colorScheme, setColorScheme] = useState<
    "vibrant" | "dark" | "bright" | "pastel"
  >("vibrant");
  const [thumbnailCount, setThumbnailCount] = useState<number>(3);
  const [selectedModel, setSelectedModel] = useState<
    "gemini-2.5-flash" | "gemini-2.5-flash-lite"
  >("gemini-2.5-flash");

  const styleOptions = [
    {
      value: "engaging",
      label: "Engaging",
      emoji: "👀",
      description: "Eye-catching & authentic",
    },
    {
      value: "bold",
      label: "Bold",
      emoji: "💥",
      description: "High contrast & dramatic",
    },
    {
      value: "minimal",
      label: "Minimal",
      emoji: "✨",
      description: "Clean & focused",
    },
    {
      value: "dramatic",
      label: "Dramatic",
      emoji: "🎭",
      description: "Emotional & intense",
    },
    {
      value: "playful",
      label: "Playful",
      emoji: "🎉",
      description: "Fun & energetic",
    },
  ];

  const colorSchemeOptions = [
    {
      value: "vibrant",
      label: "Vibrant",
      colors: ["#FF0000", "#FFD700", "#00FF00"],
    },
    { value: "dark", label: "Dark", colors: ["#000000", "#1a1a1a", "#FF0000"] },
    {
      value: "bright",
      label: "Bright",
      colors: ["#FFFFFF", "#FFD700", "#FF69B4"],
    },
    {
      value: "pastel",
      label: "Pastel",
      colors: ["#FFB6C1", "#E6E6FA", "#98FB98"],
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

  // Poll for job status
  const pollJobStatus = async (currentJobId: string) => {
    try {
      const res = await authFetch(`/api/ai/thumbnail-status/${currentJobId}`, {
        method: "GET",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to get job status.");
      }

      const data = await res.json();
      console.log("📊 Thumbnail generation job status:", data);

      if (data.position !== undefined) setQueuePosition(data.position);
      if (data.queueLength !== undefined) setQueueLength(data.queueLength);
      if (data.estimatedWaitTime !== undefined)
        setEstimatedWaitTime(data.estimatedWaitTime);

      if (data.status === "completed") {
        console.log("✅ Thumbnail generation completed!");

        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }

        setGeneratedThumbnails(data.thumbnails || []);
        if (data.thumbnails && data.thumbnails.length > 0) {
          setSelectedThumbnail(data.thumbnails[0]);
        }
        setStatus("success");
        setJobId(null);
        setQueuePosition(null);
        setQueueLength(null);
        setEstimatedWaitTime(null);
      } else if (data.status === "failed") {
        console.error("❌ Thumbnail generation failed");

        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }

        setError(data.error || "Thumbnail generation failed");
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
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        setError("Please select a valid image or video file");
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        setError("File size should be less than 50MB");
        return;
      }

      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setMediaType(isImage ? "image" : "video");
      setError(null);
      setGeneratedThumbnails([]);
      setSelectedThumbnail(null);
    }
  };

  // Handle media removal
  const handleRemoveMedia = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setGeneratedThumbnails([]);
    setSelectedThumbnail(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Generate thumbnails
  const handleGenerateThumbnails = async () => {
    if (!selectedFile) {
      setError("Please upload an image or video file");
      return;
    }

    setStatus("loading");
    setError(null);
    setGeneratedThumbnails([]);
    setSelectedThumbnail(null);
    setQueuePosition(null);
    setQueueLength(null);
    setEstimatedWaitTime(null);

    try {
      console.log("🎨 Requesting thumbnail generation...");

      // Send file directly in FormData (no S3 upload)
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("thumbnailStyle", thumbnailStyle);
      formData.append("textOverlay", textOverlay);
      formData.append("includeEmoji", includeEmoji.toString());
      formData.append("colorScheme", colorScheme);
      formData.append("thumbnailCount", thumbnailCount.toString());
      formData.append("modelName", selectedModel);
      formData.append("mediaType", mediaType);

      const res = await authFetch("/api/ai/generate-thumbnail", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Thumbnail generation failed");
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
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to generate thumbnails";
      setError(message);
      setStatus("error");

      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }
  };

  // Download thumbnail
  const handleDownloadThumbnail = () => {
    if (!selectedThumbnail?.imageData) return;

    const link = document.createElement("a");
    link.href = selectedThumbnail.imageData;
    link.download = `thumbnail-${selectedThumbnail.id}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8 text-center px-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2 sm:gap-3">
            <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-storiq-purple flex-shrink-0" />
            <span>AI Thumbnail Generator</span>
          </h1>
          <p className="text-white/60 text-sm sm:text-base md:text-lg">
            Create eye-catching YouTube thumbnails with AI
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:items-start">
          {/* Left Column - Upload & Controls */}
          <div className="w-full xl:w-[45%] 2xl:w-[40%] space-y-4 sm:space-y-5 md:space-y-6 xl:overflow-y-auto xl:max-h-[calc(100vh-12rem)] xl:pr-2 scrollbar-hide">
            {/* Media Upload */}
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-3 sm:p-4 md:p-5 lg:p-6">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-storiq-purple" />
                Upload Media
              </h3>

              <div className="space-y-3 sm:space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-storiq-border hover:border-storiq-purple rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-colors bg-storiq-card-bg/30"
                >
                  {imagePreview ? (
                    <div className="relative">
                      {mediaType === "image" ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-lg"
                        />
                      ) : (
                        <video
                          src={imagePreview}
                          className="max-h-64 mx-auto rounded-lg"
                          controls
                        />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveMedia();
                        }}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <FileVideo className="w-12 h-12 mx-auto text-white/40" />
                      <p className="text-white/60 text-sm">
                        Click to upload image or video
                      </p>
                      <p className="text-white/40 text-xs">
                        PNG, JPG, MP4, MOV (max 50MB)
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </Card>

            {/* Text Overlay */}
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-3 sm:p-4 md:p-5 lg:p-6">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                <Type className="w-4 h-4 sm:w-5 sm:h-5 text-storiq-purple" />
                Text Overlay
              </h3>
              <Input
                type="text"
                value={textOverlay}
                onChange={(e) => setTextOverlay(e.target.value)}
                placeholder="e.g., YOU WON'T BELIEVE THIS!"
                className="w-full bg-storiq-card-bg border border-storiq-border text-white placeholder:text-white/40"
              />
              <label className="flex items-center gap-2 mt-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeEmoji}
                  onChange={(e) => setIncludeEmoji(e.target.checked)}
                  className="w-4 h-4 rounded border-storiq-border bg-storiq-card-bg text-storiq-purple"
                />
                <span className="text-white/80 text-sm">Include emojis</span>
              </label>
            </Card>

            {/* Style */}
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-3 sm:p-4 md:p-5 lg:p-6">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                <Layout className="w-4 h-4 sm:w-5 sm:h-5 text-storiq-purple" />
                Thumbnail Style
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {styleOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setThumbnailStyle(
                        option.value as
                          | "engaging"
                          | "bold"
                          | "minimal"
                          | "dramatic"
                          | "playful"
                      )
                    }
                    className={`p-3 rounded-lg border transition-all ${
                      thumbnailStyle === option.value
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

            {/* Color Scheme */}
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-3 sm:p-4 md:p-5 lg:p-6">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-storiq-purple" />
                Color Scheme
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {colorSchemeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setColorScheme(
                        option.value as "vibrant" | "dark" | "bright" | "pastel"
                      )
                    }
                    className={`p-3 rounded-lg border transition-all ${
                      colorScheme === option.value
                        ? "border-storiq-purple bg-storiq-purple/10"
                        : "border-storiq-border bg-storiq-card-bg/30"
                    }`}
                  >
                    <div className="flex gap-1 mb-2">
                      {option.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                    <div className="text-white text-sm font-semibold">
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Count & Model */}
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-3 sm:p-4 md:p-5 lg:p-6">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4">
                Thumbnail Count
              </h3>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((count) => (
                  <button
                    key={count}
                    onClick={() => setThumbnailCount(count)}
                    className={`flex-1 py-2 rounded-lg border transition-all ${
                      thumbnailCount === count
                        ? "border-storiq-purple bg-storiq-purple/10 text-white"
                        : "border-storiq-border bg-storiq-card-bg/30 text-white/60 hover:text-white"
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>

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
              onClick={handleGenerateThumbnails}
              disabled={status === "loading" || !selectedFile}
              className="w-full bg-gradient-to-r from-storiq-purple to-storiq-purple/80 hover:from-storiq-purple/90 hover:to-storiq-purple/70 text-white font-semibold py-6 text-base rounded-xl transition-all disabled:opacity-50"
            >
              {status === "loading" ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating Thumbnails...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Generate Thumbnails
                </div>
              )}
            </Button>
          </div>

          {/* Right Column - Results */}
          <div className="w-full xl:w-[55%] 2xl:w-[60%] xl:sticky xl:top-4 xl:self-start">
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-3 sm:p-4 md:p-5 lg:p-6 min-h-[600px] xl:max-h-[calc(100vh-8rem)] flex flex-col">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-storiq-purple" />
                Generated Thumbnails
              </h3>

              {/* Loading State */}
              {status === "loading" && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-storiq-purple"></div>
                  <p className="text-white/60 text-sm">
                    Analyzing content and generating thumbnails...
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
                    onClick={handleGenerateThumbnails}
                    className="bg-storiq-purple hover:bg-storiq-purple/80"
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {/* Success State */}
              {generatedThumbnails.length > 0 && status === "success" && (
                <div className="flex-1 flex flex-col space-y-4 overflow-y-auto scrollbar-hide">
                  {/* Selected Thumbnail Preview */}
                  {selectedThumbnail && selectedThumbnail.imageData && (
                    <div className="bg-storiq-card-bg/30 rounded-lg p-4">
                      <img
                        src={selectedThumbnail.imageData}
                        alt={selectedThumbnail.title}
                        className="w-full rounded-lg"
                      />
                      <div className="mt-3">
                        <h4 className="text-white font-semibold">
                          {selectedThumbnail.title}
                        </h4>
                        <p className="text-white/60 text-sm mt-1">
                          {selectedThumbnail.description}
                        </p>
                        <div className="flex gap-2 mt-2">
                          {selectedThumbnail.colorPalette.map((color, idx) => (
                            <div
                              key={idx}
                              className="w-6 h-6 rounded"
                              style={{ backgroundColor: color }}
                              title={color}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Thumbnail Options */}
                  <div className="space-y-2">
                    <h4 className="text-white/80 text-sm font-semibold">
                      Choose a Design:
                    </h4>
                    <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto scrollbar-hide">
                      {generatedThumbnails.map((thumbnail) => (
                        <button
                          key={thumbnail.id}
                          onClick={() => setSelectedThumbnail(thumbnail)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            selectedThumbnail?.id === thumbnail.id
                              ? "border-storiq-purple bg-storiq-purple/10"
                              : "border-storiq-border bg-storiq-card-bg/30 hover:border-storiq-purple/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">🖼️</div>
                            <div className="flex-1">
                              <div className="text-white text-sm font-semibold">
                                {thumbnail.title}
                              </div>
                              <div className="text-white/40 text-xs mt-1">
                                {thumbnail.description}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={handleDownloadThumbnail}
                      disabled={!selectedThumbnail?.imageData}
                      className="flex-1 bg-storiq-purple hover:bg-storiq-purple/80 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download (1280x720)
                    </Button>
                    <Button
                      onClick={() => {
                        setGeneratedThumbnails([]);
                        setSelectedThumbnail(null);
                        setStatus("idle");
                      }}
                      className="flex-1 bg-storiq-card-bg border border-storiq-border hover:bg-storiq-border text-white"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      New Thumbnails
                    </Button>
                  </div>
                </div>
              )}

              {/* Idle State */}
              {status === "idle" && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-storiq-purple/10 flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-storiq-purple" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-white/60 text-sm sm:text-base">
                      Upload media to generate thumbnails
                    </p>
                    <p className="text-white/40 text-xs">
                      AI will create YouTube-optimized thumbnail designs
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
            Powered by Google Gemini Vision • YouTube-Optimized 1280x720
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ThumbnailGenerator;
