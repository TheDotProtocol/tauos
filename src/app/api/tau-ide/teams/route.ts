import { NextRequest, NextResponse } from 'next/server';
import { requireAuthUser, authErrorResponse, userIdString } from '@/lib/tau-ide/server/auth';
import { listTeams, createTeam, inviteProjectMember, listProjectMembers } from '@/lib/tau-ide/server/teams';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuthUser(request);
    const teams = await listTeams(userIdString(user));
    return NextResponse.json({ teams });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ teams: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = requireAuthUser(request);
    const body = await request.json();
    if (body.action === 'invite') {
      await inviteProjectMember(body.projectId, body.userId, body.role ?? 'developer', userIdString(user));
      return NextResponse.json({ success: true });
    }
    const team = await createTeam(userIdString(user), body.name);
    return NextResponse.json({ team }, { status: 201 });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
