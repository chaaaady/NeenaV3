import { useState, useCallback, useRef, useEffect } from 'react';

interface UseStepControllerProps {
  totalSteps: number;
  scrollThreshold?: number;
}

export function useStepController({ totalSteps, scrollThreshold = 140 }: UseStepControllerProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const lastScrollY = useRef(0);
  const scrollAccumulator = useRef(0);
  const isAnimating = useRef(false);

  const nextStep = useCallback(() => {
    if (activeStep < totalSteps - 1 && !isAnimating.current) {
      isAnimating.current = true;
      setActiveStep((prev) => prev + 1);
      setTimeout(() => {
        isAnimating.current = false;
      }, 420);
    }
  }, [activeStep, totalSteps]);

  const prevStep = useCallback(() => {
    if (activeStep > 0 && !isAnimating.current) {
      isAnimating.current = true;
      setActiveStep((prev) => prev - 1);
      setTimeout(() => {
        isAnimating.current = false;
      }, 420);
    }
  }, [activeStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps && !isAnimating.current) {
      isAnimating.current = true;
      setActiveStep(step);
      setTimeout(() => {
        isAnimating.current = false;
      }, 420);
    }
  }, [totalSteps]);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (isAnimating.current) {
        e.preventDefault();
        return;
      }

      const delta = e.deltaY;
      const currentDirection = delta > 0 ? 'down' : 'up';
      
      setScrollDirection(currentDirection);
      
      // Accumulate scroll
      scrollAccumulator.current += Math.abs(delta);

      if (scrollAccumulator.current >= scrollThreshold) {
        if (currentDirection === 'down') {
          nextStep();
        } else {
          prevStep();
        }
        scrollAccumulator.current = 0;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      lastScrollY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isAnimating.current) return;

      const currentY = e.touches[0].clientY;
      const delta = lastScrollY.current - currentY;

      if (Math.abs(delta) > 50) {
        if (delta > 0) {
          nextStep();
        } else {
          prevStep();
        }
        lastScrollY.current = currentY;
      }
    };

    window.addEventListener('wheel', handleScroll, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [nextStep, prevStep, scrollThreshold]);

  return {
    activeStep,
    scrollDirection,
    nextStep,
    prevStep,
    goToStep,
    isFirstStep: activeStep === 0,
    isLastStep: activeStep === totalSteps - 1,
  };
}

