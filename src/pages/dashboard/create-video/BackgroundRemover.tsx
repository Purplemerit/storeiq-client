// BackgroundRemover.tsx
import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Image as ImageIcon,
  Upload,
  Sparkles,
  Download,
  Trash2,
  RefreshCw,
  Scissors,
  Link as LinkIcon,
  X,
  Settings2,
  Maximize2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/lib/authFetch";

type Status = "idle" | "loading" | "success" | "error";

const BackgroundRemover: React.FC = () => {
  const { user } = useAuth();

  // Image upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Processing state
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(
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
  const [creditsCharged, setCreditsCharged] = useState<number | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Options
  const [selectedSize, setSelectedSize] = useState<string>("auto");
  const [selectedFormat, setSelectedFormat] = useState<string>("png");
  const [selectedType, setSelectedType] = useState<string>("auto");
  const [bgColor, setBgColor] = useState<string>("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const sizeOptions = [
    { value: "auto", label: "Auto", description: "Best quality" },
    { value: "preview", label: "Preview", description: "0.25 Megapixels" },
    { value: "small", label: "Small", description: "0.25 Megapixels" },
    { value: "regular", label: "Regular", description: "4 Megapixels" },
    { value: "medium", label: "Medium", description: "10 Megapixels" },
    { value: "hd", label: "HD", description: "25 Megapixels" },
  ];

  const formatOptions = [
    { value: "png", label: "PNG", description: "Transparency" },
    { value: "jpg", label: "JPG", description: "Smaller file" },
    { value: "zip", label: "ZIP", description: "Fastest" },
  ];

  const typeOptions = [
    { value: "auto", label: "Auto", description: "Detect automatically" },
    { value: "person", label: "Person", description: "Human subjects" },
    { value: "product", label: "Product", description: "Product photos" },
    { value: "car", label: "Car", description: "Vehicles" },
    { value: "animal", label: "Animal", description: "Pets & animals" },
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
      const res = await authFetch(`/api/ai/bg-removal-status/${currentJobId}`, {
        method: "GET",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to get job status.");
      }

      const data = await res.json();
      console.log("📊 Background removal job status:", data);

      // Update queue info
      if (data.position !== undefined) setQueuePosition(data.position);
      if (data.queueLength !== undefined) setQueueLength(data.queueLength);
      if (data.estimatedWaitTime !== undefined)
        setEstimatedWaitTime(data.estimatedWaitTime);

      // Check if completed
      if (data.status === "completed") {
        console.log("✅ Background removal completed!");

        // Stop polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }

        setProcessedImageUrl(data.imageUrl);
        setCreditsCharged(data.creditsCharged);
        setStatus("success");
        setJobId(null);
        setQueuePosition(null);
        setQueueLength(null);
        setEstimatedWaitTime(null);
      } else if (data.status === "failed") {
        console.error("❌ Background removal failed");

        // Stop polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }

        setError(data.error || "Background removal failed");
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
      if (file.size > 12 * 1024 * 1024) {
        // 12MB limit (remove.bg max)
        setError("Image size should be less than 12MB");
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageUrl("");
      setError(null);
      setProcessedImageUrl(null);
    }
  };

  // Handle URL input
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    if (e.target.value) {
      setSelectedFile(null);
      setImagePreview(null);
      setError(null);
      setProcessedImageUrl(null);
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setImageUrl("");
    setProcessedImageUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove background
  const handleRemoveBackground = async () => {
    if (!selectedFile && !imageUrl) {
      setError("Please upload an image or provide an image URL");
      return;
    }

    setStatus("loading");
    setError(null);
    setProcessedImageUrl(null);
    setQueuePosition(null);
    setQueueLength(null);
    setEstimatedWaitTime(null);
    setCreditsCharged(null);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const payload: {
        size: string;
        format: string;
        type: string;
        bgColor?: string;
        imageS3Key?: string;
        imageUrl?: string;
        originalFilename?: string;
      } = {
        size: selectedSize,
        format: selectedFormat,
        type: selectedType,
      };

      if (bgColor) {
        payload.bgColor = bgColor.replace("#", "");
      }

      // If using uploaded file, upload to S3 first
      if (selectedFile) {
        console.log("📤 Uploading image to S3...");
        const uploadRes = await authFetch("/api/s3/generate-upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: selectedFile.name,
            contentType: selectedFile.type,
          }),
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to get upload URL");
        }

        const uploadData = await uploadRes.json();

        // Upload to S3
        const s3Res = await fetch(uploadData.uploadUrl, {
          method: "PUT",
          body: selectedFile,
          headers: { "Content-Type": selectedFile.type },
        });

        if (!s3Res.ok) {
          throw new Error("Failed to upload image");
        }

        payload.imageS3Key = uploadData.key;
        payload.originalFilename = selectedFile.name;
      } else if (imageUrl) {
        payload.imageUrl = imageUrl;
      }

      console.log("✂️ Requesting background removal...");
      const res = await authFetch("/api/ai/remove-background", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to remove background");
      }

      const data = await res.json();
      console.log("✓ Job created:", data);

      // Store job ID and queue info
      setJobId(data.jobId);
      setQueuePosition(data.position);
      setQueueLength(data.queueLength);
      setEstimatedWaitTime(data.estimatedWaitTime);

      // Start polling
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      pollingIntervalRef.current = setInterval(() => {
        if (data.jobId) {
          pollJobStatus(data.jobId);
        }
      }, 2000);

      // Immediate poll
      pollJobStatus(data.jobId);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to remove background";
      setError(message);
      setStatus("error");

      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }
  };

  // Download processed image
  const handleDownloadImage = () => {
    if (processedImageUrl) {
      const link = document.createElement("a");
      link.href = processedImageUrl;
      link.download = `no-bg-${Date.now()}.${selectedFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8 text-center px-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2 sm:gap-3">
            <Scissors className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-storiq-purple flex-shrink-0" />
            <span>Background Remover</span>
          </h1>
          <p className="text-white/60 text-sm sm:text-base md:text-lg">
            Remove backgrounds from images instantly with AI
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:items-start">
          {/* Left Column - Upload & Controls */}
          <div className="w-full xl:w-[45%] 2xl:w-[40%] space-y-4 sm:space-y-5 md:space-y-6 xl:overflow-y-auto xl:max-h-[calc(100vh-10rem)] xl:pr-2 scrollbar-hide">
            {/* Image Upload */}
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-3 sm:p-4 md:p-5 lg:p-6">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-storiq-purple" />
                Upload Image
              </h3>

              {/* Upload Area */}
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
                        PNG, JPG, JPEG (max 12MB)
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
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="URL Preview"
                      className="max-h-64 mx-auto rounded-lg mt-2"
                      onError={() => setError("Failed to load image from URL")}
                    />
                  )}
                </div>
              </div>
            </Card>

            {/* Output Options */}
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-3 sm:p-4 md:p-5 lg:p-6">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                <Settings2 className="w-4 h-4 sm:w-5 sm:h-5 text-storiq-purple" />
                Output Settings
              </h3>

              {/* Size Selection */}
              <div className="space-y-2 mb-4">
                <label className="text-white/80 text-sm">Image Size</label>
                <div className="grid grid-cols-2 gap-2">
                  {sizeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedSize(option.value)}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        selectedSize === option.value
                          ? "border-storiq-purple bg-storiq-purple/10 text-white"
                          : "border-storiq-border bg-storiq-card-bg/30 text-white/60 hover:text-white"
                      }`}
                    >
                      <div className="text-sm font-semibold">
                        {option.label}
                      </div>
                      <div className="text-xs text-white/40 mt-1">
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Format Selection */}
              <div className="space-y-2 mb-4">
                <label className="text-white/80 text-sm">Output Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {formatOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedFormat(option.value)}
                      className={`p-3 rounded-lg border transition-all text-center ${
                        selectedFormat === option.value
                          ? "border-storiq-purple bg-storiq-purple/10 text-white"
                          : "border-storiq-border bg-storiq-card-bg/30 text-white/60 hover:text-white"
                      }`}
                    >
                      <div className="text-sm font-semibold">
                        {option.label}
                      </div>
                      <div className="text-xs text-white/40 mt-1">
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Selection */}
              <div className="space-y-2">
                <label className="text-white/80 text-sm">Subject Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {typeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedType(option.value)}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        selectedType === option.value
                          ? "border-storiq-purple bg-storiq-purple/10 text-white"
                          : "border-storiq-border bg-storiq-card-bg/30 text-white/60 hover:text-white"
                      }`}
                    >
                      <div className="text-sm font-semibold">
                        {option.label}
                      </div>
                      <div className="text-xs text-white/40 mt-1">
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Advanced Options */}
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-3 sm:p-4 md:p-5 lg:p-6">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between text-white font-semibold text-base sm:text-lg mb-3"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-storiq-purple" />
                  Advanced Options
                </span>
                <span
                  className={`transition-transform ${
                    showAdvanced ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {showAdvanced && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-white/80 text-sm">
                      Background Color (hex)
                    </label>
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      placeholder="#FFFFFF"
                      className="w-full bg-storiq-card-bg border border-storiq-border text-white placeholder:text-white/40 px-3 py-2 rounded-lg focus:outline-none focus:border-storiq-purple text-sm"
                    />
                    <p className="text-xs text-white/40">
                      Leave empty for transparent background
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {/* Process Button */}
            <Button
              onClick={handleRemoveBackground}
              disabled={status === "loading" || (!selectedFile && !imageUrl)}
              className="w-full bg-gradient-to-r from-storiq-purple to-storiq-purple/80 hover:from-storiq-purple/90 hover:to-storiq-purple/70 text-white font-semibold py-6 text-base rounded-xl transition-all disabled:opacity-50"
            >
              {status === "loading" ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Scissors className="w-5 h-5" />
                  Remove Background
                </div>
              )}
            </Button>
          </div>

          {/* Right Column - Results */}
          <div className="w-full xl:w-[55%] 2xl:w-[60%] xl:sticky xl:top-4">
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-3 sm:p-4 md:p-5 lg:p-6 h-[600px] xl:h-[calc(100vh-10rem)] flex flex-col">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-storiq-purple" />
                Result
              </h3>

              {/* Loading State */}
              {status === "loading" && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-storiq-purple"></div>
                  <p className="text-white/60 text-sm">
                    Removing background with AI...
                  </p>
                  {queuePosition !== null && queueLength !== null && (
                    <div className="text-center space-y-2">
                      <div className="text-white/60 text-sm">
                        Position in queue: {queuePosition} / {queueLength}
                      </div>
                      {estimatedWaitTime !== null && (
                        <div className="text-white/40 text-xs">
                          Estimated wait: ~{estimatedWaitTime} seconds
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Error State */}
              {error && status === "error" && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                    <X className="w-8 h-8 text-red-500" />
                  </div>
                  <p className="text-red-400 text-sm text-center">{error}</p>
                  <Button
                    onClick={handleRemoveBackground}
                    className="bg-storiq-purple hover:bg-storiq-purple/80"
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {/* Success State */}
              {processedImageUrl && status === "success" && (
                <div className="flex-1 flex flex-col space-y-4">
                  <div className="flex-1 bg-storiq-card-bg border-storiq-border rounded-lg overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={processedImageUrl}
                      alt="Processed"
                      className="max-w-full max-h-full object-contain"
                      style={{
                        imageRendering: "crisp-edges",
                      }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={handleDownloadImage}
                      className="flex-1 bg-storiq-purple hover:bg-storiq-purple/80 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={() => {
                        setProcessedImageUrl(null);
                        setStatus("idle");
                      }}
                      className="flex-1 bg-storiq-card-bg border border-storiq-border hover:bg-storiq-border text-white"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      New Image
                    </Button>
                  </div>

                  {/* Info */}
                  {creditsCharged !== null && (
                    <div className="text-center text-xs text-white/40">
                      Credits used: {creditsCharged}
                    </div>
                  )}
                </div>
              )}

              {/* Idle State */}
              {status === "idle" && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-storiq-purple/10 flex items-center justify-center">
                    <Scissors className="w-10 h-10 text-storiq-purple" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-white/60 text-sm sm:text-base">
                      Upload an image to remove its background
                    </p>
                    <p className="text-white/40 text-xs">
                      Our AI will automatically detect and remove the background
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
            Powered by remove.bg API • Professional Background Removal
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BackgroundRemover;
