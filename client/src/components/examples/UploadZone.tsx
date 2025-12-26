import UploadZone from '../UploadZone';
import { useState } from 'react';

export default function UploadZoneExample() {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    console.log('File selected:', file.name);
  };

  return (
    <div className="p-8">
      <UploadZone
        onFileSelect={handleFileSelect}
        isDragging={isDragging}
        onDragStateChange={setIsDragging}
      />
    </div>
  );
}
