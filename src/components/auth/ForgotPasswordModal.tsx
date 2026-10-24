'use client';

import React, { useState } from 'react';
import { X, Mail, KeyRound, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

type Step = 'email' | 'otp' | 'new_password' | 'success';

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  initialEmail = '',
}: ForgotPasswordModalProps) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await authService.requestOtp(email.trim());
      if (response.success !== false) {
        toast.success('Verification code sent to your email!');
        setStep('otp');
      } else {
        const msg = response.message || 'Failed to send verification code. Please check your email.';
        setError(msg);
        toast.error(msg);
      }
    } catch (err: any) {
      console.error('Request OTP error:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Could not send verification code.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length < 4) {
      setError('Please enter a valid verification code.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await authService.verifyOtp({
        email: email.trim(),
        otp: otp.trim(),
      });
      if (response.success !== false) {
        toast.success('Code verified! Please create your new password.');
        setStep('new_password');
      } else {
        const msg = response.message || 'Invalid or expired verification code.';
        setError(msg);
        toast.error(msg);
      }
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Invalid or expired code.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim() || newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.resetPassword({
        email: email.trim(),
        newPassword: newPassword.trim(),
      });
      if (response.success !== false) {
        toast.success('Password updated successfully!');
        setStep('success');
      } else {
        const msg = response.message || 'Could not reset password. Please try again.';
        setError(msg);
        toast.error(msg);
      }
    } catch (err: any) {
      console.error('Reset password error:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Password update failed.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('email');
    setError('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Reset Password</h3>
            <p className="text-xs text-slate-500 mt-0.5">Recover your Business Bosses account</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-2 text-xs text-red-600">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Request OTP */}
        {step === 'email' && (
          <form onSubmit={handleRequestOtp} className="mt-6 space-y-4">
            <p className="text-xs text-slate-600">
              Enter the email address associated with your account and we&apos;ll send you a verification code.
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F21C29] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#F21C29] hover:bg-[#D01420] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 2: Enter OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
            <p className="text-xs text-slate-600">
              Enter the 6-digit verification code sent to <strong className="text-slate-900">{email}</strong>:
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Verification Code
              </label>
              <div className="relative">
                <KeyRound className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.trim())}
                  placeholder="123456"
                  className="w-full pl-11 pr-4 py-2.5 tracking-widest text-center font-mono font-bold text-base bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F21C29] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#F21C29] hover:bg-[#D01420] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Verify Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              Change Email
            </button>
          </form>
        )}

        {/* Step 3: Enter New Password */}
        {step === 'new_password' && (
          <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
            <p className="text-xs text-slate-600">
              Create a new secure password for your account (minimum 6 characters).
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F21C29] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F21C29] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#F21C29] hover:bg-[#D01420] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Update Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 4: Success */}
        {step === 'success' && (
          <div className="mt-6 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Password Changed!</h4>
            <p className="text-xs text-slate-600">
              Your password has been successfully updated. You can now sign in with your new credentials.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3 bg-[#F21C29] hover:bg-[#D01420] text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
