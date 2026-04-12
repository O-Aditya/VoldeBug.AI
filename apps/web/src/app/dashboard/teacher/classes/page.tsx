"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTeacherClasses } from "@web/hooks/use-teacher";
import { GradientMesh } from "@web/components/ui/background";
import { Users, BookOpen, ChevronRight, PlusCircle, Calendar } from "lucide-react";

export default function TeacherClassesPage() {
  const router = useRouter();
  const { data: classes, isLoading } = useTeacherClasses();

  return (
    <div className="min-h-screen relative">
      <GradientMesh />
      <div className="max-w-6xl mx-auto space-y-6 pb-24 lg:pb-8 px-4 md:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="pt-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">Your Classes</h1>
            <p className="text-foreground-muted text-sm mt-1.5">Manage your class sections and students</p>
          </div>
          
          <button 
            onClick={() => alert("Creating a new class will be available soon!")}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl font-semibold text-sm hover:bg-accent-light transition-all shadow-lg shadow-accent/20"
          >
            <PlusCircle className="w-5 h-5" />
            New Class
          </button>
        </motion.div>

        {/* Classes Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-surface/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : !classes || classes.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-accent-light" />
            </div>
            <h2 className="font-display text-xl font-semibold">No classes found</h2>
            <p className="text-foreground-muted text-sm max-w-md mt-2">
              You haven't set up any classes yet. Create your first class to invite students and start assigning work. 
            </p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 16 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {classes.map((cls, i) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="card overflow-hidden hover:border-accent/40 transition-all group flex flex-col"
              >
                <div className="h-24 bg-gradient-to-br from-accent/20 to-surface border-b border-card-border p-5 relative">
                  <h3 className="font-display text-xl font-bold truncate pr-8">{cls.name}</h3>
                  <p className="text-xs text-foreground-muted mt-1 flex items-center gap-1.5 opacity-80">
                    <Calendar className="w-3.5 h-3.5" /> Created {new Date(cls.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1 bg-surface/50 p-3 rounded-lg border border-card-border">
                      <p className="text-xs text-foreground-subtle font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" /> Students
                      </p>
                      <p className="text-xl font-bold text-foreground">{cls._count?.members || 0}</p>
                    </div>
                    <div className="flex-1 bg-surface/50 p-3 rounded-lg border border-card-border">
                      <p className="text-xs text-foreground-subtle font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" /> Assign.
                      </p>
                      <p className="text-xl font-bold text-foreground">{cls._count?.assignments || 0}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => router.push(`/dashboard/teacher/classes/${cls.id}`)}
                    className="w-full py-2.5 border border-card-border rounded-xl text-sm font-semibold flex items-center justify-center gap-2 group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all"
                  >
                    View Class <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
