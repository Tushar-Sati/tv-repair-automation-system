"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, User, Phone, Tag, Calendar, Wrench, AlertCircle, Edit, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchJobById, updateJob } from "@/lib/api";
import { ProtectedFinancialValue } from "@/components/revenue/ProtectedFinancialValue";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await fetchJobById(params.id as string);
      setJob(data);
      setLoading(false);
    }
    load();
  }, [params.id]);

  const handleAction = async (action: string) => {
    setUpdating(true);
    let updates = {};
    if (action === "REPAIRED") updates = { status: "OK" };
    if (action === "DELIVERED") updates = { deliver: "YES" };
    if (action === "NR") updates = { status: "NR" };
    
    // Simulating prompt for payment for this prototype
    if (action === "PAYMENT") {
      const amt = prompt("Enter payment amount (₹):", job.payment || "");
      if (amt !== null) updates = { payment: amt };
      else { setUpdating(false); return; }
    }

    const ok = await updateJob(job.id, updates);
    if (ok) {
      const data = await fetchJobById(params.id as string);
      setJob(data);
    }
    setUpdating(false);
  };

  if (loading) {
    return <div className="h-full flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>;
  }

  if (!job) {
    return <div className="text-white">Job not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/repairs">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold tracking-tight text-white">{job.brand} {job.model_no}</h2>
              <Badge variant="outline" className="text-blue-400 border-blue-500/30 bg-blue-500/10 font-mono">
                {job.job_number}
              </Badge>
            </div>
            <p className="text-zinc-400 mt-1">Detailed repair ticket and customer information.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => handleAction('PAYMENT')}
            variant="outline" 
            className="border-green-500/30 text-green-400 hover:bg-green-500/10 gap-2"
          >
            Update Payment
          </Button>
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 gap-2">
            Send Manual Reminder
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="glass-card border-white/10 bg-white/5 h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-blue-400" />
                Customer Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Name</p>
                <p className="text-white text-lg">{job.customer_name}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Phone</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-zinc-400" />
                  <p className="text-white">{job.phone_number}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Date Received</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  <p className="text-white">{job.date_received}</p>
                </div>
              </div>
              <div className="pt-2">
                <Badge variant={job.days_pending > 5 ? "destructive" : "info"} className="w-full justify-center text-xs py-1">
                  {job.days_pending} Days Pending
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Device Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="md:col-span-2">
          <Card className="glass-card border-white/10 bg-white/5 h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full blur-2xl pointer-events-none" />
            
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Tag className="h-5 w-5 text-purple-400" />
                Device & Repair Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Serial Number</p>
                  <p className="text-white font-mono bg-white/5 px-2 py-1 rounded w-fit">{job.serial_no || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Payment</p>
                  <p className="text-green-400 font-bold text-xl">
                    {job.payment ? <ProtectedFinancialValue>{`₹${job.payment}`}</ProtectedFinancialValue> : "Unpaid"}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-4">
                  <p className="text-xs text-red-400/80 uppercase tracking-wider font-semibold mb-2 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Reported Symptoms
                  </p>
                  <p className="text-white">{job.symptoms || "No symptoms reported."}</p>
                </div>
                
                <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-4">
                  <p className="text-xs text-blue-400/80 uppercase tracking-wider font-semibold mb-2 flex items-center gap-1">
                    <Wrench className="h-3 w-3" /> Part Replacement
                  </p>
                  <p className="text-white">{job.part_replacement || "None specified."}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button 
            onClick={() => handleAction('REPAIRED')} 
            disabled={updating || job.status === "OK"}
            className="h-16 bg-blue-600 hover:bg-blue-700 shadow-[0_0_20px_rgba(59,130,246,0.3)] text-lg justify-start px-6 gap-3"
          >
            <CheckCircle2 className="h-6 w-6" /> 
            {job.status === "OK" ? "Repaired" : "Mark Repaired"}
          </Button>
          
          <Button 
            onClick={() => handleAction('DELIVERED')} 
            disabled={updating || job.deliver === "YES"}
            className="h-16 bg-green-600 hover:bg-green-700 shadow-[0_0_20px_rgba(22,163,74,0.3)] text-lg justify-start px-6 gap-3"
          >
            <CheckCircle2 className="h-6 w-6" /> 
            {job.deliver === "YES" ? "Delivered" : "Mark Delivered"}
          </Button>
          
          <Button 
            onClick={() => handleAction('NR')} 
            disabled={updating || job.status === "NR"}
            variant="destructive"
            className="h-16 shadow-[0_0_20px_rgba(220,38,38,0.3)] text-lg justify-start px-6 gap-3"
          >
            <XCircle className="h-6 w-6" /> 
            Not Repairable
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
