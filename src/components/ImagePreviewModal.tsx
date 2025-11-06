import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Wand2, X } from "lucide-react";

const Dialog = React.lazy(() =>
  import("@/components/ui/dialog").then((m) => ({ default: m.Dialog }))
);
const DialogContent = React.lazy(() =>
  import("@/components/ui/dialog").then((m) => ({ default: m.DialogContent }))
);
const DialogHeader = React.lazy(() =>
  import("@/components/ui/dialog").then((m) => ({ default: m.DialogHeader }))
);
const DialogTitle = React.lazy(() =>
  import("@/components/ui/dialog").then((m) => ({ default: m.DialogTitle }))
);
const DialogFooter = React.lazy(() =>
  import("@/components/ui/dialog").then((m) => ({ default: m.DialogFooter }))
);

interface ImageData {
  id?: string;
  s3Key?: string;
  s3Url?: string;
  url?: string;
}

interface ImagePreviewModalProps {
  open: boolean;
  src: string | null;
  title: string;
  imageId: string | null;
  prompt: string | null;
  onClose: () => void;
  onDelete: (imageId: string | null) => void;
  fallbackImages?: ImageData[];
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  open,
  src,
  title,
  imageId,
  prompt,
  onClose,
  onDelete,
  fallbackImages = [],
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const imgObj = fallbackImages.find(
      (img) => img.id === imageId || img.s3Key === imageId
    );
    if (imgObj && imgObj.s3Url) {
      (e.target as HTMLImageElement).src = imgObj.s3Url;
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <Suspense fallback={<div>Loading...</div>}>
          <DialogContent
            className="max-w-4xl w-[95vw] p-0 bg-transparent border-0 shadow-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Main Glass Container */}
            <div className="flex flex-col h-full bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/15 overflow-hidden">
              
              {/* Compact Header */}
              <div className="px-6 py-4 flex-shrink-0 bg-white/5 backdrop-blur-md border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></div>
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
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

              {/* Image Container - Minimal Padding */}
              <div className="flex-1 p-6 flex items-center justify-center min-h-[50vh] max-h-[70vh] overflow-hidden">
                <div className="relative max-w-full max-h-full">
                  {src && (
                    <img
                      src={src}
                      alt={title}
                      className="object-contain max-h-[60vh] w-auto max-w-full rounded-lg shadow-2xl"
                      onError={handleImageError}
                    />
                  )}
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
                    onClick={() => onDelete(imageId)}
                    className="gap-2 bg-red-500/90 hover:bg-red-500 border-red-400/30 px-4 py-2 h-auto text-sm"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
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

export default ImagePreviewModal;