// components/JobProgress.tsx
'use client';

import React from 'react';
import { CheckCircle, XCircle, Loader2, Clock } from 'lucide-react';
import type { Job } from '@/lib/api';

interface JobProgressProps {
  jobs: Job[];
}

export default function JobProgress({ jobs }: JobProgressProps) {
  if (jobs.length === 0) return null;

  const getJobIcon = (status: Job['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getJobTitle = (type: Job['type']) => {
    switch (type) {
      case 'find-matches':
        return '🔍 מציאת התאמות';
      case 'compare-quality':
        return '⭐ השוואת איכות';
      case 'fetch-articles':
        return '📥 שליפת כתבות';
    }
  };

  const getStatusText = (status: Job['status']) => {
    switch (status) {
      case 'completed':
        return 'הושלם';
      case 'failed':
        return 'נכשל';
      case 'running':
        return 'פועל';
      case 'pending':
        return 'ממתין';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 animate-fadeIn"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {getJobIcon(job.status)}
              <div>
                <div className="font-medium text-gray-900 text-sm">
                  {getJobTitle(job.type)}
                </div>
                <div className="text-xs text-gray-500">
                  {getStatusText(job.status)}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {job.status === 'running' && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>התקדמות</span>
                <span>{Math.round(job.progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-500 ease-out"
                  style={{ width: `${job.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Result */}
          {job.status === 'completed' && job.result && (
            <div className="mt-2 text-xs text-gray-600 bg-green-50 p-2 rounded">
              {job.type === 'find-matches' && (
                <>
                  נבדקו: {job.result.totalChecked} | נמצאו: {job.result.totalMatches}
                </>
              )}
              {job.type === 'compare-quality' && (
                <>
                  הושוו: {job.result.totalCompared}
                </>
              )}
            </div>
          )}

          {/* Error */}
          {job.status === 'failed' && job.error && (
            <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
              {job.error}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}