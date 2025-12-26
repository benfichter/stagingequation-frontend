# Visual Staging AI - Design Guidelines

## Design Approach
**Selected Framework:** Design System Approach (Material Design) with references to professional AI tools like Midjourney, Runway ML, and Adobe Firefly. This creates a clean, professional interface that emphasizes functionality and trust while maintaining visual appeal.

**Core Principles:**
- Clarity over decoration: Every element serves the user's workflow
- Professional confidence: Design conveys AI precision and reliability
- Visual hierarchy: Guide users naturally through the 4-step process
- Spatial awareness: Generous whitespace to let room images breathe

## Typography System

**Font Family:** Inter (via Google Fonts CDN)
- Headings: Inter, weights 600-700
- Body text: Inter, weight 400
- Labels/UI: Inter, weight 500

**Hierarchy:**
- Page titles: text-4xl (36px) font-semibold
- Step headers: text-2xl (24px) font-semibold  
- Section labels: text-sm (14px) font-medium uppercase tracking-wide
- Body text: text-base (16px)
- Helper text: text-sm (14px)

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-6 or p-8
- Section spacing: gap-8 or gap-12
- Card margins: m-4
- Button padding: px-6 py-3

**Container Strategy:**
- Maximum width: max-w-6xl (1152px) for main content
- Image containers: max-w-4xl for optimal viewing
- Centered layout: mx-auto for all major containers

**Grid Structure:**
- Step 2 layout: Two-column grid (lg:grid-cols-2) - uploaded image on left, controls on right
- Single column on mobile: grid-cols-1

## Component Library

### Navigation & Progress
**Progress Stepper:**
- Horizontal step indicator across top
- 4 circles connected by lines showing: Upload → Configure → Calibrate → Results
- Active step: filled circle, bold label
- Completed steps: checkmark icon, clickable
- Future steps: outlined circle, muted
- Position: Sticky at top with py-6 spacing

### Step 1: Upload Interface
**Upload Zone:**
- Large drag-and-drop area: min-h-96
- Dashed border with rounded-lg corners
- Centered upload icon (Heroicons: cloud-arrow-up, size h-16 w-16)
- Primary text: "Drag and drop your room image"
- Secondary text: "or click to browse" (text-sm)
- Supported formats note below: "Supports JPG, PNG up to 10MB"

### Step 2: Configuration Screen
**Layout:** Two-column grid (image left, controls right on desktop)

**Image Preview Section:**
- Uploaded image: rounded-lg border, object-cover
- Image dimensions: max-h-[600px] w-full

**Controls Panel (Right Side):**
- Stacked form controls with gap-6
- Each control group has label above input

**Room Type Selector:**
- Label: "Room Type"
- Dropdown menu with options: Bedroom, Living Room, Dining Room, Kitchen, Office, Bathroom
- Full width: w-full

**Ceiling Height Input:**
- Label: "Ceiling Height"
- Number input with unit selector (ft/m toggle buttons inline)
- Default placeholder: "8.0"

**Style Selector:**
- Label: "Staging Style"  
- Grid of style cards: grid-cols-2 gap-4
- Each card: Small thumbnail preview, style name below
- Styles: Modern, Minimalist, Industrial, Scandinavian, Traditional, Bohemian
- Selected state: border highlight

**Submit Button:**
- Large, full-width: w-full
- Text: "Generate Staged Room"
- Position: mt-8

### Step 3: Calibration Display
**Layout:** Centered single column
- Status indicator: "Calibrating dimensions..." with animated dots
- Image display: rounded-lg border
- Dimension overlay lines rendered on top of image
- Measurement labels positioned near key features (walls, ceiling, floor)

### Step 4: Results View
**Layout:** Single column centered

**Image Display:**
- Large preview area: max-h-[700px]
- Rounded-lg border
- Image switches based on toggle state

**Toggle Control:**
- Checkbox with label: "Show dimensions overlay"
- Position: Below image, centered mb-6
- Uses switch component (rounded-full with animated transition)

**Download Button:**
- Primary button: "Download Image"
- Icon: Heroicons download icon
- Position: Below toggle, centered

**Action Bar (Below Download):**
- Two secondary buttons side-by-side: "Start Over" | "Generate Another"
- gap-4 spacing

## Card Components
**Standard Card:**
- Border: border rounded-lg
- Padding: p-6
- Shadow: shadow-sm hover:shadow-md transition

**Image Card:**
- Same as standard but with overflow-hidden
- Image: rounded-t-lg, content below rounded-b-lg

## Form Elements
**Input Fields:**
- Height: h-12
- Padding: px-4
- Border: border rounded-md
- Focus state: ring outline

**Dropdown Selectors:**
- Same styling as inputs
- Chevron icon: Heroicons chevron-down

**Buttons:**
- Primary: Large px-8 py-3, rounded-lg, font-medium
- Secondary: Same size, outlined variant
- Icon buttons: Square p-3, rounded-md

## Icons
**Library:** Heroicons (via CDN)
**Common Icons:**
- cloud-arrow-up (upload)
- check-circle (completed steps)
- cog-6-tooth (settings/calibration)
- arrow-down-tray (download)
- photo (image placeholder)

## Images

**Hero Section:** No traditional hero - this is a workflow tool

**Image Assets Needed:**
1. **Style Preview Thumbnails** (Step 2): 6 small square thumbnails (150x150px) showing each staging style. These should be simple, recognizable furniture arrangements representing each aesthetic.

2. **Empty State Illustration** (Step 1): Optional decorative illustration in upload zone showing a simple room outline or camera icon - subtle, not dominant.

3. **User Uploaded Images:** Display as provided, maintain aspect ratio with object-cover and max-height constraints.

## Animations
**Minimal & Purposeful:**
- Progress stepper: Smooth circle fill on completion (duration-300)
- Step transitions: Gentle fade-in (duration-200)
- Button hover: Subtle lift (translate-y-[-2px])
- Toggle switch: Smooth slide animation (duration-200)
- Loading state: Pulsing opacity on calibration step

**No scroll animations, parallax, or decorative motion**

## Accessibility
- All form inputs have associated labels
- Step navigation keyboard accessible
- Image alt text for all visuals
- Focus indicators on all interactive elements
- ARIA labels for icon-only buttons
- Maintain 4.5:1 contrast ratios (handled by later color selection)