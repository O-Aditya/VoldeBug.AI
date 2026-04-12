"use client";

import { motion } from "framer-motion";
import { useTool } from "@web/hooks/use-tools";
import { GradientMesh } from "@web/components/ui/background";
import {
  ArrowLeft, ExternalLink, Users, BookOpen, Lightbulb,
  CheckCircle2, Tag, ChevronRight, Zap
} from "lucide-react";

// ─── Category label map ───────────────────────────────────────────────────

const CATEGORY_LABEL: Record<string, string> = {
  CHAT_AI: "Chat AI",
  CODE_AI: "Code AI",
  IMAGE_AI: "Image AI",
  WRITING_AI: "Writing AI",
  RESEARCH_AI: "Research AI",
};

// ─── Demo fallback for this tool ──────────────────────────────────────────

const DEMO_TOOLS: Record<string, {
  name: string; category: string; description: string; brandColor: string;
  useCases: string[]; subjects: string[]; usageCount: number;
  howTo: string[]; examplePrompts: string[]; proTips: string[];
}> = {
  default: {
    name: "ChatGPT",
    category: "CHAT_AI",
    description: "ChatGPT is an advanced conversational AI that can help you with brainstorming, writing essays, explaining complex concepts, debugging code, and much more. It understands context and provides detailed, thoughtful responses.",
    brandColor: "#10a37f",
    useCases: ["Essay brainstorming and drafting", "Explaining difficult concepts", "Answering research questions", "Writing feedback and editing", "Learning new topics interactively"],
    subjects: ["English", "Science", "History", "Mathematics", "Computer Science", "All subjects"],
    usageCount: 1250,
    howTo: [
      "Navigate to chatgpt.com and create a free account",
      "Start a new chat by clicking 'New chat' in the sidebar",
      "Type your question or request clearly — be specific for better results",
      "Read the response, then follow up with clarifying questions",
      "Use the thumbs up/down to rate responses and improve future answers",
    ],
    examplePrompts: [
      '"Explain photosynthesis in simple terms as if I\'m 14 years old"',
      '"Help me create an outline for an essay about climate change"',
      '"What are 5 interesting facts about the Roman Empire?"',
      '"Review my paragraph and suggest improvements: [paste your text]"',
    ],
    proTips: [
      "Be specific in your prompts — the more detail you give, the better the response",
      "Ask follow-up questions to dig deeper into any topic",
      "Use it to check your work, not to do your work for you",
      "Always verify important facts from reliable sources",
    ],
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────

export default function ToolDetailPage({ params }: { params: { id: string } }) {
  const { data: tool, isLoading, isError } = useTool(params.id);

  // Use real tool data or fall back to demo
  const t = tool
    ? {
        ...tool,
        howTo: ["Open the tool in a new tab", "Create an account if required", "Type your question or prompt", "Explore the tool's features"],
        examplePrompts: tool.useCases.map((uc) => `"Help me with: ${uc}"`),
        proTips: ["Start with simple prompts", "Experiment with different phrasings", "Save outputs you find useful"],
      }
    : DEMO_TOOLS.default;

  const color = t.brandColor || "#6366f1";

  return (
    <div className="min-h-screen relative">
      <GradientMesh />

      <div className="max-w-4xl mx-auto pb-24 lg:pb-8 px-4 md:px-6 lg:px-8">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="pt-4 mb-6"
        >
          <a
            href="/dashboard/tools"
            className="inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </a>
        </motion.div>

        {isLoading && (
          <div className="space-y-6 animate-pulse">
            <div className="h-32 rounded-2xl bg-surface/50" />
            <div className="h-48 rounded-2xl bg-surface/50" />
          </div>
        )}

        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Hero card */}
            <div
              className="relative overflow-hidden rounded-2xl border p-6 md:p-8"
              style={{
                background: `linear-gradient(135deg, ${color}10, ${color}05)`,
                borderColor: `${color}25`,
              }}
            >
              <div className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full blur-[60px]"
                style={{ backgroundColor: `${color}20` }} />

              <div className="relative z-10 flex items-start gap-5 flex-wrap">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg"
                  style={{ backgroundColor: color }}
                >
                  {t.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="font-display text-2xl font-bold">{t.name}</h1>
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: `${color}18`, color }}
                    >
                      {CATEGORY_LABEL[t.category] ?? t.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-foreground-muted">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      {t.usageCount.toLocaleString()} students used this tool
                    </span>
                  </div>
                </div>
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(t.name + " AI tool")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white shadow-lg transition-all hover:opacity-90"
                  style={{ backgroundColor: color, boxShadow: `0 4px 20px ${color}40` }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Tool
                </a>
              </div>

              <p className="mt-5 text-sm text-foreground/80 leading-relaxed relative z-10">
                {t.description}
              </p>
            </div>

            {/* Grid: Use Cases + Subjects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="card p-5">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground-muted mb-4 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Use Cases
                </h2>
                <ul className="space-y-2">
                  {t.useCases.map((uc, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                      {uc}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card p-5">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground-muted mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Subjects
                </h2>
                <div className="flex flex-wrap gap-2">
                  {t.subjects.map((s, i) => (
                    <span key={i} className="tag">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* How to use */}
            <div className="card p-5">
              <h2 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent-light" />
                How to Use {t.name}
              </h2>
              <ol className="space-y-3">
                {t.howTo.map((step, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                    className="flex items-start gap-3"
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: color }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed">{step}</span>
                  </motion.li>
                ))}
              </ol>
            </div>

            {/* Grid: Example Prompts + Pro Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="card p-5">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground-muted mb-4">
                  Example Prompts
                </h2>
                <div className="space-y-3">
                  {t.examplePrompts.map((p, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl text-xs text-foreground/80 font-mono leading-relaxed"
                      style={{ backgroundColor: `${color}08`, border: `1px solid ${color}18` }}
                    >
                      {p}
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-5">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground-muted mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Pro Tips
                </h2>
                <ul className="space-y-3">
                  {t.proTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <ChevronRight className="w-4 h-4 text-accent-light flex-shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div
              className="card p-6 text-center"
              style={{ background: `linear-gradient(135deg, ${color}08, transparent)`, borderColor: `${color}20` }}
            >
              <p className="font-display text-base font-semibold mb-2">Ready to try {t.name}?</p>
              <p className="text-sm text-foreground-muted mb-4">
                Open the tool and complete your assignment to earn XP.
              </p>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(t.name + " AI tool")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
                style={{ backgroundColor: color, boxShadow: `0 4px 20px ${color}30` }}
              >
                <ExternalLink className="w-4 h-4" />
                Open {t.name}
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
