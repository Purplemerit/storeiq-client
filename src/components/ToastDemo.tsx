import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast-config";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function ToastDemo() {
  const handleSuccessToast = () => {
    toast.success("Operation completed successfully!");
  };

  const handleErrorToast = () => {
    toast.error("Failed to complete operation. Please try again.");
  };

  const handleWarningToast = () => {
    toast.warning("Your storage is almost full. Consider upgrading.");
  };

  const handleInfoToast = () => {
    toast.info("New features are now available in the dashboard!");
  };

  const handleLoadingToast = () => {
    const loadingToast = toast.loading("Processing your request...");

    // Simulate async operation
    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success("Request processed successfully!");
    }, 3000);
  };

  const handlePromiseToast = () => {
    const fakePromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve("Success!");
        } else {
          reject(new Error("Failed!"));
        }
      }, 2000);
    });

    toast.promise(fakePromise, {
      loading: "Uploading video...",
      success: "Video uploaded successfully!",
      error: "Failed to upload video.",
    });
  };

  const handleCustomToast = () => {
    toast.custom("AI generation complete! Your video is ready.", "🎨");
  };

  const handleMultipleToasts = () => {
    toast.success("First notification");
    setTimeout(() => toast.info("Second notification"), 300);
    setTimeout(() => toast.warning("Third notification"), 600);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Enhanced Toast Notifications
        </h1>
        <p className="text-gray-400">
          Click the buttons below to see the enhanced toast notifications in
          action
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Button
          onClick={handleSuccessToast}
          variant="outline"
          className="h-auto flex flex-col items-start gap-2 p-4 border-green-500/20 hover:border-green-500/40 hover:bg-green-500/5"
        >
          <div className="flex items-center gap-2 text-green-500">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">Success Toast</span>
          </div>
          <span className="text-xs text-gray-400 text-left">
            Shows success messages with green accent
          </span>
        </Button>

        <Button
          onClick={handleErrorToast}
          variant="outline"
          className="h-auto flex flex-col items-start gap-2 p-4 border-red-500/20 hover:border-red-500/40 hover:bg-red-500/5"
        >
          <div className="flex items-center gap-2 text-red-500">
            <XCircle className="w-5 h-5" />
            <span className="font-semibold">Error Toast</span>
          </div>
          <span className="text-xs text-gray-400 text-left">
            Shows error messages with red accent
          </span>
        </Button>

        <Button
          onClick={handleWarningToast}
          variant="outline"
          className="h-auto flex flex-col items-start gap-2 p-4 border-yellow-500/20 hover:border-yellow-500/40 hover:bg-yellow-500/5"
        >
          <div className="flex items-center gap-2 text-yellow-500">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Warning Toast</span>
          </div>
          <span className="text-xs text-gray-400 text-left">
            Shows warnings with yellow accent
          </span>
        </Button>

        <Button
          onClick={handleInfoToast}
          variant="outline"
          className="h-auto flex flex-col items-start gap-2 p-4 border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/5"
        >
          <div className="flex items-center gap-2 text-blue-500">
            <Info className="w-5 h-5" />
            <span className="font-semibold">Info Toast</span>
          </div>
          <span className="text-xs text-gray-400 text-left">
            Shows information with blue accent
          </span>
        </Button>

        <Button
          onClick={handleLoadingToast}
          variant="outline"
          className="h-auto flex flex-col items-start gap-2 p-4 border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/5"
        >
          <div className="flex items-center gap-2 text-purple-500">
            <Loader2 className="w-5 h-5" />
            <span className="font-semibold">Loading Toast</span>
          </div>
          <span className="text-xs text-gray-400 text-left">
            Shows loading state with spinner
          </span>
        </Button>

        <Button
          onClick={handlePromiseToast}
          variant="outline"
          className="h-auto flex flex-col items-start gap-2 p-4 border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/5"
        >
          <div className="flex items-center gap-2 text-purple-500">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Promise Toast</span>
          </div>
          <span className="text-xs text-gray-400 text-left">
            Handles async operations automatically
          </span>
        </Button>

        <Button
          onClick={handleCustomToast}
          variant="outline"
          className="h-auto flex flex-col items-start gap-2 p-4 border-pink-500/20 hover:border-pink-500/40 hover:bg-pink-500/5"
        >
          <div className="flex items-center gap-2 text-pink-500">
            <span className="text-xl">🎨</span>
            <span className="font-semibold">Custom Toast</span>
          </div>
          <span className="text-xs text-gray-400 text-left">
            Custom message with emoji icon
          </span>
        </Button>

        <Button
          onClick={handleMultipleToasts}
          variant="outline"
          className="h-auto flex flex-col items-start gap-2 p-4 border-gray-500/20 hover:border-gray-500/40 hover:bg-gray-500/5"
        >
          <div className="flex items-center gap-2 text-gray-400">
            <span className="text-xl">📚</span>
            <span className="font-semibold">Multiple Toasts</span>
          </div>
          <span className="text-xs text-gray-400 text-left">
            Shows multiple notifications stacked
          </span>
        </Button>

        <Button
          onClick={() => toast.dismissAll()}
          variant="outline"
          className="h-auto flex flex-col items-start gap-2 p-4 border-gray-500/20 hover:border-gray-500/40 hover:bg-gray-500/5"
        >
          <div className="flex items-center gap-2 text-gray-400">
            <span className="text-xl">🗑️</span>
            <span className="font-semibold">Dismiss All</span>
          </div>
          <span className="text-xs text-gray-400 text-left">
            Clears all visible toasts
          </span>
        </Button>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
        <h2 className="text-xl font-semibold mb-3 text-purple-300">
          ✨ Features
        </h2>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            <span>Positioned in top-right corner for optimal visibility</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            <span>Glassmorphism effect with backdrop blur</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            <span>Color-coded by type (success, error, warning, info)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            <span>Smooth animations and transitions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            <span>Support for custom icons and emojis</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            <span>Promise-based toasts for async operations</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
