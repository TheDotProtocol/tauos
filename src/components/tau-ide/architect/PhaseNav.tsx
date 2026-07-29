'use client';

import { ARCHITECT_PHASES, type ArchitectPhaseId } from '@/lib/tau-ide/architect/phases';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';

interface PhaseNavProps {
  currentPhase: ArchitectPhaseId;
  onPhaseChange: (phase: ArchitectPhaseId) => void;
  completedPhases?: ArchitectPhaseId[];
}

export default function PhaseNav({ currentPhase, onPhaseChange, completedPhases = [] }: PhaseNavProps) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
      {ARCHITECT_PHASES.map((phase) => {
        const isActive = phase.id === currentPhase;
        const isComplete = completedPhases.includes(phase.id);
        const isPast = phase.order < (ARCHITECT_PHASES.find((p) => p.id === currentPhase)?.order ?? 0);

        return (
          <button
            key={phase.id}
            onClick={() => onPhaseChange(phase.id)}
            title={phase.description}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap shrink-0 transition-all ${
              isActive
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : isComplete || isPast
                  ? 'text-green-400/80 hover:bg-green-500/10'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            {isComplete ? (
              <CheckCircle className="w-3 h-3" />
            ) : isActive ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Circle className="w-3 h-3" />
            )}
            {phase.label}
          </button>
        );
      })}
    </div>
  );
}
