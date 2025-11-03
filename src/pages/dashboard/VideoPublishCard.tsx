import React, { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

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
  const videoId = video.id || video.s3Key || "";
  const selection = platformSelections[videoId] || { yt: false, ig: false };

  return (
    <div className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl overflow-hidden border border-slate-600/50 transition-all duration-300 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 backdrop-blur-sm">
      {/* Dialog and ScheduleDialog will be lazy loaded in Publish.tsx */}
      <div className="relative aspect-video bg-slate-900 overflow-hidden">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title || "Video thumbnail"}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <video
            src={video.url}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            tabIndex={-1}
            muted
            playsInline
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
        {/* DialogTrigger and ScheduleDialog will be rendered by parent */}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <input
              type="text"
              className="text-white font-bold text-lg mb-2 truncate group-hover:text-purple-200 transition-colors bg-transparent border-b border-purple-500 focus:outline-none focus:border-pink-500 w-full"
              value={
                editedTitles[videoId] !== undefined
                  ? editedTitles[videoId]
                  : video.title || ""
              }
              placeholder="Enter video title"
              onChange={(e) =>
                setEditedTitles((titles) => ({
                  ...titles,
                  [videoId]: e.target.value,
                }))
              }
              maxLength={100}
            />
            <div className="flex items-center gap-3 text-sm">
              <span className="text-slate-400">
                Published {video.publishCount ?? 0} time
                {(video.publishCount ?? 0) === 1 ? "" : "s"}
              </span>
              {video.scheduledTime && (
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
                  ${
                    video.scheduledStatus === "completed"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : video.scheduledStatus === "failed"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  }`}
                >
                  <svg
                    className={`w-3.5 h-3.5 ${
                      video.scheduledStatus === "completed"
                        ? "text-green-400"
                        : video.scheduledStatus === "failed"
                        ? "text-red-400"
                        : "text-purple-400"
                    }`}
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
                  <div>
                    <span className="font-semibold">
                      {video.scheduledStatus === "completed"
                        ? "Published successfully"
                        : video.scheduledStatus === "failed"
                        ? "Publishing failed"
                        : "Scheduled for " +
                          DateTime.fromISO(video.scheduledTime).toLocaleString(
                            DateTime.DATETIME_SHORT
                          )}
                    </span>
                    {video.scheduledStatus === "completed" && (
                      <span className="block text-green-400/60 mt-0.5">
                        Published to YouTube
                      </span>
                    )}
                    {video.scheduledStatus === "failed" && (
                      <span className="block text-red-400/60 mt-0.5">
                        Check connection and try again
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Platform Selection */}
        <div className="mb-4 flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={`flex-1 p-2 rounded-lg transition-all ${
                    selection.yt
                      ? "bg-purple-500/20 text-purple-400 border-2 border-purple-500"
                      : "bg-slate-700/50 text-slate-400 border border-slate-600/50"
                  }`}
                  onClick={() => handlePlatformChange(videoId, "youtube")}
                  disabled={!ytConnected}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>YouTube</span>
                    {ytConnected ? (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          selection.yt ? "bg-purple-500" : "bg-green-500"
                        }`}
                      />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                    )}
                  </div>
                  {!ytConnected && (
                    <span className="text-xs block text-red-400">
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
            className={`flex-1 font-medium transition-all duration-300 ${
              !selection.yt || !ytConnected
                ? "bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 border border-slate-600/50"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
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
                  className={`px-4 transition-all duration-300 ${
                    !selection.yt || !ytConnected
                      ? "border-slate-600/50 text-slate-400 hover:bg-slate-700/50"
                      : "border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400"
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
