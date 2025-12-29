import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bookmark, Check, Sparkles } from "lucide-react";
import { Link } from "wouter";
import PromoBanner from "@/components/PromoBanner";
import { type DemoUser } from "@/types/demo";
import FullHouseLogo from "@/components/FullHouseLogo";

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

const USER_STORAGE_KEY = "stagingEquationUser";

export default function Journal() {
  const [activeBlogTag, setActiveBlogTag] = useState(BLOG_TAGS[0]);
  const [blogQuery, setBlogQuery] = useState("");
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const [readPosts, setReadPosts] = useState<Record<string, boolean>>({});
  const [user, setUser] = useState<DemoUser | null>(null);

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
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Studio Journal
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">{user ? "Dashboard" : "Home"}</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/journal">Journal</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/staging">Run Demo</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle>Studio Journal</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Sample posts to spark your next staging concept.
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
                        <Button type="button" size="sm" variant="ghost" onClick={() => toggleSaved(post.id)}>
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
                  \"Warm modern living room, layered neutrals, statement lighting, clear walkway to balcony.\"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
