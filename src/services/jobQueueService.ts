import type { JobItem } from '../types';

export class JobQueueService {
  private listeners: ((jobs: JobItem[]) => void)[] = [];
  private jobs: JobItem[] = [];

  subscribe(listener: (jobs: JobItem[]) => void) {
    this.listeners.push(listener);
    listener(this.jobs);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l([...this.jobs]));
  }

  addJob(taskName: string): JobItem {
    const job: JobItem = {
      id: `job-${Date.now()}`,
      taskName,
      status: 'processing',
      progress: 10,
      createdAt: new Date().toISOString(),
    };

    this.jobs.unshift(job);
    this.notify();

    this.simulateJobLifecycle(job.id);

    return job;
  }

  private simulateJobLifecycle(jobId: string) {
    let currentProgress = 10;

    const interval = setInterval(() => {
      const job = this.jobs.find((j) => j.id === jobId);
      if (!job) {
        clearInterval(interval);
        return;
      }

      currentProgress += Math.floor(Math.random() * 25) + 15;

      if (currentProgress >= 50 && currentProgress < 90) {
        job.status = 'rendering';
        job.progress = currentProgress;
      } else if (currentProgress >= 100) {
        job.status = 'completed';
        job.progress = 100;
        clearInterval(interval);
      } else {
        job.progress = currentProgress;
      }

      this.notify();
    }, 1000);
  }

  getJobs(): JobItem[] {
    return [...this.jobs];
  }
}

export const jobQueueService = new JobQueueService();
