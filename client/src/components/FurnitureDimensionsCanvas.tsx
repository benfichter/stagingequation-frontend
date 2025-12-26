import { useEffect, useRef } from "react";

interface FurnitureDimensionsCanvasProps {
  imageUrl: string;
}

export default function FurnitureDimensionsCanvas({ imageUrl }: FurnitureDimensionsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      // Draw furniture dimension lines (mocked furniture measurements)
      ctx.strokeStyle = '#10b981'; // Green for furniture dimensions
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      
      // Sofa/couch dimensions (left side)
      ctx.beginPath();
      ctx.moveTo(img.width * 0.15, img.height * 0.6);
      ctx.lineTo(img.width * 0.4, img.height * 0.6);
      ctx.stroke();
      
      // Coffee table dimensions (center)
      ctx.beginPath();
      ctx.moveTo(img.width * 0.42, img.height * 0.55);
      ctx.lineTo(img.width * 0.58, img.height * 0.55);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(img.width * 0.5, img.height * 0.5);
      ctx.lineTo(img.width * 0.5, img.height * 0.65);
      ctx.stroke();
      
      // Armchair dimensions (right side)
      ctx.beginPath();
      ctx.moveTo(img.width * 0.65, img.height * 0.58);
      ctx.lineTo(img.width * 0.8, img.height * 0.58);
      ctx.stroke();
      
      // Measurement labels for furniture
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 14px Inter';
      ctx.fillText('7.5 ft', img.width * 0.24, img.height * 0.58);
      ctx.fillText('3.0 ft', img.width * 0.48, img.height * 0.52);
      ctx.fillText('2.5 ft', img.width * 0.52, img.height * 0.6);
      ctx.fillText('4.2 ft', img.width * 0.7, img.height * 0.56);
    };
    
    img.src = imageUrl;
  }, [imageUrl]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-auto max-h-[700px]"
      data-testid="canvas-furniture-dimensions"
    />
  );
}
