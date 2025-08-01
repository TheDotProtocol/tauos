import { NextRequest, NextResponse } from 'next/server';
import { Redis } from 'ioredis';

// Initialize Redis connection
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Mock email data for development
const mockEmails = [
  {
    id: '1',
    from: 'john.doe@tauos.org',
    to: ['admin@tauos.org'],
    subject: 'Welcome to TauMail',
    preview: 'Welcome to your new TauMail account. This is a secure, privacy-first email service.',
    date: new Date('2024-01-15T10:30:00Z'),
    isRead: false,
    isStarred: true,
    hasAttachments: false,
    isImportant: true,
    body: 'Welcome to your new TauMail account. This is a secure, privacy-first email service that integrates seamlessly with the TauOS ecosystem.',
    threadId: 'thread-1'
  },
  {
    id: '2',
    from: 'meeting@tauos.org',
    to: ['admin@tauos.org'],
    subject: 'Team Meeting - TauOS Integration',
    preview: 'Discussion about integrating TauMail with TauConnect, TauMessenger, and TauCalendar.',
    date: new Date('2024-01-15T09:15:00Z'),
    isRead: true,
    isStarred: false,
    hasAttachments: true,
    isImportant: true,
    body: 'Hi team,\n\nLet\'s discuss the integration of TauMail with our other services:\n\n- TauConnect: Video call integration\n- TauMessenger: Chat integration\n- TauCalendar: Event creation from emails\n- TauCloud: File attachment storage\n\nPlease review the attached integration plan.',
    threadId: 'thread-2',
    attachments: [
      {
        name: 'integration-plan.pdf',
        size: 1024000,
        type: 'application/pdf'
      }
    ]
  },
  {
    id: '3',
    from: 'support@tauos.org',
    to: ['admin@tauos.org'],
    subject: 'TauCloud Storage Integration',
    preview: 'Your TauCloud storage has been successfully integrated with TauMail.',
    date: new Date('2024-01-14T16:45:00Z'),
    isRead: true,
    isStarred: false,
    hasAttachments: false,
    isImportant: false,
    body: 'Your TauCloud storage has been successfully integrated with TauMail. You can now:\n\n- Attach files directly from TauCloud\n- Store email attachments in TauCloud\n- Share files via email with TauCloud links\n\nStorage quota: 1GB used of 10GB total',
    threadId: 'thread-3'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'inbox';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // In production, this would fetch from the actual mail server
    // For now, return mock data
    const emails = mockEmails.slice((page - 1) * limit, page * limit);

    // Cache the results in Redis
    await redis.setex(`emails:${folder}:${page}`, 300, JSON.stringify(emails));

    return NextResponse.json({
      emails,
      pagination: {
        page,
        limit,
        total: mockEmails.length,
        totalPages: Math.ceil(mockEmails.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, cc, bcc, subject, body: emailBody, attachments, replyTo } = body;

    // Validate required fields
    if (!to || !subject || !emailBody) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In production, this would send via SMTP
    const emailId = `email-${Date.now()}`;
    const newEmail = {
      id: emailId,
      from: 'admin@tauos.org', // Current user
      to: Array.isArray(to) ? to : [to],
      cc: cc || [],
      bcc: bcc || [],
      subject,
      body: emailBody,
      date: new Date(),
      isRead: true,
      isStarred: false,
      hasAttachments: attachments && attachments.length > 0,
      isImportant: false,
      attachments: attachments || []
    };

    // Store in Redis for immediate access
    await redis.setex(`email:${emailId}`, 3600, JSON.stringify(newEmail));

    // Integration with other TauOS services
    if (attachments && attachments.length > 0) {
      // Integrate with TauCloud for file storage
      console.log('Integrating with TauCloud for file storage');
    }

    // Check if this is a calendar-related email
    if (subject.toLowerCase().includes('meeting') || subject.toLowerCase().includes('event')) {
      // Integrate with TauCalendar
      console.log('Integrating with TauCalendar for event creation');
    }

    // Check if this is a call-related email
    if (subject.toLowerCase().includes('call') || subject.toLowerCase().includes('video')) {
      // Integrate with TauConnect
      console.log('Integrating with TauConnect for video calls');
    }

    return NextResponse.json({
      success: true,
      emailId,
      message: 'Email sent successfully'
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 