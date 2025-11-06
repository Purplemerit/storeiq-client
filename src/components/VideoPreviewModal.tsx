import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Wand2, X, Play } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

const Dialog = React.lazy(() =>
  import("@/components/ui/dialog").then((m) => ({ default: m.Dialog }))
);
const DialogContent = React.lazy(() =>
  import("@/components/ui/dialog").then((m) => ({ default: m.DialogContent }))
);

const AdvancedVideoPlayer = React.lazy(
  () => import("@/components/AdvancedVideoPlayer")
);

interface VideoPreviewModalProps {
  open: boolean;
  src: string | null;
  title: string;
  videoId: string | null;
  prompt: string | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onDelete: (videoId: string | null) => void;
  onLoadedData: () => void;
  onError: () => void;
}

const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({
  open,
  src,
  title,
  videoId,
  prompt,
  loading,
  error,
  onClose,
  onDelete,
  onLoadedData,
  onError,
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
    const maxLen = 50;
    if (cleanTitle.length > maxLen) {
      cleanTitle = cleanTitle.slice(0, maxLen) + "...";
    }

    return cleanTitle;
  };

  const displayTitle = getCleanTitle(title);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <Suspense fallback={<div>Loading...</div>}>
          <DialogContent
            className="max-w-5xl w-[95vw] max-h-[95vh] p-0 bg-transparent border-0 shadow-none overflow-hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Main Glass Container - iOS-like */}
            <div className="flex flex-col max-h-[95vh] bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Compact Header */}
              <div className="px-4 md:px-6 py-3 md:py-4 flex-shrink-0 bg-white/5 backdrop-blur-md border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                    <div className="w-1 h-5 md:h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full flex-shrink-0"></div>
                    <h2 className="text-base md:text-lg font-semibold text-white flex items-center gap-2 truncate">
                      <Play className="h-3.5 w-3.5 md:h-4 md:w-4 text-purple-400 flex-shrink-0" />
                      <span className="truncate">{displayTitle}</span>
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1.5 md:p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 hover:border-white/20 transition-all duration-200 flex-shrink-0"
                    aria-label="Close modal"
                  >
                    <X className="h-3.5 w-3.5 md:h-4 md:w-4 text-white/80" />
                  </button>
                </div>
              </div>

              {/* Video Player Container */}
              <div className="flex-1 min-h-0 p-4 md:p-6 pb-6 md:pb-8 flex items-center justify-center bg-gradient-to-b from-black/10 to-black/20 overflow-hidden">
                <div className="w-full max-w-3xl flex items-center">
                  <AspectRatio
                    ratio={16 / 9}
                    className="bg-black rounded-xl overflow-visible w-full"
                  >
                    {/* Overlay: Loading spinner */}
                    {loading && (
                      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 transition-opacity animate-fade-in">
                        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <span className="text-white text-lg font-medium">
                          Loading video...
                        </span>
                      </div>
                    )}

                    {/* Overlay: Error */}
                    {error && (
                      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 transition-opacity animate-fade-in p-6">
                        <div className="bg-red-500/20 rounded-full p-4 mb-4">
                          <Play className="h-8 w-8 text-red-400" />
                        </div>
                        <span className="text-red-400 text-lg font-semibold mb-2">
                          Failed to load video
                        </span>
                        <span className="text-white/70 text-center text-sm mb-6">
                          {error}
                        </span>
                        <Button
                          variant="outline"
                          onClick={onClose}
                          className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                        >
                          Close Preview
                        </Button>
                      </div>
                    )}

                    {/* Video Player */}
                    {src && (
                      <Suspense
                        fallback={<Skeleton className="w-full h-full" />}
                      >
                        <AdvancedVideoPlayer
                          src={src}
                          className="w-full h-full"
                          aria-label="Video preview"
                          onLoadedData={onLoadedData}
                          onError={onError}
                        />
                      </Suspense>
                    )}
                  </AspectRatio>
                </div>
              </div>

              {/* Compact Footer */}
              <div className="flex-shrink-0 bg-white/5 backdrop-blur-md border-t border-white/10 max-h-[30vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20">
                {/* Prompt Section - Only if exists */}
                {prompt && (
                  <div className="px-4 md:px-6 pt-3 md:pt-4 pb-2 md:pb-3 border-b border-white/5">
                    <div className="flex items-start gap-3">
                      <Wand2 className="h-4 w-4 text-purple-300 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-purple-300/80 font-medium uppercase tracking-wider mb-1">
                          AI Prompt
                        </p>
                        <p className="text-sm text-white/80 leading-relaxed line-clamp-3">
                          {prompt}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons - Compact */}
                <div className="px-4 md:px-6 py-3 md:py-4 flex justify-between items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-200 px-4 py-2 h-auto text-sm rounded-xl backdrop-blur-sm"
                  >
                    Close
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => onDelete(videoId)}
                    className="gap-2 bg-red-500/80 hover:bg-red-500 border-red-400/20 px-4 py-2 h-auto text-sm rounded-xl backdrop-blur-sm"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Video
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Suspense>
      </Dialog>
    </Suspense>
  );
};

export default VideoPreviewModal;
