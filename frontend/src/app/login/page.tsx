"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Wrench, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ADMIN_TOKEN } from "@/lib/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    await new Promise(r => setTimeout(r, 800)); // Brief visual feedback

    if (username === "admin" && password === "admin123") {
      // Set cookie with 7-day expiry so middleware can read it immediately
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `auth_token=${ADMIN_TOKEN}; path=/; expires=${expires}`;
      // Use href so the browser does a full reload — ensures middleware sees the cookie
      window.location.href = "/dashboard";
    } else {
      setError("Invalid admin credentials. Try admin / admin123");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-gradient-to-tr from-blue-500/10 to-purple-500/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-panel rounded-2xl p-8 border border-white/10 shadow-2xl overflow-hidden relative">
          {/* Animated top border */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          <div className="flex flex-col items-center mb-8">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.5)] mb-4">
              <Wrench className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Admin Operating System</h1>
            <p className="text-sm text-zinc-400">Authorized access only.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500" />
                <Input 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username" 
                  className="pl-10 bg-white/5 border-white/10 text-white focus:border-blue-500 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500" />
                <Input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password" 
                  className="pl-10 bg-white/5 border-white/10 text-white focus:border-purple-500 h-11"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 text-base font-medium bg-blue-600 hover:bg-blue-700 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all mt-4"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Secure Login"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 flex justify-center">
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Lock className="h-3 w-3" /> End-to-end encrypted session
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
