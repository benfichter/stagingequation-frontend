import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  BookOpen,
  Check,
  LogOut,
  Settings,
  Sparkles,
  Upload,
  UserPlus,
} from "lucide-react";
import { Link } from "wouter";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import OrderForm from "@/components/OrderForm";
import OrderHistory from "@/components/OrderHistory";
import { type DemoUser } from "@/types/demo";
import { buildApiUrl } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import PromoBanner from "@/components/PromoBanner";
import FullHouseLogo from "@/components/FullHouseLogo";
import emptyRoomImage from "@assets/stock_images/1.jpeg";
import stagedRoomImage from "@assets/stock_images/1_Staged.png";

const USER_STORAGE_KEY = "stagingEquationUser";
const isPasswordTooLong = (value: string) => new TextEncoder().encode(value).length > 72;

const features = [
  {
    icon: UserPlus,
    title: "Create Account",
    description: "Set up a secure account in seconds",
  },
  {
    icon: Upload,
    title: "Upload",
    description: "Add a photo of your empty room",
  },
  {
    icon: Settings,
    title: "Prompt",
    description: "Choose a style and guide the AI with a prompt",
  },
  {
    icon: BookOpen,
    title: "Deliver",
    description: "Share a watermarked preview, then order finals",
  },
];

const benefits = [
  "$4 per image New Year special through January 7",
  "Watermarked demo previews for quick sharing",
  "Room type and style controls",
  "Prompt-guided furnishing suggestions",
  "Resolution matches your original upload",
];

