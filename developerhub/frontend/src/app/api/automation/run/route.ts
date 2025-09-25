import { NextRequest, NextResponse } from 'next/server';

interface RunPipelineRequest {
  pipelineId: string;
  trigger?: 'manual' | 'push' | 'pull_request' | 'schedule';
  environment?: string;
  variables?: Record<string, string>;
}

interface PipelineRun {
  id: string;
  pipelineId: string;
  status: 'running' | 'success' | 'failed' | 'cancelled';
  startTime: string;
  endTime?: string;
  duration: number;
  steps: PipelineStep[];
  logs: string[];
  environment: string;
  variables: Record<string, string>;
}

interface PipelineStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  startTime?: string;
  endTime?: string;
  duration: number;
  logs: string[];
}

// Mock data for pipeline runs
const pipelineRuns: PipelineRun[] = [];

export async function POST(request: NextRequest) {
  try {
    const body: RunPipelineRequest = await request.json();
    const { pipelineId, trigger = 'manual', environment = 'staging', variables = {} } = body;

    // Validate required fields
    if (!pipelineId) {
      return NextResponse.json(
        { success: false, error: 'Pipeline ID is required' },
        { status: 400 }
      );
    }

    // Create new pipeline run
    const runId = `run_${Date.now()}`;
    const startTime = new Date().toISOString();

    const newRun: PipelineRun = {
      id: runId,
      pipelineId,
      status: 'running',
      startTime,
      duration: 0,
      environment,
      variables,
      steps: [
        {
          id: '1',
          name: 'Checkout Code',
          status: 'running',
          startTime,
          duration: 0,
          logs: ['Starting checkout...', 'Fetching repository...']
        },
        {
          id: '2',
          name: 'Install Dependencies',
          status: 'pending',
          duration: 0,
          logs: []
        },
        {
          id: '3',
          name: 'Build',
          status: 'pending',
          duration: 0,
          logs: []
        },
        {
          id: '4',
          name: 'Test',
          status: 'pending',
          duration: 0,
          logs: []
        },
        {
          id: '5',
          name: 'Deploy',
          status: 'pending',
          duration: 0,
          logs: []
        }
      ],
      logs: [
        `[${new Date().toISOString()}] Starting pipeline run ${runId}`,
        `[${new Date().toISOString()}] Environment: ${environment}`,
        `[${new Date().toISOString()}] Trigger: ${trigger}`,
        `[${new Date().toISOString()}] Variables: ${JSON.stringify(variables)}`
      ]
    };

    pipelineRuns.push(newRun);

    // Simulate pipeline execution
    simulatePipelineExecution(runId);

    return NextResponse.json({
      success: true,
      data: newRun,
      message: 'Pipeline run started successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to start pipeline run' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pipelineId = searchParams.get('pipelineId');
    const status = searchParams.get('status');
    const environment = searchParams.get('environment');

    let filteredRuns = pipelineRuns;

    // Apply filters
    if (pipelineId) {
      filteredRuns = filteredRuns.filter(run => run.pipelineId === pipelineId);
    }

    if (status) {
      filteredRuns = filteredRuns.filter(run => run.status === status);
    }

    if (environment) {
      filteredRuns = filteredRuns.filter(run => run.environment === environment);
    }

    // Sort by start time (newest first)
    filteredRuns.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    return NextResponse.json({
      success: true,
      data: filteredRuns,
      total: filteredRuns.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pipeline runs' },
      { status: 500 }
    );
  }
}

async function simulatePipelineExecution(runId: string) {
  const run = pipelineRuns.find(r => r.id === runId);
  if (!run) return;

  // Simulate step execution with delays
  const stepDelays = [2000, 3000, 5000, 4000, 2000]; // 2s, 3s, 5s, 4s, 2s

  for (let i = 0; i < run.steps.length; i++) {
    const step = run.steps[i];
    
    // Start step
    step.status = 'running';
    step.startTime = new Date().toISOString();
    
    // Add logs
    const stepLogs = [
      `[${new Date().toISOString()}] Starting ${step.name}...`,
      `[${new Date().toISOString()}] Executing ${step.name}...`
    ];
    
    step.logs.push(...stepLogs);
    run.logs.push(...stepLogs);

    // Wait for step to complete
    await new Promise(resolve => setTimeout(resolve, stepDelays[i]));

    // Complete step
    step.status = 'success';
    step.endTime = new Date().toISOString();
    step.duration = Math.floor((new Date(step.endTime).getTime() - new Date(step.startTime!).getTime()) / 1000);

    // Add completion logs
    const completionLogs = [
      `[${new Date().toISOString()}] ${step.name} completed successfully`,
      `[${new Date().toISOString()}] Duration: ${step.duration}s`
    ];
    
    step.logs.push(...completionLogs);
    run.logs.push(...completionLogs);

    // Update run duration
    run.duration = Math.floor((new Date().getTime() - new Date(run.startTime).getTime()) / 1000);
  }

  // Complete pipeline
  run.status = 'success';
  run.endTime = new Date().toISOString();
  run.duration = Math.floor((new Date(run.endTime).getTime() - new Date(run.startTime).getTime()) / 1000);

  const completionLogs = [
    `[${new Date().toISOString()}] Pipeline run ${runId} completed successfully`,
    `[${new Date().toISOString()}] Total duration: ${run.duration}s`,
    `[${new Date().toISOString()}] All steps passed`
  ];
  
  run.logs.push(...completionLogs);
}
