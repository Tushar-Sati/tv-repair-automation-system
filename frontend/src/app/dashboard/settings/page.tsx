"use client";

import { motion } from "framer-motion";
import { User, Bell, Shield, Database, Smartphone, Webhook, CheckCircle2, Activity, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">System Settings</h2>
        <p className="text-zinc-400 mt-1">Manage integrations, automation, and backend health.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Backend Health Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="glass-card border-white/10 bg-white/5 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full blur-2xl pointer-events-none" />
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-400" />
                Backend Connection Health
              </CardTitle>
              <CardDescription>Status of the FastAPI and Sync Service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-medium text-white">FastAPI Core</span>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">Operational</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
                  <span className="font-medium text-white">Google Sheets Sync</span>
                </div>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Live Syncing</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-purple-500 animate-pulse" />
                  <span className="font-medium text-white">Data Latency</span>
                </div>
                <span className="text-zinc-400 text-sm">~1.2 seconds</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Database & Sheets */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Card className="glass-card border-white/10 bg-white/5 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-400" />
                Google Sheets Integration
              </CardTitle>
              <CardDescription>Configure the live database connection.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Spreadsheet ID</label>
                <div className="flex gap-2">
                  <Input defaultValue="1jZtJ5x...gHkP" className="bg-white/5 border-white/10 text-white font-mono" readOnly />
                  <Button variant="outline" className="bg-white/5 border-white/10">Edit</Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Sheet Name</label>
                <Input defaultValue="TV_Repair_DB_2026" className="bg-white/5 border-white/10 text-white" readOnly />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 flex items-center justify-between">
                  <span>Auto-Sync Interval</span>
                  <span className="text-blue-400">30 seconds</span>
                </label>
                <input type="range" min="10" max="300" defaultValue="30" className="w-full accent-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Automation Services */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="md:col-span-2">
          <Card className="glass-card border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Webhook className="h-5 w-5 text-purple-400" />
                Automation & Schedulers
              </CardTitle>
              <CardDescription>Manage Python backend automation services.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Smartphone className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">WhatsApp Customer Messaging</h4>
                      <p className="text-sm text-zinc-400">Automated job status updates via PyWhatKit.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">Running</Badge>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <RefreshCw className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Cron Task Scheduler</h4>
                      <p className="text-sm text-zinc-400">Periodic checks for pending deliveries and payments.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Active</Badge>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Admin Profile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="md:col-span-2">
          <Card className="glass-card border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-400" />
                Admin Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg border-2 border-white/10">
                TS
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">Tushar Sati</h3>
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-zinc-400 font-medium">Owner / System Administrator</p>
                <div className="pt-2">
                  <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                    Change Password
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
