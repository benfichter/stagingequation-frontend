import { useEffect, useRef } from 'react';

interface HouseLoadingAnimationProps {
  message?: string;
  duration?: number;
}

export default function HouseLoadingAnimation({ 
  message = "Processing...",
  duration = 2000 
}: HouseLoadingAnimationProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const path = svgRef.current.querySelector('.draw-path') as SVGPathElement;
    if (!path) return;
    
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    path.style.animation = `drawPath ${duration}ms ease-in-out infinite`;
  }, [duration]);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <style>{`
        @keyframes drawPath {
          0%, 100% {
            stroke-dashoffset: var(--path-length, 500);
          }
          50% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
      <svg
        ref={svgRef}
        width="200"
        height="200"
        viewBox="0 0 200 200"
        className="mb-6"
      >
        {/* Single continuous house outline with integrated chimney */}
        <path
          className="draw-path"
          d="M 50 150 L 50 90 L 100 50 L 113 60 L 113 45 L 132 45 L 132 70 L 150 90 L 150 150 L 50 150 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <p className="text-lg font-medium text-foreground" data-testid="text-loading-message">{message}</p>
      <p className="text-sm text-muted-foreground mt-1">This may take a few moments</p>
    </div>
  );
}
