import React, { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { extractMeaningfulFilename } from "@/lib/extractFilename";

// Lazy load ScheduleDialog
const ScheduleDialog = React.lazy(() =>
  import("@/components/schedule-dialog").then((m) => ({
    default: m.ScheduleDialog,
  }))
);

export interface Video {
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

export interface VideoPublishCardProps {
  video: Video;
  ytConnected: boolean;
  igConnected: boolean;
  platformSelections: { [videoId: string]: { yt: boolean; ig: boolean } };
  handlePlatformChange: (
    videoId: string,
    platform: "youtube" | "instagram"
  ) => void;
  handlePost: (video: Video, scheduledTime?: DateTime) => void;
  postingId: string | null;
  schedulingLoading: boolean;
  editedTitles: { [id: string]: string };
  setEditedTitles: React.Dispatch<
    React.SetStateAction<{ [id: string]: string }>
  >;
}

const VideoPublishCard: React.FC<VideoPublishCardProps> = ({
  video,
  ytConnected,
  igConnected,
  platformSelections,
  handlePlatformChange,
  handlePost,
  postingId,
  schedulingLoading,
  editedTitles,
  setEditedTitles,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const videoId = video.id || video.s3Key || "";
  const selection = platformSelections[videoId] || { yt: false, ig: false };

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
    const maxLen = 30;
    if (cleanTitle.length > maxLen) {
      cleanTitle = cleanTitle.slice(0, maxLen) + "...";
    }

    return cleanTitle;
  };

  // Extract meaningful filename from s3Key if title is not available
  const rawTitle = video.title || extractMeaningfulFilename(video.s3Key);
  const displayTitle = getCleanTitle(rawTitle);

  return (
    <div className="relative border border-storiq-border rounded-2xl overflow-hidden hover:border-storiq-purple/50 transition-all duration-300 w-full group cursor-pointer">
      {/* Background Image */}
      <div className="absolute inset-0">
        {/* Skeleton loader */}
        {!thumbnailLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={displayTitle}
            className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
              thumbnailLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setThumbnailLoaded(true)}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
              setThumbnailLoaded(true);
            }}
          />
        ) : (
          <video
            src={video.url}
            className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
              thumbnailLoaded ? "opacity-100" : "opacity-0"
            }`}
            tabIndex={-1}
            muted
            playsInline
            onLoadedData={() => setThumbnailLoaded(true)}
            onError={() => setThumbnailLoaded(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 min-h-[400px] flex flex-col justify-end">
        {/* Title input */}
        <input
          type="text"
          className="text-white text-xl font-bold mb-3 drop-shadow-lg bg-transparent border-b-2 border-storiq-purple/50 focus:outline-none focus:border-storiq-purple w-full placeholder:text-white/40"
          value={
            editedTitles[videoId] !== undefined
              ? editedTitles[videoId]
              : video.title || ""
          }
          placeholder={displayTitle}
          onChange={(e) =>
            setEditedTitles((titles) => ({
              ...titles,
              [videoId]: e.target.value,
            }))
          }
          maxLength={100}
          title={rawTitle}
        />

        {/* Metadata badges */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-white/80 text-sm bg-black/30 px-2 py-1 rounded-md backdrop-blur-sm">
            Published {video.publishCount ?? 0} time
            {(video.publishCount ?? 0) === 1 ? "" : "s"}
          </span>
          {video.scheduledTime && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm
              ${
                video.scheduledStatus === "completed"
                  ? "bg-green-500/30 text-green-200 border border-green-400/50"
                  : video.scheduledStatus === "failed"
                  ? "bg-red-500/30 text-red-200 border border-red-400/50"
                  : "bg-purple-500/30 text-purple-200 border border-purple-400/50"
              }`}
            >
              <svg
                className={`w-3.5 h-3.5`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {video.scheduledStatus === "completed" ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                ) : video.scheduledStatus === "failed" ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                )}
              </svg>
              <span>
                {video.scheduledStatus === "completed"
                  ? "Published ✓"
                  : video.scheduledStatus === "failed"
                  ? "Failed"
                  : DateTime.fromISO(video.scheduledTime).toLocaleString(
                      DateTime.DATETIME_SHORT
                    )}
              </span>
            </div>
          )}
        </div>

        {/* Platform Selection */}
        <div className="mb-3 flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={`flex-1 p-2.5 rounded-lg transition-all backdrop-blur-sm ${
                    selection.yt
                      ? "bg-storiq-purple/80 text-white border-2 border-storiq-purple shadow-lg shadow-storiq-purple/20"
                      : "bg-black/40 text-white/60 border border-white/20 hover:bg-black/50"
                  }`}
                  onClick={() => handlePlatformChange(videoId, "youtube")}
                  disabled={!ytConnected}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    <span className="font-medium">YouTube</span>
                    {ytConnected ? (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          selection.yt ? "bg-white" : "bg-green-400"
                        }`}
                      />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-red-400" />
                    )}
                  </div>
                  {!ytConnected && (
                    <span className="text-xs block text-red-300 mt-1">
                      Not Connected
                    </span>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {ytConnected
                    ? selection.yt
                      ? "Selected for publishing"
                      : "Click to select YouTube for publishing"
                    : "Connect YouTube account to publish"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            className={`flex-1 font-medium transition-all duration-300 backdrop-blur-sm ${
              !selection.yt || !ytConnected
                ? "bg-black/40 hover:bg-black/50 text-white/60 border border-white/20"
                : "bg-storiq-purple hover:bg-storiq-purple/90 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] border-0"
            }`}
            onClick={() => handlePost(video)}
            disabled={postingId === videoId || !selection.yt || !ytConnected}
            title={
              !ytConnected
                ? "Connect to YouTube to publish videos"
                : !selection.yt
                ? "Select a platform to publish"
                : ""
            }
          >
            {postingId === videoId ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publishing...
              </span>
            ) : (
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
                {!ytConnected
                  ? "Connect YouTube"
                  : !selection.yt
                  ? "Select Platform"
                  : "Publish Now"}
              </span>
            )}
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className={`px-4 transition-all duration-300 backdrop-blur-sm ${
                    !selection.yt || !ytConnected
                      ? "bg-black/40 border-white/20 text-white/60 hover:bg-black/50"
                      : "bg-black/40 border-storiq-purple/50 text-white hover:bg-storiq-purple/20 hover:border-storiq-purple"
                  }`}
                  onClick={() => setScheduleOpen(true)}
                  disabled={schedulingLoading || !selection.yt || !ytConnected}
                  title={
                    !ytConnected
                      ? "Connect to YouTube to schedule videos"
                      : !selection.yt
                      ? "Select a platform to schedule"
                      : "Schedule for later"
                  }
                >
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {ytConnected
                    ? selection.yt
                      ? "Schedule for later"
                      : "Select a platform to schedule"
                    : "Connect YouTube to schedule"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Schedule Dialog */}
        <Suspense fallback={null}>
          <ScheduleDialog
            open={scheduleOpen}
            onOpenChange={setScheduleOpen}
            onSchedule={(scheduledTime) => {
              handlePost(video, scheduledTime);
              setScheduleOpen(false);
            }}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default VideoPublishCard;
