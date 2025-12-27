import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type DemoUser, type OrderListItem } from "@/types/demo";

const buildApiUrl = (path: string) => {
  const base = import.meta.env.VITE_API_BASE || "/api";
  const trimmed = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${trimmed}${normalized}`;
};

interface OrderHistoryProps {
  user: DemoUser;
}

const statusMap: Record<string, { label: string; tone: "default" | "secondary" | "destructive" }> = {
  pending_payment: { label: "Payment pending", tone: "secondary" },
  paid: { label: "Paid", tone: "default" },
  expired: { label: "Expired", tone: "destructive" },
};

export default function OrderHistory({ user }: OrderHistoryProps) {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(buildApiUrl(`/users/${user.id}/orders`));
        if (!response.ok) {
          throw new Error("Unable to load orders");
        }
        const data = (await response.json()) as OrderListItem[];
        setOrders(data);
      } catch {
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading orders…</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders yet. Your first order will show up here.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const statusInfo = statusMap[order.status] || { label: order.status, tone: "secondary" };
              const total = (order.amount_cents / 100).toFixed(2);
              return (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border rounded-lg p-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={statusInfo.tone}>{statusInfo.label}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">
                      {order.image_count} image{order.image_count === 1 ? "" : "s"} · ${total} {order.currency.toUpperCase()}
                    </p>
                    {order.note ? (
                      <p className="text-xs text-muted-foreground">Note: {order.note}</p>
                    ) : null}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Order #{order.id.slice(0, 8)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
