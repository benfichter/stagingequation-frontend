import CalibrationDisplay from '../CalibrationDisplay';

export default function CalibrationDisplayExample() {
  // Create a simple placeholder image data URL
  const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23e5e7eb" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Inter" font-size="24" fill="%239ca3af"%3ERoom Image%3C/text%3E%3C/svg%3E';

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <CalibrationDisplay imageUrl={placeholderImage} isProcessing={true} />
    </div>
  );
}
