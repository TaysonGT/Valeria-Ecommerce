import { useEffect } from 'react';

export const useOutsideClick = (
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void,
  excludeRefs: React.RefObject<HTMLElement | null>[] = []
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if clicked element is outside the target ref
      const isOutside = ref.current && !ref.current.contains(event.target as Node);
      
      // Check if clicked element is not in exclude refs
      const isNotExcluded = excludeRefs.every(
        exRef => !exRef.current?.contains(event.target as Node)
      );

      if (isOutside && isNotExcluded) {
        callback();
      }
    };

    // Use bubbling phase instead of capture phase
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback, excludeRefs]);
};