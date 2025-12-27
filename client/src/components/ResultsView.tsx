import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RotateCcw, Sparkles, Ruler } from "lucide-react";
import { type Dimensions } from "@/types/demo";

interface ResultsViewProps {
  stagedImageUrl: string;
  dimensions?: Dimensions | null;
  onStartOver?: () => void;
  onGenerateAnother?: () => void;
  onPlaceOrder?: () => void;
}

export default function ResultsView({
  stagedImageUrl,
  dimensions,
  onStartOver,
  onGenerateAnother,
  onPlaceOrder,
}: ResultsViewProps) {
  const convertToFeet = (meters: number) => {
    return (meters * 3.28084).toFixed(2);
  };

  const convertToSquareFeet = (squareMeters: number) => {
    return (squareMeters * 10.7639).toFixed(2);
  };

  const handleDownload = () => {
    const downloadImage = async () => {
      try {
        const response = await fetch(stagedImageUrl);
        if (!response.ok) {
          throw new Error("Download failed");
        }
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "staged-room.jpg";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
      } catch {
        window.open(stagedImageUrl, "_blank", "noopener");
      }
    };

    void downloadImage();
  };

  return (
    <div className="space-y-6">
      {dimensions && (
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
                <p className="text-lg font-semibold" data-testid="text-dimension-width">
                  {dimensions.width.toFixed(2)}m ({convertToFeet(dimensions.width)}ft)
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Depth</p>
                <p className="text-lg font-semibold" data-testid="text-dimension-depth">
                  {dimensions.depth.toFixed(2)}m ({convertToFeet(dimensions.depth)}ft)
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Height</p>
                <p className="text-lg font-semibold" data-testid="text-dimension-height">
                  {dimensions.height.toFixed(2)}m ({convertToFeet(dimensions.height)}ft)
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Area</p>
                <p className="text-lg font-semibold" data-testid="text-dimension-area">
                  {dimensions.area.toFixed(2)}m2 ({convertToSquareFeet(dimensions.area)}ft2)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="rounded-lg border overflow-hidden bg-card">
        <img
          src={stagedImageUrl}
          alt="Staged room"
          className="w-full h-auto max-h-[700px] object-contain"
          data-testid="img-staged-result"
        />
      </div>

      <div className="flex justify-center">
        <Button onClick={handleDownload} size="lg" className="gap-2" data-testid="button-download">
          <Download className="w-4 h-4" />
          Download Image
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Demo downloads are watermarked and match the original upload resolution.
      </p>

      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={onStartOver} className="gap-2" data-testid="button-start-over">
          <RotateCcw className="w-4 h-4" />
          Start Over
        </Button>
        <Button variant="outline" onClick={onGenerateAnother} className="gap-2" data-testid="button-generate-another">
          <Sparkles className="w-4 h-4" />
          Generate Another
        </Button>
        {onPlaceOrder ? (
          <Button onClick={onPlaceOrder} className="gap-2" data-testid="button-place-order">
            Place Order
          </Button>
        ) : null}
      </div>
    </div>
  );
}
