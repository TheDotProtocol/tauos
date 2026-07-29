import { NextResponse } from 'next/server';
import { parseProjectBlock, validateProjectFiles } from '@/lib/tau-ide/architect/project-generator';
import { withArchitectGuard } from '@/lib/tau-ide/server/route-guard';

export const POST = withArchitectGuard(async (_request, body) => {
  const { content, files } = body;

  if (content) {
    const project = parseProjectBlock(String(content));
    if (!project) {
      return NextResponse.json({ error: 'No valid tau-project block found' }, { status: 400 });
    }
    const validation = validateProjectFiles(project.files);
    return NextResponse.json({ project, validation });
  }

  if (Array.isArray(files) && files.length) {
    const validation = validateProjectFiles(files);
    return NextResponse.json({ validation });
  }

  return NextResponse.json({ error: 'content or files required' }, { status: 400 });
});
