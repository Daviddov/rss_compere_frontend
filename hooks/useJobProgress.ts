// hooks/useJobProgress.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import * as api from '@/lib/api';
import type { Job } from '@/lib/api';

export function useJobProgress(onComplete?: (job: Job) => void) {
  const [activeJobs, setActiveJobs] = useState<Map<string, Job>>(new Map());
  const [isTracking, setIsTracking] = useState(false);

  const startJob = useCallback(async (jobId: string) => {
    setIsTracking(true);
    
    try {
      await api.pollJob(
        jobId,
        (job) => {
          setActiveJobs((prev) => {
            const next = new Map(prev);
            next.set(jobId, job);
            return next;
          });
        },
        2000 // poll every 2 seconds
      ).then((completedJob) => {
        // Remove from active jobs after completion
        setTimeout(() => {
          setActiveJobs((prev) => {
            const next = new Map(prev);
            next.delete(jobId);
            return next;
          });
        }, 3000);
        
        if (onComplete) {
          onComplete(completedJob);
        }
      });
    } catch (error) {
      console.error('Job failed:', error);
      // Keep in activeJobs to show error
    } finally {
      setIsTracking(false);
    }
  }, [onComplete]);

  const getActiveJobsList = useCallback(() => {
    return Array.from(activeJobs.values());
  }, [activeJobs]);

  const hasActiveJobs = activeJobs.size > 0;

  return {
    activeJobs: getActiveJobsList(),
    hasActiveJobs,
    isTracking,
    startJob,
  };
}