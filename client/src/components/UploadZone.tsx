import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isDragging?: boolean;
  onDragStateChange?: (isDragging: boolean) => void;
}

export default function UploadZone({ onFileSelect, isDragging, onDragStateChange }: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragStateChange?.(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    onDragStateChange?.(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDragStateChange?.(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={cn(
        "min-h-96 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-12 transition-all hover-elevate cursor-pointer",
        isDragging ? "border-primary bg-accent/50" : "border-border"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      data-testid="upload-zone"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        className="hidden"
        onChange={handleFileChange}
        data-testid="input-file"
      />
      <Upload className="w-16 h-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Drag and drop your room image
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        or click to browse
      </p>
      <p className="text-xs text-muted-foreground">
        Supports JPG, PNG up to 10MB
      </p>
    </div>
  );
}
