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

  // Helper to truncate title
  const getShortTitle = (title?: string, maxLen = 25) => {
    if (!title) return "Untitled Image";
    return title.length > maxLen ? title.slice(0, maxLen) + "..." : title;
  };

  const displayTitle = image.title || image.s3Key || "Untitled Image";

  return (
    <div className="relative border border-storiq-border rounded-2xl overflow-hidden hover:border-storiq-purple/50 transition-all duration-300 w-full group">
      {/* Background Image */}
      <div className="absolute inset-0">
        {/* Skeleton loader */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}
        <img
          src={image.url}
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
      <div className="relative z-10 p-6 min-h-[320px] flex flex-col justify-end">
        <h3
          className="text-white text-xl font-bold mb-4 drop-shadow-lg"
          title={displayTitle}
        >
          {getShortTitle(displayTitle)}
        </h3>
        <div className="flex space-x-3">
          <Button
            className="flex-1 bg-storiq-purple/80 hover:bg-storiq-purple text-white font-medium backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              if (onPreview) {
                onPreview(image);
              }
            }}
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
          <Button
            className="flex-1 bg-black/40 hover:bg-black/50 text-white font-medium backdrop-blur-sm border border-storiq-purple/50 hover:border-storiq-purple transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              handlePost({
                ...image,
                editedTitles,
              });
            }}
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
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              Publish
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImagePublishCard;
