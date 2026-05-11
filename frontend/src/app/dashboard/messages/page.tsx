"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Bot, User, CheckCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const chats = [
  { id: 1, name: "John Doe", job: "#0001", status: "online", lastMessage: "When will my TV be ready?", time: "10:42 AM", unread: 2 },
  { id: 2, name: "Jane Smith", job: "#0002", status: "offline", lastMessage: "Okay, thank you.", time: "Yesterday", unread: 0 },
  { id: 3, name: "Mike Johnson", job: "#0003", status: "offline", lastMessage: "Can you send the invoice?", time: "Mon", unread: 0 },
];

const messages = [
  { id: 1, sender: "bot", text: "Hello! Welcome to RepairFlow. Your TV (Job #0001) has been received.", time: "10:00 AM", automated: true },
  { id: 2, sender: "user", text: "When will my TV be ready?", time: "10:42 AM" },
];

export default function MessagesPage() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          Customer Messaging
          <Badge variant="info" className="ml-2">WhatsApp Connected</Badge>
        </h2>
        <p className="text-zinc-400 mt-1">Communicate directly with customers via WhatsApp.</p>
      </div>

      <div className="flex-1 overflow-hidden glass-card rounded-xl border border-white/10 flex">
        {/* Sidebar */}
        <div className="w-80 border-r border-white/10 flex flex-col bg-black/20">
          <div className="p-4 border-b border-white/10">
            <Input placeholder="Search messages..." className="bg-white/5 border-white/10 text-white" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <div key={chat.id} className="p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors relative">
                {chat.id === 1 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{chat.name}</span>
                    <span className="text-xs text-zinc-500">{chat.job}</span>
                  </div>
                  <span className="text-xs text-zinc-500">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-zinc-400 truncate pr-4">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <Badge variant="default" className="bg-blue-500 text-white h-5 w-5 p-0 flex items-center justify-center rounded-full">
                      {chat.unread}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-black/10">
          {/* Chat Header */}
          <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                JD
              </div>
              <div>
                <h3 className="font-medium text-white">John Doe</h3>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Online
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-white/10 text-zinc-300">
                View Job
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white border-none">
                <Bot className="h-4 w-4 mr-2" />
                Auto-Reply
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-start' : 'items-end'}`}
              >
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.sender === 'user' 
                    ? 'bg-white/10 text-white rounded-tl-sm' 
                    : 'bg-blue-600 text-white rounded-tr-sm'
                }`}>
                  {msg.automated && (
                    <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-blue-200 mb-1">
                      <Bot className="h-3 w-3" /> Automated Message
                    </div>
                  )}
                  <p className="text-sm">{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-zinc-500">
                  {msg.time}
                  {msg.sender !== 'user' && <CheckCheck className="h-3 w-3 text-blue-400" />}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-white/5">
            <div className="flex gap-2">
              <Input 
                placeholder="Type a message..." 
                className="flex-1 bg-white/5 border-white/10 text-white rounded-full px-4" 
              />
              <Button className="rounded-full w-10 h-10 p-0 shrink-0 bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
