import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const roomConfigSchema = z.object({
  roomType: z.enum(['bedroom', 'living-room', 'dining-room', 'kitchen', 'office', 'bathroom']),
  ceilingHeight: z.number().min(6).max(20),
  ceilingUnit: z.enum(['ft', 'm']),
  style: z.enum(['modern', 'minimalist', 'industrial', 'scandinavian', 'traditional', 'bohemian']),
});

export type RoomConfig = z.infer<typeof roomConfigSchema>;

export const stagingRequestSchema = z.object({
  image: z.string(),
  roomType: z.string(),
  ceilingHeight: z.number(),
  ceilingUnit: z.enum(['ft', 'm']),
  style: z.string(),
});

export type StagingRequest = z.infer<typeof stagingRequestSchema>;

export const dimensionsSchema = z.object({
  height: z.number(),
  width: z.number(),
  depth: z.number(),
  area: z.number(),
  unit: z.string(),
});

export const ceilingMeasurementSchema = z.object({
  from: z.string(),
  to: z.string(),
  distance: z.number(),
});

export const stagingResponseSchema = z.object({
  success: z.boolean(),
  request_id: z.string().optional(),
  timestamp: z.string().optional(),
  original_image: z.object({
    width: z.number(),
    height: z.number(),
  }).optional(),
  dimensions: dimensionsSchema.optional(),
  staged_image: z.string(),
  ceiling_corners_image: z.string().optional(),
  ceiling_measurements: z.array(ceilingMeasurementSchema).optional(),
  room_type: z.string().optional(),
  style_description: z.string().optional(),
  style_prompt: z.string().optional(),
  processing_time_seconds: z.number().optional(),
  error: z.string().optional(),
});

export type StagingResponse = z.infer<typeof stagingResponseSchema>;
export type Dimensions = z.infer<typeof dimensionsSchema>;
export type CeilingMeasurement = z.infer<typeof ceilingMeasurementSchema>;
