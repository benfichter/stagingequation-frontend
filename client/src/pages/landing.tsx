import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Check,
  Download,
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
import emptyRoomImage from "@assets/stock_images/empty_room_interior__c37a1a01.jpg";
import stagedRoomImage from "@assets/stock_images/beautifully_staged_l_3025d9c3.jpg";

const BLOG_TAGS = ["All", "Workflow", "Design", "AI Tips", "Pricing"];

const BLOG_POSTS = [
  {
    id: "thirty-minute-brief",
    title: "The 30-Min Staging Brief",
    tags: ["Workflow"],
    readTime: "5 min",
    author: "Studio Desk",
    date: "Today",
    excerpt:
      "Turn client notes into a crisp staging brief that keeps every render aligned with the listing story.",
  },
  {
    id: "texture-stacks",
    title: "Texture Stacks That Sell",
    tags: ["Design"],
    readTime: "4 min",
    author: "Esha from Styling",
    date: "Yesterday",
    excerpt:
      "Layer rugs, textiles, and wood grains so rooms feel curated but still easy for buyers to imagine.",
  },
  {
    id: "prompting-open-floor",
    title: "Prompting for Open Floor Plans",
    tags: ["AI Tips"],
    readTime: "6 min",
    author: "AI Lab",
    date: "2 days ago",
    excerpt:
      "Use spatial cues and focal anchors in your prompts to keep wide-open layouts cohesive.",
  },
  {
    id: "micro-pricing",
    title: "Pricing Micro-Staging Bundles",
    tags: ["Pricing"],
    readTime: "3 min",
    author: "Ops Notebook",
    date: "This week",
    excerpt:
      "Bundle kitchens and living rooms together to improve conversion without adding friction.",
  },
];

export default function Landing() {
  const [user, setUser] = useState<DemoUser | null>(null);
  const USER_STORAGE_KEY = "stagingEquationUser";
  const baseApi = import.meta.env.VITE_API_BASE || "/api";
  const apiBase = baseApi.endsWith("/") ? baseApi.slice(0, -1) : baseApi;
  const [activeBlogTag, setActiveBlogTag] = useState(BLOG_TAGS[0]);
  const [blogQuery, setBlogQuery] = useState("");
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const [readPosts, setReadPosts] = useState<Record<string, boolean>>({});

  const normalizedQuery = blogQuery.trim().toLowerCase();
  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesTag = activeBlogTag === "All" || post.tags.includes(activeBlogTag);
    if (!normalizedQuery) {
      return matchesTag;
    }
    const searchable = `${post.title} ${post.excerpt} ${post.author}`.toLowerCase();
    return matchesTag && searchable.includes(normalizedQuery);
  });
  const savedQueue = BLOG_POSTS.filter((post) => savedPosts[post.id]);

  const toggleSaved = (postId: string) => {
    setSavedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleRead = (postId: string) => {
    setReadPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

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
          <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <Badge variant="outline" className="w-fit gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Studio online
                </Badge>
                <div className="space-y-2">
                  <h1 className="text-4xl sm:text-5xl font-semibold">Welcome back, {user.name}</h1>
                  <p className="text-muted-foreground text-lg">
                    Build quick demos, keep the queue moving, and ship confident staging to clients.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <Link href="/staging">Run a New Demo</Link>
                  </Button>
                  <Button variant="secondary" size="lg" asChild>
                    <a href="#studio-journal">Jump to Journal</a>
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleClearAccount} className="gap-2">
                    <LogOut className="w-4 h-4" />
                    Switch Account
                  </Button>
                </div>
              </div>
              <Card className="border-border/60 bg-background/80">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Quick guide</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Three steps to keep the dashboard simple.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      1
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Run a demo</p>
                      <p>Generate a watermarked preview with your client notes.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      2
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Upload and checkout</p>
                      <p>Use the order form below to submit final rooms.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      3
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Track orders</p>
                      <p>See paid and delivered work in your order history.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-10 space-y-10">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <OrderForm
              user={user}
              title="Place a New Order"
              description="Upload the rooms you want staged, add any notes, and checkout at $0.01 per image."
              submitLabel="Pay & Submit Order"
            />
            <Card>
              <CardHeader>
                <CardTitle>Reading Queue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                {savedQueue.length === 0 ? (
                  <p>Save posts to build a queue for your next staging sprint.</p>
                ) : (
                  <div className="space-y-3">
                    {savedQueue.map((post) => (
                      <div key={post.id} className="rounded-lg border bg-muted/20 p-3 space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">{post.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {post.readTime} | {post.tags[0]}
                            </p>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleSaved(post.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="rounded-lg border bg-background p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Prompt of the day
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "Warm modern living room, layered neutrals, statement lighting, clear walkway to balcony."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div id="studio-journal" className="space-y-6">
            <Card>
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Studio Journal
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Sample blog posts to spark your next staging concept.
                    </p>
                  </div>
                  <Badge variant="outline">{filteredPosts.length} posts</Badge>
                </div>
                <div className="space-y-3">
                  <Input
                    value={blogQuery}
                    onChange={(event) => setBlogQuery(event.target.value)}
                    placeholder="Search the journal..."
                  />
                  <div className="flex flex-wrap gap-2">
                    {BLOG_TAGS.map((tag) => (
                      <Button
                        key={tag}
                        type="button"
                        size="sm"
                        variant={activeBlogTag === tag ? "default" : "outline"}
                        onClick={() => setActiveBlogTag(tag)}
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredPosts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No posts match that filter. Try another tag or search.
                  </p>
                ) : (
                  filteredPosts.map((post) => {
                    const isSaved = Boolean(savedPosts[post.id]);
                    const isRead = Boolean(readPosts[post.id]);
                    return (
                      <div key={post.id} className="rounded-lg border bg-muted/20 p-4 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="secondary">{post.tags[0]}</Badge>
                            <span>{post.readTime} read</span>
                            <span>|</span>
                            <span>{post.date}</span>
                          </div>
                          {isRead ? (
                            <Badge variant="outline" className="gap-1">
                              <Check className="h-3 w-3" />
                              Read
                            </Badge>
                          ) : null}
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-base font-semibold">{post.title}</h3>
                          <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <span className="text-xs text-muted-foreground">by {post.author}</span>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant={isSaved ? "default" : "outline"}
                              onClick={() => toggleSaved(post.id)}
                              className="gap-2"
                            >
                              <Bookmark className="h-4 w-4" />
                              {isSaved ? "Saved" : "Save"}
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleRead(post.id)}
                            >
                              {isRead ? "Mark unread" : "Mark read"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

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
