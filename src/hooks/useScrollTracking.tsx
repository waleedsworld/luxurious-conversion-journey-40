import { useEffect, useCallback } from 'react';
import { handleAction } from '@/utils/actionHandler';

export const useScrollTracking = (elementId: string) => {
  const handleScroll = useCallback(async (e: Event) => {
    const element = e.target as HTMLElement;
    const direction = element.scrollTop > (element as any).lastScrollTop ? 'down' : 'up';
    (element as any).lastScrollTop = element.scrollTop;

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
    const element = e.target as HTMLElement;
    (element as any).touchStartY = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(async (e: TouchEvent) => {
    const element = e.target as HTMLElement;
    const touchEndY = e.changedTouches[0].clientY;
    const direction = (element as any).touchStartY > touchEndY ? 'down' : 'up';
    
    await handleAction('swipe', { 
      direction,
      element: elementId 
    });
  }, [elementId]);

  useEffect(() => {
    const element = document.getElementById(elementId);
    if (element) {
      (element as any).lastScrollTop = 0;
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