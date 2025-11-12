import { NextRequest, NextResponse } from 'next/server';
import { projectRepository } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from session (for now, use a default)
    // TODO: Get from authenticated session
    const userId = request.headers.get('x-user-id') || 'default-user';
    
    const projects = await projectRepository.findByUserId(userId);
    
    return NextResponse.json({
      success: true,
      data: projects
    });
  } catch (error: unknown) {
    console.error('Failed to fetch projects:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // If database is not available, return empty array instead of error
    if (errorMessage.includes('does not exist') || errorMessage.includes('connection')) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch projects',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

// Sanitize input to prevent XSS and injection
function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
    .substring(0, 1000); // Limit length
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { name, description, repositoryUrl, isPublic } = body;

    // Validate required fields
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Project name is required' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    name = sanitizeInput(name);
    if (description) description = sanitizeInput(description);
    if (repositoryUrl) {
      // Validate URL format
      try {
        new URL(repositoryUrl);
      } catch {
        return NextResponse.json(
          { success: false, error: 'Invalid repository URL format' },
          { status: 400 }
        );
      }
    }

    // Additional validation
    if (name.length === 0 || name.length > 255) {
      return NextResponse.json(
        { success: false, error: 'Project name must be between 1 and 255 characters' },
        { status: 400 }
      );
    }

    // Get user ID from session (for now, use a default)
    // TODO: Get from authenticated session
    const userId = request.headers.get('x-user-id') || 'default-user';

    // Create project
    const project = await projectRepository.create({
      userId,
      name,
      description,
      repositoryUrl,
      isPublic: isPublic !== false
    });

    return NextResponse.json({
      success: true,
      data: project,
      message: 'Project created successfully'
    });
  } catch (error: unknown) {
    console.error('Failed to create project:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Check if it's a database connection error
    if (errorMessage.includes('does not exist') || errorMessage.includes('connection')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database connection failed. Please ensure PostgreSQL is running and the projects table exists.',
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        },
        { status: 500 }
      );
    }
    
    // Check if table doesn't exist
    if (errorMessage.includes('relation') && errorMessage.includes('does not exist')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Projects table not found. Please run database migrations.',
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create project',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

