import { getPool } from '@/app/api/taumail/middleware/security';
import { withTauMailAuth } from '@/lib/taumail/api-route';
import { ensureDefaultWorkspaceData } from '@/lib/taumail/schema';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function mapContact(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    name: String(row.name || ''),
    email: String(row.email || ''),
    role: String(row.designation || row.role || ''),
    verified: Boolean(row.verified),
    phone: row.phone ? String(row.phone) : '',
    phoneCountryCode: row.phone_country_code ? String(row.phone_country_code) : '+1',
    tauId: row.tau_id ? String(row.tau_id) : '',
    organization: row.organization ? String(row.organization) : '',
    designation: row.designation ? String(row.designation) : String(row.role || ''),
  };
}

export async function GET(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const pool = getPool();
    await ensureDefaultWorkspaceData(pool, userId);
    const result = await pool.query(
      `SELECT id, name, email, role, verified, phone, phone_country_code, tau_id, organization, designation, created_at
       FROM taumail_contacts
       WHERE user_id = $1
       ORDER BY name ASC`,
      [userId],
    );
    return NextResponse.json({ success: true, contacts: result.rows.map(mapContact) });
  });
}

export async function POST(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      phoneCountryCode,
      tauId,
      organization,
      designation,
      role,
      verified,
    } = body;
    if (!name || !email) {
      return NextResponse.json({ error: 'name and email required' }, { status: 400 });
    }
    const designationValue = designation || role || '';
    const result = await getPool().query(
      `INSERT INTO taumail_contacts
         (user_id, name, email, role, verified, phone, phone_country_code, tau_id, organization, designation)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, name, email, role, verified, phone, phone_country_code, tau_id, organization, designation, created_at`,
      [
        userId,
        name,
        email,
        designationValue,
        Boolean(verified),
        phone || null,
        phoneCountryCode || '+1',
        tauId || null,
        organization || null,
        designationValue,
      ],
    );
    return NextResponse.json({ success: true, contact: mapContact(result.rows[0]) });
  });
}
