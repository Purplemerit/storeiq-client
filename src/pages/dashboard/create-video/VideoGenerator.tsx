import React, { useState, useEffect, useRef } from "react";
const promptPlaceVideo =
  "https://store-iq-video-bucket.s3.ap-south-1.amazonaws.com/prompt-place.mp4";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import AdvancedVideoPlayer from "@/components/AdvancedVideoPlayer";
import { useAuth } from "@/context/AuthContext";
import { Wand2, Play, Upload } from "lucide-react";

function isErrorWithMessage(err: unknown): err is { message: string } {
  return (
    typeof err === "object" &&
    err !== null &&
    "message" in err &&
    typeof (err as { message?: unknown }).message === "string"
  );
}

import DashboardLayout from "@/components/DashboardLayout";

const VideoGenerator = () => {
  const { user } = useAuth();
  // --- STATE MANAGEMENT ---
  type Status = "idle" | "loading" | "success" | "error";
  const [prompt, setPrompt] = useState(``);
  const [selectedQuality, setSelectedQuality] = useState("720p");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("16:9");
  const [selectedDuration, setSelectedDuration] = useState(8);
  const [enhancePrompt, setEnhancePrompt] = useState(true);
  // Status for video generation
  const [videoStatus, setVideoStatus] = useState<Status>("idle");
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoS3Key, setVideoS3Key] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [videoResolution, setVideoResolution] = useState<string | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<Status>("idle");
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Queue management state
  const [jobId, setJobId] = useState<string | null>(null);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [queueLength, setQueueLength] = useState<number | null>(null);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number | null>(
    null
  );
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- UPLOAD VIDEO STATE ---
  const [uploadStatus, setUploadStatus] = useState<Status>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form validation error
  const [formError, setFormError] = useState<string | null>(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Poll job status
  const pollJobStatus = async (currentJobId: string) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(
        `${API_BASE_URL}/api/gemini-veo3/job-status/${currentJobId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to get job status.");
      }

      const data = await res.json();
      console.log("📊 Job status:", data);

      // Update queue info
      if (data.position !== undefined) setQueuePosition(data.position);
      if (data.queueLength !== undefined) setQueueLength(data.queueLength);
      if (data.estimatedWaitTime !== undefined)
        setEstimatedWaitTime(data.estimatedWaitTime);

      // Check if completed
      if (data.status === "completed") {
        console.log("✅ Video generation completed!");

        // Stop polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }

        // Set video data
        setVideoUrl(data.s3Url);
        setVideoS3Key(data.s3Key || null);
        setVideoDuration(data.duration || null);
        setVideoResolution(data.resolution || selectedQuality);
        setVideoStatus("success");
        setJobId(null);
        setQueuePosition(null);
        setQueueLength(null);
        setEstimatedWaitTime(null);
      } else if (data.status === "failed") {
        console.error("❌ Video generation failed");

        // Stop polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }

        setVideoError(data.error || "Video generation failed");
        setVideoStatus("error");
        setJobId(null);
        setQueuePosition(null);
        setQueueLength(null);
        setEstimatedWaitTime(null);
      }
      // If still processing or queued, continue polling
    } catch (err: unknown) {
      console.error("❌ Error polling job status:", err);
      // Don't stop polling on temporary errors, but log them
    }
  };

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) {
      setFormError("Prompt cannot be empty.");
      return;
    }
    setFormError(null);
    setVideoStatus("loading");
    setVideoError(null);
    setVideoUrl(null);
    setVideoS3Key(null);
    setQueuePosition(null);
    setQueueLength(null);
    setEstimatedWaitTime(null);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

      console.log("🎬 Requesting video generation...");

      const res = await fetch(
        `${API_BASE_URL}/api/gemini-veo3/generate-video`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            prompt,
            quality: selectedQuality,
            aspectRatio: selectedAspectRatio,
            durationSeconds: selectedDuration,
            enhancePrompt: enhancePrompt,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to generate video.");
      }

      const data = await res.json();
      console.log("✓ Job created:", data);

      // Store job ID and queue info
      setJobId(data.jobId);
      setQueuePosition(data.position);
      setQueueLength(data.queueLength);
      setEstimatedWaitTime(data.estimatedWaitTime);

      // Start polling for job status
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      // Poll every 3 seconds
      pollingIntervalRef.current = setInterval(() => {
        if (data.jobId) {
          pollJobStatus(data.jobId);
        }
      }, 3000);

      // Do an immediate poll
      pollJobStatus(data.jobId);
    } catch (err: unknown) {
      let message = "An unexpected error occurred while generating the video.";
      if (isErrorWithMessage(err)) {
        message = err.message;
      } else if (err instanceof Response) {
        const errorData = await err.json().catch(() => ({}));
        message = errorData?.error || "Failed to process the request.";
      }
      console.error("❌ Video generation error:", message);
      setVideoError(message);
      setVideoStatus("error");

      // Clear polling on error
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }
  };

  // --- DATA ---
  const qualityOptions = ["720p", "1080p"];
  const aspectRatioOptions = ["16:9", "9:16"];
  const durationOptions = [4, 6, 8];

  // --- UPLOAD VIDEO HANDLER ---
  const handleUploadVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadStatus("idle");
    setUploadError(null);
    if (!selectedFile) {
      setUploadError("Please select a video file to upload.");
      return;
    }
    setUploading(true);
    setUploadStatus("loading");
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      // 1. Get signed S3 URL from backend (correct endpoint)
      const getUrlRes = await fetch(`${API_BASE_URL}/api/s3-presigned-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          filename: selectedFile.name,
          contentType: selectedFile.type,
        }),
      });
      if (!getUrlRes.ok) {
        const err = await getUrlRes.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to get signed upload URL.");
      }

      const presignedResp = await getUrlRes.json();
      console.log("Presigned URL response:", presignedResp);
      const url = presignedResp.url;
      const fileUrl = presignedResp.fileUrl;
      // Accept both key and s3Key for compatibility
      const key = presignedResp.key || presignedResp.s3Key;
      if (!url || !fileUrl || !key)
        throw new Error("Invalid signed URL response.");

      // 2. Upload file directly to S3
      const uploadRes = await fetch(url, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": selectedFile.type,
        },
      });
      if (!uploadRes.ok) {
        throw new Error("Failed to upload video to S3.");
      }

      // 3. Register the uploaded video in backend so it appears in /api/videos
      const registerRes = await fetch(`${API_BASE_URL}/api/register-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          s3Key: key,
          title: selectedFile.name,
        }),
      });
      if (!registerRes.ok) {
        const err = await registerRes.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to register uploaded video.");
      }
      setVideoUrl(fileUrl);
      setVideoS3Key(key || null);
      setUploadStatus("success");
      setSelectedFile(null);
    } catch (err: unknown) {
      let message = "Unknown error";
      if (isErrorWithMessage(err)) {
        message = err.message;
      }
      setUploadError(message);
      setUploadStatus("error");
    } finally {
      setUploading(false);
    }
  };

  // --- DELETE VIDEO HANDLER ---
  const handleDeleteVideo = async () => {
    if (!videoS3Key) return;
    setDeleteStatus("loading");
    setDeleteError(null);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${API_BASE_URL}/api/delete-video`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ s3Key: videoS3Key }),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to delete video.");
      }
      setDeleteStatus("success");
      setVideoUrl(null);
      setVideoS3Key(null);
      setVideoStatus("idle");
      setVideoError(null);
    } catch (err: unknown) {
      let message = "Unknown error";
      if (isErrorWithMessage(err)) {
        message = err.message;
      }
      setDeleteError(message);
      setDeleteStatus("error");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8 text-center px-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2 sm:gap-3">
            <Wand2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-storiq-purple flex-shrink-0" />
            <span>Text to Video</span>
          </h1>
          <p className="text-white/60 text-sm sm:text-base md:text-lg">
            Transform text description into videos.
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {/* Left Column - Controls */}
          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 h-full w-full xl:w-[45%] 2xl:w-[40%] xl:overflow-y-auto xl:max-h-[calc(100vh-140px)] xl:pr-2 scrollbar-thin scrollbar-thumb-storiq-border/40 scrollbar-track-transparent [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {/* Prompt Area */}
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-3 sm:p-4 md:p-5 lg:p-6">
              <Textarea
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder="Describe your video here... Be as detailed as possible for better results."
                className="bg-storiq-card-bg border-storiq-border text-white placeholder:text-white/40 min-h-[120px] sm:min-h-[140px] md:min-h-[160px] resize-none focus:border-storiq-purple focus:ring-storiq-purple font-medium text-sm sm:text-base [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
              />

              {formError && (
                <Alert
                  variant="destructive"
                  className="mt-3 border-red-500/50 bg-red-500/10"
                >
                  <AlertTitle className="text-red-200">
                    Validation Error
                  </AlertTitle>
                  <AlertDescription className="text-red-300">
                    {formError}
                  </AlertDescription>
                </Alert>
              )}
            </Card>

            {/* Video Quality Selection */}
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-3 sm:p-4 md:p-5 lg:p-6">
              <h3 className="text-white text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Video Quality
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {qualityOptions.map((quality) => (
                  <Button
                    key={quality}
                    onClick={() => setSelectedQuality(quality)}
                    variant={
                      selectedQuality === quality ? "default" : "outline"
                    }
                    className={`h-10 sm:h-11 md:h-12 text-sm sm:text-base transition-all duration-200 ${
                      selectedQuality === quality
                        ? "bg-storiq-purple hover:bg-storiq-purple/80 text-white border-storiq-purple"
                        : "bg-black border-storiq-border text-white/80 hover:bg-storiq-purple/10 hover:border-storiq-purple"
                    }`}
                  >
                    <span
                      className={
                        selectedQuality === quality
                          ? "text-white"
                          : "text-white/80"
                      }
                    >
                      {quality}
                    </span>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Voice Speed Selection */}
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-3 sm:p-4 md:p-5 lg:p-6">
              <h3 className="text-white text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Aspect Ratio
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {aspectRatioOptions.map((ratio) => (
                  <Button
                    key={ratio}
                    onClick={() => setSelectedAspectRatio(ratio)}
                    variant={
                      selectedAspectRatio === ratio ? "default" : "outline"
                    }
                    className={`h-10 sm:h-11 md:h-12 text-sm sm:text-base transition-all duration-200 ${
                      selectedAspectRatio === ratio
                        ? "bg-storiq-purple hover:bg-storiq-purple/80 text-white border-storiq-purple"
                        : "bg-black border-storiq-border text-white/80 hover:bg-storiq-purple/10 hover:border-storiq-purple"
                    }`}
                  >
                    <span
                      className={
                        selectedAspectRatio === ratio
                          ? "text-white"
                          : "text-white/80"
                      }
                    >
                      {ratio === "16:9"
                        ? "Landscape (16:9)"
                        : "Portrait (9:16)"}
                    </span>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Audio Language Selection */}
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-3 sm:p-4 md:p-5 lg:p-6">
              <h3 className="text-white text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Video Duration
              </h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {durationOptions.map((duration) => (
                  <Button
                    key={duration}
                    onClick={() => setSelectedDuration(duration)}
                    variant={
                      selectedDuration === duration ? "default" : "outline"
                    }
                    className={`h-10 sm:h-11 md:h-12 text-sm sm:text-base transition-all duration-200 ${
                      selectedDuration === duration
                        ? "bg-storiq-purple hover:bg-storiq-purple/80 text-white border-storiq-purple"
                        : "bg-black border-storiq-border text-white/80 hover:bg-storiq-purple/10 hover:border-storiq-purple"
                    }`}
                  >
                    <span
                      className={
                        selectedDuration === duration
                          ? "text-white"
                          : "text-white/80"
                      }
                    >
                      {duration}s
                    </span>
                  </Button>
                ))}
              </div>
              <p className="text-white/50 text-xs sm:text-sm mt-2">
                Length of the generated video
              </p>
            </Card>

            {/* Enhance Prompt Option */}
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-3 sm:p-4 md:p-5 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-base sm:text-lg font-semibold mb-1">
                    Enhance Prompt
                  </h3>
                  <p className="text-white/50 text-xs sm:text-sm">
                    Use Gemini AI to improve your prompt for better results
                  </p>
                </div>
                <button
                  onClick={() => setEnhancePrompt(!enhancePrompt)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    enhancePrompt ? "bg-storiq-purple" : "bg-storiq-border"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      enhancePrompt ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </Card>

            {/* Generate Button */}
            <Button
              onClick={handleGenerateVideo}
              disabled={videoStatus === "loading" || !prompt.trim()}
              className="h-12 sm:h-13 md:h-14 bg-gradient-to-r from-storiq-purple to-storiq-purple/80 hover:from-storiq-purple/90 hover:to-storiq-purple/70 text-white font-semibold text-sm sm:text-base transition-all duration-200 w-full"
            >
              {videoStatus === "loading" ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span className="hidden xs:inline">Generating...</span>
                  <span className="xs:hidden">Processing...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Generate Video
                </span>
              )}
            </Button>

            {/* Upload Video Section */}
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-3 sm:p-4 md:p-5 lg:p-6">
              <form
                onSubmit={handleUploadVideo}
                className="space-y-3 sm:space-y-4"
              >
                <h3 className="text-white text-base sm:text-lg font-semibold">
                  Upload Video
                </h3>
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      setSelectedFile(e.target.files?.[0] || null);
                      setUploadError(null);
                    }}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 sm:h-11 md:h-12 w-full border-storiq-border bg-storiq-card-bg hover:bg-storiq-card-bg/80 text-white font-semibold text-sm sm:text-base"
                    disabled={uploading}
                    onClick={() => {
                      if (!uploading && fileInputRef.current) {
                        fileInputRef.current.value = ""; // allow re-selecting same file
                        fileInputRef.current.click();
                      }
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Choose File
                    </span>
                  </Button>
                  {selectedFile && (
                    <div className="text-white/60 text-xs sm:text-sm break-all">
                      Selected: {selectedFile.name}
                    </div>
                  )}
                  {selectedFile && (
                    <Button
                      type="submit"
                      className="h-9 sm:h-10 bg-green-600 hover:bg-green-700 text-white font-semibold w-full text-sm sm:text-base"
                      disabled={uploading}
                    >
                      {uploading ? (
                        <span className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                          Uploading...
                        </span>
                      ) : (
                        "Upload Video"
                      )}
                    </Button>
                  )}
                </div>
              </form>
              {uploadStatus === "error" && uploadError && (
                <Alert
                  variant="destructive"
                  className="mt-4 border-red-500/50 bg-red-500/10"
                >
                  <AlertTitle className="text-red-200 text-sm sm:text-base">
                    Upload Error
                  </AlertTitle>
                  <AlertDescription className="text-red-300 text-xs sm:text-sm">
                    {uploadError}
                  </AlertDescription>
                </Alert>
              )}
            </Card>
          </div>

          {/* Right Column - Video Preview */}
          <div className="w-full xl:w-[55%] 2xl:w-[60%] flex-shrink-0">
            <div className="xl:sticky xl:top-6">
              <Card className="bg-storiq-card-bg/50 border-storiq-border p-3 sm:p-4 md:p-5 lg:p-6 h-full flex flex-col">
                <h3 className="text-white text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 text-storiq-purple flex-shrink-0" />
                  Video Preview
                </h3>

                {videoStatus === "loading" && (
                  <div className="flex flex-col items-center justify-center p-6 sm:p-8 md:p-10 border-2 border-storiq-purple/30 rounded-lg bg-gradient-to-br from-storiq-purple/10 to-transparent">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-storiq-purple mb-3 sm:mb-4"></div>
                    <span className="text-storiq-purple font-semibold text-base sm:text-lg text-center">
                      {queuePosition && queuePosition > 0
                        ? `In Queue - Position ${queuePosition}`
                        : "Generating your video with Veo-3..."}
                    </span>
                    <p className="text-white/60 text-xs sm:text-sm mt-2 text-center max-w-md">
                      {queuePosition && queuePosition > 0 ? (
                        <>
                          {queueLength && queueLength > 1 && (
                            <span className="block">
                              {queueLength - 1} other{" "}
                              {queueLength - 1 === 1 ? "user" : "users"} ahead
                              of you
                            </span>
                          )}
                          {estimatedWaitTime && (
                            <span className="block mt-1">
                              Estimated wait:{" "}
                              {Math.ceil(estimatedWaitTime / 60)} minute
                              {Math.ceil(estimatedWaitTime / 60) === 1
                                ? ""
                                : "s"}
                            </span>
                          )}
                        </>
                      ) : (
                        "The AI is creating, rendering, and uploading your video."
                      )}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-white/50 text-xs">
                      <div className="animate-pulse">
                        {queuePosition && queuePosition > 0 ? "⏳" : "🎬"}
                      </div>
                      <span>Please don't close this page</span>
                    </div>
                    {jobId && (
                      <div className="mt-3 text-white/40 text-xs font-mono">
                        Job ID: {jobId.substring(0, 8)}...
                      </div>
                    )}
                  </div>
                )}

                {videoStatus === "error" && videoError && (
                  <Alert
                    variant="destructive"
                    className="mb-4 border-red-500/50 bg-red-500/10"
                  >
                    <AlertTitle className="text-red-200 text-sm sm:text-base">
                      Generation Failed
                    </AlertTitle>
                    <AlertDescription className="text-red-300 text-xs sm:text-sm">
                      {videoError}
                    </AlertDescription>
                  </Alert>
                )}

                {videoStatus === "success" && videoUrl && (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="p-2 sm:p-3 border-2 border-green-500/30 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent">
                      <AdvancedVideoPlayer
                        src={videoUrl}
                        onDelete={handleDeleteVideo}
                        className="w-full rounded-lg shadow-2xl"
                      />
                      <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 text-green-400 text-xs sm:text-sm font-semibold">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Video generated successfully!</span>
                        {videoDuration && (
                          <span>Duration: {videoDuration} seconds</span>
                        )}
                        {videoResolution && (
                          <span>Resolution: {videoResolution}</span>
                        )}
                      </div>
                    </div>

                    {deleteStatus === "error" && deleteError && (
                      <Alert
                        variant="destructive"
                        className="border-red-500/50 bg-red-500/10"
                      >
                        <AlertTitle className="text-red-200 text-sm sm:text-base">
                          Delete Error
                        </AlertTitle>
                        <AlertDescription className="text-red-300 text-xs sm:text-sm">
                          {deleteError}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {videoStatus === "idle" && (
                  <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 border-2 border-dashed border-storiq-border rounded-lg bg-gradient-to-br from-storiq-card-bg to-storiq-card-bg/30">
                    <video
                      src={promptPlaceVideo as string}
                      controls
                      autoPlay
                      loop
                      muted
                      className="w-full max-w-lg rounded-lg shadow-lg mb-3 sm:mb-4"
                      poster=""
                    />
                    <div className="w-full flex flex-col items-center mt-2">
                      <h4 className="text-white/60 text-sm sm:text-base font-semibold mb-1">
                        Prompt
                      </h4>
                      <pre className="text-white/70 text-xs sm:text-sm md:text-base font-medium whitespace-pre-line text-center px-2">
                        Create a video about sustainable living tips. Feature a
                        young female character. Each scene should have a
                        different background. Use a modern sans-serif font and
                        vibrant nature visuals.
                      </pre>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VideoGenerator;
