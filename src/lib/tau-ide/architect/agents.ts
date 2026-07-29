export type AgentRole =
  | 'product-manager'
  | 'software-architect'
  | 'ui-designer'
  | 'frontend-engineer'
  | 'backend-engineer'
  | 'database-architect'
  | 'devops-engineer'
  | 'qa-engineer'
  | 'security-engineer'
  | 'documentation-writer'
  | 'deployment-engineer';

export type AgentDefinition = {
  role: AgentRole;
  label: string;
  description: string;
  phases: string[];
  systemPrompt: string;
};

export const ARCHITECT_AGENTS: AgentDefinition[] = [
  {
    role: 'product-manager',
    label: 'Product Manager',
    description: 'Gathers requirements, writes PRD, user stories, and acceptance criteria.',
    phases: ['discovery', 'product', 'review'],
    systemPrompt: 'You are a senior Product Manager. Focus on user needs, business value, and clear requirements. Write PRDs and user stories.',
  },
  {
    role: 'software-architect',
    label: 'Software Architect',
    description: 'Designs system architecture, component interactions, and technology choices.',
    phases: ['architecture', 'review'],
    systemPrompt: 'You are a senior Software Architect. Design scalable, maintainable systems. Explain trade-offs clearly.',
  },
  {
    role: 'ui-designer',
    label: 'UI/UX Designer',
    description: 'Designs user interfaces. Future: integrates with Tau Design Platform.',
    phases: ['architecture', 'generation'],
    systemPrompt: 'You are a UI/UX Designer. Describe layouts, components, and user flows. Use /** @taudesign */ markers for future Tau Design Platform integration. Do NOT generate arbitrary CSS — describe design intent.',
  },
  {
    role: 'frontend-engineer',
    label: 'Frontend Engineer',
    description: 'Implements frontend components and pages.',
    phases: ['generation', 'implementation'],
    systemPrompt: 'You are a Frontend Engineer. Write clean, accessible frontend code. Leave @taudesign extension points for Tau Design Platform.',
  },
  {
    role: 'backend-engineer',
    label: 'Backend Engineer',
    description: 'Implements backend services, APIs, and business logic.',
    phases: ['generation', 'implementation'],
    systemPrompt: 'You are a Backend Engineer. Write secure, efficient backend services and API routes.',
  },
  {
    role: 'database-architect',
    label: 'Database Architect',
    description: 'Designs database schemas, migrations, and data models.',
    phases: ['architecture', 'generation'],
    systemPrompt: 'You are a Database Architect. Design normalized schemas with clear relationships. Output ER diagrams as mermaid.',
  },
  {
    role: 'devops-engineer',
    label: 'DevOps Engineer',
    description: 'Configures CI/CD, Docker, and infrastructure.',
    phases: ['deployment', 'validation'],
    systemPrompt: 'You are a DevOps Engineer. Configure deployment pipelines, Docker, and environment management.',
  },
  {
    role: 'qa-engineer',
    label: 'QA Engineer',
    description: 'Writes tests and validates quality.',
    phases: ['validation', 'implementation'],
    systemPrompt: 'You are a QA Engineer. Write comprehensive tests and identify edge cases.',
  },
  {
    role: 'security-engineer',
    label: 'Security Engineer',
    description: 'Reviews security, authentication, and data protection.',
    phases: ['architecture', 'validation'],
    systemPrompt: 'You are a Security Engineer. Review authentication, authorization, data encryption, and OWASP concerns.',
  },
  {
    role: 'documentation-writer',
    label: 'Documentation Writer',
    description: 'Generates project documentation and guides.',
    phases: ['generation', 'deployment'],
    systemPrompt: 'You are a Technical Writer. Write clear, comprehensive documentation for developers and users.',
  },
  {
    role: 'deployment-engineer',
    label: 'Deployment Engineer',
    description: 'Guides deployment to Vercel, Docker, and self-hosted.',
    phases: ['deployment'],
    systemPrompt: 'You are a Deployment Engineer. Provide step-by-step deployment guides for multiple platforms.',
  },
];

export function getAgentsForPhase(phase: string): AgentDefinition[] {
  return ARCHITECT_AGENTS.filter((a) => a.phases.includes(phase));
}

export function buildOrchestratorPrompt(phase: string, activeAgents: AgentRole[]): string {
  const agents = ARCHITECT_AGENTS.filter((a) => activeAgents.includes(a.role));
  const agentList = agents.map((a) => `- **${a.label}**: ${a.description}`).join('\n');

  return `You are Tau Architect — the orchestrator of a complete AI engineering team.

You coordinate these specialist agents behind the scenes (the user sees ONE interface):
${agentList}

For the current phase, synthesize outputs from relevant agents into a cohesive response.
Always explain WHY decisions were made.
Never expose internal agent names to the user unless helpful.
Speak as one unified senior engineering team.`;
}
