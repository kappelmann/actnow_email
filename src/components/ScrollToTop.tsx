import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import smoothscroll from "smoothscroll-polyfill";

// kick off the polyfill
smoothscroll.polyfill();

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
