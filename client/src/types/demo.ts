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
  original_filename?: string | null;
  content_type?: string | null;
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

export type OrderCheckoutResponse = {
  order_id: string;
  checkout_url: string;
  amount_cents: number;
  currency: string;
  image_count: number;
};

export type OrderListItem = {
  id: string;
  status: string;
  note?: string | null;
  image_count: number;
  amount_cents: number;
  currency: string;
  created_at: string;
};

export type OrderDetail = {
  id: string;
  user_id: string;
  status: string;
  note?: string | null;
  image_count: number;
  amount_cents: number;
  currency: string;
  stripe_session_id?: string | null;
  created_at: string;
  uploads: UploadRecord[];
};