export default function Landing() {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    firmName: "",
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const { toast } = useToast();

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
        await fetch(buildApiUrl("/moge/warm"), { method: "POST" });
      } catch {
        // ignore warmup errors
      }
    };
    warmMoge();
  }, [user?.id]);

  const handleClearAccount = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  const handleLogin = async () => {
    if (!loginForm.email.trim() || !loginForm.password) {
      toast({
        title: "Missing details",
        description: "Email and password are required to log in.",
        variant: "destructive",
      });
      return;
    }
    if (isPasswordTooLong(loginForm.password)) {
      toast({
        title: "Password too long",
        description: "Use 72 characters or fewer.",
        variant: "destructive",
      });
      return;
    }

    setIsLoggingIn(true);
    try {
      const response = await fetch(buildApiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginForm.email.trim(),
          password: loginForm.password,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        let message = text || "Unable to log in.";
        try {
          const parsed = JSON.parse(text) as { detail?: string };
          message = parsed.detail || message;
        } catch {
          // keep fallback message
        }
        throw new Error(message);
      }

      const loggedInUser = (await response.json()) as DemoUser;
      setUser(loggedInUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));
      toast({
        title: "Welcome back",
        description: "Your dashboard is ready.",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Unable to log in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignup = async () => {
    if (!signupForm.firmName.trim() || !signupForm.name.trim() || !signupForm.email.trim()) {
      toast({
        title: "Missing details",
        description: "Firm name, name, and email are required to create an account.",
        variant: "destructive",
      });
      return;
    }
    if (signupForm.password.length < 8) {
      toast({
        title: "Password too short",
        description: "Use at least 8 characters for your password.",
        variant: "destructive",
      });
      return;
    }
    if (isPasswordTooLong(signupForm.password)) {
      toast({
        title: "Password too long",
        description: "Use 72 characters or fewer.",
        variant: "destructive",
      });
      return;
    }

    setIsSigningUp(true);
    try {
      const response = await fetch(buildApiUrl("/users"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firm_name: signupForm.firmName.trim(),
          name: signupForm.name.trim(),
          email: signupForm.email.trim(),
          phone: signupForm.phone.trim() || null,
          password: signupForm.password,
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
        description: "Welcome to your dashboard.",
      });
    } catch (error: any) {
      toast({
        title: "Account error",
        description: error.message || "Unable to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSigningUp(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <PromoBanner />
      <header className="border-b bg-background/95">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <FullHouseLogo className="h-6 w-6 text-primary" />
              <span>Staging Equation</span>
            </div>
            <Badge variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Dashboard
            </Badge>
              <span className="text-sm text-muted-foreground">Welcome back, {user.name}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">Dashboard</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/journal">Journal</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/staging">Run Demo</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClearAccount} className="gap-2">
                <LogOut className="h-4 w-4" />
                Switch Account
              </Button>
            </div>
          </div>
        </header>

        <section className="max-w-6xl mx-auto px-4 py-10 space-y-10">
          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <OrderForm
              user={user}
              title="Upload Your Images"
              description="Submit your rooms for final staging and checkout at $4 per image."
              submitLabel="Pay & Submit Order"
            />
            <Card>
              <CardHeader>
                <CardTitle>Quick guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="space-y-2">
                  <p className="text-foreground font-medium">1. Upload your rooms</p>
                  <p>Add the spaces you want staged to your order.</p>
                </div>
                <div className="space-y-2">
                  <p className="text-foreground font-medium">2. Checkout</p>
                  <p>Pay once and our team begins the final staging.</p>
                </div>
                <div className="space-y-2">
                  <p className="text-foreground font-medium">3. Track delivery</p>
                  <p>See order status and download links in history.</p>
                </div>
                <Button variant="secondary" asChild className="w-full">
                  <Link href="/staging">Run a new demo</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <OrderHistory user={user} />
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PromoBanner />
      <header className="border-b bg-background/95">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <FullHouseLogo className="h-6 w-6 text-primary" />
            <span>Staging Equation</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/journal">Journal</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="#auth">Login</a>
            </Button>
          </div>
        </div>
      </header>
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
              <span className="block text-primary mt-2">With AI Staging</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground">
              Upload a room photo and get a watermarked staging demo in minutes. New Year special
              pricing is $4 per image through January 7.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button size="lg" className="h-12 px-8 text-base" data-testid="button-get-started" asChild>
                <a href="#auth">
                  Create Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base" data-testid="button-try-demo" asChild>
                <Link href="/staging">Run a Demo</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Demo previews are watermarked and match your upload resolution.
            </p>
          </div>
        </div>
      </section>

      <section id="features-section" className="py-20 border-t">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple 4-Step Process</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our streamlined workflow makes professional room staging accessible to everyone.
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
                    <span className="text-sm font-semibold text-muted-foreground">Step {index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
                <a href="#auth">
                  Create Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
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

      <section id="auth" className="py-20 border-t">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">Log in or create your account</h2>
            <p className="text-muted-foreground">Your dashboard and onboarding remain separate.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={loginForm.email}
                    onChange={(event) =>
                      setLoginForm((prev) => ({ ...prev, email: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    maxLength={72}
                    value={loginForm.password}
                    onChange={(event) =>
                      setLoginForm((prev) => ({ ...prev, password: event.target.value }))
                    }
                  />
                </div>
                <Button
                  className="w-full h-11"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? "Logging in..." : "Log in"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="signup-firm">Firm name</Label>
                    <Input
                      id="signup-firm"
                      autoComplete="organization"
                      value={signupForm.firmName}
                      onChange={(event) =>
                        setSignupForm((prev) => ({ ...prev, firmName: event.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Your name</Label>
                    <Input
                      id="signup-name"
                      autoComplete="name"
                      value={signupForm.name}
                      onChange={(event) =>
                        setSignupForm((prev) => ({ ...prev, name: event.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      value={signupForm.email}
                      onChange={(event) =>
                        setSignupForm((prev) => ({ ...prev, email: event.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone (optional)</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      autoComplete="tel"
                      value={signupForm.phone}
                      onChange={(event) =>
                        setSignupForm((prev) => ({ ...prev, phone: event.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    autoComplete="new-password"
                    maxLength={72}
                    value={signupForm.password}
                    onChange={(event) =>
                      setSignupForm((prev) => ({ ...prev, password: event.target.value }))
                    }
                  />
                </div>
                <Button
                  className="w-full h-11"
                  onClick={handleSignup}
                  disabled={isSigningUp}
                >
                  {isSigningUp ? "Creating account..." : "Create account"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>(c) 2025 Staging Equation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
