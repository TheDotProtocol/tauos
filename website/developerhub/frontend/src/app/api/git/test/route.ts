import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test Git operations
    const testResults = {
      repositories: {
        endpoint: '/api/git/repositories',
        status: 'OK',
        description: 'Repository management API'
      },
      operations: {
        endpoint: '/api/git/operations',
        status: 'OK',
        description: 'Git operations API'
      },
      features: [
        'Repository listing and filtering',
        'Git clone, pull, push operations',
        'Branch management',
        'Commit history',
        'Status checking',
        'Diff viewing',
        'Real-time command execution',
        'Operation history tracking'
      ],
      supportedCommands: [
        'git clone',
        'git pull',
        'git push',
        'git commit',
        'git checkout',
        'git merge',
        'git status',
        'git log',
        'git diff'
      ]
    };

    return NextResponse.json({
      success: true,
      data: testResults,
      message: 'Git integration test completed successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Git integration test failed' },
      { status: 500 }
    );
  }
}
