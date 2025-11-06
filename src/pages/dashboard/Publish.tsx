"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/authFetch";
import { DateTime } from "luxon";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useYouTubeConnect from "@/hooks/useYouTubeConnect";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Lazy load VideoPublishCard
const LazyVideoPublishCard = React.lazy(() => import("./VideoPublishCard"));

// Lazy load ImagePublishCard
const LazyImagePublishCard = React.lazy(() => import("./ImagePublishCard"));

// Lazy load ImagePreviewModal
const ImagePreviewModal = React.lazy(
  () => import("@/components/ImagePreviewModal")
);

// Lazy load ScheduleDialog
const ScheduleDialog = React.lazy(() =>
  import("@/components/schedule-dialog").then((m) => ({
    default: m.ScheduleDialog,
  }))
);

// Lazy load Dialog components
const Dialog = React.lazy(() =>
  import("@/components/ui/dialog").then((m) => ({ default: m.Dialog }))
);
const DialogTrigger = React.lazy(() =>
  import("@/components/ui/dialog").then((m) => ({ default: m.DialogTrigger }))
);
const DialogContent = React.lazy(() =>
  import("@/components/ui/dialog").then((m) => ({ default: m.DialogContent }))
);
const DialogTitle = React.lazy(() =>
  import("@/components/ui/dialog").then((m) => ({ default: m.DialogTitle }))
);

