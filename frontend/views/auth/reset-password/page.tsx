'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Stethoscope, Check, X, ShieldCheck, AlertCircle } from 'lucide-react';

const ResetPasswordView = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordRules = [
    { label: 'Minimum 8 characters', met: password.length >= 8 },
    { label: 'Uppercase required', met: /[A-Z]/.test(password) },
    { label: 'Lowercase required', met: /[a-z]/.test(password) },
    { label: 'Number required', met: /[0-9]/.test(password) },
    { label: 'Special character required', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Top Accent Bar */}
        <div className="h-2 bg-blue-600 w-full"></div>

        <div className="p-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-50 p-3 rounded-2xl mb-4">
              <Stethoscope className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Create New Password</h2>
            <p className="text-slate-500 text-center text-sm mt-2">
              Set a strong password to secure your account
            </p>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">New Password *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Password Rules */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Security Requirements</p>
                <div className="grid grid-cols-1 gap-2">
                  {passwordRules.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      {rule.met ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300"></div>
                      )}
                      <span className={`text-xs ${rule.met ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Confirm Password *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-800"
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Passwords do not match
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || passwordRules.some(r => !r.met) || password !== confirmPassword}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'RESET PASSWORD'
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Password Updated!</h3>
              <p className="text-slate-500 text-sm mt-2 mb-8">
                Your password has been changed successfully. You can now use your new password to login.
              </p>
              <a 
                href="/login" 
                className="block w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all"
              >
                GO TO LOGIN
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordView;
