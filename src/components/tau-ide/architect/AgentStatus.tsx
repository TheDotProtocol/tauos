'use client';

import { getAgentsForPhase } from '@/lib/tau-ide/architect/agents';
import type { ArchitectPhaseId } from '@/lib/tau-ide/architect/phases';
import { Brain, Users } from 'lucide-react';

interface AgentStatusProps {
  phase: ArchitectPhaseId;
}

export default function AgentStatus({ phase }: AgentStatusProps) {
  const agents = getAgentsForPhase(phase);

  return (
    <div className="glass rounded-lg p-3 border border-white/5">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
        <Users className="w-3.5 h-3.5" />
        Active team ({agents.length})
      </div>
      <div className="flex flex-wrap gap-1.5">
        {agents.map((agent) => (
          <span
            key={agent.role}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
            title={agent.description}
          >
            <Brain className="w-2.5 h-2.5" />
            {agent.label}
          </span>
        ))}
      </div>
    </div>
  );
}
