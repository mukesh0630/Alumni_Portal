import React, { useEffect, useState } from 'react';
import { Check, AlertCircle, Info, X } from 'lucide-react';

/**
 * Centralized toast notification component.
 * @param {Object} toast - Toast object with `msg`, `type` ('success' | 'error' | 'info').
 * @param {Function} onDismiss - Callback to clear the toast.
 * @param {number} [duration=3000] - Auto-dismiss duration in ms.
 */
export const Toast = ({ toast, onDismiss, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      // Trigger enter animation
      requestAnimationFrame(() => setIsVisible(true));

      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 200); // Wait for exit animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [toast, duration, onDismiss]);

  if (!toast) return null;

  const styles = {
    success: 'bg-emerald-950 border-emerald-500 text-emerald-200',
    error: 'bg-red-950 border-red-500 text-red-200',
    info: 'bg-violet-950 border-violet-500 text-violet-200'
  };

  const icons = {
    success: <Check className="w-4 h-4" />,
    error: <AlertCircle className="w-4 h-4" />,
    info: <Info className="w-4 h-4" />
  };

  const type = toast.type || 'success';

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-[60] px-4 py-3 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border transition-all duration-200 ${
        styles[type]
      } ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
    >
      {icons[type]}
      <span className="max-w-xs">{toast.msg}</span>
      <button
        onClick={() => { setIsVisible(false); setTimeout(onDismiss, 200); }}
        className="ml-1 p-0.5 rounded hover:bg-white/10 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};
