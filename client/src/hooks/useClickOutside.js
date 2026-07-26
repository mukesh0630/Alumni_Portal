import { useEffect } from 'react';

/**
 * Hook that triggers a callback when a click occurs outside the referenced element.
 * @param {React.RefObject} ref - The ref attached to the element to monitor.
 * @param {Function} handler - Callback invoked on outside click.
 * @param {boolean} [active=true] - Whether the listener is active.
 */
export function useClickOutside(ref, handler, active = true) {
  useEffect(() => {
    if (!active) return;

    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, active]);
}
