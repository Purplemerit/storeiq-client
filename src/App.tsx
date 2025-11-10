import { Toaster } from "react-hot-toast";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Index from "./pages/Index";
import About from "./pages/About";
import Tools from "./pages/Tools";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./components/HeroSection";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import Header from "./components/Header";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import AnimatedRoute from "./components/AnimatedRoute";

// Dashboard pages
import Dashboard from "./pages/dashboard/Dashboard";
import Stats from "./pages/dashboard/Stats";
import Publish from "./pages/dashboard/Publish";
import Videos from "./pages/dashboard/Videos";
import Exports from "./pages/dashboard/Exports";
// import Scripts from "./pages/dashboard/Scripts";
import Settings from "./pages/dashboard/Settings";
import VideoGenerator from "./pages/dashboard/create-video/VideoGenerator";
import ImageGenerator from "./pages/dashboard/create-video/ImageGenerator";
import PromptGenerator from "./pages/dashboard/create-video/PromptGenerator";
import ImageEditor from "./pages/dashboard/create-video/ImageEditor";
import ImageToPrompt from "./pages/dashboard/create-video/ImageToPrompt";
// import CreateVideo from "./pages/dashboard/CreateVideo";
import SearchVideos from "./pages/dashboard/SearchVideos";
import SearchImages from "./pages/dashboard/SearchImages";
import VideoEditor from "./pages/dashboard/VideoEditor";
import TextToSpeech from "./pages/dashboard/Aitextmounting";
// import AIToolsPage from "./pages/dashboard/AItools";
import AIObjectBlendTool from "./pages/dashboard/ai-tools/Mobimagetool";
import TTSPlayer from "./pages/dashboard/ai-tools/Ttscharachter";

import { AuthProvider } from "./context/AuthContext";
import { LoaderProvider } from "./context/LoaderContext";
import ProtectedRoute from "./context/Protected";

const queryClient = new QueryClient();

// ScrollToTop component to handle scroll on route change
const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

// Layout component that includes Header and Footer
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const showHeaderFooter = ["/", "/about", "/tools"].includes(
    location.pathname
  );

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {showHeaderFooter && (
        <div style={{ position: "relative", zIndex: 100 }}>
          <Header />
        </div>
      )}
      <div
        className={`flex-grow ${showHeaderFooter ? "pt-20" : ""}`}
        style={{ position: "relative", overflow: "hidden" }}
      >
        {children}
      </div>
      {showHeaderFooter && <Footer />}
    </div>
  );
};

// AnimatedRoutes component to handle route animations
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatedRoute>
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

        {/* Protected Routes (everything else) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/stats"
          element={
            <ProtectedRoute>
              <Stats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/publish"
          element={
            <ProtectedRoute>
              <Publish />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/videos"
          element={
            <ProtectedRoute>
              <Videos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/exports"
          element={
            <ProtectedRoute>
              <Exports />
            </ProtectedRoute>
          }
        />
        {/* <Route
        path="/dashboard/scripts"
        element={
          <ProtectedRoute>
            <Scripts />
          </ProtectedRoute>
        }
      /> */}
        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/create-video"
          element={
            <ProtectedRoute>
              <VideoGenerator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/create-image"
          element={
            <ProtectedRoute>
              <ImageGenerator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/create-prompt"
          element={
            <ProtectedRoute>
              <PromptGenerator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/image-to-prompt"
          element={
            <ProtectedRoute>
              <ImageToPrompt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/aitextmounting"
          element={
            <ProtectedRoute>
              <TextToSpeech />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/dashboard/aitools"
          element={
            <ProtectedRoute>
              <AIToolsPage />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/dashboard/aitools/Mobimage"
          element={
            <ProtectedRoute>
              <AIObjectBlendTool />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/aitools/tts"
          element={
            <ProtectedRoute>
              <TTSPlayer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/search-videos"
          element={
            <ProtectedRoute>
              <SearchVideos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/search-images"
          element={
            <ProtectedRoute>
              <SearchImages />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard/edit-image" element={<ImageEditor />} />
        <Route
          path="/dashboard/video-editor/*"
          element={
            <ProtectedRoute>
              <VideoEditor />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatedRoute>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          // Default options
          className: "",
          duration: 4000,
          style: {
            background: "#1a1a1a",
            color: "#fff",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            borderRadius: "12px",
            padding: "16px 20px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow:
              "0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(139, 92, 246, 0.1)",
            backdropFilter: "blur(10px)",
            maxWidth: "400px",
          },
          // Success toast
          success: {
            duration: 3500,
            style: {
              background: "linear-gradient(135deg, #1a1a1a 0%, #1e293b 100%)",
              border: "1px solid rgba(34, 197, 94, 0.4)",
              boxShadow:
                "0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(34, 197, 94, 0.2)",
            },
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          // Error toast
          error: {
            duration: 4500,
            style: {
              background: "linear-gradient(135deg, #1a1a1a 0%, #1e1b1b 100%)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              boxShadow:
                "0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(239, 68, 68, 0.2)",
            },
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
          // Loading toast
          loading: {
            style: {
              background: "linear-gradient(135deg, #1a1a1a 0%, #1e293b 100%)",
              border: "1px solid rgba(139, 92, 246, 0.4)",
              boxShadow:
                "0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(139, 92, 246, 0.2)",
            },
          },
        }}
      />
      <Sonner />
      <LoaderProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AuthProvider>
            <Layout>
              <AnimatedRoutes />
            </Layout>
          </AuthProvider>
        </BrowserRouter>
      </LoaderProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
