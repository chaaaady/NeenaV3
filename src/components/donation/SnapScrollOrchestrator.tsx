"use client";

import { ReactNode, useState, useRef, useEffect } from "react";

interface CardStep {
  id: string;
  header: ReactNode;
  content: ReactNode;
}

interface SnapScrollOrchestratorProps {
  steps: CardStep[];
}

const CARD_COLLAPSED_HEIGHT = 72;
const UNIFORM_GAP = 16;
const HEADER_HEIGHT = 100; // Increased to accommodate prayer info

// The famous "Apple Ease"
const APPLE_EASE = "cubic-bezier(0.19, 1, 0.22, 1)";

export function SnapScrollOrchestrator({ steps }: SnapScrollOrchestratorProps) {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  // Handle wheel scroll for snap behavior
  const handleWheel = (e: React.WheelEvent) => {
    if (isScrollingRef.current) return;
    
    const threshold = 50;
    
    // Scroll DOWN -> Next card
    if (e.deltaY > threshold && expandedIndex < steps.length - 1) {
      isScrollingRef.current = true;
      setExpandedIndex(expandedIndex + 1);
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 600);
    }
    // Scroll UP -> Previous card
    else if (e.deltaY < -threshold && expandedIndex > 0) {
      isScrollingRef.current = true;
      setExpandedIndex(expandedIndex - 1);
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 600);
    }
  };

  // Handle touch/drag for mobile
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
    setTouchEnd(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (isScrollingRef.current) return;
    
    const distance = touchStart - touchEnd;
    const threshold = 80;

    // Swipe UP -> Next card
    if (distance > threshold && expandedIndex < steps.length - 1) {
      isScrollingRef.current = true;
      setExpandedIndex(expandedIndex + 1);
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 600);
    }
    // Swipe DOWN -> Previous card
    else if (distance < -threshold && expandedIndex > 0) {
      isScrollingRef.current = true;
      setExpandedIndex(expandedIndex - 1);
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 600);
    }
  };

  const collapsedCardsCount = expandedIndex;
  const collapsedStackHeight = collapsedCardsCount > 0 
    ? collapsedCardsCount * CARD_COLLAPSED_HEIGHT + (collapsedCardsCount - 1) * UNIFORM_GAP
    : 0;
  const topOffset = HEADER_HEIGHT + collapsedStackHeight;

  // Calculate bottom space based on card type
  let baseBottomSpace = 80;
  if (steps[expandedIndex]?.id === 'payment') {
    baseBottomSpace = 20;
  }

  return (
    <div 
      ref={scrollContainerRef}
      className="fixed inset-0 overflow-hidden"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* --- COLLAPSED STACK (Top) --- */}
      {collapsedCardsCount > 0 && (
        <div 
          className="fixed top-0 left-0 right-0 z-30 px-5"
          style={{
            paddingTop: `calc(env(safe-area-inset-top) + ${HEADER_HEIGHT}px)`,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: `${UNIFORM_GAP}px` }}>
            {steps.map((step, index) => {
              if (index >= expandedIndex) return null;
              
              // Calculate opacity and scale based on position (parallax effect)
              const distanceFromActive = expandedIndex - index;
              const opacity = Math.max(0.3, 1 - (distanceFromActive * 0.15));
              const scale = Math.max(0.95, 1 - (distanceFromActive * 0.02));
              
              return (
                <div
                  key={step.id}
                  onClick={() => {
                    if (!isScrollingRef.current) {
                      isScrollingRef.current = true;
                      setExpandedIndex(index);
                      setTimeout(() => {
                        isScrollingRef.current = false;
                      }, 600);
                    }
                  }}
                  className="rounded-3xl bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/20 shadow-2xl cursor-pointer transition-all hover:brightness-110 active:scale-[0.98] flex items-center"
                  style={{ 
                    height: CARD_COLLAPSED_HEIGHT,
                    padding: '0 1.5rem',
                    opacity,
                    transform: `scale(${scale})`,
                    transition: `all 0.6s ${APPLE_EASE}`
                  }}
                >
                  {step.header}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- ACTIVE CARD (Expanded) with retraction animation --- */}
      <div 
        className="absolute left-0 right-0 px-5 z-20"
        style={{
          top: `calc(env(safe-area-inset-top) + ${topOffset + UNIFORM_GAP}px)`,
          bottom: expandedIndex < steps.length - 1 
            ? `calc(env(safe-area-inset-bottom) + ${CARD_COLLAPSED_HEIGHT + UNIFORM_GAP}px)`
            : `calc(env(safe-area-inset-bottom) + ${baseBottomSpace}px)`,
          transition: `all 0.6s ${APPLE_EASE}`,
        }}
      >
        <div 
          className="h-full rounded-3xl bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden flex flex-col"
          style={{
            transition: `all 0.6s ${APPLE_EASE}`,
          }}
        >
          {/* Card content - NO internal scroll */}
          <div className="flex-1 overflow-hidden p-6">
            {steps[expandedIndex]?.content}
          </div>
        </div>
      </div>

      {/* --- PEEK of NEXT CARD (Bottom) --- */}
      {expandedIndex < steps.length - 1 && (
        <div 
          className="fixed left-0 right-0 px-5 z-10"
          style={{
            bottom: `calc(env(safe-area-inset-bottom) + 0px)`,
            height: CARD_COLLAPSED_HEIGHT,
            transition: `all 0.6s ${APPLE_EASE}`,
          }}
          onClick={() => {
            if (!isScrollingRef.current) {
              isScrollingRef.current = true;
              setExpandedIndex(expandedIndex + 1);
              setTimeout(() => {
                isScrollingRef.current = false;
              }, 600);
            }
          }}
        >
          <div 
            className="h-full rounded-t-3xl bg-gradient-to-br from-white/15 via-white/10 to-white/8 backdrop-blur-xl border border-white/15 border-b-0 shadow-xl cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all flex items-center"
            style={{
              padding: '0 1.5rem',
              transition: `all 0.6s ${APPLE_EASE}`,
            }}
          >
            {steps[expandedIndex + 1]?.header}
          </div>
        </div>
      )}
    </div>
  );
}

