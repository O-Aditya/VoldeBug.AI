"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTools } from "@web/hooks/use-tools";
import { GradientMesh } from "@web/components/ui/background";
import {
  Search, Bot, Code2, Pen, Image, BookOpen,
  ExternalLink, Sparkles, TrendingUp, ChevronRight, Zap, X
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────

const CATEGORIES = [
  { key: "", label: "All Tools", icon: Sparkles },
  { key: "CHAT_AI", label: "Chat AI", icon: Bot },
  { key: "CODE_AI", label: "Code AI", icon: Code2 },
  { key: "IMAGE_AI", label: "Image AI", icon: Image },
  { key: "WRITING_AI", label: "Writing AI", icon: Pen },
  { key: "RESEARCH_AI", label: "Research AI", icon: BookOpen },
];

const CATEGORY_COLORS: Record<string, string> = {
  CHAT_AI: "#6366f1",
  CODE_AI: "#06b6d4",
  IMAGE_AI: "#ec4899",
  WRITING_AI: "#22c55e",
  RESEARCH_AI: "#f59e0b",
};

const CATEGORY_LABEL: Record<string, string> = {
  CHAT_AI: "Chat AI",
  CODE_AI: "Code AI",
  IMAGE_AI: "Image AI",
  WRITING_AI: "Writing AI",
  RESEARCH_AI: "Research AI",
};

// Demo tools for when the database is empty
const DEMO_TOOLS = [
  { id: "1", name: "ChatGPT", category: "CHAT_AI", description: "Advanced conversational AI for brainstorming, writing, and answering complex questions.", logoUrl: "", brandColor: "#10a37f", useCases: ["Essay help", "Brainstorming", "Q&A"], subjects: ["All subjects"], usageCount: 1250, createdAt: "" },
  { id: "2", name: "GitHub Copilot", category: "CODE_AI", description: "AI pair programmer that helps you write code faster and smarter.", logoUrl: "", brandColor: "#1b1f24", useCases: ["Code completion", "Bug fixing", "Learning"], subjects: ["Computer Science", "STEM"], usageCount: 890, createdAt: "" },
  { id: "3", name: "Midjourney", category: "IMAGE_AI", description: "Generate stunning, high-quality images from text descriptions.", logoUrl: "", brandColor: "#000000", useCases: ["Art projects", "Presentations", "Creative work"], subjects: ["Art", "Design"], usageCount: 756, createdAt: "" },
  { id: "4", name: "Grammarly", category: "WRITING_AI", description: "Advanced writing assistant that checks grammar, style, and clarity in real time.", logoUrl: "", brandColor: "#15c39a", useCases: ["Essay editing", "Grammar check", "Writing improvement"], subjects: ["English", "All subjects"], usageCount: 1100, createdAt: "" },
  { id: "5", name: "Perplexity AI", category: "RESEARCH_AI", description: "AI-powered search engine that gives direct, cited answers to research questions.", logoUrl: "", brandColor: "#20b2aa", useCases: ["Research", "Fact-checking", "Learning"], subjects: ["Science", "History", "Research"], usageCount: 680, createdAt: "" },
  { id: "6", name: "Claude", category: "CHAT_AI", description: "Thoughtful AI assistant excellent at analysis, writing, and nuanced reasoning.", logoUrl: "", brandColor: "#d97706", useCases: ["Analysis", "Writing", "Tutoring"], subjects: ["All subjects"], usageCount: 540, createdAt: "" },
  { id: "7", name: "Replit", category: "CODE_AI", description: "Online IDE with built-in AI to help you code, run, and share projects.", logoUrl: "", brandColor: "#f26207", useCases: ["Coding projects", "Learning to code", "Collaboration"], subjects: ["Computer Science"], usageCount: 420, createdAt: "" },
  { id: "8", name: "Canva AI", category: "IMAGE_AI", description: "Design tool with AI image generation and editing for presentations and projects.", logoUrl: "", brandColor: "#00c4cc", useCases: ["Presentations", "Posters", "Social media"], subjects: ["Art", "Business", "All subjects"], usageCount: 890, createdAt: "" },
  { id: "9", name: "QuillBot", category: "WRITING_AI", description: "AI paraphrasing and summarization tool for better, clearer writing.", logoUrl: "", brandColor: "#4CAF50", useCases: ["Paraphrasing", "Summarizing", "Writing"], subjects: ["English", "All subjects"], usageCount: 650, createdAt: "" },
  { id: "10", name: "Elicit", category: "RESEARCH_AI", description: "AI research assistant that helps find and summarize academic papers.", logoUrl: "", brandColor: "#5b21b6", useCases: ["Academic research", "Paper summaries", "Literature review"], subjects: ["Science", "Research"], usageCount: 310, createdAt: "" },
];

// ─── Sub-components ───────────────────────────────────────────────────────

function ToolCard({ tool, index }: { tool: typeof DEMO_TOOLS[0]; index: number }) {
  const color = tool.brandColor || CATEGORY_COLORS[tool.category] || "#6366f1";
  const catLabel = CATEGORY_LABEL[tool.category] || tool.category;

  return (
    <motion.a
      href={`/dashboard/tools/${tool.id}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: index * 0.04 }}
      className="card p-5 flex flex-col gap-4 group hover:scale-[1.01] transition-transform"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg"
          style={{ backgroundColor: color }}
        >
          {tool.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-sm truncate">{tool.name}</p>
          <span
            className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mt-0.5"
            style={{ backgroundColor: `${color}18`, color }}
          >
            {catLabel}
          </span>
        </div>
        <ExternalLink
          className="w-4 h-4 text-foreground-subtle opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        />
      </div>

      {/* Description */}
      <p className="text-xs text-foreground-muted leading-relaxed line-clamp-2">
        {tool.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-card-border">
        <div className="flex items-center gap-1 text-xs text-foreground-subtle">
          <TrendingUp className="w-3 h-3" />
          <span>{tool.usageCount.toLocaleString()} uses</span>
        </div>
        <span className="text-xs text-accent-light group-hover:underline flex items-center gap-0.5">
          Open <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </motion.a>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  const handleSearchChange = useCallback((val: string) => {
    setSearch(val);
    clearTimeout((window as any).__searchTimer);
    (window as any).__searchTimer = setTimeout(() => setDebouncedSearch(val), 300);
  }, []);

  const { data: apiTools, isLoading } = useTools({
    category: activeCategory || undefined,
    search: debouncedSearch || undefined,
  });

  // Fall back to demo tools if DB is empty
  const allTools = apiTools && apiTools.length > 0 ? apiTools : DEMO_TOOLS;

  const filtered = useMemo(() => {
    let t = allTools;
    if (activeCategory) t = t.filter((tool) => tool.category === activeCategory);
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      t = t.filter(
        (tool) =>
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q)
      );
    }
    return t;
  }, [allTools, activeCategory, debouncedSearch]);

  return (
    <div className="min-h-screen relative">
      <GradientMesh />

      <div className="max-w-6xl mx-auto pb-24 lg:pb-8 px-4 md:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-6 pb-2 space-y-1"
        >
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6 text-accent-light" />
            AI Tools Library
          </h1>
          <p className="text-sm text-foreground-muted">
            {allTools.length} tools curated for students — find the right one for your assignment
          </p>
        </motion.div>

        {/* Search + Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="sticky top-14 z-30 py-4 -mx-4 px-4 md:-mx-6 md:px-6 bg-bg/80 backdrop-blur-sm border-b border-white/5 space-y-3"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search tools by name or description…"
              className="input-base pl-10 pr-10"
              aria-label="Search AI tools"
            />
            {search && (
              <button
                onClick={() => { setSearch(""); setDebouncedSearch(""); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  activeCategory === cat.key
                    ? "bg-accent text-white shadow-md shadow-accent/20"
                    : "bg-surface/40 text-foreground-muted hover:text-foreground hover:bg-surface/70 border border-card-border"
                }`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        <div className="mt-4 mb-3 flex items-center justify-between">
          <p className="text-xs text-foreground-subtle">
            {isLoading ? "Loading..." : `${filtered.length} tool${filtered.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="card h-44 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-foreground-subtle opacity-40" />
            </div>
            <p className="font-display text-base font-semibold mb-1">No tools found</p>
            <p className="text-sm text-foreground-subtle">
              Try a different search term or category
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((tool, i) => (
                <ToolCard key={tool.id} tool={tool} index={i} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}