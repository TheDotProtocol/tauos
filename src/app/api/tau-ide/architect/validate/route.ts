import { NextRequest, NextResponse } from 'next/server';
import { parseProjectBlock, validateProjectFiles } from '@/lib/tau-ide/architect/project-generator';

export async function POST(request: NextRequest) {
  try {
    const { content, files } = await request.json();

    if (content) {
      const project = parseProjectBlock(content);
      if (!project) {
        return NextResponse.json({ error: 'No valid tau-project block found' }, { status: 400 });
      }
      const validation = validateProjectFiles(project.files);
      return NextResponse.json({ project, validation });
    }

    if (files?.length) {
      const validation = validateProjectFiles(files);
      return NextResponse.json({ validation });
    }

    return NextResponse.json({ error: 'content or files required' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Validation failed' }, { status: 500 });
  }
}
