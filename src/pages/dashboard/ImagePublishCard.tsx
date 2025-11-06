import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface ImageData {
  id?: string;
  url: string;
  s3Key?: string;
  title?: string;
  prompt?: string;
}

interface ImagePublishCardProps {
  image: ImageData;
  handlePost: (
    image: ImageData & { editedTitles: { [id: string]: string } }
  ) => void;
  editedTitles: { [id: string]: string };
  onPreview?: (image: ImageData) => void;
}

const ImagePublishCard: React.FC<ImagePublishCardProps> = ({
  image,
  handlePost,
  editedTitles,
  onPreview,
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl overflow-hidden border border-slate-600/50 transition-all duration-300 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 backdrop-blur-sm">
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
        <Button
          size="sm"
          className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 bg-black/40 hover:bg-black/50 backdrop-blur-sm"
          onClick={() => onPreview && onPreview(image)}
        >
          <span className="flex items-center gap-2 text-white font-medium">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Preview
          </span>
        </Button>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-white font-bold text-lg mb-2 truncate group-hover:text-purple-200 transition-colors">
            {image.title || "Untitled Image"}
          </h3>
        </div>
        <Button
          className="w-full font-medium bg-storiq-purple hover:bg-storiq-purple/80 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
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
