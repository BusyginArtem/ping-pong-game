import { useCallback } from 'react';

export const useScrollToTop = () => {
  const scrollToTop = useCallback((options: ScrollToOptions = {}) => {
    const scrollOptions: ScrollToOptions = {
      top: 0,
      behavior: 'smooth',
      ...options,
    };

    window.scrollTo(scrollOptions);
  }, []);

  return scrollToTop;
};
