import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { stagingRequestSchema, stagingResponseSchema } from "@shared/schema";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const STAGING_API_URL = "https://07v1nbdhvfgujm-5000.proxy.runpod.net";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/stage", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No image file provided" });
      }

      const parseResult = stagingRequestSchema.safeParse({
        image: req.file.originalname,
        roomType: req.body.roomType,
        ceilingHeight: parseFloat(req.body.ceilingHeight),
        ceilingUnit: req.body.ceilingUnit,
        style: req.body.style,
      });

      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          error: `Invalid request: ${parseResult.error.errors.map(e => e.message).join(', ')}`,
        });
      }

      const { roomType, ceilingHeight, ceilingUnit, style } = parseResult.data;

      const ceilingHeightInMeters = ceilingUnit === 'ft' 
        ? ceilingHeight / 3.28084 
        : ceilingHeight;

      const styleDescriptionMap: Record<string, string> = {
        'modern': 'Modern minimal style with contemporary furniture, clean lines, neutral colors, and warm accents. Include sleek seating, minimalist decor, and subtle geometric patterns.',
        'minimalist': 'Minimalist Scandinavian style with essential furniture pieces, white and neutral tones, natural light wood accents, and uncluttered open space. Focus on functionality and simplicity.',
        'industrial': 'Industrial loft style with exposed elements, metal and wood furniture, urban aesthetics, Edison bulb lighting, and raw textures. Include metal accents and reclaimed materials.',
        'scandinavian': 'Scandinavian hygge style with light wood furniture, white and soft gray tones, cozy textiles, natural materials, plants, and warm ambient lighting. Create an inviting, comfortable atmosphere.',
        'traditional': 'Traditional classic style with elegant furniture, warm earth tones, rich wood finishes, detailed moldings, comfortable upholstered seating, and timeless decorative elements.',
        'bohemian': 'Bohemian eclectic style with vibrant colors, mixed patterns, layered textiles, plants, vintage pieces, artistic wall decor, and globally-inspired accents. Create a lived-in, creative atmosphere.',
      };

      const roomTypeMap: Record<string, string> = {
        'bedroom': 'bedroom',
        'living-room': 'living room',
        'dining-room': 'dining room',
        'kitchen': 'kitchen',
        'office': 'home office',
        'bathroom': 'bathroom',
      };

      const apiRoomType = roomTypeMap[roomType] || 'living room';
      const styleDescription = styleDescriptionMap[style] || 'Modern minimal style with neutral colors and warm accents';

      const formData = new FormData();
      const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
      formData.append('image', blob, req.file.originalname);
      formData.append('room_type', apiRoomType);
      formData.append('style_description', styleDescription);
      formData.append('ceiling_height', ceilingHeightInMeters.toFixed(2));
      formData.append('return_format', 'base64');

      const response = await fetch(`${STAGING_API_URL}/stage`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = response.statusText;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        }
        console.error('RunPod API error:', response.status, errorMessage);
        return res.status(response.status).json({
          success: false,
          error: `API error: ${errorMessage}`,
        });
      }

      let result;
      try {
        result = await response.json();
      } catch {
        console.error('Failed to parse RunPod response as JSON');
        return res.status(500).json({
          success: false,
          error: 'Invalid response from staging API',
        });
      }

      const validationResult = stagingResponseSchema.safeParse(result);
      if (!validationResult.success) {
        console.error('Invalid response schema:', validationResult.error);
        return res.status(500).json({
          success: false,
          error: 'Invalid response format from staging API',
        });
      }

      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error || 'Staging failed',
        });
      }

      return res.json(result);
    } catch (error: any) {
      console.error('Staging error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
