import React from 'react';
import { BookOpen, Target, Clock, ShieldCheck, Award } from 'lucide-react';

export const AboutView = () => {
  const milestones = [
    { year: '1994', title: 'Department Inception', desc: 'B.Sc Computer Science program inaugurated with 24 seats.' },
    { year: '2005', title: 'Network Lab Established', desc: 'First dedicated computer systems lab with high-speed internet.' },
    { year: '2016', title: 'Global Relocations Summit', desc: 'Alumni count in Silicon Valley and Europe crosses 50.' },
    { year: '2024', title: 'Alumni AI Lab Support', desc: 'Accenture & Zoho Alumni fund advanced AI learning sandbox.' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-3xl p-8 bg-gradient-to-r from-violet-900 to-slate-900 border border-violet-500/20 shadow-xl">
        <h1 className="text-4xl font-extrabold text-white mb-2">Department of Computer Science</h1>
        <p className="text-xs text-violet-300 font-semibold uppercase tracking-wider">
          B.Sc Computer Science Program | Established 1994
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="glass-panel space-y-2">
            <h3 className="text-lg font-extrabold text-violet-400 flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> Academic Vision
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              To nurture foundational computational expertise, logical problem solving, and global professional ethics inside undergraduate students, shaping them into outstanding technology leaders and cloud architects.
            </p>
          </div>

          <div className="glass-panel space-y-3">
            <h3 className="text-lg font-extrabold text-violet-400 flex items-center gap-2">
              <Target className="w-5 h-5" /> Academic Mission
            </h3>
            <ul className="text-xs text-slate-300 space-y-2 list-disc pl-5">
              <li>Deliver contemporary, industry-focused computer applications curriculum.</li>
              <li>Inculcate practical programming proficiency using modern developer tools.</li>
              <li>Bridge student-alumni networks for direct career acceleration and industrial mentorships.</li>
              <li>Foster open-source programming cultures and collaborative software builds.</li>
            </ul>
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className="glass-panel space-y-4">
          <h3 className="text-lg font-extrabold text-violet-400 flex items-center gap-2">
            <Clock className="w-5 h-5" /> Department Milestone Timeline
          </h3>

          <div className="relative pl-6 space-y-6 border-l-2 border-violet-500/30">
            {milestones.map((m, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-violet-500 border-2 border-slate-900" />
                <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 text-[10px] font-extrabold">
                  {m.year}
                </span>
                <h4 className="text-sm font-bold text-white mt-1">{m.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
