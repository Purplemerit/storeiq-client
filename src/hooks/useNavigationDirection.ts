import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Define the order of pages for determining direction
const pageOrder = ['/', '/about', '/tools'];

export const useNavigationDirection = () => {
  const location = useLocation();
  const prevLocationRef = useRef(location.pathname);

  useEffect(() => {
    prevLocationRef.current = location.pathname;
  }, [location]);

  const getDirection = () => {
    const currentIndex = pageOrder.indexOf(location.pathname);
    const prevIndex = pageOrder.indexOf(prevLocationRef.current);

    // If either path is not in our ordered list, return a default
    if (currentIndex === -1 || prevIndex === -1) {
      return 'none';
    }

    // Determine if moving forward or backward
    return currentIndex > prevIndex ? 'up' : 'down';
  };

  return getDirection();
};
