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
        {/* Full-house logo outline with integrated chimney */}
        <path
          className="draw-path"
          d="M 40 160 L 40 95 L 100 50 L 120 70 L 120 45 L 145 45 L 145 95 L 170 120 L 170 160 L 40 160 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <p className="text-lg font-medium text-foreground" data-testid="text-loading-message">{message}</p>
      <p className="text-sm text-muted-foreground mt-1">This may take a few moments</p>
    </div>
  );
}
