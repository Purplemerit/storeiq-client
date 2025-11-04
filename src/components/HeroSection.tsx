import GetStartedButton from "@/components/ui/get-started-button";
const creativeContentVideo =
  "https://store-iq-video-bucket.s3.ap-south-1.amazonaws.com/creative-content.mp4";
const aiGeneratedVideo =
  "https://store-iq-video-bucket.s3.ap-south-1.amazonaws.com/ai-generated.mp4";
const videoContentVideo =
  "https://store-iq-video-bucket.s3.ap-south-1.amazonaws.com/video-content.mp4";
// You can also import the sticker if you prefer that method
// import girlSticker from "/girl-sticker.png";

const VideoCard = ({ src }) => {
  return (
    <div className="relative aspect-[9/16] rounded-lg overflow-hidden group">
      {/* Video */}
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Striped Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            rgba(0,0,0,0.9) 0px,
            rgba(0,0,0,0.9) 2px,
            transparent 2px,
            transparent 6px
          )`,
        }}
      ></div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <section className="flex flex-col items-center justify-start text-center px-4 sm:px-6 md:px-8 relative bg-black text-white pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 md:pb-16">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 left-1/2 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Hero Videos Grid - 3 videos, responsive layout */}
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 mb-3 sm:mb-6 md:mb-8 lg:mb-10 w-full max-w-[1180px] gap-3 sm:gap-6 lg:gap-8 xl:gap-[155px] px-2 sm:px-0">
        <VideoCard src={creativeContentVideo} />
        <VideoCard src={aiGeneratedVideo} />
        <VideoCard src={videoContentVideo} />
      </div>

      {/* Main Heading */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium text-white mb-2 sm:mb-3 md:mb-4 w-full max-w-[1180px] leading-tight px-2">
        The AI workspace for next-gen creators
      </h1>

      {/* Subheading */}
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 mb-3 sm:mb-5 md:mb-6 lg:mb-8 w-full max-w-[1180px] px-2">
        <span className="underline">STORIQ</span> helps modern creators
        streamline content creation, planning, and publishing like never before.
      </p>

      {/* CTA Button */}
      <GetStartedButton />

      {/* Girl Sticker
      <div className="absolute bottom-0 right-0 w-48 h-48 md:w-56 md:h-56">
        <img
          // The 'src' is now correctly pointing to the image in your public folder
          // src="/image.png"
          alt="Meera Rajput"
          className="w-full h-full object-contain"
        />
      </div> */}
    </section>
  );
};

export default HeroSection;
