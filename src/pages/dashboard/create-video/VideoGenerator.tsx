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
  const [prompt, setPrompt] = useState(
    `Create a video about sustainable living tips.

Feature a young female character.

Each scene should have a different background. Use a modern sans-serif font and vibrant nature visuals.`
  );
  const [selectedQuality, setSelectedQuality] = useState("720P");
  const [selectedVoiceSpeed, setSelectedVoiceSpeed] = useState("5x");
  // Status for video generation
  const [videoStatus, setVideoStatus] = useState<Status>("idle");
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoS3Key, setVideoS3Key] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [videoResolution, setVideoResolution] = useState<string | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<Status>("idle");
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // --- UPLOAD VIDEO STATE ---
  const [uploadStatus, setUploadStatus] = useState<Status>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form validation error
  const [formError, setFormError] = useState<string | null>(null);

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
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(
        `${API_BASE_URL}/api/gemini-veo3/generate-video`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            prompt,
            quality: selectedQuality,
            voiceSpeed: selectedVoiceSpeed,
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to generate video.");
      }
      const data = await res.json();
      if (!data?.s3Url)
        throw new Error("No video URL returned from Gemini VEO 3.");
      setVideoUrl(data.s3Url);
      setVideoS3Key(data.s3Key || null);
      setVideoDuration(data.duration || null);
      setVideoResolution(data.resolution || null);
      setVideoStatus("success");
    } catch (err: unknown) {
      let message = "An unexpected error occurred while generating the video.";
      if (isErrorWithMessage(err)) {
        message = err.message;
      } else if (err instanceof Response) {
        const errorData = await err.json().catch(() => ({}));
        message = errorData?.error || "Failed to process the request.";
      }
      setVideoError(message);
      setVideoStatus("error");
    }
  };

  // --- DATA ---
  const qualityOptions = ["480P", "720P", "1080P"];
  const voiceSpeedOptions = ["5x", "10x"];

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
      <div className="p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
            <span className="inline-block align-middle mr-3">
              <Wand2 className="w-8 h-8 text-storiq-purple" />
            </span>
            <span className="align-middle">Text to Video</span>
          </h1>
          <p className="text-white/60 text-base md:text-lg text-center">
            Transform text description into videos.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8">
          {/* Left Column - Controls */}
          <div className="flex flex-col gap-6 md:gap-8 h-full w-full lg:w-[40%] max-lg:mb-4 overflow-y-auto lg:max-h-[calc(100vh-120px)] pr-0 lg:pr-2 scrollbar-thin scrollbar-thumb-storiq-border/40 scrollbar-track-transparent [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {/* Prompt Area */}
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-6">
              <Textarea
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder="Describe your video here... Be as detailed as possible for better results."
                className="bg-storiq-card-bg border-storiq-border text-white placeholder:text-white/40 min-h-[150px] resize-none focus:border-storiq-purple focus:ring-storiq-purple font-medium [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
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
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-6">
              <h3 className="text-white text-lg font-semibold mb-4">
                Video Quality
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {qualityOptions.map((quality) => (
                  <Button
                    key={quality}
                    onClick={() => setSelectedQuality(quality)}
                    variant={
                      selectedQuality === quality ? "default" : "outline"
                    }
                    className="h-12 transition-all duration-200"
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
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-6">
              <h3 className="text-white text-lg font-semibold mb-4">
                Voice Speed
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {voiceSpeedOptions.map((speed) => (
                  <Button
                    key={speed}
                    onClick={() => setSelectedVoiceSpeed(speed)}
                    variant={
                      selectedVoiceSpeed === speed ? "default" : "outline"
                    }
                    className="h-12 transition-all duration-200"
                  >
                    <span
                      className={
                        selectedVoiceSpeed === speed
                          ? "text-white"
                          : "text-white/80"
                      }
                    >
                      {speed}
                    </span>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Aspect Ratio Selection */}
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-lg font-semibold">
                  Aspect Ratio
                </h3>
                <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Create +10
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Swipe to explore</span>
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            </Card>

            {/* Generate Button */}
            <Button
              onClick={handleGenerateVideo}
              disabled={videoStatus === "loading" || !prompt.trim()}
              className="h-14 bg-gradient-to-r from-storiq-purple to-storiq-purple/80 hover:from-storiq-purple/90 hover:to-storiq-purple/70 text-white font-semibold text-base transition-all duration-200 w-full"
            >
              {videoStatus === "loading" ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Generating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Generate Video
                </span>
              )}
            </Button>

            {/* Upload Video Section */}
            <Card className="bg-storiq-card-bg/50 border-storiq-border p-6">
              <form onSubmit={handleUploadVideo} className="space-y-4">
                <h3 className="text-white text-lg font-semibold">
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
                    className="h-12 w-full border-storiq-border bg-storiq-card-bg hover:bg-storiq-card-bg/80 text-white font-semibold"
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
                    <div className="text-white/60 text-sm">
                      Selected: {selectedFile.name}
                    </div>
                  )}
                  {selectedFile && (
                    <Button
                      type="submit"
                      className="h-10 bg-green-600 hover:bg-green-700 text-white font-semibold w-full"
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
                  <AlertTitle className="text-red-200">Upload Error</AlertTitle>
                  <AlertDescription className="text-red-300">
                    {uploadError}
                  </AlertDescription>
                </Alert>
              )}
            </Card>
          </div>

          {/* Right Column - Video Preview */}
          <div className="w-full lg:w-[60%] flex-shrink-0">
            <div className="sticky top-6">
              <Card className="bg-storiq-card-bg/50 border-storiq-border p-4 md:p-6 h-full flex flex-col mx-auto">
                <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 text-storiq-purple" />
                  Video Preview
                </h3>

                {videoStatus === "loading" && (
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-storiq-purple/30 rounded-lg bg-gradient-to-br from-storiq-purple/10 to-transparent">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-storiq-purple mb-4"></div>
                    <span className="text-storiq-purple font-semibold text-lg">
                      Generating your video...
                    </span>
                    <p className="text-white/60 text-sm mt-2">
                      This may take a few moments
                    </p>
                  </div>
                )}

                {videoStatus === "error" && videoError && (
                  <Alert
                    variant="destructive"
                    className="mb-4 border-red-500/50 bg-red-500/10"
                  >
                    <AlertTitle className="text-red-200">
                      Generation Failed
                    </AlertTitle>
                    <AlertDescription className="text-red-300">
                      {videoError}
                    </AlertDescription>
                  </Alert>
                )}

                {videoStatus === "success" && videoUrl && (
                  <div className="space-y-4">
                    <div className="p-3 border-2 border-green-500/30 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent">
                      <AdvancedVideoPlayer
                        src={videoUrl}
                        onDelete={handleDeleteVideo}
                        className="w-full rounded-lg shadow-2xl"
                      />
                      <div className="flex flex-col items-center justify-center gap-2 mt-3 text-green-400 text-sm font-semibold">
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
                        <AlertTitle className="text-red-200">
                          Delete Error
                        </AlertTitle>
                        <AlertDescription className="text-red-300">
                          {deleteError}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {videoStatus === "idle" && (
                  <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-storiq-border rounded-lg bg-gradient-to-br from-storiq-card-bg to-storiq-card-bg/30">
                    <video
                      src={promptPlaceVideo as string}
                      controls
                      autoPlay
                      loop
                      muted
                      className="w-full max-w-lg rounded-lg shadow-lg mb-4"
                      poster=""
                    />
                    <div className="w-full flex flex-col items-center mt-2">
                      <h4 className="text-white/60 text-base font-semibold mb-1">
                        Prompt
                      </h4>
                      <pre className="text-white/70 text-base font-medium whitespace-pre-line text-center">
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
