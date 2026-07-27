import React from 'react';
import { CheckCircle2, Award, Briefcase, MapPin, Sparkles, ArrowUpRight } from 'lucide-react';

export const AlumniCard = ({ alumnus, onSelectProfile }) => {
  return (
    <div className="glass-panel relative flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 group hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-900/30">
      {alumnus.distinguished && (
        <span className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-extrabold flex items-center gap-1 shadow-md">
          <Award className="w-3.5 h-3.5 text-amber-400" /> Hall of Fame
        </span>
      )}

      <div>
        {/* Header Photo & Name */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="relative">
            <img
              src={alumnus.photo}
              alt={alumnus.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-violet-500/30 group-hover:border-violet-400 transition-colors shadow-lg"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'; }}
            />
            {alumnus.verified && (
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full ring-2 ring-violet-950">
                <CheckCircle2 className="w-3.5 h-3.5" title="Verified Alumni" />
              </span>
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors leading-snug">
              {alumnus.name}
            </h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Batch of {alumnus.batch}</p>
            {alumnus.mentorship && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold mt-1 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <Sparkles className="w-3 h-3 text-emerald-400" /> Mentor Available
              </span>
            )}
          </div>
        </div>

        {/* Job Details */}
        <div className="space-y-2 mb-4 text-xs">
          <div className="flex items-start gap-2 text-slate-300">
            <Briefcase className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white leading-snug">{alumnus.designation}</div>
              <div className="text-violet-300 font-semibold">{alumnus.company}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
            <span className="font-medium">{alumnus.location}</span>
          </div>
        </div>

        {/* Skills Tag Pills */}
        {alumnus.skills && alumnus.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {alumnus.skills.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-300 border border-violet-500/20 text-[10px] font-semibold">
                {skill}
              </span>
            ))}
            {alumnus.skills.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-semibold">
                +{alumnus.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Action */}
      <button
        onClick={() => onSelectProfile(alumnus.id)}
        className="btn btn-secondary w-full text-xs font-bold py-2.5 mt-1 flex items-center justify-center gap-1.5 group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-500 transition-all shadow-md"
      >
        <span>View Full Profile</span>
        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </div>
  );
};

