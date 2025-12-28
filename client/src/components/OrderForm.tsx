import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { type DemoUser, type OrderCheckoutResponse } from "@/types/demo";
import { buildApiUrl } from "@/lib/api";
import { X } from "lucide-react";
import { useLocation } from "wouter";

interface OrderFormProps {
  user: DemoUser;
  pricePerImage?: number;
  title?: string;
  description?: string;
  submitLabel?: string;
  onBack?: () => void;
  onCancel?: () => void;
  cancelLabel?: string;
}

export default function OrderForm({
  user,
  pricePerImage = 0.01,
  title = "Place Your Order",
  description = "Upload the rooms you want staged, add a note for our team, and checkout.",
  submitLabel = "Pay & Submit Order",
  onBack,
  onCancel,
  cancelLabel = "Cancel Order",
}: OrderFormProps) {
  const [orderFiles, setOrderFiles] = useState<{ file: File; url: string }[]>([]);
  const [orderNote, setOrderNote] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const orderImageCount = orderFiles.length;
  const orderTotal = orderImageCount * pricePerImage;

  const handleOrderFilesChange = (files: FileList | null) => {
    if (!files) {
      orderFiles.forEach((item) => URL.revokeObjectURL(item.url));
      setOrderFiles([]);
      return;
    }
    orderFiles.forEach((item) => URL.revokeObjectURL(item.url));
    const nextFiles = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setOrderFiles(nextFiles);
  };

  const handleSubmitOrder = async () => {
    if (orderFiles.length === 0) {
      toast({
        title: "Add images",
        description: "Upload at least one room image for your order.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingOrder(true);
    try {
      const formData = new FormData();
      formData.append("user_id", user.id);
      if (orderNote.trim()) {
        formData.append("note", orderNote.trim());
      }
      orderFiles.forEach((item) => formData.append("files", item.file));

      const response = await fetch(buildApiUrl("/orders/checkout"), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        let message = text || "Unable to start checkout.";
        try {
          const parsed = JSON.parse(text) as { detail?: string };
          message = parsed.detail || message;
        } catch {
          // keep fallback message
        }
        throw new Error(message);
      }

      const payload = (await response.json()) as OrderCheckoutResponse;
      if (!payload.checkout_url) {
        throw new Error("Checkout URL missing.");
      }

      window.location.href = payload.checkout_url;
    } catch (error: any) {
      toast({
        title: "Order error",
        description: error.message || "Unable to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setOrderFiles((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      if (removed?.url) {
        URL.revokeObjectURL(removed.url);
      }
      return next;
    });
  };

  const handleCancelOrder = () => {
    if (onCancel) {
      onCancel();
      return;
    }
    setLocation("/");
  };

  useEffect(() => {
    return () => {
      orderFiles.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [orderFiles]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-semibold mb-4">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="order-files">Room images</Label>
            <Input
              id="order-files"
              type="file"
              multiple
              accept="image/*"
              onChange={(event) => handleOrderFilesChange(event.target.files)}
              data-testid="input-order-files"
            />
            {orderFiles.length > 0 ? (
              <div className="text-sm text-muted-foreground">
                {orderFiles.length} image{orderFiles.length === 1 ? "" : "s"} selected.
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Add all the rooms you want staged in this order.
              </div>
            )}
          </div>

          {orderFiles.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {orderFiles.map((item, index) => (
                <div key={item.url} className="relative rounded-lg border bg-muted/30 overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.file.name || `Order image ${index + 1}`}
                    className="h-40 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm hover:bg-background"
                    aria-label={`Remove ${item.file.name || "image"}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="px-3 py-2 text-xs text-muted-foreground truncate">
                    {item.file.name}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="order-note">Notes for our team (optional)</Label>
            <Textarea
              id="order-note"
              placeholder="Example: Keep the living room neutral, add staging for a family-friendly feel."
              value={orderNote}
              onChange={(event) => setOrderNote(event.target.value)}
              data-testid="input-order-note"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-dashed">
              <CardContent className="pt-6 space-y-1">
                <p className="text-xs uppercase text-muted-foreground">Price per image</p>
                <p className="text-2xl font-semibold">${pricePerImage.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card className="border-dashed">
              <CardContent className="pt-6 space-y-1">
                <p className="text-xs uppercase text-muted-foreground">Images</p>
                <p className="text-2xl font-semibold">{orderImageCount}</p>
              </CardContent>
            </Card>
            <Card className="border-dashed">
              <CardContent className="pt-6 space-y-1">
                <p className="text-xs uppercase text-muted-foreground">Total</p>
                <p className="text-2xl font-semibold">${orderTotal.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleSubmitOrder}
              className="h-12"
              disabled={isSubmittingOrder || orderFiles.length === 0}
              data-testid="button-submit-order"
            >
              {isSubmittingOrder ? "Redirecting to checkout..." : submitLabel}
            </Button>
            {onBack ? (
              <Button variant="outline" onClick={onBack} className="h-12">
                Back
              </Button>
            ) : null}
            <Button variant="ghost" onClick={handleCancelOrder} className="h-12">
              {cancelLabel}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Orders are delivered after payment. We keep your original resolution—no upscaling promises.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
