import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type DemoConfig, type RoomType, type StagingStyle } from "@/types/demo";

interface ConfigurationPanelProps {
  config: DemoConfig;
  onConfigChange: (config: DemoConfig) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const styles = [
  { value: 'modern', label: 'Modern' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'scandinavian', label: 'Scandinavian' },
  { value: 'traditional', label: 'Traditional' },
  { value: 'bohemian', label: 'Bohemian' },
] as const;

export default function ConfigurationPanel({ config, onConfigChange, onSubmit, isSubmitting }: ConfigurationPanelProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="room-type" className="text-sm font-medium uppercase tracking-wide">
          Room Type
        </Label>
        <Select
          value={config.roomType}
          onValueChange={(value) => onConfigChange({ ...config, roomType: value as RoomType })}
        >
          <SelectTrigger id="room-type" className="h-12" data-testid="select-room-type">
            <SelectValue placeholder="Select room type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bedroom">Bedroom</SelectItem>
            <SelectItem value="living-room">Living Room</SelectItem>
            <SelectItem value="dining-room">Dining Room</SelectItem>
            <SelectItem value="kitchen">Kitchen</SelectItem>
            <SelectItem value="office">Office</SelectItem>
            <SelectItem value="bathroom">Bathroom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="staging-style" className="text-sm font-medium uppercase tracking-wide">
          Staging Style
        </Label>
        <Select
          value={config.style}
          onValueChange={(value) => onConfigChange({ ...config, style: value as StagingStyle })}
        >
          <SelectTrigger id="staging-style" className="h-12" data-testid="select-staging-style">
            <SelectValue placeholder="Select staging style" />
          </SelectTrigger>
          <SelectContent>
            {styles.map((style) => (
              <SelectItem key={style.value} value={style.value}>
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="prompt" className="text-sm font-medium uppercase tracking-wide">
          Prompt (Optional)
        </Label>
        <Textarea
          id="prompt"
          placeholder="e.g. Warm modern living room with neutral tones and natural light"
          className="min-h-28"
          value={config.prompt || ''}
          onChange={(e) => onConfigChange({ ...config, prompt: e.target.value })}
          data-testid="input-prompt"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="calibration-height" className="text-sm font-medium uppercase tracking-wide">
          Ceiling Height (Optional, meters)
        </Label>
        <Input
          id="calibration-height"
          type="number"
          min="1"
          step="0.01"
          placeholder="2.6"
          value={config.calibrationHeightM ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            const parsed = value ? Number.parseFloat(value) : NaN;
            onConfigChange({
              ...config,
              calibrationHeightM: Number.isFinite(parsed) ? parsed : undefined,
            });
          }}
          data-testid="input-calibration-height"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Demo outputs are watermarked and match your upload resolution (no 4K upscaling).
      </p>

      <Button
        onClick={onSubmit}
        className="w-full h-12 mt-8"
        disabled={isSubmitting || !config.roomType || !config.style}
        data-testid="button-generate"
      >
        {isSubmitting ? 'Generating...' : 'Generate Demo'}
      </Button>
    </div>
  );
}
