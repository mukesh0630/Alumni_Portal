import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, CheckCircle2 } from 'lucide-react';

export const MentorshipModal = ({ alumnus, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [note, setNote] = useState('');
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Focus management
  useEffect(() => {
    previousFocusRef.current = document.activeElement;
    if (modalRef.current) {
      modalRef.current.focus();
    }
    return () => {
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!alumnus) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Request mentorship from ${alumnus.name}`}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 relative outline-none"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          aria-label="Close mentorship request"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Request Mentorship</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Send a direct connection request to <strong>{alumnus.name}</strong> ({alumnus.designation} at {alumnus.company}).
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Major Interest / Goal</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud Architecture, AI Research, Resume Review"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Personal Introduction Note</label>
                <textarea
                  rows={4}
                  required
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={`Hi ${alumnus.name}, I am a B.Sc CS student interested in learning more about your journey at ${alumnus.company}...`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={onClose} className="btn btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" /> Submit Request
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Mentorship Request Sent!</h3>
            <p className="text-xs text-slate-300">
              {alumnus.name} has been notified. You will receive an email confirmation once they accept your invitation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
