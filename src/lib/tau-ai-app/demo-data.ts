/** Figma demo content — UI state only until backend integrations ship */
export const tauAiContinueConversations = [
  { id: 'q3-market', title: 'Q3 Market Analysis', category: 'Research', time: '2h ago', href: '/tau-ai-app/chat?q=q3-market' },
  { id: 'tokyo', title: 'Travel Plan: Tokyo', category: 'Personal', time: 'Yesterday', href: '/tau-ai-app/chat' },
  { id: 'arch', title: 'App Architecture Review', category: 'Systems', time: '3 days ago', href: '/tau-ai-app/chat' },
] as const;

export const tauAiPinnedKnowledge = [
  { title: 'Tau Ecosystem Architecture Spec', meta: '4.2 MB • PDF' },
  { title: 'Local Neural Node Configuration Guide', meta: '128 KB • MARKDOWN' },
  { title: 'Private Security Protocol V2', meta: '1.1 MB • DOC' },
] as const;

export const tauAiQuickActions = [
  { id: 'research', label: 'Research', subtitle: 'Launch research stream', icon: 'research' as const },
  { id: 'analyse', label: 'Analyse', subtitle: 'Launch analyse stream', icon: 'analyse' as const },
  { id: 'write', label: 'Write', subtitle: 'Launch write stream', icon: 'write' as const },
  { id: 'brainstorm', label: 'Brainstorm', subtitle: 'Launch brainstorm stream', icon: 'brainstorm' as const },
  { id: 'code', label: 'Code', subtitle: 'Launch code stream', icon: 'terminal' as const },
  { id: 'globe', label: 'Explore', subtitle: 'Launch explore stream', icon: 'globe' as const },
] as const;

export const tauAiEcosystemNodes = ['Tau Mail', 'Tau Cloud', 'Tau Browser', 'Tau OS Core'] as const;

export const tauAiWelcomeTasks = [
  {
    title: 'Research a topic',
    description: 'Deep dive literature & outline synthesized briefs',
  },
  {
    title: 'Analyse a document',
    description: 'Extract critical risk factors & structural patterns',
  },
  {
    title: 'Write something',
    description: 'Draft high-impact technical specs or clean copy',
  },
  {
    title: 'Build a project',
    description: 'Bootstrap codebases & construct architecture design',
  },
] as const;

export const tauAiChatFollowUps = [
  'Go deeper on competitors',
  'Create presentation',
  'Email summary to team',
] as const;

export const tauAiWorkspaceCards = [
  {
    title: 'Q3 Competitive Analysis',
    category: 'Research',
    time: '2 hours ago',
    description: 'Synthesizing market positioning benchmarks and pricing dynamics of Tier 1 nodes.',
    progress: 85,
  },
  {
    title: 'Product Launch Copy',
    category: 'Writing',
    time: '5 hours ago',
    description: 'Crafting premium launch scripts and executive summaries for the Tau OS announcement.',
    progress: 45,
  },
  {
    title: 'API Migration Plan',
    category: 'Programming',
    time: 'Yesterday',
    description: 'Architecting isolated local container boundaries to secure data stream ingest.',
    progress: 95,
  },
  {
    title: 'Budget Forecast 2025',
    category: 'Finance',
    time: '2 days ago',
    description: 'Modelling compute cost projections vs token allocations for local-node architectures.',
    progress: 60,
  },
  {
    title: 'Tokyo Business Trip',
    category: 'Travel',
    time: '3 days ago',
    description: 'Structuring corporate delegation travel briefs, local secure network nodes and meetings.',
    progress: 30,
  },
  {
    title: 'Contract Review — Series B',
    category: 'Legal',
    time: '1 week ago',
    description: 'Extracting key corporate risk profiles and intellectual sovereignty protection clauses.',
    progress: 75,
  },
] as const;

export const tauAiWorkspaceFilters = [
  'All',
  'Research',
  'Writing',
  'Programming',
  'Business',
  'Education',
  'Legal',
  'Finance',
  'Travel',
  'Health',
] as const;

export const tauAiNewChatSuggestions = [
  { title: 'Research & Analysis', description: 'Deep dive literature & outline synthesized briefs' },
  { title: 'Writing & Editing', description: 'Draft high-impact technical specs or clean copy' },
  { title: 'Code & Development', description: 'Write, debug, and explain complex source code' },
  { title: 'Data & Documents', description: 'Extract risk factors, analyse files & structural patterns' },
] as const;

