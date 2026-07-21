import React, { useState } from 'react';
import { LogIn, KeyRound, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthView = ({ setActiveView }) => {
  const { loginAs } = useAuth();
  const [screen, setScreen] = useState('login'); // 'login' | 'forgot' | 'otp'
  const [role, setRole] = useState('alumni');

  const handleSignIn = (e) => {
    e.preventDefault();
    loginAs(role);
    if (role === 'faculty') setActiveView('faculty-dashboard');
    else if (role === 'alumni') setActiveView('alumni-dashboard');
    else if (role === 'student') setActiveView('student-graduation');
    else setActiveView('dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-12 animate-fade-in">
      <div className="glass-panel p-8 space-y-6">
        {screen === 'login' && (
          <form onSubmit={handleSignIn} className="space-y-5">
            <h2 className="text-2xl font-extrabold text-white text-center">Access Alumni Portal</h2>

            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  role === 'student' ? 'bg-violet-600 text-white' : 'text-slate-400'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('alumni')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  role === 'alumni' ? 'bg-violet-600 text-white' : 'text-slate-400'
                }`}
              >
                Alumni
              </button>
              <button
                type="button"
                onClick={() => setRole('faculty')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  role === 'faculty' ? 'bg-violet-600 text-white' : 'text-slate-400'
                }`}
              >
                Faculty
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email or Register Number</label>
              <input
                type="text"
                required
                placeholder="e.g. CS2021001 or name@gmail.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400">
              <button type="button" onClick={() => setScreen('forgot')} className="hover:underline hover:text-violet-400">
                Forgot Password?
              </button>
              <button type="button" onClick={() => setActiveView('student-graduation')} className="hover:underline hover:text-violet-400">
                Request Alumni Status
              </button>
            </div>

            <button type="submit" className="btn btn-primary text-xs font-bold w-full py-2.5 flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" /> Sign In
            </button>
          </form>
        )}

        {screen === 'forgot' && (
          <form onSubmit={(e) => { e.preventDefault(); setScreen('otp'); }} className="space-y-4">
            <h2 className="text-xl font-extrabold text-white">Reset Password</h2>
            <p className="text-xs text-slate-400">Enter your registered email address to receive verification code.</p>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@gmail.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div className="flex justify-between items-center pt-2">
              <button type="button" onClick={() => setScreen('login')} className="text-xs text-slate-400 hover:underline">
                Back to Sign In
              </button>
              <button type="submit" className="btn btn-primary text-xs font-bold">
                Send Code
              </button>
            </div>
          </form>
        )}

        {screen === 'otp' && (
          <form onSubmit={(e) => { e.preventDefault(); setScreen('login'); }} className="space-y-4">
            <h2 className="text-xl font-extrabold text-white">OTP Verification</h2>
            <p className="text-xs text-slate-400">Enter the 4-digit code sent to your email.</p>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4].map(i => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  required
                  className="w-12 h-12 text-center text-base font-bold bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-violet-500"
                />
              ))}
            </div>
            <div className="flex justify-between items-center pt-2">
              <button type="button" onClick={() => setScreen('forgot')} className="text-xs text-slate-400 hover:underline">
                Resend Code
              </button>
              <button type="submit" className="btn btn-primary text-xs font-bold">
                Verify & Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
