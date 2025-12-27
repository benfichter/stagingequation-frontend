import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Settings, Sparkles, ArrowRight, Check, UserPlus, Download, LogOut } from "lucide-react";
import { Link } from "wouter";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import OrderForm from "@/components/OrderForm";
import OrderHistory from "@/components/OrderHistory";
import { type DemoUser } from "@/types/demo";
import emptyRoomImage from "@assets/stock_images/empty_room_interior__c37a1a01.jpg";
import stagedRoomImage from "@assets/stock_images/beautifully_staged_l_3025d9c3.jpg";

export default function Landing() {
  const [user, setUser] = useState<DemoUser | null>(null);
  const USER_STORAGE_KEY = "stagingEquationUser";
  const baseApi = import.meta.env.VITE_API_BASE || "/api";
  const apiBase = baseApi.endsWith("/") ? baseApi.slice(0, -1) : baseApi;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (!stored) {
      return;
    }
    try {
      setUser(JSON.parse(stored) as DemoUser);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    const warmMoge = async () => {
      try {
        await fetch(`${apiBase}/moge/warm`, { method: "POST" });
      } catch {
        // ignore warmup errors
      }
    };
    warmMoge();
  }, [user?.id, apiBase]);

  const handleClearAccount = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <section className="border-b bg-muted/40">
          <div className="max-w-5xl mx-auto px-4 py-12 space-y-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-semibold">Welcome back, {user.name}</h1>
            <p className="text-muted-foreground text-lg">
              Place a staging order or start a fresh demo whenever you need it.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/staging">Run a New Demo</Link>
              </Button>
              <Button variant="outline" size="lg" onClick={handleClearAccount} className="gap-2">
                <LogOut className="w-4 h-4" />
                Switch Account
              </Button>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-12 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-muted-foreground">
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
            </CardContent>
          </Card>

          <OrderForm
            user={user}
            title="Place a New Order"
            description="Upload the rooms you want staged, add any notes, and checkout at $9.50 per image."
            submitLabel="Pay & Submit Order"
          />

          <OrderHistory user={user} />
        </section>
      </div>
    );
  }

  const features = [
    {
      icon: UserPlus,
      title: "Create Account",
      description: "Create your demo account in seconds"
    },
    {
      icon: Upload,
      title: "Upload",
      description: "Add a photo of your empty room"
    },
    {
      icon: Settings,
      title: "Prompt",
      description: "Choose a style and guide the AI with a prompt"
    },
    {
      icon: Download,
      title: "Download Demo",
      description: "Get a watermarked staging preview to share"
    }
  ];

  const benefits = [
    "Watermarked demo previews for quick sharing",
    "Professional staging in minutes",
    "Room type and style controls",
    "Prompt-guided furnishing suggestions",
    "Resolution matches your original upload"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center space-y-8">
            <div className="inline-block">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-accent-foreground/10">
                <Sparkles className="w-4 h-4 text-accent-foreground" />
                <span className="text-sm font-medium text-accent-foreground">
                  AI-Powered Visual Staging
                </span>
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              Transform Your Spaces
              <span className="block text-primary mt-2">
                With AI Staging
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground">
              Upload a room photo and get a watermarked staging demo in minutes, not hours.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button size="lg" className="h-12 px-8 text-base" data-testid="button-get-started" asChild>
                <Link href="/staging">
                  Create Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base" data-testid="button-try-demo" asChild>
                <Link href="/staging">
                  Try the Demo
                </Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Demo previews are watermarked and match your upload resolution.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-20 border-t">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple 4-Step Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our streamlined workflow makes professional room staging accessible to everyone
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover-elevate" data-testid={`card-feature-${index}`}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground">
                      Step {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Professional Results,
                <span className="block text-primary">Powered by AI</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our AI generates clean staging previews that help clients visualize the space quickly.
                Final, unwatermarked staging is delivered after purchase.
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-base">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" className="h-12 px-8 mt-4" data-testid="button-start-staging" asChild>
                <Link href="/staging">
                  Create Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
            
            <div className="relative">
              <BeforeAfterSlider
                beforeImage={emptyRoomImage}
                afterImage={stagedRoomImage}
                beforeLabel="Empty Room"
                afterLabel="AI Staged"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready to Transform Your Space?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for realtors and designers who need fast, shareable staging previews.
          </p>
          <Button size="lg" className="h-14 px-10 text-lg" data-testid="button-get-started-bottom" asChild>
            <Link href="/staging">
              Create Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 Staging Equation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
