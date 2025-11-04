import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

interface AnimatedRouteProps {
  children: React.ReactNode;
}

const AnimatedRoute: React.FC<AnimatedRouteProps> = ({ children }) => {
  const location = useLocation();

  // Define page order for determining animation direction
  const pageOrder = ["/", "/about", "/tools"];
  const currentIndex = pageOrder.indexOf(location.pathname);
  const prevIndexRef = React.useRef(currentIndex);

  // Update previous index after render
  React.useEffect(() => {
    prevIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Determine animation direction
  const isForward = currentIndex > prevIndexRef.current;
  const isAnimatedRoute = currentIndex !== -1 && prevIndexRef.current !== -1;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={
          isAnimatedRoute ? { y: isForward ? "100%" : "-100%" } : { y: 0 }
        }
        animate={{ y: 0 }}
        exit={isAnimatedRoute ? { y: isForward ? "-100%" : "100%" } : { y: 0 }}
        transition={{
          type: "spring" as const,
          stiffness: 100,
          damping: 20,
        }}
        style={{
          width: "100%",
          backgroundColor: "#000",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedRoute;
