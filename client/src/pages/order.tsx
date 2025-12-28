import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type OrderDetail } from "@/types/demo";
import { buildApiUrl } from "@/lib/api";

const statusMap: Record<string, { label: string; tone: "default" | "secondary" | "destructive" }> = {
  pending_payment: { label: "Payment pending", tone: "secondary" },
  paid: { label: "Paid", tone: "default" },
  expired: { label: "Expired", tone: "destructive" },
};

export default function OrderDetailPage() {
  const [, params] = useRoute("/orders/:orderId");
  const orderId = params?.orderId;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      setErrorMessage("Order not found.");
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(buildApiUrl(`/orders/${orderId}`));
        if (!response.ok) {
          throw new Error("Unable to load order");
        }
        const data = (await response.json()) as OrderDetail;
        setOrder(data);
        setErrorMessage("");
      } catch {
        setErrorMessage("Unable to load this order.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const total = order ? (order.amount_cents / 100).toFixed(2) : "0.00";
  const statusInfo = order ? statusMap[order.status] || { label: order.status, tone: "secondary" } : null;
  const uploads = order?.uploads ?? [];

  const handleResumePayment = async () => {
    if (!order) {
      return;
    }
    setIsPaying(true);
    setPayError("");
    try {
      const response = await fetch(buildApiUrl(`/orders/${order.id}/checkout`), { method: "POST" });
      if (!response.ok) {
        throw new Error("Unable to resume payment");
      }
      const data = (await response.json()) as { checkout_url: string };
      window.location.href = data.checkout_url;
    } catch {
      setPayError("Unable to open checkout. Please try again.");
      setIsPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Order</p>
            <h1 className="text-3xl font-semibold">
              {order ? `#${order.id.slice(0, 8)}` : "Loading..."}
            </h1>
            <p className="text-sm text-muted-foreground">Details, status, and uploaded images.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {order?.status === "pending_payment" ? (
              <Button onClick={handleResumePayment} disabled={isPaying}>
                {isPaying ? "Opening checkout..." : "Pay for this order"}
              </Button>
            ) : null}
            <Button variant="outline" asChild>
              <Link href="/">Back to Dashboard</Link>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="py-8 text-sm text-muted-foreground">Loading order...</CardContent>
          </Card>
        ) : errorMessage ? (
          <Card>
            <CardContent className="py-8 text-sm text-muted-foreground">{errorMessage}</CardContent>
          </Card>
        ) : order ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 text-sm text-muted-foreground">
                <div className="space-y-1">
                  <p className="text-xs uppercase text-muted-foreground">Status</p>
                  {statusInfo ? <Badge variant={statusInfo.tone}>{statusInfo.label}</Badge> : null}
                </div>
                {payError ? (
                  <div className="sm:col-span-2 text-xs text-destructive">
                    {payError}
                  </div>
                ) : null}
                <div className="space-y-1">
                  <p className="text-xs uppercase text-muted-foreground">Placed</p>
                  <p className="text-foreground">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase text-muted-foreground">Total</p>
                  <p className="text-foreground">
                    ${total} {order.currency.toUpperCase()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase text-muted-foreground">Images</p>
                  <p className="text-foreground">{order.image_count}</p>
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <p className="text-xs uppercase text-muted-foreground">Order ID</p>
                  <p className="text-foreground break-all">{order.id}</p>
                </div>
                {order.note ? (
                  <div className="sm:col-span-2 space-y-1">
                    <p className="text-xs uppercase text-muted-foreground">Note</p>
                    <p className="text-foreground">{order.note}</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Images</CardTitle>
              </CardHeader>
              <CardContent>
                {uploads.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No images attached to this order yet.</p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {uploads.map((upload, index) => {
                      const imageUrl = upload.download_url || upload.storage_url;
                      const label = upload.original_filename || `Order image ${index + 1}`;
                      return (
                        <a
                          key={upload.id}
                          href={imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="group block overflow-hidden rounded-lg border bg-muted/20"
                        >
                          <img
                            src={imageUrl}
                            alt={label}
                            className="h-40 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                          />
                          <div className="p-3 text-xs text-muted-foreground">{label}</div>
                        </a>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </section>
    </div>
  );
}
