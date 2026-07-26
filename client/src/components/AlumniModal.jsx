import React, { useEffect, useRef } from 'react';
import { X, CheckCircle2, Award, Briefcase, MapPin, Sparkles, Mail, ExternalLink, Compass, Zap } from 'lucide-react';

export const AlumniModal = ({ alumnus, onClose, onRequestMentorship, onAiQuery }) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Store focus, trap it inside modal, restore on close
  useEffect(() => {
    previousFocusRef.current = document.activeElement;

    // Focus the modal container
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
      aria-label={`Profile details for ${alumnus.name}`}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col outline-none"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-950/50 relative">
          <div className="flex items-start gap-4">
            <img
              src={alumnus.photo}
              alt={alumnus.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-violet-500 shadow-xl"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">{alumnus.name}</h2>
                {alumnus.verified && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {alumnus.distinguished && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-400" /> Hall of Fame
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Batch of {alumnus.batch} • {alumnus.company}</p>
              <p className="text-sm font-semibold text-violet-400 mt-1">{alumnus.designation}</p>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-pink-400" /> {alumnus.location}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Close profile modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-300">
          {/* Bio */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Professional Summary</h4>
            <p className="leading-relaxed text-slate-200 bg-slate-950/40 p-3.5 rounded-xl border border-white/5">
              {alumnus.bio}
            </p>
          </div>

          {/* Mentorship Status & Action */}
          <div className="p-4 rounded-xl bg-violet-950/30 border border-violet-800/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div>
                <div className="font-bold text-white">
                  {alumnus.mentorship ? 'Mentorship Program Active' : 'Mentorship Currently Unavailable'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {alumnus.mentorship ? 'Available for 1-on-1 career guidance & resume reviews' : 'Not accepting new mentees at this time'}
                </div>
              </div>
            </div>
            {alumnus.mentorship && (
              <button
                onClick={() => onRequestMentorship(alumnus)}
                className="btn btn-primary text-xs shrink-0"
              >
                Request Mentorship
              </button>
            )}
          </div>

          {/* Skills */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">Key Core Competencies</h4>
            <div className="flex flex-wrap gap-2">
              {alumnus.skills.map((skill, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">Key Milestones & Awards</h4>
            <ul className="space-y-2">
              {alumnus.achievements.map((ach, i) => (
                <li key={i} className="flex items-start gap-2 bg-slate-950/30 p-2.5 rounded-lg border border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 shrink-0" />
                  <span className="text-slate-200">{ach}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Career Timeline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Career History</h4>
            <div className="relative pl-6 space-y-4 border-l-2 border-violet-500/30">
              {alumnus.timeline.map((item, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-violet-500 border-2 border-slate-900" />
                  <span className="text-[10px] font-bold text-violet-400">{item.year}</span>
                  <div className="font-bold text-white text-xs">{item.role}</div>
                  <div className="text-[11px] text-slate-400">{item.company}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAiQuery('summary', alumnus.name)}
              className="btn btn-secondary text-xs flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" /> AI Executive Summary
            </button>
            <button
              onClick={() => onAiQuery('roadmap', alumnus.name)}
              className="btn btn-secondary text-xs flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-violet-400" /> AI Roadmap
            </button>
          </div>
          <button onClick={onClose} className="btn btn-secondary text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
