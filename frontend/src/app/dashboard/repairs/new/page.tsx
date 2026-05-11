"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, ArrowLeft, Wand2 } from "lucide-react";
import Link from "next/link";

export default function NewRepairJobPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/repairs">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Add New Repair Job</h2>
            <p className="text-zinc-400 mt-1">Enter customer and device details to create a new ticket.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 gap-2">
            <Wand2 className="h-4 w-4" />
            AI Auto-Fill
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Save className="h-4 w-4" />
            Save Job
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Customer Information */}
        <Card className="glass-card border-white/10 bg-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <CardHeader>
            <CardTitle className="text-white text-lg">Customer Information</CardTitle>
            <CardDescription>Contact details for updates via WhatsApp.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Full Name</label>
              <Input placeholder="John Doe" className="bg-white/5 border-white/10 text-white focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Phone Number (WhatsApp)</label>
              <Input placeholder="+1 (555) 000-0000" className="bg-white/5 border-white/10 text-white focus:border-blue-500" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-zinc-300">Email Address (Optional)</label>
              <Input placeholder="john@example.com" type="email" className="bg-white/5 border-white/10 text-white focus:border-blue-500" />
            </div>
          </CardContent>
        </Card>

        {/* Device Information */}
        <Card className="glass-card border-white/10 bg-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
          <CardHeader>
            <CardTitle className="text-white text-lg">Device Details</CardTitle>
            <CardDescription>Specifications of the TV being repaired.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Brand</label>
              <select className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
                <option value="" disabled selected>Select brand...</option>
                <option value="samsung">Samsung</option>
                <option value="lg">LG</option>
                <option value="sony">Sony</option>
                <option value="vizio">Vizio</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Model Number</label>
              <Input placeholder="e.g. QN65Q80AA" className="bg-white/5 border-white/10 text-white focus:border-purple-500" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-zinc-300">Serial Number</label>
              <Input placeholder="Scan barcode or enter manually" className="bg-white/5 border-white/10 text-white focus:border-purple-500" />
            </div>
          </CardContent>
        </Card>

        {/* Repair Details */}
        <Card className="glass-card border-white/10 bg-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <CardHeader>
            <CardTitle className="text-white text-lg">Repair Details</CardTitle>
            <CardDescription>Symptoms, priority, and assignment.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-zinc-300">Reported Symptoms</label>
              <textarea 
                className="flex w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 min-h-[100px] resize-none"
                placeholder="Describe the issue in detail..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Priority Level</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="priority" className="text-emerald-500 focus:ring-emerald-500 bg-white/10 border-white/20" />
                  <span className="text-sm text-zinc-300">Low</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="priority" className="text-yellow-500 focus:ring-yellow-500 bg-white/10 border-white/20" defaultChecked />
                  <span className="text-sm text-zinc-300">Medium</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="priority" className="text-red-500 focus:ring-red-500 bg-white/10 border-white/20" />
                  <span className="text-sm text-zinc-300">High</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Estimated Completion Date</label>
              <Input type="date" className="bg-white/5 border-white/10 text-white focus:border-emerald-500 [color-scheme:dark]" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
