"use client";

import { ReactNode } from "react";
import { useStepController } from "./useStepController";
import { SummaryBar, createAmountSummary, createInfoSummary } from "./SummaryBar";
import { DonationCard } from "./DonationCard";

interface CardStep {
  id: string;
  content: ReactNode;
  getSummary?: () => ReturnType<typeof createAmountSummary> | ReturnType<typeof createInfoSummary> | null;
}

interface CardOrchestratorProps {
  steps: CardStep[];
  summaryData: {
    amount?: number;
    frequency?: string;
    userName?: string;
  };
}

export function CardOrchestrator({ steps, summaryData }: CardOrchestratorProps) {
  const { activeStep, goToStep } = useStepController({
    totalSteps: steps.length,
    scrollThreshold: 140
  });

  // Build summary items from completed steps
  const summaryItems = steps
    .slice(0, activeStep)
    .map(step => step.getSummary?.())
    .filter(Boolean) as ReturnType<typeof createAmountSummary>[];

  // Calculate top offset based on number of summary items
  const summaryHeight = summaryItems.length * (72 + 8); // card height + gap
  const headerOffset = 60; // approximate header height
  const topOffset = headerOffset + summaryHeight + 12; // + gap

  return (
    <div className="relative min-h-screen">
      {/* Summary Bar */}
      {summaryItems.length > 0 && <SummaryBar items={summaryItems} />}

      {/* Cards Container */}
      <div 
        className="px-5 transition-all duration-300"
        style={{
          paddingTop: `calc(env(safe-area-inset-top) + ${topOffset}px)`,
          paddingBottom: "calc(env(safe-area-inset-bottom) + 2rem)"
        }}
      >
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isCollapsed = index < activeStep;
          const isPast = index < activeStep;
          
          if (isPast && !isCollapsed) return null;
          if (index > activeStep) return null;

          return (
            <DonationCard
              key={step.id}
              id={step.id}
              isActive={isActive}
              isCollapsed={isCollapsed}
            >
              {step.content}
            </DonationCard>
          );
        })}
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

