import { useEffect, useState } from "react";
import ProgressStepper from "@/components/ProgressStepper";
import UploadZone from "@/components/UploadZone";
import ConfigurationPanel from "@/components/ConfigurationPanel";
import ResultsView from "@/components/ResultsView";
import CalibrationDisplay from "@/components/CalibrationDisplay";
import HouseLoadingAnimation from "@/components/HouseLoadingAnimation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OrderForm from "@/components/OrderForm";
import { type DemoConfig, type DemoUser, type DemoWatermarkResponse, type Dimensions } from "@/types/demo";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { id: 1, label: "Create Account" },
  { id: 2, label: "Upload" },
  { id: 3, label: "Configure" },
  { id: 4, label: "Calibration" },
  { id: 5, label: "Results" },
  { id: 6, label: "Place Order" },
];

const USER_STORAGE_KEY = "stagingEquationUser";

const buildApiUrl = (path: string) => {
  const base = import.meta.env.VITE_API_BASE || "/api";
  const trimmed = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${trimmed}${normalized}`;
};

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [config, setConfig] = useState<DemoConfig>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [stagedImageUrl, setStagedImageUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<Dimensions | null>(null);
  const [calibrationOverlayUrl, setCalibrationOverlayUrl] = useState<string | null>(null);
  const [user, setUser] = useState<DemoUser | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (!stored) {
      return null;
    }
    try {
      return JSON.parse(stored) as DemoUser;
    } catch {
      return null;
    }
  });
  const [accountForm, setAccountForm] = useState({
    firmName: "",
    name: "",
    email: "",
    phone: "",
  });
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const { toast } = useToast();
  const canCreateAccount =
    accountForm.firmName.trim().length > 0 &&
    accountForm.name.trim().length > 0 &&
    accountForm.email.trim().length > 0;

  useEffect(() => {
    if (!user) {
      return;
    }

    const warmMoge = async () => {
      try {
        await fetch(buildApiUrl("/moge/warm"), { method: "POST" });
      } catch {
        // ignore warmup errors
      }
    };

    warmMoge();
  }, [user?.id]);

  const handleCreateAccount = async () => {
    if (!accountForm.firmName.trim() || !accountForm.name.trim() || !accountForm.email.trim()) {
      toast({
        title: "Missing details",
        description: "Firm name, name, and email are required to create an account.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingAccount(true);
    try {
      const response = await fetch(buildApiUrl("/users"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firm_name: accountForm.firmName.trim(),
          name: accountForm.name.trim(),
          email: accountForm.email.trim(),
          phone: accountForm.phone.trim() || null,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        let message = text || "Unable to create account.";
        try {
          const parsed = JSON.parse(text) as { detail?: string };
          message = parsed.detail || message;
        } catch {
          // keep fallback message
        }
        throw new Error(message);
      }

      const createdUser = (await response.json()) as DemoUser;
      setUser(createdUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(createdUser));
      toast({
        title: "Account created",
        description: "You can now upload a room photo and run the demo.",
      });
      setCurrentStep(2);
    } catch (error: any) {
      toast({
        title: "Account error",
        description: error.message || "Unable to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const handleClearAccount = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    setCurrentStep(1);
    setUploadedImage(null);
    setUploadedFile(null);
    setConfig({});
    setStagedImageUrl(null);
    setDimensions(null);
    setCalibrationOverlayUrl(null);
    setAccountForm({
      firmName: "",
      name: "",
      email: "",
      phone: "",
    });
  };

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    setStagedImageUrl(null);
    setDimensions(null);
    setCalibrationOverlayUrl(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setCurrentStep(3);
    };
    reader.readAsDataURL(file);
  };

  const handleConfigSubmit = async () => {
    if (!user) {
      toast({
        title: "Account required",
        description: "Create an account before running the demo.",
        variant: "destructive",
      });
      setCurrentStep(1);
      return;
    }

    if (!uploadedFile) {
      toast({
        title: "Error",
        description: "No image file found. Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    if (!config.roomType || !config.style) {
      toast({
        title: "Error",
        description: "Please choose a room type and staging style.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setCurrentStep(4);

    try {
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("file", uploadedFile);
      formData.append("room_type", config.roomType);
      formData.append("style", config.style);
      if (config.calibrationHeightM && Number.isFinite(config.calibrationHeightM)) {
        formData.append("calibration_height_m", String(config.calibrationHeightM));
      }
      if (config.prompt?.trim()) {
        formData.append("prompt", config.prompt.trim());
      }

      const response = await fetch(buildApiUrl("/demo/watermark"), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        let message = text || "Staging failed.";
        try {
          const parsed = JSON.parse(text) as { detail?: string };
          message = parsed.detail || message;
        } catch {
          // keep fallback message
        }
        throw new Error(message);
      }

      const result = (await response.json()) as DemoWatermarkResponse;
      const stagedUrl = result.staged.download_url || result.staged.storage_url;

      if (!stagedUrl || stagedUrl.startsWith("r2://")) {
        throw new Error("Staged image is not publicly accessible yet.");
      }

      setStagedImageUrl(stagedUrl);
      setDimensions(result.dimensions ?? null);
      setCalibrationOverlayUrl(result.ceiling_overlay_base64 ?? null);
      setIsProcessing(false);

      if (!result.ceiling_overlay_base64) {
        setCurrentStep(5);
      }

      toast({
        title: "Demo ready",
        description: "Your staged demo image is ready to view.",
      });
    } catch (error: any) {
      console.error("Demo staging error:", error);
      setIsProcessing(false);
      toast({
        title: "Error",
        description: error.message || "Failed to generate demo. Please try again.",
        variant: "destructive",
      });
      setCurrentStep(3);
    }
  };

  const handleContinueToResults = () => {
    setCurrentStep(5);
  };

  const handleStartOver = () => {
    setCurrentStep(user ? 2 : 1);
    setUploadedImage(null);
    setUploadedFile(null);
    setConfig({});
    setStagedImageUrl(null);
    setDimensions(null);
    setCalibrationOverlayUrl(null);
  };

  const handleGenerateAnother = () => {
    setCurrentStep(uploadedImage ? 3 : 2);
    setStagedImageUrl(null);
    setDimensions(null);
    setCalibrationOverlayUrl(null);
  };


  return (
    <div className="min-h-screen bg-background">
      <ProgressStepper currentStep={currentStep} steps={steps} />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        {currentStep === 1 && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-semibold mb-4">Create Your Account</h1>
              <p className="text-muted-foreground">
                Set up your demo account to generate staged previews with a watermark.
              </p>
            </div>

            {user ? (
              <Card>
                <CardHeader>
                  <CardTitle>Account Ready</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2 text-sm text-muted-foreground">
                    <div>
                      <span className="text-foreground font-medium">Firm:</span> {user.firm_name}
                    </div>
                    <div>
                      <span className="text-foreground font-medium">Name:</span> {user.name}
                    </div>
                    <div>
                      <span className="text-foreground font-medium">Email:</span> {user.email}
                    </div>
                    {user.phone ? (
                      <div>
                        <span className="text-foreground font-medium">Phone:</span> {user.phone}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={() => setCurrentStep(2)} className="h-11">
                      Continue to Upload
                    </Button>
                    <Button variant="outline" onClick={handleClearAccount} className="h-11">
                      Use Different Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firm-name">Firm name</Label>
                      <Input
                        id="firm-name"
                        placeholder="Example Realty"
                        autoComplete="organization"
                        value={accountForm.firmName}
                        onChange={(e) =>
                          setAccountForm((prev) => ({ ...prev, firmName: e.target.value }))
                        }
                        data-testid="input-firm-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="full-name">Your name</Label>
                      <Input
                        id="full-name"
                        placeholder="Alex Agent"
                        autoComplete="name"
                        value={accountForm.name}
                        onChange={(e) => setAccountForm((prev) => ({ ...prev, name: e.target.value }))}
                        data-testid="input-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="alex@example.com"
                        autoComplete="email"
                        value={accountForm.email}
                        onChange={(e) => setAccountForm((prev) => ({ ...prev, email: e.target.value }))}
                        data-testid="input-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="555-123-4567"
                        autoComplete="tel"
                        value={accountForm.phone}
                        onChange={(e) => setAccountForm((prev) => ({ ...prev, phone: e.target.value }))}
                        data-testid="input-phone"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleCreateAccount}
                    className="w-full h-12"
                    disabled={isCreatingAccount || !canCreateAccount}
                    data-testid="button-create-account"
                  >
                    {isCreatingAccount ? "Creating account..." : "Create account"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-semibold mb-4">Upload Your Room Image</h1>
              <p className="text-muted-foreground">
                Start by uploading a photo of your empty room
              </p>
            </div>
            <UploadZone
              onFileSelect={handleFileSelect}
              isDragging={isDragging}
              onDragStateChange={setIsDragging}
            />
          </div>
        )}

        {currentStep === 3 && uploadedImage && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-semibold mb-4">Configure Your Demo</h1>
              <p className="text-muted-foreground">
                Choose a style and room type, then guide the AI with your prompt.
              </p>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <div className="rounded-lg border overflow-hidden bg-card">
                  <img
                    src={uploadedImage}
                    alt="Uploaded room"
                    className="w-full h-auto max-h-[600px] object-cover"
                    data-testid="img-uploaded-preview"
                  />
                </div>
              </div>
              <div>
                <ConfigurationPanel
                  config={config}
                  onConfigChange={setConfig}
                  onSubmit={handleConfigSubmit}
                  isSubmitting={isProcessing}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="max-w-4xl mx-auto">
            {isProcessing ? (
              <HouseLoadingAnimation message="Staging your room and preparing calibration..." duration={3000} />
            ) : calibrationOverlayUrl ? (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-semibold mb-4">Calibration Preview</h1>
                  <p className="text-muted-foreground">
                    Review the detected ceiling outline before viewing the final demo.
                  </p>
                </div>
                <CalibrationDisplay
                  imageUrl={calibrationOverlayUrl}
                  isProcessing={false}
                  actionLabel="Continue to Results"
                  dimensions={dimensions}
                  onGenerateStaging={handleContinueToResults}
                />
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                Upload a room photo to start the demo.
              </div>
            )}
          </div>
        )}

        {currentStep === 5 && stagedImageUrl && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-semibold mb-4">Your Demo Result</h1>
              <p className="text-muted-foreground">
                Download your watermarked demo image. Final staging is delivered after purchase.
              </p>
            </div>
            <ResultsView
              stagedImageUrl={stagedImageUrl}
              dimensions={dimensions}
              onStartOver={handleStartOver}
              onGenerateAnother={handleGenerateAnother}
              onPlaceOrder={() => setCurrentStep(6)}
            />
          </div>
        )}

        {currentStep === 6 && user && (
          <div className="max-w-4xl mx-auto">
            <OrderForm
              user={user}
              description="Upload the rooms you want staged, add a note for our team, and checkout at $9.50 per image."
              onBack={() => setCurrentStep(5)}
              submitLabel="Pay & Submit Order"
            />
          </div>
        )}
      </main>
    </div>
  );
}
