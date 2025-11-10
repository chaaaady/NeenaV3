"use client";

import { ReactNode } from "react";
import { useStepController } from "./useStepController";
import { CollapsibleCard } from "./CollapsibleCard";

interface CardStep {
  id: string;
  header: ReactNode;
  content: ReactNode;
}

interface CardOrchestratorV2Props {
  steps: CardStep[];
}

export function CardOrchestratorV2({ steps }: CardOrchestratorV2Props) {
  const { activeStep, goToStep } = useStepController({
    totalSteps: steps.length,
    scrollThreshold: 140
  });

  // Calculate top offset based on collapsed cards
  const collapsedCount = activeStep;
  const cardHeaderHeight = 88; // approximate height of collapsed card
  const gap = 12;
  const headerOffset = 60; // approximate header height
  const topOffset = headerOffset + (collapsedCount * (cardHeaderHeight + gap));

  return (
    <div className="relative min-h-screen">
      {/* Cards Container */}
      <div 
        className="transition-all duration-300"
        style={{
          paddingTop: `calc(env(safe-area-inset-top) + ${topOffset}px)`,
          paddingBottom: "calc(env(safe-area-inset-bottom) + 2rem)",
          paddingLeft: "1.25rem",
          paddingRight: "1.25rem"
        }}
      >
        <div className="space-y-3">
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isCollapsed = index < activeStep;
            const isPast = index < activeStep;
            const isFuture = index > activeStep;
            
            // Don't render future cards
            if (isFuture) return null;

            return (
              <CollapsibleCard
                key={step.id}
                id={step.id}
                isActive={isActive}
                isCollapsed={isCollapsed}
                header={step.header}
                content={step.content}
                onExpand={() => goToStep(index)}
              />
            );
          })}
        </div>
      </div>

      {/* Navigation Indicator */}
      <div 
        className="fixed left-0 right-0 z-30 flex items-center justify-center"
        style={{ 
          bottom: "calc(env(safe-area-inset-bottom) + 2rem)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)"
        }}
      >
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
          <div className="flex items-center gap-1.5">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`h-2 rounded-full transition-all ${
                  activeStep === index ? 'bg-white w-6' : 'bg-white/40 w-2'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

