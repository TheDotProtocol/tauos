import { NextRequest, NextResponse } from 'next/server';
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { action, value } = body;

    // Get the email from Redis or mock data
    const emailKey = `email:${id}`;
    const cachedEmail = await redis.get(emailKey);
    
    let email;
    if (cachedEmail) {
      email = JSON.parse(cachedEmail);
    } else {
      // Fallback to mock data for development
      email = {
        id,
        from: 'sender@tauos.org',
        to: ['admin@tauos.org'],
        subject: 'Sample Email',
        preview: 'This is a sample email for testing.',
        date: new Date(),
        isRead: false,
        isStarred: false,
        hasAttachments: false,
        isImportant: false,
        body: 'Sample email body content.'
      };
    }

    // Update email based on action
    switch (action) {
      case 'star':
        email.isStarred = value;
        break;
      case 'read':
        email.isRead = value;
        break;
      case 'important':
        email.isImportant = value;
        break;
      case 'archive':
        email.folder = 'archive';
        break;
      case 'delete':
        email.folder = 'trash';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Update in Redis
    await redis.setex(emailKey, 3600, JSON.stringify(email));

    // Log the action for monitoring
    await redis.lpush('email_actions', JSON.stringify({
      emailId: id,
      action,
      value,
      timestamp: new Date().toISOString()
    }));

    return NextResponse.json({
      success: true,
      email
    });
  } catch (error) {
    console.error('Error updating email:', error);
    return NextResponse.json(
      { error: 'Failed to update email' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // In production, this would mark the email as deleted in the mail server
    // For now, just remove from Redis
    await redis.del(`email:${id}`);

    // Log the deletion
    await redis.lpush('email_actions', JSON.stringify({
      emailId: id,
      action: 'delete',
      timestamp: new Date().toISOString()
    }));

    return NextResponse.json({
      success: true,
      message: 'Email deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting email:', error);
    return NextResponse.json(
      { error: 'Failed to delete email' },
      { status: 500 }
    );
  }
} 