const IG_OAUTH_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth/instagram`;

// Videos state
interface Video {
  id?: string;
  url: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  s3Key?: string;
  publishCount?: number;
  publishedToYouTube?: boolean;
  scheduledTime?: string;
  scheduledStatus?: "pending" | "completed" | "failed";
  editedTitles: { [id: string]: string };
  setEditedTitles: React.Dispatch<
    React.SetStateAction<{ [id: string]: string }>
  >;
}

const Publish = () => {
  const navigate = useNavigate();
  const {
    ytConnected,
    loading: ytLoading,
    handleYouTubeOAuth,
    fetchConnectionStatus,
    disconnectYouTube,
  } = useYouTubeConnect();
  const [igConnected, setIgConnected] = useState(false);

  const [activeTab, setActiveTab] = useState<"scheduled" | "past">("scheduled");
  const [videos, setVideos] = useState<Video[]>([]);
  // Track edited titles per video
  const [editedTitles, setEditedTitles] = useState<{ [id: string]: string }>(
    {}
  );

  // Helper: check if file is a video (not image)
  function isVideoFile(url: string) {
    // Remove query params before checking extension
    const cleanUrl = url.split("?")[0];
    return /\.(mp4|mov|webm|avi|mkv)$/i.test(cleanUrl);
  }

  // Main display: show all video files
  const videoItems = videos.filter((v) => isVideoFile(v.url));

  // Filtering logic for future use (not applied to main display yet)
  const scheduledVideos = videoItems.filter(
    (v) =>
      !v.publishedToYouTube &&
      (!v.scheduledTime ||
        (v.scheduledTime && v.scheduledStatus !== "completed"))
  );
  const publishedVideos = videoItems.filter(
    (v) =>
      v.publishedToYouTube ||
      (v.scheduledTime && v.scheduledStatus === "completed")
  );
  const [images, setImages] = useState<
    { id?: string; url: string; s3Key?: string; title?: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [imagesLoading, setImagesLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imagesError, setImagesError] = useState<string | null>(null);
  const [postingId, setPostingId] = useState<string | null>(null);
  const [schedulingLoading, setSchedulingLoading] = useState<boolean>(false);

  // Pagination state
  const [currentVideoPage, setCurrentVideoPage] = useState(1);
  const [currentImagePage, setCurrentImagePage] = useState(1);
  const [currentPastVideoPage, setCurrentPastVideoPage] = useState(1);
  const itemsPerPage = 9;

  // Image preview modal state
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    src: string | null;
    title: string;
    id: string | null;
    prompt: string | null;
  }>({ src: null, title: "", id: null, prompt: null });

  // Platform selection per video
  type PlatformSelections = { [videoId: string]: { yt: boolean; ig: boolean } };
  const [platformSelections, setPlatformSelections] =
    useState<PlatformSelections>({});

  const handlePlatformChange = (
    videoId: string,
    platform: "youtube" | "instagram"
  ) => {
    setPlatformSelections((prev) => ({
      ...prev,
      [videoId]: {
        yt: platform === "youtube" ? !prev[videoId]?.yt : !!prev[videoId]?.yt,
        ig: platform === "instagram" ? !prev[videoId]?.ig : !!prev[videoId]?.ig,
      },
    }));
  };

  // Fetch videos from backend

  // Handle posting per video
  // Fetch images from backend
  const fetchImages = async (): Promise<{ error?: string }> => {
    setImagesLoading(true);
    setImagesError(null);
    try {
      const res = await authFetch("/api/images");
      if (!res.ok) throw new Error("Failed to fetch images");
      const data = await res.json();
      setImages(
        Array.isArray(data)
          ? data.map((img) => ({
              id: img.key,
              url: img.s3Url,
              s3Key: img.key,
              title: img.title,
            }))
          : []
      );
      return {};
    } catch (err) {
      const error = (err as Error)?.message || "Unknown error";
      setImagesError(error);
      return { error };
    } finally {
      setImagesLoading(false);
    }
  };

  // Handle image preview
  const handleImagePreview = (image: {
    id?: string;
    url: string;
    s3Key?: string;
    title?: string;
    prompt?: string;
  }) => {
    setSelectedImage({
      src: image.url,
      title: image.title || "Untitled Image",
      id: image.id || image.s3Key || null,
      prompt: image.prompt || null,
    });
    setImagePreviewOpen(true);
  };

  const handleCloseImagePreview = () => {
    setImagePreviewOpen(false);
    setSelectedImage({ src: null, title: "", id: null, prompt: null });
  };

  const handleDeleteImage = async (imageId: string | null) => {
    if (!imageId) return;

    try {
      const res = await authFetch(`/api/images/${imageId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete image");

      toast.success("Image deleted successfully");
      setImagePreviewOpen(false);
      await fetchImages(); // Refresh the images list
    } catch (err) {
      console.error("Delete error:", err);
      toast.error((err as Error)?.message || "Failed to delete image");
    }
  };

  // Fetch videos from backend
  const fetchVideos = async (): Promise<{ error?: string }> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch("/api/videos");
      if (!res.ok) throw new Error("Failed to fetch videos");
      const data = await res.json();
      setVideos(Array.isArray(data) ? data : []);
      // Debug: log what we get from backend
      console.log("Fetched videos:", data);
      return {};
    } catch (err) {
      const error = (err as Error)?.message || "Unknown error";
      setError(error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const validateYouTubeConnection = async (): Promise<boolean> => {
    try {
      const statusRes = await authFetch("/api/auth/status");
      const status = await statusRes.json();

      if (!status.youtube) {
        await disconnectYouTube();
        await fetchConnectionStatus();
        toast.error(
          "YouTube connection has expired. Please reconnect your account."
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Failed to verify connection status:", error);
      toast.error("Failed to verify connection status. Please try again.");
      return false;
    }
  };

  const safeLoadData = async (isMounted: boolean): Promise<void> => {
    try {
      const [videosRes, imagesRes] = await Promise.all([
        fetchVideos(),
        fetchImages(),
      ]);

      if (!isMounted) return;

      if (videosRes.error) {
        throw new Error(videosRes.error);
      }
      if (imagesRes.error) {
        throw new Error(imagesRes.error);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
      if (error instanceof Error && error.message.includes("Unauthorized")) {
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login";
      } else {
        toast.error("Failed to load content. Please refresh the page.");
      }
      throw error;
    }
  };

  const handlePost = async (video: Video, scheduledTime?: DateTime) => {
    try {
      setSchedulingLoading(true);
      setPostingId(video.id || video.s3Key || "");

      if (!ytConnected) {
        toast.error(
          "YouTube connection required. Please connect your account."
        );
        setSchedulingLoading(false);
        setPostingId(null);
        return;
      }

      const selection = platformSelections[video.id || video.s3Key || ""] || {
        yt: false,
        ig: false,
      };

      if (!selection.yt && !selection.ig) {
        toast.error("Please select at least one platform for publishing");
        setSchedulingLoading(false);
        return;
      }

      // Use edited title if available, else fallback to video.title
      const videoId = video.id || video.s3Key || "";
      const title =
        editedTitles[videoId] && editedTitles[videoId].trim()
          ? editedTitles[videoId].trim()
          : video.title && video.title.trim()
          ? video.title.trim()
          : "Untitled Video";
      const payload = {
        s3Key: video.s3Key,
        metadata: {
          title,
          description: video.description || "",
        },
      };

      if (selection.yt && ytConnected) {
        try {
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
          const endpoint = scheduledTime
            ? "/api/schedule/video"
            : "/api/publish/youtube";

          const requestPayload = scheduledTime
            ? {
                videoS3Key: video.s3Key,
                scheduledTime: scheduledTime.toISO(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                metadata: {
                  title,
                  description: video.description || "",
                },
              }
            : payload;

          const res = await authFetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestPayload),
          });

          const data = await res.json();

          if (!res.ok) {
            const errorMessage = data.error || "Unknown error";
            if (res.status === 401 || res.status === 403) {
              await disconnectYouTube();
              await fetchConnectionStatus();
              toast.error(
                "YouTube authorization expired. Please reconnect your account."
              );
            } else {
              toast.error(`Publishing failed: ${errorMessage}`);
            }
            setSchedulingLoading(false);
            setPostingId(null);
            return;
          }

          if (scheduledTime) {
            toast.success(
              `Video "${
                video.title || "Untitled Video"
              }" scheduled successfully!`
            );
            await fetchVideos();
            setActiveTab("scheduled");
          } else {
            toast.success(
              `"${video.title || "Untitled Video"}" published successfully!`
            );
            setPlatformSelections((prev) => ({
              ...prev,
              [video.id || video.s3Key || ""]: { yt: false, ig: false },
            }));
            await Promise.all([fetchVideos(), fetchConnectionStatus()]);
            setActiveTab("past");
          }
        } catch (err) {
          console.error("Publishing Error:", err);
          toast.error(
            (err as Error)?.message || "An unexpected error occurred"
          );
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setSchedulingLoading(false);
      setPostingId(null);
    }
  };

  // Load initial data
  React.useEffect(() => {
    const loadContent = async () => {
      try {
        await Promise.all([fetchVideos(), fetchImages()]);
      } catch (err) {
        console.error("Failed to load content:", err);
      }
    };

    loadContent();
  }, []);

  // Handle YouTube connection status
  React.useEffect(() => {
    const handleConnectionStatus = async () => {
      if (sessionStorage.getItem("ytConnectInitiated") && ytConnected) {
        toast.success("Successfully connected to YouTube!");
        sessionStorage.removeItem("ytConnectInitiated");
      }
    };

    handleConnectionStatus();
  }, [ytConnected]);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
            Your Posting Queue
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            Your content published while you sleep
          </p>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value: "scheduled" | "past") => setActiveTab(value)}
          className="w-full"
        >
          <TabsList className="mb-6 md:mb-8 bg-transparent gap-2 flex-col sm:flex-row w-full sm:w-auto">
            <TabsTrigger
              value="scheduled"
              className={`w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm font-medium transition-colors data-[state=active]:bg-storiq-purple data-[state=active]:text-white text-white/60 hover:text-white hover:bg-storiq-card-bg`}
            >
              Scheduled
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className={`w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm font-medium transition-colors data-[state=active]:bg-storiq-purple data-[state=active]:text-white text-white/60 hover:text-white hover:bg-storiq-card-bg`}
            >
              Past Publications
            </TabsTrigger>
          </TabsList>

          {/* Social Connect Banner */}
          <div className="bg-storiq-card-bg border border-storiq-border rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="text-xl md:text-2xl">🔗</div>
              <div>
                <h3 className="text-white font-medium text-sm md:text-base">
                  {ytConnected
                    ? "Connected to YouTube"
                    : "Connect Social Accounts to enable scheduling"}
                </h3>
                <p className="text-white/60 text-xs md:text-sm">
                  {ytConnected
                    ? "Ready to publish and schedule videos"
                    : "To use scheduling feature, connect social accounts"}
                </p>
              </div>
            </div>
            <Button
              className={`w-full sm:w-auto ${
                ytConnected
                  ? "bg-storiq-purple hover:bg-storiq-purple/80 border-2 border-storiq-purple"
                  : "bg-storiq-purple hover:bg-storiq-purple/80 border-2 border-storiq-purple"
              } text-white rounded-lg text-sm`}
              disabled={ytLoading}
              onClick={() => (!ytConnected ? handleYouTubeOAuth() : null)}
            >
              {ytLoading
                ? "Connecting..."
                : ytConnected
                ? "✓ Connected"
                : "Connect Now"}
            </Button>
          </div>

          {/* Queue Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                Your Posting Queue
              </h2>
              <p className="text-white/60 text-sm md:text-base">
                Your content published while you sleep
              </p>
            </div>
          </div>

          {/* Content based on active tab */}
          <TabsContent value="scheduled" className="mt-6">
            {/* Split videos and images by file extension */}
            {(() => {
              function isVideoFile(url: string) {
                const cleanUrl = url.split("?")[0];
                return /\.(mp4|mov|webm|avi|mkv)$/i.test(cleanUrl);
              }
              function isImageFile(url: string) {
                const cleanUrl = url.split("?")[0];
                return /\.(jpg|jpeg|png|gif|webp)$/i.test(cleanUrl);
              }

              // Filter videos for current view
              const allVideoItems = videos.filter((v) => isVideoFile(v.url));
              // Only show scheduled (not published) videos in this tab
              const currentVideoItems = allVideoItems.filter((v) => {
                const published = !!v.publishedToYouTube;
                const scheduledCompleted =
                  !!v.scheduledTime && v.scheduledStatus === "completed";
                // Show if NOT published and NOT completed
                return !published && !scheduledCompleted;
              });

              const imageItems = images;
              return (
                <>
                  {/* Videos Section */}
                  <div className="bg-storiq-card-bg border border-storiq-border rounded-xl md:rounded-2xl p-4 md:p-8 mb-8 md:mb-12">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-white">
                          Your Videos
                        </h2>
                        <p className="text-slate-400 text-sm md:text-base mt-0.5 md:mt-1">
                          Select and customize videos to publish across
                          platforms
                        </p>
                      </div>
                      <div className="flex sm:hidden items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-600/50 self-end">
                        <span className="text-xs text-slate-400">Total:</span>
                        <span className="text-base font-bold text-white">
                          {videoItems.length}
                        </span>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-600/50">
                        <span className="text-sm text-slate-400">Total:</span>
                        <span className="text-lg font-bold text-white">
                          {videoItems.length}
                        </span>
                      </div>
                    </div>

                    {loading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="bg-storiq-card-bg border border-storiq-border rounded-2xl overflow-hidden animate-pulse"
                          >
                            {/* Video Thumbnail Skeleton */}
                            <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 relative">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>

                            {/* Content Skeleton */}
                            <div className="p-4 space-y-4">
                              {/* Title */}
                              <Skeleton className="h-6 w-3/4 bg-gray-700/50" />

                              {/* Platform Selection */}
                              <div className="flex gap-2">
                                <Skeleton className="h-10 w-24 bg-gray-700/50 rounded-lg" />
                                <Skeleton className="h-10 w-24 bg-gray-700/50 rounded-lg" />
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                <Skeleton className="h-10 flex-1 bg-gray-700/50 rounded-lg" />
                                <Skeleton className="h-10 flex-1 bg-gray-700/50 rounded-lg" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : error ? (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-6 py-4 rounded-2xl flex items-center gap-3">
                        <svg
                          className="w-5 h-5 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{error}</span>
                      </div>
                    ) : currentVideoItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed border-slate-600/50 rounded-2xl bg-slate-800/20">
                        <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mx-auto">
                          <svg
                            className="w-10 h-10 text-slate-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          No videos yet
                        </h3>
                        <p className="text-slate-400 mb-6 max-w-md mx-auto">
                          Create your first video to start publishing across
                          social platforms
                        </p>
                        <Button
                          className="bg-storiq-purple hover:bg-storiq-purple/80 text-white font-medium px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={() => navigate("/dashboard/create-video")}
                        >
                          <span className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                            Create Your First Video
                          </span>
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                          {currentVideoItems
                            .slice(
                              (currentVideoPage - 1) * itemsPerPage,
                              currentVideoPage * itemsPerPage
                            )
                            .map((video) => (
                              <Suspense
                                fallback={<Skeleton className="h-96 w-full" />}
                              >
                                <Suspense fallback={<div>Loading...</div>}>
                                  <LazyVideoPublishCard
                                    key={video.id || video.s3Key}
                                    video={video}
                                    ytConnected={ytConnected}
                                    igConnected={igConnected}
                                    platformSelections={platformSelections}
                                    handlePlatformChange={handlePlatformChange}
                                    handlePost={handlePost}
                                    postingId={postingId}
                                    schedulingLoading={schedulingLoading}
                                    editedTitles={editedTitles}
                                    setEditedTitles={setEditedTitles}
                                  />
                                </Suspense>
                              </Suspense>
                            ))}
                        </div>
                        {currentVideoItems.length > itemsPerPage && (
                          <div className="flex justify-center items-center gap-2 mt-8">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setCurrentVideoPage((prev) =>
                                  Math.max(prev - 1, 1)
                                )
                              }
                              disabled={currentVideoPage === 1}
                              className="bg-storiq-card-bg border-storiq-border text-white hover:bg-storiq-purple hover:border-storiq-purple disabled:opacity-50"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-white/60 text-sm">
                              Page {currentVideoPage} of{" "}
                              {Math.ceil(
                                currentVideoItems.length / itemsPerPage
                              )}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setCurrentVideoPage((prev) =>
                                  Math.min(
                                    prev + 1,
                                    Math.ceil(
                                      currentVideoItems.length / itemsPerPage
                                    )
                                  )
                                )
                              }
                              disabled={
                                currentVideoPage ===
                                Math.ceil(
                                  currentVideoItems.length / itemsPerPage
                                )
                              }
                              className="bg-storiq-card-bg border-storiq-border text-white hover:bg-storiq-purple hover:border-storiq-purple disabled:opacity-50"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {/* Images Section */}
                  <div className="bg-storiq-card-bg border border-storiq-border rounded-xl md:rounded-2xl p-4 md:p-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-white">
                          Your Images
                        </h2>
                        <p className="text-slate-400 text-sm md:text-base mt-0.5 md:mt-1">
                          Select and customize images to publish across
                          platforms
                        </p>
                      </div>
                      <div className="flex sm:hidden items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-600/50 self-end">
                        <span className="text-xs text-slate-400">Total:</span>
                        <span className="text-base font-bold text-white">
                          {imageItems.length}
                        </span>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-600/50">
                        <span className="text-sm text-slate-400">Total:</span>
                        <span className="text-lg font-bold text-white">
                          {imageItems.length}
                        </span>
                      </div>
                    </div>

                    {imagesLoading ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="aspect-square rounded-xl overflow-hidden border border-storiq-border animate-pulse"
                          >
                            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800" />
                          </div>
                        ))}
                      </div>
                    ) : imagesError ? (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-6 py-4 rounded-2xl flex items-center gap-3">
                        <svg
                          className="w-5 h-5 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{imagesError}</span>
                      </div>
                    ) : imageItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed border-slate-600/50 rounded-2xl bg-slate-800/20">
                        <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mx-auto">
                          <svg
                            className="w-10 h-10 text-slate-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          No images yet
                        </h3>
                        <p className="text-slate-400 mb-6 max-w-md mx-auto">
                          Create your first image to start publishing across
                          social platforms
                        </p>
                        <Button
                          className="bg-storiq-purple hover:bg-storiq-purple/80 text-white font-medium px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={() => navigate("/dashboard/create-image")}
                        >
                          <span className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                            Create Your First Image
                          </span>
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                          {imageItems
                            .slice(
                              (currentImagePage - 1) * itemsPerPage,
                              currentImagePage * itemsPerPage
                            )
                            .map((image) => (
                              <Suspense
                                key={image.id || image.s3Key}
                                fallback={<Skeleton className="h-96 w-full" />}
                              >
                                <LazyImagePublishCard
                                  image={image}
                                  handlePost={handlePost}
                                  editedTitles={editedTitles}
                                  onPreview={handleImagePreview}
                                />
                              </Suspense>
                            ))}
                        </div>
                        {imageItems.length > itemsPerPage && (
                          <div className="flex justify-center items-center gap-2 mt-8">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setCurrentImagePage((prev) =>
                                  Math.max(prev - 1, 1)
                                )
                              }
                              disabled={currentImagePage === 1}
                              className="bg-storiq-card-bg border-storiq-border text-white hover:bg-storiq-purple hover:border-storiq-purple disabled:opacity-50"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-white/60 text-sm">
                              Page {currentImagePage} of{" "}
                              {Math.ceil(imageItems.length / itemsPerPage)}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setCurrentImagePage((prev) =>
                                  Math.min(
                                    prev + 1,
                                    Math.ceil(imageItems.length / itemsPerPage)
                                  )
                                )
                              }
                              disabled={
                                currentImagePage ===
                                Math.ceil(imageItems.length / itemsPerPage)
                              }
                              className="bg-storiq-card-bg border-storiq-border text-white hover:bg-storiq-purple hover:border-storiq-purple disabled:opacity-50"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              );
            })()}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            {/* Past Publications Section */}
            <div className="bg-storiq-card-bg border border-storiq-border rounded-xl md:rounded-2xl p-4 md:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">
                      Published Content
                    </h2>
                    <p className="text-slate-400 text-sm md:text-base mt-0.5 md:mt-1">
                      Your successfully published videos and scheduling history
                    </p>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-storiq-card-bg/50 border border-storiq-border rounded-xl p-4 md:p-6 animate-pulse"
                    >
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Thumbnail Skeleton */}
                        <div className="w-full md:w-48 aspect-video md:aspect-square rounded-lg bg-gradient-to-br from-gray-700 to-gray-800" />

                        {/* Content Skeleton */}
                        <div className="flex-1 space-y-3">
                          <Skeleton className="h-6 w-3/4 bg-gray-700/50" />
                          <Skeleton className="h-4 w-1/2 bg-gray-700/30" />
                          <div className="flex gap-2 mt-4">
                            <Skeleton className="h-8 w-20 bg-gray-700/50 rounded-full" />
                            <Skeleton className="h-8 w-24 bg-gray-700/50 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-6 py-4 rounded-2xl flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              ) : (
                (() => {
                  function isVideoFile(url: string) {
                    const cleanUrl = url.split("?")[0];
                    return /\.(mp4|mov|webm|avi|mkv)$/i.test(cleanUrl);
                  }
                  const allVideoItems = videos.filter((v) =>
                    isVideoFile(v.url)
                  );
                  // Only show published/completed videos in this tab
                  // Defensive: treat missing fields as false
                  const publishedVideoItems = allVideoItems.filter(
                    (v) =>
                      !!v.publishedToYouTube ||
                      (!!v.scheduledTime && v.scheduledStatus === "completed")
                  );
                  return publishedVideoItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed border-slate-600/50 rounded-2xl bg-slate-800/20">
                      <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mx-auto">
                        <svg
                          className="w-10 h-10 text-slate-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        No Published Content
                      </h3>
                      <p className="text-slate-400 mb-6 max-w-md mx-auto">
                        Your published content will appear here after successful
                        publication.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                        {publishedVideoItems
                          .slice(
                            (currentPastVideoPage - 1) * itemsPerPage,
                            currentPastVideoPage * itemsPerPage
                          )
                          .map((video) => (
                            <Suspense
                              fallback={<Skeleton className="h-96 w-full" />}
                            >
                              <Suspense fallback={<div>Loading...</div>}>
                                <LazyVideoPublishCard
                                  key={video.id || video.s3Key}
                                  video={video}
                                  ytConnected={ytConnected}
                                  igConnected={igConnected}
                                  platformSelections={platformSelections}
                                  handlePlatformChange={handlePlatformChange}
                                  handlePost={handlePost}
                                  postingId={postingId}
                                  schedulingLoading={schedulingLoading}
                                  editedTitles={editedTitles}
                                  setEditedTitles={setEditedTitles}
                                />
                              </Suspense>
                            </Suspense>
                          ))}
                      </div>
                      {publishedVideoItems.length > itemsPerPage && (
                        <div className="flex justify-center items-center gap-2 mt-8">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPastVideoPage((prev) =>
                                Math.max(prev - 1, 1)
                              )
                            }
                            disabled={currentPastVideoPage === 1}
                            className="bg-storiq-card-bg border-storiq-border text-white hover:bg-storiq-purple hover:border-storiq-purple disabled:opacity-50"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <span className="text-white/60 text-sm">
                            Page {currentPastVideoPage} of{" "}
                            {Math.ceil(
                              publishedVideoItems.length / itemsPerPage
                            )}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPastVideoPage((prev) =>
                                Math.min(
                                  prev + 1,
                                  Math.ceil(
                                    publishedVideoItems.length / itemsPerPage
                                  )
                                )
                              )
                            }
                            disabled={
                              currentPastVideoPage ===
                              Math.ceil(
                                publishedVideoItems.length / itemsPerPage
                              )
                            }
                            className="bg-storiq-card-bg border-storiq-border text-white hover:bg-storiq-purple hover:border-storiq-purple disabled:opacity-50"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  );
                })()
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Image Preview Modal */}
        <Suspense fallback={null}>
          <ImagePreviewModal
            open={imagePreviewOpen}
            src={selectedImage.src}
            title={selectedImage.title}
            imageId={selectedImage.id}
            prompt={selectedImage.prompt}
            onClose={handleCloseImagePreview}
            onDelete={handleDeleteImage}
            fallbackImages={images}
          />
        </Suspense>
      </div>
    </DashboardLayout>
  );
};

export default Publish;
