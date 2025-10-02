import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Mock update database (in production, use real database)
const updates = {
  '1.0.1': {
    version: '1.0.1',
    size: '15.2MB',
    checksum: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
    description: 'Security patches and performance improvements'
  },
  '1.0.2': {
    version: '1.0.2',
    size: '12.8MB',
    checksum: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1',
    description: 'Bug fixes and new features'
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { version: string } }
) {
  try {
    const version = params.version;
    
    console.log(`📥 OTA Download: Version ${version}`);
    
    const updateInfo = updates[version];
    
    if (!updateInfo) {
      console.log(`❌ Update not found: ${version}`);
      
      return NextResponse.json({
        error: 'Update not found',
        version: version
      }, { status: 404 });
    }
    
    console.log(`✅ Update found: ${version} (${updateInfo.size})`);
    
    // In production, this would serve actual update files
    // For now, create a mock update package
    const mockUpdateContent = `TauOS Update ${version}
This is a mock update package for testing.
In production, this would contain actual system updates.

Update Information:
- Version: ${updateInfo.version}
- Size: ${updateInfo.size}
- Checksum: ${updateInfo.checksum}
- Description: ${updateInfo.description}

Installation Instructions:
1. Download the update package
2. Verify the checksum
3. Extract the package
4. Run the installation script
5. Restart the system

This update includes:
- Security patches
- Performance improvements
- Bug fixes
- New features

For support, visit: https://tauos.org/support
`;
    
    // Create mock update package
    const updateBuffer = Buffer.from(mockUpdateContent, 'utf8');
    
    return new NextResponse(updateBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="tauos-update-${version}.tar.gz"`,
        'Content-Length': updateBuffer.length.toString(),
        'X-Update-Version': version,
        'X-Update-Size': updateInfo.size,
        'X-Update-Checksum': updateInfo.checksum
      }
    });
    
  } catch (error) {
    console.error('❌ OTA Download Error:', error);
    
    return NextResponse.json({
      error: 'Failed to download update',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
