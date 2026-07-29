import { getPool } from '@/lib/db-pool';
import { ensureSchema, dbAvailable, fileStoreRead, fileStoreWrite } from './db';

export async function listTeams(userId: string) {
  if (await dbAvailable()) {
    await ensureSchema();
    const res = await getPool().query(
      `SELECT t.* FROM tau_ide_teams t
       LEFT JOIN tau_ide_team_members m ON m.team_id = t.id
       WHERE t.owner_id = $1 OR m.user_id = $1`,
      [userId]
    );
    return res.rows;
  }
  return fileStoreRead(userId, 'teams', []);
}

export async function createTeam(userId: string, name: string) {
  if (await dbAvailable()) {
    await ensureSchema();
    const res = await getPool().query('INSERT INTO tau_ide_teams (name, owner_id) VALUES ($1, $2) RETURNING *', [name, userId]);
    const team = res.rows[0];
    await getPool().query('INSERT INTO tau_ide_team_members (team_id, user_id, role) VALUES ($1, $2, $3)', [team.id, userId, 'owner']);
    return team;
  }
  const teams = fileStoreRead<unknown[]>(userId, 'teams', []);
  const team = { id: `team_${Date.now()}`, name, owner_id: userId };
  teams.push(team);
  fileStoreWrite(userId, 'teams', teams);
  return team;
}

export async function inviteProjectMember(projectId: string, userId: string, role: string, invitedBy: string) {
  if (await dbAvailable()) {
    await ensureSchema();
    await getPool().query(
      `INSERT INTO tau_ide_project_members (project_id, user_id, role, invited_by) VALUES ($1,$2,$3,$4)
       ON CONFLICT (project_id, user_id) DO UPDATE SET role = $3`,
      [projectId, userId, role, invitedBy]
    );
    await createNotification(userId, { type: 'invitation', title: 'Project invitation', message: `You've been invited to a project`, project_id: projectId });
  }
}

export async function listProjectMembers(projectId: string) {
  if (await dbAvailable()) {
    await ensureSchema();
    const res = await getPool().query('SELECT * FROM tau_ide_project_members WHERE project_id = $1', [projectId]);
    return res.rows;
  }
  return [];
}

async function createNotification(userId: string, n: { type: string; title: string; message: string; project_id?: string; metadata?: Record<string, unknown> }) {
  if (await dbAvailable()) {
    await ensureSchema();
    await getPool().query(
      'INSERT INTO tau_ide_notifications (user_id, project_id, type, title, message, metadata) VALUES ($1,$2,$3,$4,$5,$6)',
      [userId, n.project_id ?? null, n.type, n.title, n.message, JSON.stringify(n.metadata ?? {})]
    );
  }
}

export { createNotification };

export async function listNotifications(userId: string) {
  if (await dbAvailable()) {
    await ensureSchema();
    const res = await getPool().query('SELECT * FROM tau_ide_notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50', [userId]);
    return res.rows;
  }
  return fileStoreRead(userId, 'notifications', []);
}

export async function markNotificationRead(id: string, userId: string) {
  if (await dbAvailable()) {
    await ensureSchema();
    await getPool().query('UPDATE tau_ide_notifications SET read = true WHERE id = $1 AND user_id = $2', [id, userId]);
  }
}
