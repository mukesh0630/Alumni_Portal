import React from 'react';

/**
 * Reusable skeleton loading component matching the glassmorphism design.
 * @param {'card' | 'stat' | 'table-row'} variant - The skeleton style variant.
 * @param {number} [count=1] - Number of skeleton items to render.
 */
export const LoadingSkeleton = ({ variant = 'card', count = 1 }) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  if (variant === 'stat') {
    return (
      <>
        {skeletons.map(i => (
          <div key={i} className="glass-panel text-center animate-pulse">
            <div className="h-8 w-16 bg-slate-800 rounded-lg mx-auto mb-2" />
            <div className="h-3 w-24 bg-slate-800 rounded mx-auto" />
          </div>
        ))}
      </>
    );
  }

  if (variant === 'table-row') {
    return (
      <>
        {skeletons.map(i => (
          <tr key={i} className="animate-pulse">
            <td className="py-3.5 px-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800" />
                <div className="space-y-1.5">
                  <div className="h-3 w-28 bg-slate-800 rounded" />
                  <div className="h-2 w-40 bg-slate-800/60 rounded" />
                </div>
              </div>
            </td>
            <td className="py-3.5 px-4"><div className="h-3 w-12 bg-slate-800 rounded" /></td>
            <td className="py-3.5 px-4">
              <div className="space-y-1.5">
                <div className="h-3 w-20 bg-slate-800 rounded" />
                <div className="h-2 w-28 bg-slate-800/60 rounded" />
              </div>
            </td>
            <td className="py-3.5 px-4"><div className="h-3 w-24 bg-slate-800 rounded" /></td>
            <td className="py-3.5 px-4">
              <div className="flex gap-1">
                <div className="h-4 w-12 bg-slate-800 rounded" />
                <div className="h-4 w-12 bg-slate-800 rounded" />
              </div>
            </td>
            <td className="py-3.5 px-4 text-right">
              <div className="flex justify-end gap-2">
                <div className="h-7 w-20 bg-slate-800 rounded-lg" />
                <div className="h-7 w-8 bg-slate-800 rounded-lg" />
              </div>
            </td>
          </tr>
        ))}
      </>
    );
  }

  // Default: card variant
  return (
    <>
      {skeletons.map(i => (
        <div key={i} className="glass-panel animate-pulse">
          <div className="flex items-start gap-3.5 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-800" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-slate-800 rounded" />
              <div className="h-3 w-20 bg-slate-800/60 rounded" />
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-3 w-full bg-slate-800/50 rounded" />
            <div className="h-3 w-3/4 bg-slate-800/40 rounded" />
          </div>
          <div className="h-9 w-full bg-slate-800 rounded-xl" />
        </div>
      ))}
    </>
  );
};
