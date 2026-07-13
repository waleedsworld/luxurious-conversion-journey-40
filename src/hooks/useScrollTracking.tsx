import { useEffect, useCallback } from 'react';
import { handleAction } from '@/utils/actionHandler';

type TrackedElement = HTMLElement & {
  lastScrollTop?: number;
  touchStartY?: number;
};

export const useScrollTracking = (elementId: string) => {
  const handleScroll = useCallback(async (e: Event) => {
    const element = e.target as TrackedElement;
    const direction = element.scrollTop > (element.lastScrollTop ?? 0) ? 'down' : 'up';
    element.lastScrollTop = element.scrollTop;

    // Track both scroll and swipe actions
    await handleAction('scroll', { 
      direction,
      element: elementId 
    });
    await handleAction('swipe', { 
      direction,
      element: elementId 
    });
  }, [elementId]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const element = e.target as TrackedElement;
    element.touchStartY = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(async (e: TouchEvent) => {
    const element = e.target as TrackedElement;
    const touchEndY = e.changedTouches[0].clientY;
    const direction = (element.touchStartY ?? 0) > touchEndY ? 'down' : 'up';
    
    await handleAction('swipe', { 
      direction,
      element: elementId 
    });
  }, [elementId]);

  useEffect(() => {
    const element = document.getElementById(elementId) as TrackedElement | null;
    if (element) {
      element.lastScrollTop = 0;
      element.addEventListener('scroll', handleScroll);
      element.addEventListener('touchstart', handleTouchStart);
      element.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        element.removeEventListener('scroll', handleScroll);
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [elementId, handleScroll, handleTouchStart, handleTouchEnd]);
};