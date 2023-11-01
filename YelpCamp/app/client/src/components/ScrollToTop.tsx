import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop({ children }) {
    const { pathname } = useLocation();

    console.log('scrolltotop');
    

    useEffect(() => {
        // window.scrollTo(0, 0);
        document.documentElement.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant", // Optional if you want to skip the scrolling animation
          });
    }, [pathname]);

    return children;
}
