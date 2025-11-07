"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Mic,
  Play,
  Upload,
  Download,
  Volume2,
  VideoIcon,
  Sparkles,
  Check,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  FileAudio,
  Film,
  Plus,
  Loader2,
  X,
} from "lucide-react";

interface Video {
  id: string;
  url: string;
  title?: string;
}

export default function TextToSpeech() {
  const [text, setText] = useState("");
  interface Voice {
    voice_id?: string;
    voiceId?: string;
    name: string;
  }
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(false);

  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [mountedVideo, setMountedVideo] = useState<Video | null>(null);
  const [loadingMount, setLoadingMount] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [loadingVoices, setLoadingVoices] = useState(true);

  // UI State
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVoiceDropdown, setShowVoiceDropdown] = useState(false);
  const [inputHidden, setInputHidden] = useState(false);

  // Queue state for TTS
  const [ttsJobId, setTtsJobId] = useState<string | null>(null);
  const [ttsQueuePosition, setTtsQueuePosition] = useState<number | null>(null);
  const [ttsQueueLength, setTtsQueueLength] = useState<number | null>(null);
  const [ttsEstimatedWaitTime, setTtsEstimatedWaitTime] = useState<
    number | null
  >(null);
  const ttsPollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Queue state for audio mounting
  const [mountJobId, setMountJobId] = useState<string | null>(null);
  const [mountQueuePosition, setMountQueuePosition] = useState<number | null>(
    null
  );
  const [mountQueueLength, setMountQueueLength] = useState<number | null>(null);
  const [mountEstimatedWaitTime, setMountEstimatedWaitTime] = useState<
    number | null
  >(null);
  const mountPollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "https://api.example.com";

  const fetchWithAuth = useCallback(
    (url: string, options: RequestInit = {}) => {
      const headers = options.headers || {};
      const token = getToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
      return fetch(url, { ...options, headers, credentials: "include" });
    },
    []
  );

  const fetchVideos = useCallback(async () => {
    setLoadingVideos(true);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/videos`);
      if (!res.ok) throw new Error("Failed to fetch videos");
      const videoArray: Video[] = await res.json();
      setVideos(videoArray);
    } catch (err) {
      console.log("API not available, using mock data");
      // Fallback to mock data
      const mockVideos = [
        {
          id: "video1",
          url: "/abstract-geometric-animation.png",
          title: "Product Demo",
        },
        {
          id: "video2",
          url: "/abstract-geometric-motion.png",
          title: "Tutorial Video",
        },
        { id: "video3", url: "/sample-video-3.png", title: "Marketing Clip" },
      ];
      setVideos(mockVideos);
    } finally {
      setLoadingVideos(false);
    }
  }, [API_BASE_URL, fetchWithAuth]);

  useEffect(() => {
    const loadVoices = async () => {
      try {
        const res = await fetchWithAuth(`${API_BASE_URL}/video-tts/voices`);
        const data = await res.json();
        setVoices(data.voices || []);
        if (data.voices?.length) {
          setSelectedVoice(data.voices[0].voice_id || data.voices[0].voiceId);
        }
      } catch (error) {
        console.log("API not available, using mock data");
        // Fallback to mock data
        const mockVoices = [
          { voice_id: "voice1", name: "Sarah - Professional" },
          { voice_id: "voice2", name: "David - Conversational" },
          { voice_id: "voice3", name: "Emma - Energetic" },
          { voice_id: "voice4", name: "James - Authoritative" },
        ];
        setVoices(mockVoices);
        setSelectedVoice(mockVoices[0].voice_id);
      } finally {
        setLoadingVoices(false);
      }
    };

    loadVoices();
  }, [API_BASE_URL, fetchWithAuth]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (ttsPollingIntervalRef.current) {
        clearInterval(ttsPollingIntervalRef.current);
      }
      if (mountPollingIntervalRef.current) {
        clearInterval(mountPollingIntervalRef.current);
      }
    };
  }, []);

  // Poll for TTS job status
  const pollTtsJobStatus = async (currentJobId: string) => {
    try {
      const statusRes = await fetchWithAuth(
        `${API_BASE_URL}/video-tts/tts-status/${currentJobId}`
      );

      if (!statusRes.ok) {
        throw new Error("Failed to get job status");
      }

      // Check if response is JSON or audio data
      const contentType = statusRes.headers.get("content-type");

      if (contentType && contentType.includes("audio")) {
        // Stop polling - audio is ready
        if (ttsPollingIntervalRef.current) {
          clearInterval(ttsPollingIntervalRef.current);
          ttsPollingIntervalRef.current = null;
        }

        const audioBlob = await statusRes.blob();
        setAudioUrl(URL.createObjectURL(audioBlob));
        setCurrentStep(3);
        setInputHidden(true);
        setLoadingAudio(false);
        setTtsJobId(null);
        setTtsQueuePosition(null);
        setTtsQueueLength(null);
        setTtsEstimatedWaitTime(null);
      } else {
        // JSON status response
        const statusData = await statusRes.json();

        if (statusData.status === "failed") {
          // Stop polling
          if (ttsPollingIntervalRef.current) {
            clearInterval(ttsPollingIntervalRef.current);
            ttsPollingIntervalRef.current = null;
          }

          alert(`TTS generation failed: ${statusData.error}`);
          setLoadingAudio(false);
          setTtsJobId(null);
          setTtsQueuePosition(null);
          setTtsQueueLength(null);
          setTtsEstimatedWaitTime(null);
        } else if (
          statusData.status === "queued" ||
          statusData.status === "processing"
        ) {
          // Update queue position
          setTtsQueuePosition(statusData.position || null);
          setTtsQueueLength(statusData.queueLength || null);
          setTtsEstimatedWaitTime(statusData.estimatedWaitTime || null);
        }
      }
    } catch (err) {
      console.error("[TTS] Polling error:", err);
      // Don't stop polling on network errors, continue trying
    }
  };

  // Poll for audio mounting job status
  const pollMountJobStatus = async (currentJobId: string) => {
    try {
      const statusRes = await fetchWithAuth(
        `${API_BASE_URL}/api/video/mount-audio-status/${currentJobId}`
      );

      if (!statusRes.ok) {
        throw new Error("Failed to get job status");
      }

      const statusData = await statusRes.json();

      if (statusData.status === "completed") {
        // Stop polling
        if (mountPollingIntervalRef.current) {
          clearInterval(mountPollingIntervalRef.current);
          mountPollingIntervalRef.current = null;
        }

        setMountedVideo({
          id: statusData.s3Key,
          url: statusData.url,
          title: "Mounted Video",
        });
        setCurrentStep(5);
        setLoadingMount(false);
        setMountJobId(null);
        setMountQueuePosition(null);
        setMountQueueLength(null);
        setMountEstimatedWaitTime(null);

        fetchVideos();
      } else if (statusData.status === "failed") {
        // Stop polling
        if (mountPollingIntervalRef.current) {
          clearInterval(mountPollingIntervalRef.current);
          mountPollingIntervalRef.current = null;
        }

        alert(`Audio mounting failed: ${statusData.error}`);
        setLoadingMount(false);
        setMountJobId(null);
        setMountQueuePosition(null);
        setMountQueueLength(null);
        setMountEstimatedWaitTime(null);
      } else if (
        statusData.status === "queued" ||
        statusData.status === "processing"
      ) {
        // Update queue position
        setMountQueuePosition(statusData.position || null);
        setMountQueueLength(statusData.queueLength || null);
        setMountEstimatedWaitTime(statusData.estimatedWaitTime || null);
      }
    } catch (err) {
      console.error("[AudioMount] Polling error:", err);
      // Don't stop polling on network errors, continue trying
    }
  };

  const generateAudio = async () => {
    if (!text.trim()) return alert("Please enter text!");
    setLoadingAudio(true);
    setAudioUrl(null);
    setCurrentStep(2);

    try {
      const audioRes = await fetchWithAuth(`${API_BASE_URL}/video-tts/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceId: selectedVoice }),
      });

      if (!audioRes.ok) throw new Error("TTS request failed");

      const data = await audioRes.json();
      console.log("[TTS] Job submitted:", data);

      if (!data.jobId) {
        throw new Error("No job ID returned from server");
      }

      // Set job ID and start polling
      setTtsJobId(data.jobId);
      setTtsQueuePosition(data.position || 1);
      setTtsQueueLength(data.queueLength || 1);
      setTtsEstimatedWaitTime(data.estimatedWaitTime || 20);

      // Start polling
      ttsPollingIntervalRef.current = setInterval(() => {
        pollTtsJobStatus(data.jobId);
      }, 2000);

      // Initial poll
      pollTtsJobStatus(data.jobId);
    } catch (err) {
      console.error("[TTS] Error:", err);
      alert("Failed to generate audio. Please try again.");
      setLoadingAudio(false);
      setCurrentStep(1);
    }
  };

  const mountVideoWithAudio = async () => {
    if (!selectedVideo) return alert("Select a video first");
    if (!audioUrl) return alert("Generate audio first");

    setLoadingMount(true);
    setCurrentStep(4);

    try {
      const audioBlob = await fetch(audioUrl).then((res) => res.blob());

      const formData = new FormData();
      formData.append("file", audioBlob, "tts-audio.mp3");

      const uploadRes = await fetchWithAuth(
        `${API_BASE_URL}/api/upload-audio`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadRes.ok) throw new Error("Audio upload failed");
      const { url: publicAudioUrl } = await uploadRes.json();

      const requestBody = {
        videoUrl: selectedVideo.url,
        audioUrl: publicAudioUrl,
      };

      const res = await fetchWithAuth(`${API_BASE_URL}/api/video/mount-audio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to mount video with audio");

      const data = await res.json();
      console.log("[AudioMount] Job submitted:", data);

      if (!data.jobId) {
        throw new Error("No job ID returned from server");
      }

      // Set job ID and start polling
      setMountJobId(data.jobId);
      setMountQueuePosition(data.position || 1);
      setMountQueueLength(data.queueLength || 1);
      setMountEstimatedWaitTime(data.estimatedWaitTime || 40);

      // Start polling
      mountPollingIntervalRef.current = setInterval(() => {
        pollMountJobStatus(data.jobId);
      }, 2000);

      // Initial poll
      pollMountJobStatus(data.jobId);
    } catch (err) {
      console.error("[AudioMount] Error:", err);
      alert("Failed to mount audio. Please try again.");
      setLoadingMount(false);
      setCurrentStep(3);
    }
  };

  const resetWorkflow = () => {
    setText("");
    setAudioUrl(null);
    setSelectedVideo(null);
    setMountedVideo(null);
    setCurrentStep(1);
    setInputHidden(false); // Restore input section
  };

  const getStepStatus = (step: number) => {
    if (step < currentStep) return "completed";
    if (step === currentStep) return "current";
    return "pending";
  };

  const selectedVoiceName =
    voices.find((v) => (v.voice_id || v.voiceId) === selectedVoice)?.name ||
    "Select Voice";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-storiq-dark">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-white">AI Voice Studio</h1>
            </div>
            <p className="text-white/60 text-base max-w-3xl">
              Transform your text into professional voiceovers and seamlessly
              mount them to your videos with AI-powered voice synthesis
            </p>
          </div>

          {/* Progress Steps */}
          <Card className="mb-8 bg-storiq-card-bg border-storiq-border">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center relative">
                {/* Progress Line Background */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-storiq-border z-0"></div>
                {/* Progress Line Active */}
                <div
                  className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-700 ease-out z-0"
                  style={{
                    width: `calc(${((currentStep - 1) / 4) * 100}%)`,
                  }}
                ></div>

                {[
                  { num: 1, label: "Write Text", icon: Mic },
                  { num: 2, label: "Generate Audio", icon: Volume2 },
                  { num: 3, label: "Select Video", icon: VideoIcon },
                  { num: 4, label: "Mount Audio", icon: Upload },
                  { num: 5, label: "Complete", icon: Check },
                ].map(({ num, label, icon: Icon }) => {
                  const status = getStepStatus(num);
                  return (
                    <div
                      key={num}
                      className="relative flex flex-col items-center z-10 flex-1"
                    >
                      <div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-storiq-dark
                          ${
                            status === "completed"
                              ? "border-primary bg-primary text-white"
                              : status === "current"
                              ? "border-primary text-primary scale-110"
                              : "border-storiq-border text-white/40"
                          }
                        `}
                      >
                        {status === "completed" ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <span
                        className={`
                          mt-2 text-xs font-medium text-center max-w-20 transition-colors
                          ${
                            status === "completed" || status === "current"
                              ? "text-white"
                              : "text-white/40"
                          }
                        `}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left Column - Text Input & Voice Selection */}
            <div className="space-y-6">
              {/* Text Input Card */}
              <Card className="bg-storiq-card-bg border-storiq-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Mic className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-white">Script Input</CardTitle>
                    </div>
                    <div className="text-sm text-white/60">
                      <span
                        className={text.length > 4500 ? "text-orange-400" : ""}
                      >
                        {text.length}
                      </span>
                      <span>/5000</span>
                    </div>
                  </div>
                  <CardDescription className="text-white/50">
                    Enter the text you want to convert to speech
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Textarea
                      className="min-h-[180px] resize-none bg-black/40 border-storiq-border text-white placeholder:text-white/40"
                      placeholder="Enter your script here... This text will be converted to speech using AI voice synthesis."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      maxLength={5000}
                    />
                    {text.length > 4500 && (
                      <div className="flex items-center gap-2 text-sm text-orange-400">
                        <AlertCircle className="w-4 h-4" />
                        <span>Approaching character limit</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Voice Selection Card */}
              <Card className="bg-storiq-card-bg border-storiq-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Volume2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-white">
                        Voice Selection
                      </CardTitle>
                      <CardDescription className="text-white/50">
                        Choose an AI voice for your audio
                      </CardDescription>
                    </div>
                    {loadingVoices && (
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingVoices ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary mr-3" />
                      <span className="text-white/60">Loading voices...</span>
                    </div>
                  ) : voices.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-storiq-dark-lighter flex items-center justify-center">
                        <Volume2 className="w-8 h-8 text-white/40" />
                      </div>
                      <h3 className="text-lg font-medium mb-2 text-white">
                        No Voices Available
                      </h3>
                      <p className="text-sm text-white/60 mb-4">
                        Unable to load voice options. Please try refreshing.
                      </p>
                      <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                        size="sm"
                        className="border-storiq-border text-white hover:bg-storiq-dark-lighter"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Label htmlFor="voice-select" className="sr-only">
                        Select Voice
                      </Label>
                      <button
                        id="voice-select"
                        onClick={() => setShowVoiceDropdown(!showVoiceDropdown)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-black/40 border border-storiq-border rounded-lg hover:border-primary transition-colors"
                      >
                        <span className="truncate text-white">
                          {selectedVoiceName}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform flex-shrink-0 ml-2 text-white/60 ${
                            showVoiceDropdown ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {showVoiceDropdown && (
                        <div className="absolute bottom-full left-0 right-0 mb-2 bg-storiq-dark-lighter border border-storiq-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                          {voices.map((voice) => (
                            <button
                              key={voice.voice_id || voice.voiceId}
                              onClick={() => {
                                setSelectedVoice(
                                  voice.voice_id || voice.voiceId || ""
                                );
                                setShowVoiceDropdown(false);
                              }}
                              className={`w-full text-left px-4 py-3 hover:bg-storiq-card-bg transition-colors first:rounded-t-lg last:rounded-b-lg ${
                                (voice.voice_id || voice.voiceId) ===
                                selectedVoice
                                  ? "bg-primary/20 text-white"
                                  : "text-white"
                              }`}
                            >
                              {voice.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Generate Audio Button */}
              <Button
                onClick={generateAudio}
                disabled={
                  loadingAudio ||
                  !text.trim() ||
                  !selectedVoice ||
                  loadingVoices
                }
                className="w-full h-12"
                size="lg"
              >
                {loadingAudio ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {ttsQueuePosition && ttsQueuePosition > 1
                      ? `In Queue - Position ${ttsQueuePosition}`
                      : "Generating Audio..."}
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Generate AI Voice
                  </>
                )}
              </Button>

              {/* TTS Queue Information */}
              {loadingAudio &&
                ttsQueuePosition &&
                ttsQueuePosition > 1 &&
                ttsEstimatedWaitTime && (
                  <div className="mt-2 text-center">
                    <p className="text-white/60 text-xs sm:text-sm">
                      Estimated wait time: ~
                      {Math.ceil(ttsEstimatedWaitTime / 60)} minute
                      {Math.ceil(ttsEstimatedWaitTime / 60) !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}
            </div>

            {/* Right Column - Audio Preview & Tips */}
            <div className="space-y-6">
              {/* Audio Preview Card */}
              {audioUrl && (
                <Card className="bg-storiq-card-bg border-storiq-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FileAudio className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-white">
                          Generated Audio
                        </CardTitle>
                      </div>
                      <Badge variant="default" className="gap-1">
                        <Check className="w-3 h-3" />
                        Ready
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border border-storiq-border bg-black/40 p-4">
                      <audio
                        controls
                        src={audioUrl}
                        className="w-full"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={() => setIsPlaying(false)}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          const a = document.createElement("a");
                          a.href = audioUrl;
                          a.download = "generated-audio.mp3";
                          a.click();
                        }}
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Audio
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reset Button */}
              {currentStep > 1 && (
                <Button
                  onClick={resetWorkflow}
                  variant="outline"
                  className="w-full border-storiq-border text-white hover:bg-storiq-card-bg"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Start Over
                </Button>
              )}

              {/* Pro Tips Card */}
              {currentStep === 1 && (
                <Card className="bg-storiq-card-bg border-storiq-border">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <CardTitle className="text-white">Pro Tips</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm text-white/60">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <span>
                          Write clear, natural sentences for best results
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <span>
                          Try different voices to find the perfect match
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <span>
                          Keep scripts under 5000 characters for optimal quality
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Video Selection Section */}
          {audioUrl && (
            <Card className="bg-storiq-card-bg border-storiq-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Film className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-white">
                        Select Video to Mount
                      </CardTitle>
                      <CardDescription className="text-white/50">
                        Choose a video to add your generated audio
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-storiq-dark-lighter text-white"
                  >
                    {videos.length} video{videos.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {loadingVideos ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mr-3" />
                    <span className="text-white/60">Loading videos...</span>
                  </div>
                ) : videos.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-storiq-dark-lighter flex items-center justify-center">
                      <Film className="w-10 h-10 text-white/40" />
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-white">
                      No Videos Available
                    </h3>
                    <p className="text-sm text-white/60 mb-4 max-w-md mx-auto">
                      Upload some videos first to mount your generated audio.
                      You can add videos through the dashboard.
                    </p>
                    <Button
                      onClick={fetchVideos}
                      variant="outline"
                      className="border-storiq-border text-white hover:bg-storiq-dark-lighter"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Videos
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {videos.map((video) => (
                        <div
                          key={video.id}
                          className={`group relative rounded-lg border-2 overflow-hidden transition-all duration-200 cursor-pointer ${
                            selectedVideo?.id === video.id
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-storiq-border hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedVideo(video)}
                        >
                          <div className="aspect-video bg-storiq-dark-lighter">
                            <video
                              src={video.url}
                              className="w-full h-full object-cover"
                              preload="metadata"
                            />
                          </div>
                          {selectedVideo?.id === video.id && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <div className="bg-primary rounded-full p-2">
                                <Check className="w-5 h-5 text-primary-foreground" />
                              </div>
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                            <p className="text-white text-sm font-medium truncate">
                              {video.title || `Video ${video.id.slice(-6)}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mount Button */}
                    <Button
                      onClick={mountVideoWithAudio}
                      disabled={!selectedVideo || !audioUrl || loadingMount}
                      className="w-full h-12"
                      size="lg"
                    >
                      {loadingMount ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          {mountQueuePosition && mountQueuePosition > 1
                            ? `In Queue - Position ${mountQueuePosition}`
                            : "Mounting Video..."}
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 mr-2" />
                          Mount Audio to Video
                        </>
                      )}
                    </Button>

                    {/* Audio Mount Queue Information */}
                    {loadingMount &&
                      mountQueuePosition &&
                      mountQueuePosition > 1 &&
                      mountEstimatedWaitTime && (
                        <div className="mt-2 text-center">
                          <p className="text-white/60 text-xs sm:text-sm">
                            Estimated wait time: ~
                            {Math.ceil(mountEstimatedWaitTime / 60)} minute
                            {Math.ceil(mountEstimatedWaitTime / 60) !== 1
                              ? "s"
                              : ""}
                          </p>
                        </div>
                      )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Final Video Result */}
          {mountedVideo && (
            <Card className="bg-storiq-card-bg border-storiq-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-full bg-primary/10">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">
                      Video Successfully Created!
                    </CardTitle>
                    <CardDescription className="text-white/50">
                      Your AI-generated audio has been mounted to the video
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-storiq-dark-lighter">
                  <video
                    src={mountedVideo.url}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => window.open(mountedVideo.url, "_blank")}
                    className="flex-1"
                    size="lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Final Video
                  </Button>
                  <Button
                    onClick={resetWorkflow}
                    variant="outline"
                    size="lg"
                    className="border-storiq-border text-white hover:bg-storiq-dark-lighter"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
