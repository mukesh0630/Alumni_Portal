import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Reusable error display banner with optional retry button.
 * @param {string} message - The error message to display.
 * @param {Function} [onRetry] - Optional retry callback.
 */
export const ErrorBanner = ({ message = 'Something went wrong. Please try again.', onRetry }) => {
  return (
    <div className="glass-panel text-center py-10 space-y-4 border-red-500/20 animate-fade-in">
      <div className="w-12 h-12 rounded-full bg-red-500/15 text-red-400 flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-base font-bold text-white mb-1">Failed to Load Data</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-secondary text-xs font-bold inline-flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      )}
    </div>
  );
};
