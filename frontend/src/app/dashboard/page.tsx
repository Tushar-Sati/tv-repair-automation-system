"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from "recharts";
import Link from "next/link";
import { Wrench, MonitorPlay, AlertTriangle, CheckCircle2, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchJobs, fetchAnalytics } from "@/lib/api";

export default function DashboardPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [jobsData, analyticsData] = await Promise.all([
          fetchJobs(),
          fetchAnalytics()
        ]);
        if (!analyticsData) throw new Error("Backend unreachable. Make sure FastAPI server is running on port 8000.");
        setJobs(jobsData);
        setAnalytics(analyticsData);
      } catch (err: any) {
        setError(err.message || "Failed to load data from backend.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center flex-col gap-4">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
        <p className="text-zinc-500 text-sm animate-pulse">Loading data from Google Sheets...</p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="h-full flex items-center justify-center flex-col gap-4 text-center max-w-md mx-auto">
        <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
          <span className="text-3xl">⚠️</span>
        </div>
        <h3 className="text-xl font-bold text-white">Backend Not Reachable</h3>
        <p className="text-zinc-400 text-sm leading-relaxed">
          {error || "Could not load data from your Google Sheets."}
        </p>
        <div className="mt-2 p-4 rounded-lg bg-white/5 border border-white/10 text-left w-full">
          <p className="text-xs text-zinc-400 font-mono">Make sure you have run:</p>
          <code className="text-xs text-green-400 font-mono mt-2 block">
            cd backend<br/>
            uvicorn app.main:app --reload
          </code>
        </div>
        <button onClick={() => window.location.reload()} className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
          Retry
        </button>
      </div>
    );
  }

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  // Active Repairs: all TVs currently in the shop (not yet delivered)
  const activeRepairs = jobs.filter(j => j.deliver !== "YES").length;

  // Completed Jobs: TVs with STATUS = "OK" (repaired and ready for pickup, not yet delivered)
  const completedJobs = jobs.filter(j => j.status === "OK" && j.deliver !== "YES").length;

  // Overdue: TVs where STATUS is blank (not yet diagnosed/started) AND pending > 5 days AND not delivered
  const overdueJobs = jobs.filter(j => j.status === "" && j.days_pending > 5 && j.deliver !== "YES").length;

  // Recent intakes: last 5 jobs received (newest first)
  const recentJobs = [...jobs].reverse().slice(0, 5);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Overview</h2>
          <p className="text-zinc-400 mt-1">Here's what's happening in your shop today.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="hidden md:flex">Download Report</Button>
          <Link href="/dashboard/repairs/new">
            <Button className="gap-2">
              <Wrench className="h-4 w-4" />
              New Repair Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="glass-card border-white/10 bg-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Total Revenue</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <DollarSign className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(analytics.total_revenue)}</div>
              <p className="text-xs text-blue-400 mt-1 flex items-center gap-1">Collected from delivered jobs</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Card className="glass-card border-white/10 bg-white/5 relative overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Active Repairs</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Wrench className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activeRepairs}</div>
              <p className="text-xs text-blue-400 mt-1 flex items-center gap-1">In your shop right now</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className="glass-card border-white/10 bg-white/5 relative overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Completed Jobs</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{completedJobs}</div>
              <p className="text-xs text-green-400 mt-1 flex items-center gap-1">STATUS = OK, ready for pickup</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Card className="glass-card border-white/10 bg-white/5 relative overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Overdue Jobs</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{overdueJobs}</div>
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">Not started, pending &gt; 5 days</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="col-span-4">
          <Card className="glass-card border-white/10 bg-white/5 h-full">
            <CardHeader>
              <CardTitle className="text-white">Revenue Overview</CardTitle>
              <CardDescription>Total collected vs Pending</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full flex items-center justify-center flex-col gap-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-zinc-400 uppercase tracking-widest">Total Collected</p>
                  <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    {formatCurrency(analytics.total_revenue)}
                  </p>
                </div>
                <div className="h-px w-32 bg-white/10 my-4" />
                <div className="text-center space-y-2">
                  <p className="text-sm text-zinc-400 uppercase tracking-widest">Pending</p>
                  <p className="text-3xl font-bold text-yellow-400/90">
                    {formatCurrency(analytics.pending_revenue)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }} className="col-span-3">
          <Card className="glass-card border-white/10 bg-white/5 h-full">
            <CardHeader>
              <CardTitle className="text-white">Recent Intakes</CardTitle>
              <CardDescription>Latest jobs in the queue.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentJobs.map((j: any, i: number) => (
                  <Link href={`/dashboard/repairs/${j.id}`} key={j.id} className="flex items-center group cursor-pointer">
                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center relative overflow-hidden border border-blue-500/20">
                      <MonitorPlay className="h-5 w-5 text-blue-400 z-10" />
                      <div className="absolute inset-0 bg-blue-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </div>
                    <div className="ml-4 space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none text-white group-hover:text-blue-400 transition-colors">
                        {j.brand} {j.model_no || j.serial_no || ""}
                      </p>
                      <p className="text-sm text-zinc-500 line-clamp-1">{j.symptoms || "No symptoms specified"}</p>
                    </div>
                    <div className="ml-auto font-medium text-sm text-zinc-400 flex flex-col items-end">
                      <span className="font-mono text-xs">{j.id}</span>
                      <span className="text-[10px] text-zinc-500">{j.date_received}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
