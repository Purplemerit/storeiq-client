import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { extractMeaningfulFilename } from "@/lib/extractFilename";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Edit3,
  Trash2,
  Clock,
  Calendar,
  Download,
  FileVideo,
  Eye,
  Film,
  Youtube,
  Wand2,
} from "lucide-react";
const ConfirmDialog = React.lazy(() =>
  import("@/components/confirm-dialog").then((m) => ({
    default: m.ConfirmDialog,
  }))
);

const ImagePreviewModal = React.lazy(
  () => import("@/components/ImagePreviewModal")
);

const VideoPreviewModal = React.lazy(
  () => import("@/components/VideoPreviewModal")
);

interface Video {
  id?: string;
  url: string;
  title?: string;
  thumbnail?: string;
  duration?: number;
  subtitle?: string;
  description?: string;
  prompt?: string; // AI generation prompt
  provider?: string; // AI provider (e.g., 'gemini-imagen-3', 'gemini-veo-3')
  createdAt?: string;
  s3Key?: string;
  publishCount?: number;
  publishedToYouTube?: boolean;
  isEdited?: boolean;
}

const Videos = () => {
  const navigate = useNavigate();
  // State
  const [videos, setVideos] = useState<Video[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatedThumbs, setGeneratedThumbs] = useState<{
    [key: string]: string;
  }>({});
  const [modal, setModal] = useState<{
    open: boolean;
    src: string | null;
    title: string;
    videoId: string | null;
    prompt: string | null;
    loading: boolean;
    error: string | null;
  }>({
    open: false,
    src: null,
    title: "",
    videoId: null,
    prompt: null,
    loading: true,
    error: null,
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteVideoId, setDeleteVideoId] = useState<string | null>(null);

  // No longer needed: editedVideoUrls state removed

  // Fetch videos and replace their URLs with signed URLs
  useEffect(() => {
    const fetchVideosAndImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const fetchOptions: RequestInit = { credentials: "include" };
        // Fetch videos (metadata)
        const res = await fetch(`${API_BASE_URL}/api/videos`, fetchOptions);
        if (res.status === 401) {
          throw new Error("Unauthorized (401): Please log in.");
        }
        if (!res.ok) throw new Error("Failed to fetch videos");
        let data = await res.json();
        if (!Array.isArray(data)) data = [];
        // For each video, fetch a signed URL if s3Key exists
        const videosWithSignedUrls = await Promise.all(
          data.map(async (video: any) => {
            if (video.s3Key) {
              try {
                const signedUrlRes = await fetch(
                  `${API_BASE_URL}/api/signed-url?s3Key=${encodeURIComponent(
                    video.s3Key
                  )}`,
                  fetchOptions
                );
                if (signedUrlRes.ok) {
                  const { url: signedUrl } = await signedUrlRes.json();
                  return { ...video, url: signedUrl };
                }
              } catch {}
            }
            return video;
          })
        );
        setVideos(videosWithSignedUrls);
        // removed debug log
        // Fetch images
        const imgRes = await fetch(`${API_BASE_URL}/api/images`, fetchOptions);
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          setImages(Array.isArray(imgData) ? imgData : []);
        } else {
          setImages([]);
        }
      } catch (err: unknown) {
        let message = "Unknown error";
        if (
          err &&
          typeof err === "object" &&
          "message" in err &&
          typeof (err as any).message === "string"
        ) {
          message = (err as any).message;
        } else if (typeof err === "string") {
          message = err;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchVideosAndImages();
  }, []);

  // Generate thumbnails
  useEffect(() => {
    const generateThumbnails = async () => {
      const updates: { [key: string]: string } = {};
      await Promise.all(
        videos.map(async (video: Video) => {
          if (
            !video.thumbnail &&
            video.url &&
            !generatedThumbs[video.id || video.url]
          ) {
            try {
              const thumb = await extractVideoFrame(video.url);
              if (thumb) {
                updates[video.id || video.url] = thumb;
              }
            } catch {}
          }
        })
      );
      if (Object.keys(updates).length > 0) {
        setGeneratedThumbs((prev) => ({ ...prev, ...updates }));
      }
    };
    if (videos.length > 0) generateThumbnails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos]);

  // Extract frame for thumbnail
  const extractVideoFrame = (url: string): Promise<string | null> =>
    new Promise((resolve) => {
      const video = document.createElement("video");
      video.src = url;
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.playsInline = true;
      video.currentTime = 1;
      video.addEventListener("loadeddata", () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/png"));
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      });
      video.addEventListener("error", () => resolve(null));
    });

  // Modal handlers
  const openModal = (video: Video) => {
    // Extract meaningful filename for modal title
    const modalTitle = video.title || extractMeaningfulFilename(video.s3Key);

    setModal({
      open: true,
      src: video.url || "",
      title: modalTitle,
      videoId: video.id || null,
      prompt: video.prompt || null,
      loading: true,
      error: null,
    });
  };
  const closeModal = () => {
    setModal({
      open: false,
      src: null,
      title: "",
      videoId: null,
      prompt: null,
      loading: true,
      error: null,
    });
  };

  // Delete handler
  const handleDelete = async () => {
    // removed debug log
    if (!deleteVideoId) {
      // removed debug log
      return;
    }
    try {
      setLoading(true);
      setError(null);
      // Find the video object to get the s3Key
      const videoToDelete = videos.find((v) => v.id === deleteVideoId);
      if (!videoToDelete || !videoToDelete.s3Key) {
        // removed debug log
        throw new Error("Video s3Key not found");
      }
      // removed debug log
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${API_BASE_URL}/api/delete-video`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ s3Key: videoToDelete.s3Key }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete video");
      setVideos((prev) => prev.filter((v) => v.id !== deleteVideoId));
      setDeleteVideoId(null);
      setDeleteConfirmOpen(false);
      closeModal();
    } catch (err: unknown) {
      let message = "Unknown error";
      if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof (err as any).message === "string"
      ) {
        message = (err as any).message;
      } else if (typeof err === "string") {
        message = err;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Keyboard accessibility for modal (ESC to close)
  useEffect(() => {
    if (!modal.open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modal.open]);

  // Format duration
  const formatDuration = (seconds: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper to open delete dialog safely
  function handleOpenDeleteDialog(videoId: string | null) {
    // removed debug log
    if (videoId) {
      setDeleteVideoId(videoId);
      setDeleteConfirmOpen(true);
    }
  }

  // Helper: check if file is a video (not image)
  function isVideoFile(url: string) {
    // Remove query params before checking extension
    const cleanUrl = url.split("?")[0];
    return /\.(mp4|mov|webm|avi|mkv)$/i.test(cleanUrl);
  }
  function isImageFile(url: string) {
    return /\.(png|jpg|jpeg|webp)$/i.test(url);
  }

  // Filter out images from videos
  const onlyVideos = videos.filter((video: any) => isVideoFile(video.url));
  // removed debug log
  const onlyImages = images;
  const originalVideos = onlyVideos.filter((video: any) => !video.isEdited);
  // removed debug log
  const editedVideos = onlyVideos.filter((video: any) => video.isEdited);
  // removed debug log

  // Image modal state
  const [imageModal, setImageModal] = useState<{
    open: boolean;
    src: string | null;
    title: string;
    imageId: string | null;
    prompt: string | null; // Add prompt field
    loading: boolean;
    error: string | null;
  }>({
    open: false,
    src: null,
    title: "",
    imageId: null,
    prompt: null,
    loading: true,
    error: null,
  });
  const [deleteImageConfirmOpen, setDeleteImageConfirmOpen] = useState(false);
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null);

  // Modal handlers for images
  const openImageModal = (img: any) => {
    setImageModal({
      open: true,
      src: img.s3Url || img.url || "",
      title: img.title || img.s3Key || "Untitled Image",
      imageId: img.id || img.s3Key || null,
      prompt: img.prompt || img.description || null, // Get prompt from image data
      loading: false,
      error: null,
    });
  };
  const closeImageModal = () => {
    setImageModal({
      open: false,
      src: null,
      title: "",
      imageId: null,
      prompt: null,
      loading: false,
      error: null,
    });
  };

  // Delete handler for images
  const handleDeleteImage = async () => {
    if (!deleteImageId) return;
    try {
      setLoading(true);
      setError(null);
      // Find the image object to get the s3Key
      const imageToDelete = onlyImages.find(
        (v) => (v.id || v.s3Key) === deleteImageId
      );
      if (!imageToDelete || !imageToDelete.s3Key) {
        throw new Error("Image s3Key not found");
      }
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${API_BASE_URL}/api/delete-video`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ s3Key: imageToDelete.s3Key }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete image");
      setVideos((prev) =>
        prev.filter((v) => (v.id || v.s3Key) !== deleteImageId)
      );
      setDeleteImageId(null);
      setDeleteImageConfirmOpen(false);
      closeImageModal();
    } catch (err: unknown) {
      let message = "Unknown error";
      if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof (err as any).message === "string"
      ) {
        message = (err as any).message;
      } else if (typeof err === "string") {
        message = err;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to open delete dialog safely for images
  function handleOpenDeleteImageDialog(imageId: string | null) {
    if (imageId) {
      setDeleteImageId(imageId);
      setDeleteImageConfirmOpen(true);
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Collections
              </h1>
            </div>
          </div>

          {/* Removed stats cards above video grid */}
        </div>

        {/* Preview Modal */}
        <Suspense fallback={<div>Loading...</div>}>
          <VideoPreviewModal
            open={modal.open}
            src={modal.src}
            title={modal.title}
            videoId={modal.videoId}
            prompt={modal.prompt}
            loading={modal.loading}
            error={modal.error}
            onClose={closeModal}
            onDelete={handleOpenDeleteDialog}
            onLoadedData={() => {
              setModal((prev) => ({
                ...prev,
                loading: false,
                error: null,
              }));
            }}
            onError={() => {
              setModal((prev) => ({
                ...prev,
                loading: false,
                error:
                  "This video could not be loaded. Please try again later.",
              }));
            }}
          />
        </Suspense>

        {/* Delete Confirmation Dialog */}
        {deleteVideoId && (
          <Suspense fallback={<div>Loading...</div>}>
            <ConfirmDialog
              open={deleteConfirmOpen}
              title="Delete Video"
              description="Are you sure you want to delete this video? This action cannot be undone."
              confirmLabel="Delete"
              cancelLabel="Cancel"
              onConfirm={handleDelete}
              onCancel={() => {
                setDeleteConfirmOpen(false);
                setDeleteVideoId(null);
              }}
              loading={loading}
              disableConfirm={loading}
            />
          </Suspense>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="space-y-12">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <Skeleton className="h-8 w-48 mb-2 bg-gray-700/50" />
                <Skeleton className="h-4 w-64 bg-gray-700/30" />
              </div>
            </div>

            {/* Videos Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="relative border border-storiq-border rounded-2xl overflow-hidden w-full group animate-pulse"
                >
                  {/* Thumbnail Skeleton */}
                  <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  {/* Content Skeleton */}
                  <div className="relative z-10 p-6">
                    <Skeleton className="h-6 w-3/4 mb-3 bg-gray-700/50" />
                    <div className="flex items-center gap-4 mb-4">
                      <Skeleton className="h-4 w-20 bg-gray-700/30" />
                      <Skeleton className="h-4 w-24 bg-gray-700/30" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-10 flex-1 bg-gray-700/50 rounded-lg" />
                      <Skeleton className="h-10 flex-1 bg-gray-700/50 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Images Section Skeleton */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <Skeleton className="h-8 w-48 mb-2 bg-gray-700/50" />
                  <Skeleton className="h-4 w-64 bg-gray-700/30" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-xl overflow-hidden border border-storiq-border animate-pulse"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-800/30 rounded-2xl border border-gray-700 backdrop-blur-sm">
            <div className="rounded-full bg-red-500/20 p-5 mb-5">
              <FileVideo className="h-12 w-12 text-red-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">
              Unable to load videos
            </h3>
            <p className="text-white/50 mb-8 max-w-md text-lg">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg"
            >
              Try Again
            </Button>
          </div>
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-800/30 rounded-2xl border border-gray-700 backdrop-blur-sm">
            <div className="rounded-full bg-gray-700/50 p-6 mb-6 border border-gray-600">
              <Film className="h-16 w-16 text-white/30" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">
              No videos yet
            </h3>
            <p className="text-white/40 mb-8 text-lg max-w-sm">
              Start creating amazing videos to see them appear here
            </p>
            <Button
              onClick={() => navigate("/dashboard/create-video")}
              className="bg-storiq-purple hover:bg-storiq-purple/80 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200"
            >
              Create Your First Video
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Original Videos Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    Your Videos
                  </h2>
                  <p className="text-white/60">
                    Here are all the videos that you created.
                  </p>
                </div>
              </div>

              {originalVideos.length === 0 ? (
                <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-700">
                  <FileVideo className="h-12 w-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40 text-lg">
                    No original videos found
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {originalVideos.map((video: Video, index) => (
                    <VideoCard
                      key={video.id || index}
                      video={video}
                      generatedThumbs={generatedThumbs}
                      onPreview={() => openModal(video)}
                      onEdit={() => {
                        if (video.s3Key) {
                          navigate(`/dashboard/video-editor/${video.s3Key}`, {
                            state: { url: video.url },
                          });
                        } else if (video.id) {
                          navigate(`/dashboard/video-editor/${video.id}`, {
                            state: { url: video.url },
                          });
                        }
                      }}
                      onDelete={() => handleOpenDeleteDialog(video.id)}
                      formatDuration={formatDuration}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Edited Videos Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    Edited Videos
                  </h2>
                  <p className="text-white/60">
                    Here are all the edited videos.
                  </p>
                </div>
              </div>

              {editedVideos.length === 0 ? (
                <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-700">
                  <Edit3 className="h-12 w-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40 text-lg">
                    No edited videos found
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {editedVideos.map((video: Video, index) => (
                    <VideoCard
                      key={video.id || index}
                      video={video}
                      generatedThumbs={generatedThumbs}
                      onPreview={() => openModal(video)}
                      onEdit={() => {
                        if (video.s3Key) {
                          navigate(`/dashboard/video-editor/${video.s3Key}`, {
                            state: { url: video.url },
                          });
                        } else if (video.id) {
                          navigate(`/dashboard/video-editor/${video.id}`, {
                            state: { url: video.url },
                          });
                        }
                      }}
                      onDelete={() => handleOpenDeleteDialog(video.id)}
                      formatDuration={formatDuration}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Images Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    Images in Collection
                  </h2>
                </div>
              </div>
              {onlyImages.length === 0 ? (
                <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-700">
                  <img
                    src="/image.png"
                    className="h-12 w-12 mx-auto mb-4 opacity-40"
                    alt="No images"
                  />
                  <p className="text-white/40 text-lg">No images found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {onlyImages.map((img, idx) => (
                    <ImageCard
                      key={img.id || img.s3Key || idx}
                      img={img}
                      openImageModal={openImageModal}
                      handleOpenDeleteImageDialog={handleOpenDeleteImageDialog}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
      {/* Image Preview Modal */}
      <Suspense fallback={<div>Loading...</div>}>
        <ImagePreviewModal
          open={imageModal.open}
          src={imageModal.src}
          title={imageModal.title}
          imageId={imageModal.imageId}
          prompt={imageModal.prompt}
          onClose={closeImageModal}
          onDelete={handleOpenDeleteImageDialog}
          fallbackImages={onlyImages}
        />
      </Suspense>

      {/* Delete Confirmation Dialog for Images */}
      {deleteImageId && (
        <Suspense fallback={<div>Loading...</div>}>
          <ConfirmDialog
            open={deleteImageConfirmOpen}
            title="Delete Image"
            description="Are you sure you want to delete this image? This action cannot be undone."
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onConfirm={handleDeleteImage}
            onCancel={() => {
              setDeleteImageConfirmOpen(false);
              setDeleteImageId(null);
            }}
            loading={loading}
            disableConfirm={loading}
          />
        </Suspense>
      )}
    </DashboardLayout>
  );
};

// Image Card Component
interface ImageCardProps {
  img: any;
  openImageModal: (img: any) => void;
  handleOpenDeleteImageDialog: (imageId: string | null) => void;
  formatDate: (dateString: string) => string;
}

const ImageCard: React.FC<ImageCardProps> = ({
  img,
  openImageModal,
  handleOpenDeleteImageDialog,
  formatDate,
}) => {
  const [imgLoaded, setImgLoaded] = React.useState(false);

  // Helper to truncate title
  const getShortTitle = (title?: string, maxLen = 20) => {
    if (!title) return "Untitled Image";
    return title.length > maxLen ? title.slice(0, maxLen) + "..." : title;
  };

  const displayTitle = img.title || img.s3Key || "Untitled Image";

  return (
    <div
      className="relative border border-storiq-border rounded-2xl overflow-hidden hover:border-storiq-purple/50 transition-all duration-300 w-full group cursor-pointer"
      onClick={() => openImageModal(img)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {/* Skeleton loader for image */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}
        <img
          src={img.s3Url || img.url}
          alt={displayTitle}
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
            setImgLoaded(true);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 min-h-[280px] flex flex-col justify-end">
        <h3
          className="text-white text-xl font-bold mb-4 drop-shadow-lg"
          title={displayTitle}
        >
          {getShortTitle(displayTitle)}
        </h3>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="bg-black/50 backdrop-blur-sm border-storiq-border text-white hover:bg-storiq-purple hover:border-storiq-purple"
            onClick={(e) => {
              e.stopPropagation();
              openImageModal(img);
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>
    </div>
  );
};

// Video Card Component for better organization
interface VideoCardProps {
  video: Video;
  generatedThumbs: { [key: string]: string };
  onPreview: () => void;
  onEdit: () => void;
  onDelete: () => void;
  formatDuration: (seconds: number) => string;
  formatDate: (dateString: string) => string;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  generatedThumbs,
  onPreview,
  onEdit,
  onDelete,
  formatDuration,
  formatDate,
}) => {
  // Clean up the title to show only the meaningful part
  const getCleanTitle = (rawTitle: string) => {
    if (!rawTitle) return "Untitled Video";

    // Remove file extension
    let cleanTitle = rawTitle.replace(/\.(mp4|mov|webm|avi|mkv)$/i, "");

    // Remove timestamp and UUID pattern (e.g., -1762402988644-09ff3d85)
    cleanTitle = cleanTitle.replace(/-\d{13}-[a-f0-9]{8}$/i, "");

    // Replace hyphens with spaces and capitalize words
    cleanTitle = cleanTitle
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Truncate if too long
    const maxLen = 18;
    if (cleanTitle.length > maxLen) {
      cleanTitle = cleanTitle.slice(0, maxLen) + "...";
    }

    return cleanTitle;
  };

  const [imageLoaded, setImageLoaded] = React.useState(false);

  // Extract meaningful filename from s3Key if title is not available
  const rawTitle = video.title || extractMeaningfulFilename(video.s3Key);
  const displayTitle = getCleanTitle(rawTitle);

  return (
    <div className="relative border border-storiq-border rounded-2xl overflow-hidden hover:border-storiq-purple/50 transition-all duration-300 w-full max-w-xl mx-auto group">
      {/* Background Image */}
      <div className="absolute inset-0">
        {/* Skeleton loader for thumbnail */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}
        <img
          src={
            video.thumbnail
              ? video.thumbnail
              : generatedThumbs[video.id || video.url]
              ? generatedThumbs[video.id || video.url]
              : "/placeholder.svg"
          }
          alt={displayTitle}
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
            setImageLoaded(true);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 min-h-[280px] flex flex-col justify-end">
        <h3
          className="text-white text-xl font-bold mb-4 drop-shadow-lg"
          title={rawTitle}
        >
          {displayTitle}
        </h3>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="bg-black/50 backdrop-blur-sm border-storiq-border text-white hover:bg-storiq-purple hover:border-storiq-purple"
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-black/50 backdrop-blur-sm border-storiq-border text-white hover:bg-storiq-purple hover:border-storiq-purple"
            onClick={onPreview}
          >
            Preview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Videos;
