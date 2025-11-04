import React, { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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

interface ImagePublishCardProps {
  image: any;
  handlePost: (image: any) => void;
  editedTitles: { [id: string]: string };
}

const ImagePublishCard: React.FC<ImagePublishCardProps> = ({
  image,
  handlePost,
  editedTitles,
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl overflow-hidden border border-slate-600/50 transition-all duration-300 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 backdrop-blur-sm">
      <Suspense fallback={<Skeleton className="h-80 w-full" />}>
        <Dialog>
          <div className="relative aspect-video bg-slate-900 overflow-hidden">
            {/* Skeleton loader for image */}
            {!imgLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}
            <img
              src={image.url}
              alt={image.title || "Untitled Image"}
              className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
            <Suspense fallback={<div>Loading...</div>}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100"
                >
                  Preview
                </Button>
              </DialogTrigger>
            </Suspense>
          </div>
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <DialogContent className="max-w-4xl w-full bg-slate-900 border-slate-700">
              <DialogTitle className="text-white text-xl font-bold">
                Image Preview
              </DialogTitle>
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt={image.title || "Untitled Image"}
                  className="w-full h-full object-contain"
                />
              </div>
            </DialogContent>
          </Suspense>
        </Dialog>
      </Suspense>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-white font-bold text-lg mb-2 truncate group-hover:text-purple-200 transition-colors">
            {image.title || "Untitled Image"}
          </h3>
        </div>
        <Button
          className="w-full font-medium bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          onClick={() =>
            handlePost({
              ...image,
              editedTitles,
            })
          }
        >
          <span className="flex items-center justify-center gap-2">
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
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
            Publish
          </span>
        </Button>
      </div>
    </div>
  );
};

export default ImagePublishCard;
