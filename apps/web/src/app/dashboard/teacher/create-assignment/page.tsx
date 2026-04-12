"use client";

import { useState, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GradientMesh } from "@web/components/ui/background";
import { useTeacherClasses, useCreateAssignment } from "@web/hooks/use-teacher";
import { useTools } from "@web/hooks/use-tools";
import {
  ChevronLeft, ChevronRight, Zap, BookOpen,
  Bot, Calendar, Trophy, CheckCircle2, AlertCircle,
  Search, Clock, Star
} from "lucide-react";

// ─── Step config ─────────────────────────────────────────────────────────

const STEPS = [
  { id: "basics", title: "Assignment Details", icon: BookOpen },
  { id: "tool", title: "Suggest an AI Tool", icon: Bot },
  { id: "config", title: "Deadline & Rewards", icon: Calendar },
  { id: "preview", title: "Review & Publish", icon: CheckCircle2 },
];

// ─── Step 1: Basics ───────────────────────────────────────────────────────

function BasicsStep({
  title, setTitle, description, setDescription, classId, setClassId, classes, error
}: {
  title: string; setTitle: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  classId: string; setClassId: (v: string) => void;
  classes: any[]; error?: string;
}) {
  return (
    <motion.div key="basics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title <span className="text-error">*</span></label>
        <input value={title} onChange={e => setTitle(e.target.value)} className="input-base" placeholder="e.g. Summarize an article using AI" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Description <span className="text-error">*</span></label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={5}
          className="input-base resize-none"
          placeholder="Explain what students need to do, the learning goal, and how to use the suggested tool..."
        />
        <p className="text-xs text-foreground-subtle">{description.length} / 2000 characters</p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Class <span className="text-error">*</span></label>
        <select value={classId} onChange={e => setClassId(e.target.value)} className="input-base">
          <option value="">Select a class…</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-error/8 border border-error/20 text-error text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}
    </motion.div>
  );
}

// ─── Step 2: Tool picker ──────────────────────────────────────────────────

function ToolStep({
  selectedTool, setSelectedTool
}: { selectedTool: any; setSelectedTool: (t: any) => void }) {
  const [search, setSearch] = useState("");
  const { data: tools } = useTools({ search });

  return (
    <motion.div key="tool" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <p className="text-sm text-foreground-muted">Select the AI tool you'd like students to practice with. This is optional.</p>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-base pl-9"
          placeholder="Search tools…"
        />
      </div>

      {/* Selected pill */}
      {selectedTool && (
        <div className="flex items-center gap-2 p-3 rounded-xl border border-accent/20 bg-accent-surface text-sm">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: selectedTool.brandColor || "#6366f1" }}>
            {selectedTool.name[0]}
          </div>
          <span className="font-medium text-accent-light flex-1">{selectedTool.name}</span>
          <button onClick={() => setSelectedTool(null)} className="text-foreground-subtle hover:text-error text-xs">Remove</button>
        </div>
      )}

      {/* Tool grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
        {tools?.map(tool => (
          <button
            key={tool.id}
            onClick={() => setSelectedTool(tool)}
            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
              selectedTool?.id === tool.id
                ? "border-accent bg-accent-surface"
                : "border-card-border hover:border-card-border-hover hover:bg-surface/40"
            }`}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: tool.brandColor || "#6366f1" }}>
              {tool.name[0]}
            </div>
            <span className="text-xs font-medium truncate">{tool.name}</span>
          </button>
        ))}
      </div>

      <button onClick={() => setSelectedTool(null)} className="text-xs text-foreground-subtle hover:text-foreground transition-colors">
        Skip — no tool suggested
      </button>
    </motion.div>
  );
}

// ─── Step 3: Config ───────────────────────────────────────────────────────

function ConfigStep({
  dueDate, setDueDate, xpReward, setXpReward, earlyBonus, setEarlyBonus
}: {
  dueDate: string; setDueDate: (v: string) => void;
  xpReward: number; setXpReward: (v: number) => void;
  earlyBonus: number; setEarlyBonus: (v: number) => void;
}) {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  return (
    <motion.div key="config" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Calendar className="w-4 h-4 text-foreground-subtle" />
          Due Date <span className="text-error">*</span>
        </label>
        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} min={minDateStr} className="input-base" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent-light" />
            Base XP Reward
          </label>
          <input type="number" min={10} max={500} value={xpReward} onChange={e => setXpReward(Number(e.target.value))} className="input-base" />
          <p className="text-xs text-foreground-subtle">Awarded on submission</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            Early Bonus XP
          </label>
          <input type="number" min={0} max={200} value={earlyBonus} onChange={e => setEarlyBonus(Number(e.target.value))} className="input-base" />
          <p className="text-xs text-foreground-subtle">For submitting 2+ days early</p>
        </div>
      </div>

      {/* XP preview */}
      <div className="p-4 rounded-xl border border-card-border bg-surface/30">
        <p className="text-xs text-foreground-subtle mb-2 font-medium uppercase tracking-wider">XP Preview</p>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="stat-number text-2xl text-accent-light">{xpReward}</p>
            <p className="text-xs text-foreground-subtle">On-time</p>
          </div>
          <div className="text-foreground-subtle">+</div>
          <div className="text-center">
            <p className="stat-number text-2xl text-yellow-400">{earlyBonus}</p>
            <p className="text-xs text-foreground-subtle">Early bonus</p>
          </div>
          <div className="text-foreground-subtle">=</div>
          <div className="text-center">
            <p className="stat-number text-2xl text-success">{xpReward + earlyBonus}</p>
            <p className="text-xs text-foreground-subtle">Max earn</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Step 4: Preview ──────────────────────────────────────────────────────