export const tauAiNewChatCapabilities = [
  { label: 'Web Research', icon: 'globe2' as const },
  { label: 'File Analysis', icon: 'fileSearch' as const },
  { label: 'Code Execution', icon: 'terminalSquare' as const },
  { label: 'Image Understanding', icon: 'eye' as const },
] as const;

/** Substrate routing options — Figma layout, honest substrate labels (not Tau-owned weights) */
export const tauAiSubstrateOptions = [
  {
    id: 'ollama',
    label: 'Ollama (Local)',
    badges: ['FAST', 'Local'],
    recommended: false,
    icon: 'zap' as const,
    description: 'Quick responses via local Ollama substrate. Best for simple questions when configured.',
  },
  {
    id: 'auto',
    label: 'Auto Router',
    badges: ['RECOMMENDED', 'Local'],
    recommended: true,
    icon: 'brainCircuit' as const,
    description: 'DeterministicModelRouter selects the best configured substrate for your task.',
  },
  {
    id: 'remote',
    label: 'Remote Substrate',
    badges: ['ADVANCED', 'Cloud'],
    recommended: false,
    icon: 'microscope' as const,
    description: 'Complex tasks via configured remote provider (DeepSeek, OpenAI, etc.) when allowed.',
  },
] as const;

export const tauAiHistoryFilters = ['All', 'Today', 'This Week', 'This Month', 'Archived'] as const;

export const tauAiConversationHistory = [
  {
    section: 'Today',
    items: [
      { title: 'Q3 Market Analysis', snippet: 'Compare our Q3 performance indicators against competitors...', substrate: 'Auto', time: '2h ago' },
      { title: 'Travel Plan: Tokyo May 2025', snippet: 'Draft a 7-day itinerary with local secure network nodes...', substrate: 'Ollama', time: '5h ago' },
    ],
  },
  {
    section: 'Yesterday',
    items: [
      { title: 'React Component Architecture', snippet: 'Review the folder structure and propose improvements...', substrate: 'Auto', time: '1d ago' },
      { title: 'Email Draft: Partnership Proposal', snippet: 'Write a professional outreach email to potential partners...', substrate: 'Auto', time: '1d ago' },
    ],
  },
  {
    section: 'This Week',
    items: [
      { title: 'Python Data Pipeline Review', snippet: 'Analyse the ETL pipeline for bottlenecks and security...', substrate: 'Remote', time: '3d ago' },
      { title: 'Brand Strategy Workshop Notes', snippet: 'Summarize key decisions from the workshop session...', substrate: 'Auto', time: '4d ago' },
      { title: 'Legal Contract Summary', snippet: 'Extract key terms and risk factors from the agreement...', substrate: 'Remote', time: '5d ago' },
      { title: 'Weekly Team Update Template', snippet: 'Create a reusable template for weekly status updates...', substrate: 'Ollama', time: '6d ago' },
    ],
  },
] as const;

export const tauAiSearchFilters = ['All', 'Conversations', 'Files', 'Knowledge Base', 'Web'] as const;

export const tauAiSearchResults = [
  {
    type: 'Conversation',
    title: 'Q3 Competitor Performance Analysis',
    snippet: '...our growth vectors remained highly stable despite increased customer acquisition compression in ',
    highlight: 'Region A which witnessed a 14.8% growth delta',
    meta: 'October 12, 2026',
    match: '98% Match',
  },
  {
    type: 'PDF File',
    title: 'Tau Ecosystem Architecture Spec.pdf',
    snippet: '...The local neural architecture guarantees zero external latency by processing state variables inside ',
    highlight: 'the isolated system runtime',
    meta: '4.2 MB • Updated 3 days ago',
    match: '85% Match',
  },
  {
    type: 'Knowledge Entry',
    title: 'Private Security Protocols & Encryption Standards',
    snippet: 'Overview of AES-256 state machines, cryptographic key encapsulation, and local secure storage mapping.',
    highlight: '',
    meta: 'Ecosystem Core Documents',
    match: 'Relevant',
  },
] as const;

export const tauAiRecentSearches = ['Region A Churn Rates', 'Local server config', 'Cryptographic seeds'] as const;

export const tauAiSavedKnowledge = ['Tokyo Itinerary Guide', 'Ecosystem Spec v2.1', 'Secure Shell Tunneling'] as const;

export const tauAiGrayscaleWorkflows = [
  { name: 'Customer Onboarding', status: 'RUNNING', color: '#4ade80' },
  { name: 'Content Review Auto', status: 'RUNNING', color: '#4ade80' },
  { name: 'Sales Qualification', status: 'PAUSED', color: '#d4a843' },
  { name: 'Compliance Audit Tr...', status: 'SCHEDULED', color: '#60a5fa' },
] as const;
