"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTeacherDashboard } from "@web/hooks/use-teacher";
import { GradientMesh } from "@web/components/ui/background";
import { Search, Filter, CheckCircle2, FileText, ChevronRight, AlertCircle, Clock } from "lucide-react";

export default function GradingDashboardPage() {
  const { data, isLoading } = useTeacherDashboard();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SUBMITTED" | "GRADED">("SUBMITTED");

  // Mocking all submissions from recentSubmissions for now, plus graded ones if available
  const allSubmissions = data?.recentSubmissions ?? [];

  const filteredSubmissions = useMemo(() => {
    return allSubmissions.filter((sub) => {
      const matchesSearch = sub.studentName?.toLowerCase().includes(search.toLowerCase()) || 
                            sub.assignmentTitle.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || sub.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allSubmissions, search, statusFilter]);

  if (isLoading) {
    return (
      <div className="min-h-screen relative p-6">
        <div className="h-8 w-48 bg-surface animate-pulse rounded-xl mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-surface animate-pulse rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <GradientMesh />
      <div className="max-w-6xl mx-auto space-y-6 pb-24 lg:pb-8 px-4 md:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="pt-8 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">Grading Center</h1>
            <p className="text-foreground-muted text-sm mt-1.5">Review and grade student submissions</p>
          </div>
          
          <div className="flex items-center gap-3 bg-surface/30 px-4 py-2 rounded-xl border border-white/5 shadow-sm">
            <div className="flex flex-col items-center px-3 border-r border-white/10">
              <span className="text-xl font-bold text-accent-light">{data?.pendingSubmissions ?? 0}</span>
              <span className="text-[10px] uppercase tracking-wider text-foreground-subtle font-medium">To Grade</span>
            </div>
            <div className="flex flex-col items-center px-3">
              <span className="text-xl font-bold text-success">{data?.averageGrade ? `${data.averageGrade.toFixed(1)}%` : '—'}</span>
              <span className="text-[10px] uppercase tracking-wider text-foreground-subtle font-medium">Avg Class Grade</span>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-foreground-subtle" />
            <input 
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student or assignment..."
              className="w-full bg-surface border border-card-border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
            />
          </div>
          <div className="flex p-1 bg-surface border border-card-border rounded-xl">
            <button 
              onClick={() => setStatusFilter("SUBMITTED")} 
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${statusFilter === "SUBMITTED" ? "bg-accent/10 text-accent-light" : "text-foreground-muted hover:text-foreground"}`}
            >
              Needs Grading
            </button>
            <button 
              onClick={() => setStatusFilter("GRADED")} 
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${statusFilter === "GRADED" ? "bg-success/10 text-success" : "text-foreground-muted hover:text-foreground"}`}
            >
              Graded
            </button>
            <button 
              onClick={() => setStatusFilter("ALL")} 
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${statusFilter === "ALL" ? "bg-white/10 text-foreground" : "text-foreground-muted hover:text-foreground"}`}
            >
              All
            </button>
          </div>
        </motion.div>

        {/* List */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card overflow-hidden">
          {filteredSubmissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <h3 className="font-display text-lg font-semibold">You're all caught up!</h3>
              <p className="text-sm text-foreground-muted mt-1 max-w-sm">
                {statusFilter === "SUBMITTED" ? "There are no pending submissions that need grading right now." : "No submissions found matching your filters."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-card-border">
              {filteredSubmissions.map((sub, i) => (
                <a 
                  key={sub.id} 
                  href={`/dashboard/teacher/grading/${sub.id}`}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 hover:bg-surface/40 transition-colors group block relative"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface border border-card-border flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {sub.studentName?.[0] || "?"}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-accent-light transition-colors">
                        {sub.assignmentTitle}
                      </h4>
                      <p className="text-xs text-foreground-subtle mt-0.5">
                        Submitted by <span className="font-medium text-foreground-muted">{sub.studentName}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 flex items-center gap-6 sm:w-auto w-full justify-between sm:justify-end">
                    <div className="flex items-center gap-2 text-xs text-foreground-subtle">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </div>
                    
                    {sub.status === "SUBMITTED" ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-warning/10 text-warning text-xs font-medium border border-warning/20">
                        <AlertCircle className="w-3.5 h-3.5" /> Needs Grade
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-success/10 text-success text-xs font-medium border border-success/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Graded: {sub.grade}
                      </div>
                    )}
                    
                    <ChevronRight className="w-4 h-4 text-foreground-subtle opacity-0 sm:opacity-100 group-hover:opacity-100 transition-opacity hidden sm:block" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
