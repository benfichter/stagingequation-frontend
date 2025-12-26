import { useState, useRef, useEffect } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After"
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    setSliderPosition(Math.min(Math.max(percentage, 0), 100));
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setIsAutoPlaying(false);
    if ('clientX' in e) {
      handleMove(e.clientX);
    } else if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let newPosition = sliderPosition;
    
    switch (e.key) {
      case 'ArrowLeft':
        newPosition = Math.max(0, sliderPosition - 1);
        break;
      case 'ArrowRight':
        newPosition = Math.min(100, sliderPosition + 1);
        break;
      case 'PageDown':
        newPosition = Math.max(0, sliderPosition - 10);
        break;
      case 'PageUp':
        newPosition = Math.min(100, sliderPosition + 10);
        break;
      case 'Home':
        newPosition = 0;
        break;
      case 'End':
        newPosition = 100;
        break;
      default:
        return;
    }
    
    e.preventDefault();
    setIsAutoPlaying(false);
    setSliderPosition(newPosition);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const slideDuration = 3500;
    const pauseDuration = 1500;
    const fullCycleDuration = (slideDuration + pauseDuration) * 2;

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const cycleProgress = (elapsed % fullCycleDuration) / fullCycleDuration;
      
      let newPosition: number;
      
      if (cycleProgress < 0.35) {
        const slideProgress = cycleProgress / 0.35;
        newPosition = easeInOutCubic(slideProgress) * 100;
      } else if (cycleProgress < 0.5) {
        newPosition = 100;
      } else if (cycleProgress < 0.85) {
        const slideProgress = (cycleProgress - 0.5) / 0.35;
        newPosition = 100 - (easeInOutCubic(slideProgress) * 100);
      } else {
        newPosition = 0;
      }
      
      setSliderPosition(newPosition);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAutoPlaying]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square overflow-hidden rounded-2xl border border-border select-none cursor-ew-resize"
      data-testid="before-after-slider"
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      role="slider"
      aria-label="Before and after comparison slider"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={`${Math.round(sliderPosition)}% between before and after images`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* After Image (Full) */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={afterImage}
          alt={afterLabel}
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-md border">
          <span className="text-sm font-medium">{afterLabel}</span>
        </div>
      </div>

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
        }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-md border">
          <span className="text-sm font-medium">{beforeLabel}</span>
        </div>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-primary pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Handle Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary rounded-full shadow-lg flex items-center justify-center hover-elevate active-elevate-2">
          <div className="flex gap-1">
            <div className="w-0.5 h-6 bg-primary-foreground rounded-full" />
            <div className="w-0.5 h-6 bg-primary-foreground rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
