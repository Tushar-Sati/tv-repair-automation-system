"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, User, Phone, Wrench, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { fetchJobs } from "@/lib/api";
import { ProtectedFinancialValue } from "@/components/revenue/ProtectedFinancialValue";

type Customer = {
  phone: string;
  name: string;
  jobs: any[];
  totalSpent: number;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchJobs();
        
        const custMap: Record<string, Customer> = {};
        
        data.forEach((job: any) => {
          if (!job.phone_number) return;
          
          if (!custMap[job.phone_number]) {
            custMap[job.phone_number] = {
              phone: job.phone_number,
              name: job.customer_name,
              jobs: [],
              totalSpent: 0
            };
          }
          
          custMap[job.phone_number].jobs.push(job);
          if (job.deliver === "YES" && job.payment) {
            custMap[job.phone_number].totalSpent += parseFloat(job.payment.replace(/,/g, ''));
          }
        });
        
        setCustomers(Object.values(custMap).sort((a, b) => b.totalSpent - a.totalSpent));
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = customers.filter(c => {
    const term = searchTerm.toLowerCase();
    return c.name.toLowerCase().includes(term) ||
           c.phone.includes(term) ||
           c.jobs.some(j => j.job_number.toLowerCase().includes(term) || j.brand.toLowerCase().includes(term));
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Customers</h2>
          <p className="text-zinc-400 mt-1">Searchable customer database and repair history.</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
          <Input 
            type="search" 
            placeholder="Search name, phone, job, brand..." 
            className="pl-10 bg-white/5 border-white/10 text-white h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((customer, idx) => (
            <motion.div
              key={customer.phone}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.05, 0.5) }}
            >
              <Card className="glass-card border-white/10 bg-white/5 hover:bg-white/10 transition-colors group">
                <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex items-center gap-4 md:w-1/3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 transition-colors">
                      <User className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{customer.name || "Unknown"}</h3>
                      <p className="text-sm text-zinc-400 flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {customer.phone}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Repair History ({customer.jobs.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {customer.jobs.map(job => (
                        <Link href={`/dashboard/repairs/${job.id}`} key={job.id}>
                          <Badge variant="outline" className="bg-white/5 border-white/10 hover:bg-blue-500/20 hover:border-blue-500/50 cursor-pointer gap-1 py-1 px-2 text-zinc-300">
                            <Wrench className="h-3 w-3 text-blue-400" />
                            {job.brand} {job.model_no} 
                            <span className="text-[10px] text-zinc-500 ml-1">#{job.job_number}</span>
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:w-32 flex flex-col items-end justify-center pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Lifetime Value</p>
                    <p className="text-xl font-bold text-green-400">
                      <ProtectedFinancialValue>{`₹${customer.totalSpent.toLocaleString()}`}</ProtectedFinancialValue>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-zinc-500">
              No customers found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
