"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, MoreHorizontal, RefreshCw, Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { fetchJobs, sendWhatsAppUpdates, type WhatsAppSendResult } from "@/lib/api";
import { ProtectedFinancialValue } from "@/components/revenue/ProtectedFinancialValue";

const whatsappProgressSteps = [
  "Initializing...",
  "Reading repair data...",
  "Preparing messages...",
  "Opening WhatsApp...",
  "Sending...",
  "Completed",
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      className={className}
      fill="currentColor"
    >
      <path d="M16.02 3.2c-6.97 0-12.64 5.52-12.64 12.31 0 2.31.67 4.56 1.93 6.5L3.2 28.8l7.09-2.02a12.92 12.92 0 0 0 5.73 1.34c6.97 0 12.64-5.52 12.64-12.31S22.99 3.2 16.02 3.2Zm0 22.83c-1.78 0-3.52-.45-5.05-1.31l-.39-.22-4.2 1.2 1.24-4-.25-.41a10.13 10.13 0 0 1-1.62-5.48c0-5.64 4.61-10.23 10.27-10.23s10.27 4.59 10.27 10.23-4.61 10.22-10.27 10.22Zm5.64-7.66c-.31-.15-1.82-.88-2.1-.98-.28-.1-.49-.15-.69.15-.21.3-.79.98-.97 1.18-.18.2-.36.22-.67.08-.31-.15-1.3-.47-2.48-1.5-.92-.8-1.54-1.79-1.72-2.09-.18-.3-.02-.46.14-.61.14-.14.31-.36.46-.54.15-.18.21-.3.31-.51.1-.2.05-.38-.03-.53-.08-.15-.69-1.62-.94-2.22-.25-.58-.5-.5-.69-.51h-.59c-.21 0-.54.08-.82.38-.28.3-1.08 1.03-1.08 2.51s1.1 2.91 1.26 3.11c.15.2 2.17 3.22 5.25 4.52.73.31 1.31.5 1.75.64.74.23 1.41.2 1.94.12.59-.09 1.82-.73 2.08-1.44.26-.7.26-1.3.18-1.44-.08-.13-.28-.2-.59-.35Z" />
    </svg>
  );
}

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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [activeProgressStep, setActiveProgressStep] = useState(0);
  const [whatsAppResult, setWhatsAppResult] = useState<WhatsAppSendResult | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

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

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 4500);
  };

  const handleSendWhatsAppUpdates = async () => {
    setIsConfirmOpen(false);
    setIsProgressOpen(true);
    setIsSendingWhatsApp(true);
    setWhatsAppResult(null);
    setActiveProgressStep(0);

    const progressTimer = window.setInterval(() => {
      setActiveProgressStep((step) => Math.min(step + 1, whatsappProgressSteps.length - 2));
    }, 900);

    try {
      const result = await sendWhatsAppUpdates();
      window.clearInterval(progressTimer);
      setActiveProgressStep(whatsappProgressSteps.length - 1);
      setWhatsAppResult(result);

      if (result.success) {
        showToast("success", "Messages sent successfully");
        await loadJobs();
      } else {
        showToast("error", result.error || "WhatsApp sending failed");
      }
    } finally {
      window.clearInterval(progressTimer);
      setIsSendingWhatsApp(false);
    }
  };

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
        <div className="flex flex-wrap items-center justify-start sm:justify-end gap-3">
          <Button variant="ghost" size="icon" onClick={loadJobs} className={isLoading ? "animate-spin text-zinc-400" : "text-zinc-400 hover:text-white"}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <Input 
              type="search" 
              placeholder="Search jobs, phone..." 
              className="pl-9 bg-white/5 border-white/10 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <motion.div
            whileHover={isSendingWhatsApp ? undefined : { scale: 1.03 }}
            whileTap={isSendingWhatsApp ? undefined : { scale: 0.98 }}
          >
            <Button
              type="button"
              disabled={isSendingWhatsApp}
              onClick={() => setIsConfirmOpen(true)}
              className="gap-2 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white shadow-[0_0_15px_rgba(37,211,102,0.35)] hover:from-[#2be978] hover:to-[#0f7f72] hover:shadow-[0_0_25px_rgba(37,211,102,0.6)]"
            >
              {isSendingWhatsApp ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <WhatsAppIcon className="h-4 w-4" />
              )}
              {isSendingWhatsApp ? "Sending Messages..." : "Send WhatsApp Updates"}
            </Button>
          </motion.div>
          <Link href="/dashboard/repairs/new">
            <Button className="gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)] bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Add Job
            </Button>
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {isConfirmOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md rounded-lg border border-white/10 bg-zinc-950 p-6 shadow-2xl"
              initial={{ scale: 0.95, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 16, opacity: 0 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366]">
                  <WhatsAppIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Send WhatsApp Updates</h3>
                  <p className="text-sm text-zinc-400">Are you sure you want to send WhatsApp updates to all eligible customers?</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="glass"
                  onClick={() => setIsConfirmOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSendWhatsAppUpdates}
                  className="gap-2 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white shadow-[0_0_15px_rgba(37,211,102,0.35)] hover:from-[#2be978] hover:to-[#0f7f72]"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isProgressOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-lg rounded-lg border border-white/10 bg-zinc-950 p-6 shadow-2xl"
              initial={{ scale: 0.95, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 16, opacity: 0 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">WhatsApp Progress</h3>
                  <p className="text-sm text-zinc-400">
                    {isSendingWhatsApp ? "Sending Messages..." : whatsAppResult?.success ? "Messages sent successfully" : "Error"}
                  </p>
                </div>
                {isSendingWhatsApp ? (
                  <Loader2 className="h-5 w-5 animate-spin text-[#25D366]" />
                ) : whatsAppResult?.success ? (
                  <CheckCircle2 className="h-5 w-5 text-[#25D366]" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-400" />
                )}
              </div>

              <div className="mt-6 space-y-3">
                {whatsappProgressSteps.map((step, index) => {
                  const isDone = index < activeProgressStep || (!isSendingWhatsApp && index <= activeProgressStep);
                  const isActive = isSendingWhatsApp && index === activeProgressStep;

                  return (
                    <motion.div
                      key={step}
                      className="flex items-center gap-3 text-sm"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                        isDone
                          ? "border-[#25D366] bg-[#25D366]/15 text-[#25D366]"
                          : isActive
                            ? "border-[#25D366]/70 text-[#25D366]"
                            : "border-white/10 text-zinc-600"
                      }`}>
                        {isActive ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
                      </span>
                      <span className={isDone || isActive ? "text-white" : "text-zinc-500"}>{step}</span>
                    </motion.div>
                  );
                })}
              </div>

              {whatsAppResult && (
                <motion.div
                  className="mt-6 grid grid-cols-3 gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div>
                    <p className="text-xs text-zinc-500">Total Success</p>
                    <p className="mt-1 text-xl font-semibold text-white">{whatsAppResult.sent ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Failed</p>
                    <p className="mt-1 text-xl font-semibold text-white">{whatsAppResult.failed ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Time Taken</p>
                    <p className="mt-1 text-xl font-semibold text-white">{whatsAppResult.duration || "-"}</p>
                  </div>
                </motion.div>
              )}

              {whatsAppResult?.error && (
                <p className="mt-4 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {whatsAppResult.error}
                </p>
              )}

              {!isSendingWhatsApp && (
                <div className="mt-6 flex justify-end">
                  <Button type="button" variant="glass" onClick={() => setIsProgressOpen(false)}>
                    Close
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            className={`fixed right-4 top-4 z-[60] flex items-center gap-3 rounded-lg border px-4 py-3 shadow-2xl ${
              toast.type === "success"
                ? "border-[#25D366]/30 bg-[#062f1a] text-[#baf7d0]"
                : "border-red-500/30 bg-red-950 text-red-100"
            }`}
            initial={{ opacity: 0, x: 24, y: -8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 24, y: -8 }}
          >
            {toast.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

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
                              {item.payment ? <ProtectedFinancialValue>{`₹${item.payment}`}</ProtectedFinancialValue> : "Unpaid"}
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
