export type RoomType =
  | "bedroom"
  | "living-room"
  | "dining-room"
  | "kitchen"
  | "office"
  | "bathroom";

export type StagingStyle =
  | "modern"
  | "minimalist"
  | "industrial"
  | "scandinavian"
  | "traditional"
  | "bohemian";

export type DemoConfig = {
  roomType?: RoomType;
  style?: StagingStyle;
  prompt?: string;
  calibrationHeightM?: number;
};

export type DemoUser = {
  id: string;
  firm_name: string;
  name: string;
  email: string;
  phone?: string | null;
};

export type UploadRecord = {
  id: string;
  storage_url: string;
  download_url?: string | null;
};

export type Dimensions = {
  width: number;
  depth: number;
  height: number;
  area: number;
  unit?: string;
  calibration_factor?: number | null;
};

export type DemoWatermarkResponse = {
  original: UploadRecord;
  staged: UploadRecord;
  dimensions?: Dimensions;
  ceiling_overlay_base64?: string;
  ceiling_corners?: number[][];
};
