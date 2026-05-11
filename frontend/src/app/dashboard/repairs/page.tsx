"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, MoreHorizontal, Clock, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { fetchJobs } from "@/lib/api";

type Job = {
  id: string;
  row_number: number;
  date_received: string;
  customer_name: string;
  job_number: string;
  phone_number: string;
  brand: string;
  model_no: string;
  serial_no: string;
  symptoms: string;
  part_replacement: string;
  status: string;
  deliver: string;
  message_status: string;
  payment: string;
  days_pending: number;
};

export default function RepairsQueuePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const data = await fetchJobs();
      setJobs(data);
    } catch (err) {
      console.error("Failed to load jobs", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (days: number) => {
    if (days > 7) return 'destructive';
    if (days > 3) return 'warning';
    return 'info';
  };

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job => 
    job.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.job_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.phone_number.includes(searchTerm) ||
    job.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Categorize jobs
  const pending = filteredJobs.filter(j => j.status === "" && j.deliver !== "YES");
  const diagnosing = filteredJobs.filter(j => j.status === "DIAGNOSING" && j.deliver !== "YES");
  const repairing = filteredJobs.filter(j => j.status === "WIP" && j.deliver !== "YES");
  const completed = filteredJobs.filter(j => j.status === "OK" && j.deliver !== "YES");
  const notRepairable = filteredJobs.filter(j => j.status === "NR" && j.deliver !== "YES");
  const delivered = filteredJobs.filter(j => j.deliver === "YES");

  const columns = [
    { id: "pending", title: "Pending", items: pending },
    { id: "diagnosing", title: "Diagnosing", items: diagnosing },
    { id: "repairing", title: "Repairing", items: repairing },
    { id: "completed", title: "Completed", items: completed },
    { id: "not-repairable", title: "Not Repairable", items: notRepairable },
    { id: "delivered", title: "Delivered", items: delivered },
  ];

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Repair Queue</h2>
          <p className="text-zinc-400 mt-1">Live data synced from Google Sheets.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={loadJobs} className={isLoading ? "animate-spin text-zinc-400" : "text-zinc-400 hover:text-white"}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <Input 
              type="search" 
              placeholder="Search jobs, phone..." 
              className="pl-9 bg-white/5 border-white/10 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link href="/dashboard/repairs/new">
            <Button className="gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)] bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Add Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max h-full">
          {columns.map((col) => (
            <div key={col.id} className="w-[320px] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">{col.title}</h3>
                  <Badge variant="secondary" className="bg-white/10 text-zinc-300 border-none">{col.items.length}</Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 space-y-4">
                <AnimatePresence>
                  {col.items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link href={`/dashboard/repairs/${item.id}`}>
                        <Card className="glass-card border-white/10 bg-white/5 hover:bg-white/10 transition-colors p-4 relative overflow-hidden group cursor-pointer">
                          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="flex justify-between items-start mb-3">
                            <Badge variant={getPriorityColor(item.days_pending) as any} className="capitalize text-[10px] h-5">
                              {item.days_pending} Days Pending
                            </Badge>
                            <span className="text-xs text-zinc-500 flex items-center gap-1 font-mono bg-black/20 px-1.5 py-0.5 rounded">
                              {item.id}
                            </span>
                          </div>
                          <h4 className="text-white font-medium mb-1 line-clamp-1">{item.brand} {item.model_no}</h4>
                          <p className="text-sm text-zinc-400 mb-4">{item.customer_name}</p>
                          
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                            <div className="text-xs font-mono text-zinc-500">
                              {item.phone_number}
                            </div>
                            <span className="text-xs text-green-400 font-medium">
                              {item.payment ? `₹${item.payment}` : "Unpaid"}
                            </span>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {col.items.length === 0 && !isLoading && (
                  <div className="h-24 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center text-sm text-zinc-600 bg-white/[0.01]">
                    No items
                  </div>
                )}
                {isLoading && col.items.length === 0 && (
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="h-36 bg-white/5 animate-pulse rounded-xl border border-white/5" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
