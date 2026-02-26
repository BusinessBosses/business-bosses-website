'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Loader2, Mail } from 'lucide-react';

const SettingPage = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleDeleteClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmDelete = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Request Submitted Successfully
          </h2>
          <p className="text-slate-600 mb-6">
            We have received your account deletion request. Our team will review it and process your request within 30 days.
          </p>
          <p className="text-sm text-slate-500">
            You will receive an email confirmation shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Settings
          </h1>
          <p className="text-lg text-slate-600">
            Manage your account preferences
          </p>
        </div>

        {/* Delete Account Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Delete Account
            </h2>
            <p className="text-slate-600">
              Once you delete your account, there is no going back. Please be certain.
            </p>
          </div>

          {!showConfirmation ? (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  Delete your account
                </h3>
                <p className="text-sm text-slate-500">
                  All your data will be permanently removed
                </p>
              </div>
              <button
                onClick={handleDeleteClick}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <AlertTriangle className="w-5 h-5" />
                Delete Account
              </button>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold text-red-900">
                  Are you absolutely sure?
                </h3>
              </div>
              <p className="text-red-700 mb-6">
                This action cannot be undone. This will permanently delete your account and remove all your data from our servers. Please enter your email address to confirm.
              </p>
              
              <div className="mb-6">
                <label htmlFor="confirm-email" className="block text-sm font-medium text-red-800 mb-2">
                  Enter your email address to confirm
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="confirm-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="block w-full pl-10 pr-3 py-3 border border-red-300 rounded-lg focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isSubmitting || !email}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Yes, Delete My Account'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            What happens when you delete your account?
          </h3>
          <ul className="text-blue-700 space-y-2">
            <li>• All your profile information will be permanently deleted</li>
            <li>• Your posts and content will be removed</li>
            <li>• You will lose access to all subscriptions</li>
            <li>• This action cannot be undone</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
