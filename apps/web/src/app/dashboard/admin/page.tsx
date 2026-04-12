"use client";

import { motion } from "framer-motion";
import { GradientMesh } from "@web/components/ui/background";
import { useQuery } from "@tanstack/react-query";
import { api } from "@web/lib/api";
import {
  Shield,
  Users,
  GraduationCap,
  School,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────

interface SchoolInfo {
  id: string;
  name: string;
  _count: { members: number; classes: number };
}

interface SystemStats {
  totalUsers: number;
  totalClasses: number;
  totalAssignments: number;
  activeToday: number;
}

// Mock stats for now — will be replaced with real aggregation endpoint
const mockSystemStats: SystemStats = {
  totalUsers: 156,
  totalClasses: 12,
  totalAssignments: 48,
  activeToday: 34,
};

// ─── Page ───────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const { data: school, isLoading } = useQuery({
    queryKey: ["admin-school"],
    queryFn: () => api.get<SchoolInfo>("/v1/admin/school"),
    retry: false,
  });

  return (
    <div className="min-h-screen relative">
      <GradientMesh />
      <div className="max-w-6xl mx-auto space-y-6 pb-24 lg:pb-8 px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 pt-4"
        >
          <Shield className="w-6 h-6 text-accent-light" />
          <h1 className="font-display text-xl font-bold">Admin Dashboard</h1>
        </motion.div>

        {/* System Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <StatCard
            icon={<Users className="w-5 h-5" />}
            value={mockSystemStats.totalUsers}
            label="Total Users"
            iconBg="bg-accent/10"
            iconColor="text-accent-light"
          />
          <StatCard
            icon={<School className="w-5 h-5" />}
            value={mockSystemStats.totalClasses}
            label="Classes"
            iconBg="bg-info/10"
            iconColor="text-info"
          />
          <StatCard
            icon={<GraduationCap className="w-5 h-5" />}
            value={mockSystemStats.totalAssignments}
            label="Assignments"
            iconBg="bg-success/10"
            iconColor="text-success"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            value={mockSystemStats.activeToday}
            label="Active Today"
            iconBg="bg-warning/10"
            iconColor="text-warning"
          />
        </div>

        {/* School Details */}
        {school && (
          <div className="card p-5">
            <h2 className="font-display text-lg font-semibold mb-4">{school.name}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <div>
                  <p className="text-xs text-foreground-subtle">Total Members</p>
                  <p className="stat-number text-xl">{school._count.members}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-info" />
                <div>
                  <p className="text-xs text-foreground-subtle">Total Classes</p>
                  <p className="stat-number text-xl">{school._count.classes}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="card p-5">
          <h2 className="font-display text-lg font-semibold mb-4">Management</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <AdminLink href="/admin/users" label="Manage Users" description="View, edit, update user roles" />
            <AdminLink href="/admin/classes" label="Manage Classes" description="Create, assign, organize classes" />
            <AdminLink href="/admin/settings" label="Settings" description="School config and preferences" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────

function StatCard({
  icon,
  value,
  label,
  iconBg,
  iconColor,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="card p-4">
      <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${iconBg} ${iconColor} mb-3`}>
        {icon}
      </div>
      <p className="stat-number text-2xl leading-none">{value}</p>
      <p className="text-xs text-foreground-subtle mt-1.5">{label}</p>
    </div>
  );
}

function AdminLink({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <a
      href={href}
      className="p-4 rounded-xl border bg-surface/20 border-card-border hover:border-card-border-hover hover:bg-surface/40 transition-all"
    >
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-foreground-subtle mt-1">{description}</p>
    </a>
  );
}
