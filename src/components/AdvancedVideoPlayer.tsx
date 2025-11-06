// AdvancedVideoPlayer.tsx
import React, { useRef, useState, useEffect, useCallback } from "react";

interface AdvancedVideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  onDelete?: () => void;
  actionButtons?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  showControls?: boolean;
}

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
};

const AdvancedVideoPlayer: React.FC<AdvancedVideoPlayerProps> = ({
  src,
  onDelete,
  actionButtons,
  className = "",
  style,
  showControls = true,
  ...videoProps
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [buffered, setBuffered] = useState(0);

  // Auto-hide controls
  useEffect(() => {
    if (!showControls) return;
    
    let timeoutId: NodeJS.Timeout;
    const hideControls = () => setControlsVisible(false);
    
    if (playing) {
      timeoutId = setTimeout(hideControls, 3000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [playing, controlsVisible, showControls]);

  const showControlsTemporarily = useCallback(() => {
    if (!showControls) return;
    setControlsVisible(true);
  }, [showControls]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleFullscreenChange = () => {
      setIsFullscreen(
        !!document.fullscreenElement &&
        document.fullscreenElement === video.parentElement
      );
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(0));
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    video.addEventListener("progress", handleProgress);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      video.removeEventListener("progress", handleProgress);
    };
  }, []);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || isSeeking) return;
    setCurrentTime(video.currentTime);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
    setCurrentTime(video.currentTime);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (!isSeeking) {
      video.currentTime = time;
    }
  };

  const handleSeekMouseDown = () => setIsSeeking(true);
  
  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setIsSeeking(false);
    const video = videoRef.current;
    if (!video) return;
    const time = Number((e.target as HTMLInputElement).value);
    video.currentTime = time;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const vol = Number(e.target.value);
    setVolume(vol);
    video.volume = vol;
  };

  const handleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;
    switch (e.key) {
      case " ":
      case "k":
        e.preventDefault();
        handlePlayPause();
        break;
      case "ArrowRight":
        video.currentTime = Math.min(video.currentTime + 5, duration);
        break;
      case "ArrowLeft":
        video.currentTime = Math.max(video.currentTime - 5, 0);
        break;
      case "ArrowUp":
        video.volume = Math.min(video.volume + 0.1, 1);
        setVolume(video.volume);
        break;
      case "ArrowDown":
        video.volume = Math.max(video.volume - 0.1, 0);
        setVolume(video.volume);
        break;
      case "f":
        handleFullscreen();
        break;
      case "m":
        video.volume = video.volume > 0 ? 0 : 1;
        setVolume(video.volume);
        break;
      default:
        break;
    }
    showControlsTemporarily();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = video.volume > 0 ? 0 : 1;
    setVolume(video.volume);
  };

  const getVolumeIcon = () => {
    if (volume === 0) return "mute";
    if (volume < 0.5) return "low";
    return "high";
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-storiq-card-bg border border-storiq-border rounded-lg shadow-lg overflow-hidden group ${className}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => setShowVolumeSlider(false)}
      aria-label="Advanced video player"
      style={style}
    >
      {/* Video Container */}
      <div className="relative bg-black aspect-video">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain cursor-pointer"
          tabIndex={-1}
          onClick={handlePlayPause}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          {...videoProps}
          aria-label="Video content"
        />

        {/* Center Play/Pause Button */}
        {!playing && (
          <button
            onClick={handlePlayPause}
            className="absolute inset-0 m-auto w-16 h-16 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
            aria-label="Play video"
            type="button"
          >
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="8,5 8,19 19,12" />
            </svg>
          </button>
        )}

        {/* Top Action Buttons */}
        {(onDelete || actionButtons) && (
          <div className="absolute top-3 right-3 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {actionButtons}
            {onDelete && (
              <button
                onClick={onDelete}
                className="bg-red-600/90 hover:bg-red-700 text-white rounded-lg p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 backdrop-blur-sm"
                aria-label="Delete video"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Bottom Controls Overlay */}
        {showControls && controlsVisible && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300">
            {/* Progress Bar */}
            <div className="mb-3 relative">
              {/* Buffered Progress */}
              <div 
                className="absolute h-1 bg-white/30 rounded-full"
                style={{ width: `${(buffered / duration) * 100}%` }}
              />
              {/* Seek Bar */}
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                onMouseDown={handleSeekMouseDown}
                onMouseUp={handleSeekMouseUp}
                className="absolute w-full h-3 opacity-0 cursor-pointer z-10"
                aria-label="Seek video"
              />
              <div className="relative h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-storiq-purple rounded-full transition-all duration-100"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Play/Pause */}
                <button
                  onClick={handlePlayPause}
                  className="text-white hover:text-storiq-purple transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-storiq-purple rounded-full p-1"
                  aria-label={playing ? "Pause video" : "Play video"}
                  type="button"
                >
                  {playing ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="5" width="4" height="14" rx="1" />
                      <rect x="14" y="5" width="4" height="14" rx="1" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <polygon points="6,4 20,12 6,20" />
                    </svg>
                  )}
                </button>

                {/* Volume Control */}
                <div 
                  className="relative flex items-center"
                  onMouseEnter={() => setShowVolumeSlider(true)}
                >
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-storiq-purple transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-storiq-purple rounded-full p-1"
                    aria-label={volume === 0 ? "Unmute" : "Mute"}
                    type="button"
                  >
                    {getVolumeIcon() === "mute" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                    )}
                    {getVolumeIcon() === "low" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9v6" />
                      </svg>
                    )}
                    {getVolumeIcon() === "high" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9a5 5 0 010 6" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7a9 9 0 010 12" />
                      </svg>
                    )}
                  </button>
                  
                  {showVolumeSlider && (
                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black/90 rounded-lg p-3 backdrop-blur-sm">
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={handleVolumeChange}
                        className="h-24 accent-storiq-purple vertical-slider"
                        aria-label="Volume"
                        orient="vertical"
                      />
                    </div>
                  )}
                </div>

                {/* Time Display */}
                <div className="flex items-center gap-1 text-sm text-white/80 font-mono select-none">
                  <span aria-label="Current time">
                    {formatTime(currentTime)}
                  </span>
                  <span>/</span>
                  <span aria-label="Duration">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Playback Speed (Optional) */}
                <select
                  onChange={(e) => {
                    const video = videoRef.current;
                    if (video) video.playbackRate = Number(e.target.value);
                  }}
                  className="bg-black/50 text-white text-sm rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-storiq-purple"
                  aria-label="Playback speed"
                >
                  <option value="0.5">0.5x</option>
                  <option value="0.75">0.75x</option>
                  <option value="1" selected>1x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                </select>

                {/* Fullscreen */}
                <button
                  onClick={handleFullscreen}
                  className="text-white hover:text-storiq-purple transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-storiq-purple rounded-full p-1"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  type="button"
                >
                  {isFullscreen ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9L5 5m0 0v4m0-4h4M15 15l4 4m0 0v-4m0 4h-4" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6m0-6L10 14M9 21H3v-6m0 6l11-11" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .vertical-slider {
          writing-mode: bt-lr;
          -webkit-appearance: slider-vertical;
        }
      `}</style>
    </div>
  );
};

export default AdvancedVideoPlayer;