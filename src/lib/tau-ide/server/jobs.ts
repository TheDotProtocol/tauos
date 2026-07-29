import { getPool } from '@/lib/db-pool';
import { ensureSchema, dbAvailable, fileStoreRead, fileStoreWrite } from './db';
import { createNotification } from './teams';

export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

export async function createJob(userId: string, jobType: string, input: Record<string, unknown>, projectId?: string) {
  if (await dbAvailable()) {
    await ensureSchema();
    const res = await getPool().query(
      'INSERT INTO tau_ide_jobs (user_id, project_id, job_type, status, input) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [userId, projectId ?? null, jobType, 'pending', JSON.stringify(input)]
    );
    return res.rows[0];
  }
  const jobs = fileStoreRead<unknown[]>(userId, 'jobs', []);
  const job = { id: `job_${Date.now()}`, user_id: userId, project_id: projectId, job_type: jobType, status: 'pending', input, created_at: new Date().toISOString() };
  jobs.unshift(job);
  fileStoreWrite(userId, 'jobs', jobs);
  return job;
}

export async function runJobAsync(jobId: string, handler: () => Promise<Record<string, unknown>>) {
  if (await dbAvailable()) {
    await ensureSchema();
    await getPool().query('UPDATE tau_ide_jobs SET status = $1, started_at = NOW() WHERE id = $2', ['running', jobId]);
  }
  try {
    const output = await handler();
    if (await dbAvailable()) {
      await getPool().query('UPDATE tau_ide_jobs SET status = $1, output = $2, completed_at = NOW() WHERE id = $3', ['completed', JSON.stringify(output), jobId]);
      const job = await getPool().query('SELECT user_id, project_id, job_type FROM tau_ide_jobs WHERE id = $1', [jobId]);
      if (job.rows[0]) {
        await createNotification(job.rows[0].user_id, {
          type: 'job_complete',
          title: `${job.rows[0].job_type} completed`,
          message: 'Background task finished successfully',
          project_id: job.rows[0].project_id,
        });
      }
    }
    return output;
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Job failed';
    if (await dbAvailable()) {
      await getPool().query('UPDATE tau_ide_jobs SET status = $1, error = $2, completed_at = NOW() WHERE id = $3', ['failed', error, jobId]);
    }
    throw e;
  }
}

export async function getJob(jobId: string) {
  if (await dbAvailable()) {
    await ensureSchema();
    const res = await getPool().query('SELECT * FROM tau_ide_jobs WHERE id = $1', [jobId]);
    return res.rows[0] ?? null;
  }
  return null;
}

export async function listJobs(userId: string, limit = 20) {
  if (await dbAvailable()) {
    await ensureSchema();
    const res = await getPool().query('SELECT * FROM tau_ide_jobs WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2', [userId, limit]);
    return res.rows;
  }
  return fileStoreRead(userId, 'jobs', []).slice(0, limit);
}
