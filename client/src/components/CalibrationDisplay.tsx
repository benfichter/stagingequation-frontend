import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Ruler } from "lucide-react";
import { type Dimensions } from "@/types/demo";

type CeilingMeasurement = {
  from: string;
  to: string;
  distance: number;
};

interface CalibrationDisplayProps {
  imageUrl: string;
  measurements?: CeilingMeasurement[];
  isProcessing?: boolean;
  onGenerateStaging?: () => void;
  actionLabel?: string;
  dimensions?: Dimensions | null;
}

export default function CalibrationDisplay({ 
  imageUrl, 
  measurements = [],
  isProcessing = false, 
  onGenerateStaging,
  actionLabel = "Continue",
  dimensions
}: CalibrationDisplayProps) {
  const convertToFeet = (meters: number) => {
    return (meters * 3.28084).toFixed(2);
  };

  const convertToSquareFeet = (squareMeters: number) => {
    return (squareMeters * 10.7639).toFixed(2);
  };

  const formatMeasurementLabel = (from: string, to: string) => {
    const fromLabel = from.replace("_", " ");
    const toLabel = to.replace("_", " ");
    return `${fromLabel} to ${toLabel}`;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border overflow-hidden bg-card">
        <img
          src={imageUrl}
          alt="Room calibration with ceiling corners"
          className="w-full h-auto max-h-[600px] object-contain"
          data-testid="img-calibration"
        />
      </div>

      {measurements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="w-5 h-5" />
              Ceiling Measurements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {measurements.map((measurement, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    {formatMeasurementLabel(measurement.from, measurement.to)}
                  </p>
                  <p className="text-lg font-semibold" data-testid={`text-measurement-${index}`}>
                    {measurement.distance.toFixed(2)}m ({convertToFeet(measurement.distance)}ft)
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {dimensions ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="w-5 h-5" />
              Room Dimensions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Width</p>
                <p className="text-lg font-semibold" data-testid="text-calibration-width">
                  {dimensions.width.toFixed(2)}m ({convertToFeet(dimensions.width)}ft)
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Depth</p>
                <p className="text-lg font-semibold" data-testid="text-calibration-depth">
                  {dimensions.depth.toFixed(2)}m ({convertToFeet(dimensions.depth)}ft)
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Height</p>
                <p className="text-lg font-semibold" data-testid="text-calibration-height">
                  {dimensions.height.toFixed(2)}m ({convertToFeet(dimensions.height)}ft)
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Area</p>
                <p className="text-lg font-semibold" data-testid="text-calibration-area">
                  {dimensions.area.toFixed(2)}m2 ({convertToSquareFeet(dimensions.area)}ft2)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
      
      {!isProcessing && onGenerateStaging && (
        <div className="flex justify-center">
          <Button 
            onClick={onGenerateStaging} 
            size="lg" 
            className="gap-2"
            data-testid="button-generate-staging"
          >
            <Sparkles className="w-4 h-4" />
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
