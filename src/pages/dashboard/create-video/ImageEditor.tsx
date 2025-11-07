// ImageEditor.tsx
import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import { authFetch } from "@/lib/authFetch";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Download,
  RefreshCw,
  Image as ImageIcon,
  Wand2,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import imageEditorPrompt from "@/assets/images/image-editor-prompt.png";

const ImageEditor: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [editedImageLoaded, setEditedImageLoaded] = useState(false);

  // Queue state
  const [jobId, setJobId] = useState<string | null>(null);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [queueLength, setQueueLength] = useState<number | null>(null);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number | null>(
    null
  );

  const editedImageRef = useRef<HTMLImageElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Prompt suggestions for image editing
  const promptSuggestions = [
    "Make the sky sunset orange",
    "Add flying birds in the background",
    "Change to a snowy winter scene",
    "Add dramatic storm clouds",
    "Make it look like watercolor painting",
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
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");

      const statusRes = await fetch(
        `${API_BASE_URL}/api/ai/edit-image-job-status/${currentJobId}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
          credentials: "include",
        }
      );

      if (!statusRes.ok) {
        throw new Error("Failed to get job status");
      }

      const statusData = await statusRes.json();

      if (statusData.status === "completed") {
        // Stop polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }

        setEditedImageUrl(
          statusData.editedImageUrl || statusData.imageUrl || statusData.url
        );
        setLoading(false);
        setJobId(null);
        setQueuePosition(null);
        setQueueLength(null);
        setEstimatedWaitTime(null);
      } else if (statusData.status === "failed") {
        // Stop polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }

        setError(statusData.error || "Image edit failed");
        setLoading(false);
        setJobId(null);
        setQueuePosition(null);
        setQueueLength(null);
        setEstimatedWaitTime(null);
      } else if (
        statusData.status === "queued" ||
        statusData.status === "processing"
      ) {
        // Update queue position
        setQueuePosition(statusData.position || null);
        setQueueLength(statusData.queueLength || null);
        setEstimatedWaitTime(statusData.estimatedWaitTime || null);
      }
    } catch (err) {
      console.error("[ImageEditor] Polling error:", err);
      // Don't stop polling on network errors, continue trying
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setEditedImageUrl(null);
    setError(null);
    if (file) {
      setOriginalPreview(URL.createObjectURL(file));
    } else {
      setOriginalPreview(null);
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setOriginalPreview(null);
    setEditedImageUrl(null);
    setError(null);
    // Reset the file input
    const fileInput = document.getElementById(
      "image-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEditedImageUrl(null);
    setEditedImageLoaded(false);
    setJobId(null);
    setQueuePosition(null);
    setQueueLength(null);
    setEstimatedWaitTime(null);

    // Clear any existing polling
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    if (!imageFile) {
      setError("Please upload an image.");
      return;
    }
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    setLoading(true);

    try {
      console.log("[ImageEditor] Starting image edit process");
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");

      console.log("[ImageEditor] Auth check:", {
        hasToken: !!token,
        tokenLength: token?.length,
        tokenPreview: token ? token.substring(0, 20) + "..." : "none",
        apiBaseUrl: API_BASE_URL,
      });

      // 1. Get signed upload URL for image
      console.log("[ImageEditor] Step 1: Getting upload URL");
      const imageUploadRes = await fetch(
        `${API_BASE_URL}/api/s3/generate-upload-url`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          credentials: "include",
          body: JSON.stringify({
            filename: imageFile.name,
            contentType: imageFile.type,
          }),
        }
      );

      if (!imageUploadRes.ok) {
        const errData = await imageUploadRes.json().catch(() => ({}));
        console.error(
          "[ImageEditor] Upload URL error:",
          imageUploadRes.status,
          errData
        );
        throw new Error(errData.error || "Failed to get image upload URL");
      }
      const imageUploadData = await imageUploadRes.json();
      console.log(
        "[ImageEditor] Upload URL received, S3 key:",
        imageUploadData.key
      );

      // 2. Upload image to S3
      console.log("[ImageEditor] Step 2: Uploading to S3");
      const putImageRes = await fetch(imageUploadData.uploadUrl, {
        method: "PUT",
        body: imageFile,
        headers: { "Content-Type": imageFile.type },
      });
      if (!putImageRes.ok) {
        console.error("[ImageEditor] S3 upload error:", putImageRes.status);
        throw new Error("Failed to upload image to S3");
      }
      console.log("[ImageEditor] S3 upload successful");

      // 3. Call backend with S3 key (now returns job ID)
      const payload = {
        prompt,
        imageS3Key: imageUploadData.key,
      };

      console.log(
        "[ImageEditor] Step 3: Calling edit-image API with payload:",
        payload
      );
      const res = await fetch(`${API_BASE_URL}/api/ai/edit-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      console.log("[ImageEditor] Edit API response status:", res.status);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("[ImageEditor] Edit API error:", res.status, data);

        if (res.status === 401) {
          setError(
            `Authentication error: ${
              data.error || "Unauthorized"
            }. Please check console for details.`
          );
        } else {
          setError(
            data?.error || `Failed to edit image (Status: ${res.status})`
          );
        }
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log("[ImageEditor] Received data:", data);

      // Check if we got a job ID (queue system) or direct result
      if (data.jobId && data.status === "queued") {
        // Queue system - start polling
        setJobId(data.jobId);
        setQueuePosition(data.position);
        setQueueLength(data.queueLength);
        setEstimatedWaitTime(data.estimatedWaitTime);

        console.log(
          `[ImageEditor] Job queued: ${data.jobId}, Position: ${data.position}`
        );

        // Start polling for job status
        pollingIntervalRef.current = setInterval(() => {
          pollJobStatus(data.jobId);
        }, 2000); // Poll every 2 seconds

        // Also poll immediately
        pollJobStatus(data.jobId);
      } else {
        // Direct result (shouldn't happen with queue system, but handle it)
        const url = data?.editedImageUrl || data?.imageUrl || data?.url;
        if (url) {
          setEditedImageUrl(url);
          setLoading(false);
          console.log("[ImageEditor] Success! Image URL set");
        } else {
          setError("No edited image returned from server.");
          setLoading(false);
        }
      }
    } catch (err: unknown) {
      console.error("[ImageEditor] Error during image edit:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Network error. Please try again.";
      setError(errorMessage);
      setLoading(false);

      // Clear polling on error
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }
  };

  const handleDownload = () => {
    if (editedImageUrl) {
      const link = document.createElement("a");
      link.href = editedImageUrl;
      link.download = `edited-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSuggestionClick = (suggestion: string) => setPrompt(suggestion);

  const handleRegenerate = () => {
    if (prompt.trim() && imageFile) {
      const fakeEvent = {
        preventDefault: () => {},
      } as React.FormEvent;
      handleSubmit(fakeEvent);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto overflow-x-hidden">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8 text-center px-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
            <span className="inline-flex items-center gap-2 sm:gap-3">
              <Wand2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-storiq-purple animate-pulse flex-shrink-0" />
              AI Image Editor
            </span>
          </h1>
          <p className="text-white/60 text-sm sm:text-base md:text-lg">
            Transform your images with AI-powered editing magic
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-8 overflow-x-hidden">
          {/* Left Column - Input Form */}
          <div className="w-full xl:w-[45%] 2xl:w-[40%] space-y-4 sm:space-y-5 md:space-y-6 order-2 xl:order-1 max-w-full">
            <div className="bg-storiq-card-bg/60 border border-storiq-border rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 backdrop-blur-lg">
              <form
                onSubmit={handleSubmit}
                className="space-y-4 sm:space-y-5 md:space-y-6"
              >
                {/* Image Upload */}
                <div className="space-y-2 sm:space-y-3">
                  <label
                    className="text-white font-medium text-sm sm:text-base flex items-center gap-2"
                    htmlFor="image-upload"
                  >
                    <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-storiq-purple flex-shrink-0" />
                    Upload Image
                  </label>
                  <div className="relative">
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={loading}
                      className="bg-black/40 border border-gray-700 text-white text-sm sm:text-base file:bg-storiq-purple/80 file:text-white file:border-0 file:rounded-lg file:text-sm file:py-1.5 file:px-3 file:mr-3 hover:file:bg-storiq-purple transition cursor-pointer"
                    />
                    {imageFile && (
                      <Button
                        type="button"
                        onClick={handleRemoveImage}
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0 rounded-full"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {imageFile && (
                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 flex-shrink-0" />
                      {imageFile.name}
                    </p>
                  )}
                </div>

                {/* Prompt Input */}
                <div className="space-y-2 sm:space-y-3">
                  <label
                    className="text-white font-medium text-sm sm:text-base flex items-center gap-2"
                    htmlFor="prompt"
                  >
                    <Wand2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-storiq-purple flex-shrink-0" />
                    Describe your edit
                  </label>
                  <Textarea
                    id="prompt"
                    placeholder="Make the sky sunset orange, add birds..."
                    value={prompt}
                    onChange={handlePromptChange}
                    disabled={loading}
                    className="bg-black/40 border border-gray-700 text-white placeholder:text-white/40 min-h-[100px] sm:min-h-[120px] text-sm sm:text-base rounded-xl focus:ring-2 focus:ring-storiq-purple/50 focus:border-storiq-purple transition resize-none px-3 py-2 sm:px-4 sm:py-3 scrollbar-hide"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  />
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
                        className="text-xs px-2.5 py-1.5 rounded-full bg-gray-800/50 hover:bg-storiq-purple/20 text-gray-300 hover:text-white border border-gray-700 hover:border-storiq-purple/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || !imageFile || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-storiq-purple to-storiq-purple/80 hover:from-storiq-purple/90 hover:to-storiq-purple/70 text-white font-semibold h-11 sm:h-12 text-sm sm:text-base rounded-xl transition-transform transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Editing Image...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Wand2 className="w-4 h-4" />
                      Edit Image
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="w-full xl:w-[55%] 2xl:w-[60%] order-1 xl:order-2 max-w-full">
            <div className="bg-storiq-card-bg/60 border border-storiq-border rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 backdrop-blur-lg flex flex-col min-h-[400px] sm:min-h-[500px] md:min-h-[600px] max-w-full overflow-hidden">
              {/* Loading */}
              {loading && (
                <div className="flex flex-col items-center justify-center flex-1 space-y-3 sm:space-y-4 min-h-[350px] sm:min-h-[450px] md:min-h-[550px]">
                  <div className="flex justify-center w-full">
                    <Loader
                      message={
                        queuePosition && queuePosition > 1
                          ? `In Queue - Position ${queuePosition}${
                              queueLength ? ` of ${queueLength}` : ""
                            }`
                          : "Editing your image..."
                      }
                      size="small"
                      overlay={false}
                    />
                  </div>
                  {estimatedWaitTime && estimatedWaitTime > 0 && (
                    <p className="text-gray-400 text-xs sm:text-sm animate-pulse">
                      Estimated wait: ~{Math.ceil(estimatedWaitTime / 60)}{" "}
                      minute
                      {Math.ceil(estimatedWaitTime / 60) !== 1 ? "s" : ""}
                    </p>
                  )}
                  {(!queuePosition || queuePosition === 1) && (
                    <p className="text-gray-400 text-xs sm:text-sm animate-pulse">
                      This may take a few moments...
                    </p>
                  )}
                </div>
              )}

              {/* Error */}
              {error && !loading && (
                <div className="flex flex-col items-center justify-center flex-1 space-y-3 sm:space-y-4">
                  <div className="p-2.5 sm:p-3 bg-red-500/10 rounded-full animate-bounce">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500 flex items-center justify-center">
                      <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
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

              {/* Edited Image Result */}
              {editedImageUrl && !loading && (
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
                    {/* Original Image */}
                    <div className="flex flex-col items-center w-full lg:w-[45%]">
                      <img
                        src={originalPreview || ""}
                        alt="Original"
                        className="rounded-xl w-full h-auto max-h-[250px] sm:max-h-[300px] object-contain border border-gray-700 mb-2"
                      />
                      <span className="text-xs sm:text-sm text-gray-400 font-medium">
                        Original
                      </span>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center justify-center lg:flex-shrink-0">
                      <ArrowRight className="w-6 h-6 text-storiq-purple hidden lg:block" />
                      <div className="lg:hidden rotate-90">
                        <ArrowRight className="w-6 h-6 text-storiq-purple" />
                      </div>
                    </div>

                    {/* Edited Image */}
                    <div className="flex flex-col items-center w-full lg:w-[45%]">
                      <div className="relative group w-full">
                        <img
                          ref={editedImageRef}
                          src={editedImageUrl}
                          alt="Edited"
                          className={`rounded-xl w-full h-auto max-h-[250px] sm:max-h-[300px] object-contain border-2 border-storiq-purple/70 mb-2 transition-all duration-700 ${
                            editedImageLoaded
                              ? "opacity-100 scale-100"
                              : "opacity-0 scale-105"
                          }`}
                          onLoad={() => setEditedImageLoaded(true)}
                        />
                        {!editedImageLoaded && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <RefreshCw className="w-6 h-6 text-storiq-purple animate-spin" />
                          </div>
                        )}

                        {/* Hover Download Button */}
                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 opacity-0 group-hover:opacity-100 transition">
                          <Button
                            onClick={handleDownload}
                            size="sm"
                            className="bg-black/80 hover:bg-black text-white backdrop-blur-sm border border-gray-600 h-8 sm:h-9 px-2.5"
                            title="Download edited image"
                          >
                            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm text-storiq-purple font-semibold">
                        Edited
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                    <Button
                      onClick={handleDownload}
                      className="w-full sm:w-auto bg-storiq-purple/80 hover:bg-storiq-purple text-white h-9 sm:h-10 text-sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={handleRegenerate}
                      variant="outline"
                      className="w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-800/50 h-9 sm:h-10 text-sm"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>

                  {/* Prompt Display */}
                  <div className="bg-gray-900/40 rounded-lg p-3 sm:p-4 border border-gray-800 hover:border-gray-700 transition">
                    <p className="text-xs text-gray-400 mb-1.5 flex items-center gap-1.5">
                      <Wand2 className="w-3 h-3 flex-shrink-0" />
                      Prompt used:
                    </p>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                      {prompt}
                    </p>
                  </div>
                </div>
              )}

              {/* Default Placeholder */}
              {!editedImageUrl && !loading && !error && !originalPreview && (
                <div className="flex flex-col items-center justify-center flex-1 text-center space-y-4 sm:space-y-6">
                  <img
                    src={imageEditorPrompt}
                    alt="Upload placeholder"
                    className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto rounded-xl shadow-lg border border-gray-700 bg-black/30"
                    draggable={false}
                  />
                  <p className="text-gray-500 text-xs sm:text-sm animate-pulse px-4">
                    ✨ Upload an image and enter your prompt to start editing
                  </p>
                </div>
              )}

              {/* Selected Image Preview (before editing) */}
              {!editedImageUrl && !loading && !error && originalPreview && (
                <div className="flex flex-col items-center justify-center flex-1 text-center space-y-4 sm:space-y-6">
                  <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
                    <h4 className="text-white/80 text-sm sm:text-base font-semibold mb-3">
                      Selected Image
                    </h4>
                    <img
                      src={originalPreview}
                      alt="Selected preview"
                      className="w-full rounded-xl shadow-lg border-2 border-storiq-purple/50 bg-black/30 object-contain max-h-[350px] sm:max-h-[450px]"
                      draggable={false}
                    />
                  </div>
                  <p className="text-gray-400 text-xs sm:text-sm px-4">
                    ✨ Now add a prompt below and click "Edit Image" to
                    transform your image
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {(editedImageUrl || loading) && (
          <div className="text-center mt-4 sm:mt-5 md:mt-6">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-2 px-2">
              <Sparkles className="w-3 h-3 flex-shrink-0" />
              Powered by Imagen 3 • Images are edited on-demand
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ImageEditor;
