"use client";

import { ReactNode, useState, useRef, useEffect } from "react";

interface CardStep {
  id: string;
  header: ReactNode;
  content: ReactNode;
}

interface ResponsiveOrchestratorProps {
  steps: CardStep[];
}

const CARD_COLLAPSED_HEIGHT = 72;
const UNIFORM_GAP = 16; // Uniform gap between ALL elements (Apple-like)
const HEADER_HEIGHT = 64;
const PEEK_HEIGHT = 72;

// The famous "Apple Ease"
const APPLE_EASE = "cubic-bezier(0.19, 1, 0.22, 1)";

export function ResponsiveOrchestrator({ steps }: ResponsiveOrchestratorProps) {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragCurrentY, setDragCurrentY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const collapsedCardsCount = expandedIndex;
  // Each collapsed card = height + gap, but we don't add gap after the last one (it's added in card positioning)
  const collapsedStackHeight = collapsedCardsCount > 0 
    ? collapsedCardsCount * CARD_COLLAPSED_HEIGHT + (collapsedCardsCount - 1) * UNIFORM_GAP
    : 0;
  // topOffset is header + collapsed cards (gap will be added once in card positioning)
  const topOffset = HEADER_HEIGHT + collapsedStackHeight;

  // Calculate bottom space based on card type
  let baseBottomSpace = 80;
  if (steps[expandedIndex]?.id === 'payment') {
    baseBottomSpace = 20;
  }

  // Space for peek at the bottom
  const peekSpace = expandedIndex < steps.length - 1 ? PEEK_HEIGHT + UNIFORM_GAP : 0;

  // Handle drag to navigate
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartY(e.touches[0].clientY);
    setDragCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setDragCurrentY(e.touches[0].clientY);
    // Prevent default to stop any scroll behavior
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const dragDistance = dragCurrentY - dragStartY;
    const threshold = 80;

    // Drag UP -> Next card
    if (dragDistance < -threshold && expandedIndex < steps.length - 1) {
      setExpandedIndex(expandedIndex + 1);
    }
    // Drag DOWN -> Previous card
    else if (dragDistance > threshold && expandedIndex > 0) {
      setExpandedIndex(expandedIndex - 1);
    }

    setIsDragging(false);
    setDragStartY(0);
    setDragCurrentY(0);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') {
      setIsDragging(true);
      setDragStartY(e.clientY);
      setDragCurrentY(e.clientY);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || e.pointerType !== 'mouse') return;
    setDragCurrentY(e.clientY);
    e.preventDefault();
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    
    const dragDistance = dragCurrentY - dragStartY;
    const threshold = 80;

    if (dragDistance < -threshold && expandedIndex < steps.length - 1) {
      setExpandedIndex(expandedIndex + 1);
    } else if (dragDistance > threshold && expandedIndex > 0) {
      setExpandedIndex(expandedIndex - 1);
    }

    setIsDragging(false);
    setDragStartY(0);
    setDragCurrentY(0);
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
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
              return (
                <div
                  key={step.id}
                  onClick={() => setExpandedIndex(index)}
                  className="rounded-3xl bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/20 shadow-2xl cursor-pointer transition-all hover:brightness-110 active:scale-[0.98] flex items-center"
                  style={{ 
                    height: CARD_COLLAPSED_HEIGHT,
                    padding: '0 1.5rem',
                    transition: `all 0.4s ${APPLE_EASE}`
                  }}
                >
                  {step.header}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- ACTIVE CARD (Expanded) --- */}
      <div 
        className="absolute left-0 right-0 px-5 z-20"
        style={{
          top: `calc(env(safe-area-inset-top) + ${topOffset + UNIFORM_GAP}px)`, // UNIFORM_GAP after collapsed cards
          bottom: expandedIndex < steps.length - 1 
            ? `calc(env(safe-area-inset-bottom) + ${PEEK_HEIGHT + UNIFORM_GAP}px)` // UNIFORM_GAP before peek
            : `calc(env(safe-area-inset-bottom) + ${baseBottomSpace}px)`,
          transition: `all 0.5s ${APPLE_EASE}`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="h-full rounded-3xl bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden flex flex-col">
          {/* Card content - NO scroll, content is static and fits in the card */}
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
            bottom: `calc(env(safe-area-inset-bottom) + 0px)`, // Collé en bas
            height: PEEK_HEIGHT,
            transition: `all 0.5s ${APPLE_EASE}`,
          }}
          onClick={() => setExpandedIndex(expandedIndex + 1)}
        >
          <div 
            className="h-full rounded-t-3xl bg-gradient-to-br from-white/15 via-white/10 to-white/8 backdrop-blur-xl border border-white/15 border-b-0 shadow-xl cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all flex items-center"
            style={{
              padding: '0 1.5rem',
              transition: `all 0.3s ${APPLE_EASE}`,
            }}
          >
            {steps[expandedIndex + 1]?.header}
          </div>
        </div>
      )}
    </div>
  );
}
