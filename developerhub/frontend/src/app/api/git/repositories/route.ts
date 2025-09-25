import { NextRequest, NextResponse } from 'next/server';

interface Repository {
  id: string;
  name: string;
  description: string;
  url: string;
  isPrivate: boolean;
  lastCommit: {
    hash: string;
    message: string;
    author: string;
    date: string;
  };
  branches: string[];
  currentBranch: string;
  status: 'clean' | 'modified' | 'conflict';
  remote: {
    name: string;
    url: string;
  };
}

// Mock data - in production, this would connect to actual Git repositories
const repositories: Repository[] = [
  {
    id: '1',
    name: 'tauos-core',
    description: 'TauCore™ operating system core',
    url: 'https://github.com/tauos/tauos-core',
    isPrivate: false,
    lastCommit: {
      hash: 'a1b2c3d',
      message: 'feat: implement universal driver support',
      author: 'Developer',
      date: '2025-01-15T10:30:00Z'
    },
    branches: ['main', 'develop', 'feature/kernel-integration'],
    currentBranch: 'main',
    status: 'clean',
    remote: {
      name: 'origin',
      url: 'https://github.com/tauos/tauos-core'
    }
  },
  {
    id: '2',
    name: 'tauscript',
    description: 'TauScript programming language',
    url: 'https://github.com/tauos/tauscript',
    isPrivate: false,
    lastCommit: {
      hash: 'e4f5g6h',
      message: 'feat: complete standard library implementation',
      author: 'Developer',
      date: '2025-01-15T09:15:00Z'
    },
    branches: ['main', 'develop', 'feature/ai-sdk'],
    currentBranch: 'develop',
    status: 'modified',
    remote: {
      name: 'origin',
      url: 'https://github.com/tauos/tauscript'
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const branch = searchParams.get('branch');

    let filteredRepos = repositories;

    // Apply filters
    if (search) {
      filteredRepos = filteredRepos.filter(repo => 
        repo.name.toLowerCase().includes(search.toLowerCase()) ||
        repo.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filteredRepos = filteredRepos.filter(repo => repo.status === status);
    }

    if (branch) {
      filteredRepos = filteredRepos.filter(repo => repo.branches.includes(branch));
    }

    return NextResponse.json({
      success: true,
      data: filteredRepos,
      total: filteredRepos.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, url, isPrivate, remote } = body;

    // Validate required fields
    if (!name || !url) {
      return NextResponse.json(
        { success: false, error: 'Name and URL are required' },
        { status: 400 }
      );
    }

    // Create new repository
    const newRepo: Repository = {
      id: Date.now().toString(),
      name,
      description: description || '',
      url,
      isPrivate: isPrivate || false,
      lastCommit: {
        hash: '0000000',
        message: 'Initial commit',
        author: 'Developer',
        date: new Date().toISOString()
      },
      branches: ['main'],
      currentBranch: 'main',
      status: 'clean',
      remote: remote || { name: 'origin', url }
    };

    repositories.push(newRepo);

    return NextResponse.json({
      success: true,
      data: newRepo,
      message: 'Repository created successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create repository' },
      { status: 500 }
    );
  }
}
