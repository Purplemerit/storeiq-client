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
          isAnimatedRoute ? { y: isForward ? "100vh" : "-100vh" } : { y: 0 }
        }
        animate={{ y: 0 }}
        exit={
          isAnimatedRoute ? { y: isForward ? "-100vh" : "100vh" } : { y: 0 }
        }
        transition={{
          type: "spring" as const,
          stiffness: 80,
          damping: 18,
        }}
        style={{
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "#000",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedRoute;
