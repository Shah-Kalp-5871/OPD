'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Lock, 
  ArrowRight, 
  Stethoscope, 
  ShieldCheck,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { patientPortalApi } from '@/lib/api/patient-portal';
import { useRouter } from 'next/navigation';

export default function PatientLoginView() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'MOBILE' | 'OTP'>('MOBILE');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length < 10) {
      toast.error('Please enter a valid mobile number');
      return;
    }

    setLoading(true);
    try {
      await patientPortalApi.requestOtp(mobile);
      toast.success('OTP sent to your mobile');
      setStep('OTP');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await patientPortalApi.verifyOtp(mobile, otp);
      const { access_token } = response as any;
      
      localStorage.setItem('token', access_token);
      toast.success('Login successful');
      router.push('/patient/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 mb-4 border border-indigo-500/30">
            <Stethoscope className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">MedFlow</h1>
          <p className="text-slate-400 mt-2 font-medium">Secure Patient Portal</p>
        </div>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 'MOBILE' ? (
              <motion.form
                key="mobile-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleRequestOtp}
                className="space-y-6"
              >
                <div className="space-y-2 text-center">
                  <h2 className="text-xl font-semibold text-white">Welcome Back</h2>
                  <p className="text-sm text-slate-400">Enter your registered mobile number to continue</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <Input
                      type="tel"
                      placeholder="Mobile Number"
                      className="pl-10 bg-slate-950/50 border-slate-800 text-white h-12"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all"
                    disabled={loading}
                  >
                    {loading ? 'Sending OTP...' : (
                      <span className="flex items-center gap-2">
                        Get OTP <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="otp-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleVerifyOtp}
                className="space-y-6"
              >
                <div className="space-y-2 text-center">
                  <h2 className="text-xl font-semibold text-white">Verify OTP</h2>
                  <p className="text-sm text-slate-400">Sent to +91 {mobile}</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <Input
                      type="text"
                      placeholder="6-Digit OTP"
                      maxLength={6}
                      className="pl-10 bg-slate-950/50 border-slate-800 text-white h-12 tracking-[1em] text-center font-bold"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all"
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : (
                      <span className="flex items-center gap-2">
                        Verify & Login <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </Button>

                  <button
                    type="button"
                    onClick={() => setStep('MOBILE')}
                    className="w-full text-sm text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Change Mobile Number
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </Card>

        {/* Features Info */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Secure Access</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-2">
              <Smartphone className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">OTP Verified</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Instant Reports</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
