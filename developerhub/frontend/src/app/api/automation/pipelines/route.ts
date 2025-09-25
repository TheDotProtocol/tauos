import { NextRequest, NextResponse } from 'next/server';

interface Pipeline {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'success' | 'failed' | 'pending' | 'cancelled';
  trigger: 'push' | 'pull_request' | 'schedule' | 'manual';
  repository: string;
  branch: string;
  lastRun: string;
  duration: number;
  steps: PipelineStep[];
  environment: string;
  deployment?: {
    status: 'pending' | 'deploying' | 'success' | 'failed';
    url?: string;
    environment: string;
  };
}

interface PipelineStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  duration: number;
  logs?: string[];
}

// Mock data - in production, this would connect to actual CI/CD systems
const pipelines: Pipeline[] = [
  {
    id: '1',
    name: 'TauCore Build & Test',
    description: 'Build and test TauCore™ operating system',
    status: 'success',
    trigger: 'push',
    repository: 'tauos/tauos-core',
    branch: 'main',
    lastRun: '2025-01-15T10:30:00Z',
    duration: 1200,
    environment: 'production',
    steps: [
      { id: '1', name: 'Checkout Code', status: 'success', duration: 15 },
      { id: '2', name: 'Install Dependencies', status: 'success', duration: 45 },
      { id: '3', name: 'Build Kernel', status: 'success', duration: 300 },
      { id: '4', name: 'Run Tests', status: 'success', duration: 180 },
      { id: '5', name: 'Build ISO', status: 'success', duration: 240 },
      { id: '6', name: 'Deploy', status: 'success', duration: 420 }
    ],
    deployment: {
      status: 'success',
      url: 'https://tauos.org/downloads',
      environment: 'production'
    }
  },
  {
    id: '2',
    name: 'TauScript CI',
    description: 'Build and test TauScript language',
    status: 'running',
    trigger: 'pull_request',
    repository: 'tauos/tauscript',
    branch: 'feature/ai-sdk',
    lastRun: '2025-01-15T11:15:00Z',
    duration: 0,
    environment: 'staging',
    steps: [
      { id: '1', name: 'Checkout Code', status: 'success', duration: 12 },
      { id: '2', name: 'Install Dependencies', status: 'success', duration: 30 },
      { id: '3', name: 'Compile TauScript', status: 'running', duration: 0 },
      { id: '4', name: 'Run Tests', status: 'pending', duration: 0 },
      { id: '5', name: 'Build Packages', status: 'pending', duration: 0 },
      { id: '6', name: 'Deploy to Staging', status: 'pending', duration: 0 }
    ]
  },
  {
    id: '3',
    name: 'Documentation Build',
    description: 'Build and deploy documentation',
    status: 'failed',
    trigger: 'push',
    repository: 'tauos/docs',
    branch: 'main',
    lastRun: '2025-01-15T09:45:00Z',
    duration: 180,
    environment: 'production',
    steps: [
      { id: '1', name: 'Checkout Code', status: 'success', duration: 8 },
      { id: '2', name: 'Install Dependencies', status: 'success', duration: 25 },
      { id: '3', name: 'Build Docs', status: 'failed', duration: 0 },
      { id: '4', name: 'Deploy', status: 'skipped', duration: 0 }
    ]
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const repository = searchParams.get('repository');
    const environment = searchParams.get('environment');

    let filteredPipelines = pipelines;

    // Apply filters
    if (status) {
      filteredPipelines = filteredPipelines.filter(pipeline => pipeline.status === status);
    }

    if (repository) {
      filteredPipelines = filteredPipelines.filter(pipeline => 
        pipeline.repository.toLowerCase().includes(repository.toLowerCase())
      );
    }

    if (environment) {
      filteredPipelines = filteredPipelines.filter(pipeline => pipeline.environment === environment);
    }

    return NextResponse.json({
      success: true,
      data: filteredPipelines,
      total: filteredPipelines.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pipelines' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, repository, branch, environment, steps } = body;

    // Validate required fields
    if (!name || !repository) {
      return NextResponse.json(
        { success: false, error: 'Name and repository are required' },
        { status: 400 }
      );
    }

    // Create new pipeline
    const newPipeline: Pipeline = {
      id: Date.now().toString(),
      name,
      description: description || '',
      status: 'pending',
      trigger: 'manual',
      repository,
      branch: branch || 'main',
      lastRun: new Date().toISOString(),
      duration: 0,
      environment: environment || 'staging',
      steps: steps || [
        { id: '1', name: 'Checkout Code', status: 'pending', duration: 0 },
        { id: '2', name: 'Install Dependencies', status: 'pending', duration: 0 },
        { id: '3', name: 'Build', status: 'pending', duration: 0 },
        { id: '4', name: 'Test', status: 'pending', duration: 0 },
        { id: '5', name: 'Deploy', status: 'pending', duration: 0 }
      ]
    };

    pipelines.push(newPipeline);

    return NextResponse.json({
      success: true,
      data: newPipeline,
      message: 'Pipeline created successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create pipeline' },
      { status: 500 }
    );
  }
}
