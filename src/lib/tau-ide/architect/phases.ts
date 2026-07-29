export type ArchitectPhaseId =
  | 'discovery'
  | 'product'
  | 'architecture'
  | 'generation'
  | 'review'
  | 'implementation'
  | 'validation'
  | 'deployment';

export type ArchitectPhase = {
  id: ArchitectPhaseId;
  label: string;
  description: string;
  order: number;
  deliverables: string[];
};

export const ARCHITECT_PHASES: ArchitectPhase[] = [
  {
    id: 'discovery',
    label: 'Discovery',
    description: 'Understand the problem, users, and constraints through intelligent questions.',
    order: 1,
    deliverables: ['Problem statement', 'User personas', 'Constraints', 'Technology preferences'],
  },
  {
    id: 'product',
    label: 'Product Definition',
    description: 'Generate PRD, user stories, acceptance criteria, and timeline.',
    order: 2,
    deliverables: ['PRD', 'Functional requirements', 'Non-functional requirements', 'User stories', 'Milestones'],
  },
  {
    id: 'architecture',
    label: 'Technical Architecture',
    description: 'Design system, frontend, backend, database, API, and security.',
    order: 3,
    deliverables: ['System architecture', 'Database schema', 'API design', 'Security plan', 'Architecture diagram'],
  },
  {
    id: 'generation',
    label: 'Project Generation',
    description: 'Generate complete project structure with all files organized.',
    order: 4,
    deliverables: ['Frontend', 'Backend', 'API', 'Database migrations', 'Config files', 'Documentation', 'Tests'],
  },
  {
    id: 'review',
    label: 'Review',
    description: 'Review all deliverables before implementation. Edit and approve.',
    order: 5,
    deliverables: ['Requirements review', 'Architecture review', 'Structure review', 'Timeline review'],
  },
  {
    id: 'implementation',
    label: 'Implementation',
    description: 'Generate code incrementally with tracked progress.',
    order: 6,
    deliverables: ['Component code', 'Service code', 'API routes', 'Database models', 'Tests'],
  },
  {
    id: 'validation',
    label: 'Validation',
    description: 'Lint, analyze, build, test, and security review.',
    order: 7,
    deliverables: ['Lint report', 'Build validation', 'Test results', 'Security review'],
  },
  {
    id: 'deployment',
    label: 'Deployment',
    description: 'Guided deployment to Vercel, Docker, or self-hosted.',
    order: 8,
    deliverables: ['Deployment config', 'Environment setup', 'CI/CD pipeline', 'Deploy guide'],
  },
];

export function getPhasePrompt(phase: ArchitectPhaseId, mode: 'beginner' | 'professional'): string {
  const jargon = mode === 'beginner'
    ? 'Use plain English. Avoid jargon unless the user asks for technical detail. Explain every recommendation.'
    : 'Use precise technical language. Include implementation details, trade-offs, and alternatives.';

  const prompts: Record<ArchitectPhaseId, string> = {
    discovery: `PHASE: Discovery. ${jargon}

NEVER generate code in this phase. Ask intelligent follow-up questions about:
- What problem are you solving?
- Who are your users?
- Mobile or web?
- Authentication needs?
- Payments?
- Notifications?
- Language/framework preferences?
- Database preferences?
- Cloud provider?
- Estimated scale?

Summarize what you've learned so far. When you have enough information, suggest moving to Product Definition.`,

    product: `PHASE: Product Definition. ${jargon}

Generate a complete Product Requirements Document with:
## PRD
### Problem Statement
### Target Users
### Functional Requirements
### Non-Functional Requirements
### User Stories (As a... I want... So that...)
### Acceptance Criteria
### Milestones
### Project Timeline

Make each section editable. Explain why each requirement matters.
When complete, suggest moving to Technical Architecture.`,

    architecture: `PHASE: Technical Architecture. ${jargon}

Generate:
## System Architecture
## Frontend Architecture
## Backend Architecture
## API Structure (REST/GraphQL endpoints)
## Authentication Strategy
## Database Design (tables, relationships)
## Entity Relationship Diagram (as mermaid erDiagram)
## Storage Strategy
## Security Plan
## Deployment Plan

Include a mermaid architecture diagram:
\`\`\`mermaid
graph TD
  Frontend --> API
  API --> Backend
  Backend --> Database
\`\`\`

Explain every technology choice in simple terms.
When complete, suggest Project Generation.`,

    generation: `PHASE: Project Generation. ${jargon}

Generate the complete project structure. Output a JSON block:
\`\`\`tau-project
{
  "projectName": "...",
  "description": "...",
  "stack": { "frontend": "...", "backend": "...", "database": "..." },
  "files": [
    { "path": "/src/main.tau", "content": "...", "category": "backend" },
    { "path": "/README.md", "content": "...", "category": "docs" }
  ],
  "tasks": [
    { "id": "1", "title": "Setup project", "status": "pending", "agent": "devops" }
  ]
}
\`\`\`

Organize: frontend/, backend/, api/, db/, tests/, docs/, .env.example
Future UI generation will use Tau Design Platform — leave /** @taudesign */ extension points in frontend files.`,

    review: `PHASE: Review. ${jargon}

Present a review checklist:
- [ ] Requirements complete
- [ ] Architecture approved
- [ ] Database schema reviewed
- [ ] API endpoints defined
- [ ] Project structure correct
- [ ] Timeline realistic

Ask the user what they'd like to change before implementation.
Do NOT regenerate everything unless requested.`,

    implementation: `PHASE: Implementation. ${jargon}

Generate code ONE component at a time. Track progress:
\`\`\`tau-task
{ "id": "1", "title": "User auth module", "status": "in_progress", "agent": "backend" }
\`\`\`

Output individual files in tau-project blocks. Never regenerate the entire project unless asked.
Use TauScript for backend logic where appropriate.`,

    validation: `PHASE: Validation. ${jargon}

Perform validation checklist:
## Lint Results
## Static Analysis
## Build Validation
## Dependency Check
## Basic Tests
## Security Review

Output results as:
\`\`\`tau-validation
{ "passed": 8, "failed": 1, "warnings": 2, "items": [...] }
\`\`\``,

    deployment: `PHASE: Deployment. ${jargon}

Provide guided deployment for:
- Vercel (Next.js frontend)
- Docker (containerized)
- Self-hosted (manual steps)
- Tau Cloud (Version 2 — note as future)

Include environment variables, build commands, and step-by-step instructions.`,
  };

  return prompts[phase];
}
