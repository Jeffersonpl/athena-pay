import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export const breakpoints = {
  sm: '(max-width: 640px)',
  md: '(min-width: 641px) and (max-width: 1024px)',
  lg: '(min-width: 1025px)',
  mobile: '(max-width: 768px)',
  tablet: '(min-width: 769px) and (max-width: 1024px)',
  desktop: '(min-width: 1025px)',
};

export function useIsMobile(): boolean {
  return useMediaQuery(breakpoints.mobile);
}

export function useIsTablet(): boolean {
  return useMediaQuery(breakpoints.tablet);
}

export function useIsDesktop(): boolean {
  return useMediaQuery(breakpoints.desktop);
}

export default useMediaQuery;
