import React from 'react';
import { Briefcase, MapPin, ExternalLink, Sparkles } from 'lucide-react';

export const OpportunityCard = ({ opp, onApply }) => {
  return (
    <div className="w-80 shrink-0 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-950/40 transition-all group">
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-[10px] font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> {opp.badge}
          </span>
        </div>

        <h4 className="text-sm font-extrabold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
          {opp.title}
        </h4>
        <p className="text-xs font-semibold text-slate-300 mt-0.5 flex items-center gap-1">
          <Briefcase className="w-3.5 h-3.5 text-violet-400 shrink-0" /> {opp.company}
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-pink-400 shrink-0" /> {opp.location}
        </p>

        <p className="text-xs text-slate-400 mt-2.5 leading-relaxed line-clamp-3 bg-slate-950/50 p-2.5 rounded-xl border border-white/5">
          {opp.desc}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {opp.tags.map((tag, i) => (
            <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-medium">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={() => onApply(opp)}
        className="btn btn-secondary text-xs font-bold w-full mt-4 flex items-center justify-center gap-1.5 group-hover:bg-violet-600 group-hover:text-white transition-all"
      >
        <span>Express Interest</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
