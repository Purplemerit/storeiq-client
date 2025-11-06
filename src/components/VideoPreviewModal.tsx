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
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <Suspense fallback={<div>Loading...</div>}>
          <DialogContent
            className="max-w-5xl w-[95vw] p-0 bg-transparent border-0 shadow-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Main Glass Container */}
            <div className="flex flex-col h-full bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/15 overflow-hidden">
              {/* Compact Header */}
              <div className="px-6 py-4 flex-shrink-0 bg-white/5 backdrop-blur-md border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></div>
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Play className="h-4 w-4 text-purple-400" />
                      {title}
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 hover:border-white/20 transition-all duration-200"
                    aria-label="Close modal"
                  >
                    <X className="h-4 w-4 text-white/80" />
                  </button>
                </div>
              </div>

              {/* Video Player Container */}
              <div className="flex-1 p-6 flex items-center justify-center bg-black/20">
                <div className="w-full max-w-4xl">
                  <AspectRatio
                    ratio={16 / 9}
                    className="bg-black rounded-xl overflow-hidden"
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
              <div className="flex-shrink-0 bg-white/5 backdrop-blur-md border-t border-white/10">
                {/* Prompt Section - Only if exists */}
                {prompt && (
                  <div className="px-6 pt-4 pb-3 border-b border-white/5">
                    <div className="flex items-start gap-3">
                      <Wand2 className="h-4 w-4 text-purple-300 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-purple-300/80 font-medium uppercase tracking-wider mb-1">
                          AI Prompt
                        </p>
                        <p className="text-sm text-white/80 leading-relaxed line-clamp-2">
                          {prompt}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons - Compact */}
                <div className="px-6 py-4 flex justify-between items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-200 px-4 py-2 h-auto text-sm"
                  >
                    Close
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => onDelete(videoId)}
                    className="gap-2 bg-red-500/90 hover:bg-red-500 border-red-400/30 px-4 py-2 h-auto text-sm"
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