function PreviewStep({ title, description, classId, classes, selectedTool, dueDate, xpReward, earlyBonus }: any) {
  const className = classes.find((c: any) => c.id === classId)?.name || "—";
  const due = dueDate ? new Date(dueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—";

  return (
    <motion.div key="preview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <div className="card p-5 space-y-4">
        <div>
          <p className="text-xs text-foreground-subtle uppercase tracking-wider mb-1">Title</p>
          <p className="font-display text-lg font-bold">{title || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-foreground-subtle uppercase tracking-wider mb-1">Description</p>
          <p className="text-sm text-foreground/80 leading-relaxed">{description || "—"}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-foreground-subtle uppercase tracking-wider mb-1">Class</p>
            <p className="text-sm font-medium">{className}</p>
          </div>
          <div>
            <p className="text-xs text-foreground-subtle uppercase tracking-wider mb-1">Due Date</p>
            <p className="text-sm font-medium flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{due}</p>
          </div>
          <div>
            <p className="text-xs text-foreground-subtle uppercase tracking-wider mb-1">XP Reward</p>
            <p className="text-sm font-semibold text-accent-light">+{xpReward} XP</p>
          </div>
          <div>
            <p className="text-xs text-foreground-subtle uppercase tracking-wider mb-1">Early Bonus</p>
            <p className="text-sm font-semibold text-yellow-400">+{earlyBonus} XP</p>
          </div>
        </div>
        {selectedTool && (
          <div>
            <p className="text-xs text-foreground-subtle uppercase tracking-wider mb-1">Suggested Tool</p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: selectedTool.brandColor || "#6366f1" }}>
                {selectedTool.name[0]}
              </div>
              <span className="text-sm font-medium">{selectedTool.name}</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-3.5 rounded-xl border border-success/20 bg-success/8 text-success text-sm flex items-center gap-2">
        <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0" />
        This assignment will be published immediately and visible to all class members.
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

function CreateAssignmentForm() {
  const router = useRouter();
  const { data: classes = [] } = useTeacherClasses();
  const createMutation = useCreateAssignment();

  const [step, setStep] = useState(0);
  const [error, setError] = useState<string>();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState("");
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [dueDate, setDueDate] = useState("");
  const [xpReward, setXpReward] = useState(50);
  const [earlyBonus, setEarlyBonus] = useState(25);

  const validateStep = (s: number): string | undefined => {
    if (s === 0) {
      if (!title.trim()) return "Title is required.";
      if (!description.trim()) return "Description is required.";
      if (!classId) return "Please select a class.";
    }
    if (s === 2) {
      if (!dueDate) return "Due date is required.";
    }
    return undefined;
  };

  const handleNext = useCallback(() => {
    const err = validateStep(step);
    if (err) { setError(err); return; }
    setError(undefined);
    setStep(s => s + 1);
  }, [step, title, description, classId, dueDate]);

  const handlePublish = useCallback(async () => {
    setError(undefined);
    try {
      await createMutation.mutateAsync({
        title,
        description,
        classId,
        suggestedToolId: selectedTool?.id,
        dueDate,
        xpReward,
        earlyBonus,
      });
      router.push("/dashboard/teacher?created=1");
    } catch (e: any) {
      setError(e.message ?? "Failed to create assignment.");
    }
  }, [createMutation, title, description, classId, selectedTool, dueDate, xpReward, earlyBonus, router]);

  return (
    <div className="min-h-screen relative">
      <GradientMesh />
      <div className="max-w-2xl mx-auto pb-24 lg:pb-8 px-4 md:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="pt-6 pb-6">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors mb-4">
            <ChevronLeft className="w-4 h-4" />Back
          </button>
          <h1 className="font-display text-2xl font-bold">Create Assignment</h1>
          <p className="text-sm text-foreground-muted mt-1">Publish a new AI-powered assignment for your students</p>
        </motion.div>

        {/* Step progress */}
        <div className="flex items-center gap-0 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all flex-shrink-0 ${
                i < step ? "bg-success border-success text-white" :
                i === step ? "bg-accent border-accent text-white" :
                "border-card-border text-foreground-subtle"
              }`}>
                {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 transition-all ${i < step ? "bg-success" : "bg-card-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step title */}
        <div className="mb-5 flex items-center gap-2">
          {(() => { const Icon = STEPS[step].icon; return <Icon className="w-5 h-5 text-accent-light" />; })()}
          <h2 className="font-display text-lg font-semibold">{STEPS[step].title}</h2>
          <span className="ml-auto text-xs text-foreground-subtle">Step {step + 1} of {STEPS.length}</span>
        </div>

        {/* Card */}
        <div className="card p-6 min-h-[360px]">
          <AnimatePresence mode="wait">
            {step === 0 && <BasicsStep title={title} setTitle={setTitle} description={description} setDescription={setDescription} classId={classId} setClassId={setClassId} classes={classes} error={error} />}
            {step === 1 && <ToolStep selectedTool={selectedTool} setSelectedTool={setSelectedTool} />}
            {step === 2 && <ConfigStep dueDate={dueDate} setDueDate={setDueDate} xpReward={xpReward} setXpReward={setXpReward} earlyBonus={earlyBonus} setEarlyBonus={setEarlyBonus} />}
            {step === 3 && <PreviewStep title={title} description={description} classId={classId} classes={classes} selectedTool={selectedTool} dueDate={dueDate} xpReward={xpReward} earlyBonus={earlyBonus} />}
          </AnimatePresence>
        </div>

        {/* Error (non-basics steps) */}
        {error && step !== 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center gap-2 p-3.5 rounded-xl bg-error/8 border border-error/20 text-error text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button onClick={() => { setStep(s => s - 1); setError(undefined); }} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-card-border hover:bg-surface/60 text-sm font-medium transition-all">
              <ChevronLeft className="w-4 h-4" />Back
            </button>
          )}
          {step < STEPS.length - 1 && (
            <button onClick={handleNext} className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-light transition-all">
              Next<ChevronRight className="w-4 h-4" />
            </button>
          )}
          {step === STEPS.length - 1 && (
            <button
              onClick={handlePublish}
              disabled={createMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent text-white font-semibold text-sm shadow-lg shadow-accent/25 hover:bg-accent-light transition-all disabled:opacity-60"
            >
              {createMutation.isPending ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Publishing…</>
              ) : (
                <><Zap className="w-4 h-4" />Publish Assignment</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CreateAssignmentPage() {
  return (
    <Suspense>
      <CreateAssignmentForm />
    </Suspense>
  );
}
