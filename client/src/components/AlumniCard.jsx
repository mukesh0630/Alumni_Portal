import React from 'react';
import { CheckCircle2, Award, Briefcase, MapPin, Sparkles } from 'lucide-react';

export const AlumniCard = ({ alumnus, onSelectProfile }) => {
  return (
    <div className="glass-panel relative flex flex-col justify-between hover:-translate-y-1 transition-all group duration-300">
      {alumnus.distinguished && (
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
          <Award className="w-3 h-3 text-amber-400" /> Hall of Fame
        </span>
      )}

      <div>
        {/* Header Photo & Name */}
        <div className="flex items-start gap-3.5 mb-4">
          <img
            src={alumnus.photo}
            alt={alumnus.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-violet-500/30 group-hover:border-violet-500 transition-colors shadow-md"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                {alumnus.name}
              </h3>
              {alumnus.verified && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" title="Verified Alumni" />
              )}
            </div>
            <p className="text-xs text-slate-400 font-medium">Batch of {alumnus.batch}</p>
            {alumnus.mentorship && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-0.5">
                <Sparkles className="w-3 h-3" /> Mentorship Available
              </span>
            )}
          </div>
        </div>

        {/* Job Details */}
        <div className="space-y-2 mb-4 text-xs">
          <div className="flex items-start gap-2 text-slate-300">
            <Briefcase className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white leading-snug">{alumnus.designation}</div>
              <div className="text-slate-400 font-medium">{alumnus.company}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
            <span>{alumnus.location}</span>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <button
        onClick={() => onSelectProfile(alumnus.id)}
        className="btn btn-secondary w-full text-xs font-bold py-2 mt-2 group-hover:border-violet-500/50 transition-colors"
      >
        View Full Profile
      </button>
    </div>
  );
};
