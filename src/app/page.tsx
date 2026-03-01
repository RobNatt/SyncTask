"use client";

import { SalesLoop } from "@/components/demo/SalesLoop";
import { ShieldCheck, Zap, Globe, Cpu } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30">
      {/* 1. Subtle Radial Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-indigo-900/20 blur-[120px] rounded-full" />
      </div>

      {/* 2. Navigation / Header */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
            <Cpu size={20} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">SYNCTASK</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Engine</a>
          <a href="#" className="hover:text-white transition-colors">Multi-Tenancy</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-500 hover:text-white transition-all">
          Deploy Engine
        </button>
      </nav>

      {/* 3. Hero Section */}
      <section className="relative z-10 pt-20 pb-12 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Unbreakable</span> <br />
          Workflow Pulse.
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed mb-10">
          A configuration-driven orchestration engine for mission-critical industries. 
          Deploy complex, role-based synchronous logic in under 24 hours.
        </p>
      </section>

      {/* 4. THE MASTER DEMO (The Sales Loop) */}
      <section className="relative z-10 px-4 pb-24 max-w-7xl mx-auto">
        <div className="p-1 bg-gradient-to-b from-white/10 to-transparent rounded-[3.5rem] shadow-2xl">
          <SalesLoop />
        </div>
      </section>

      {/* 5. Value Props Grid */}
      <section className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 px-6 pb-32 max-w-7xl mx-auto">
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
          <Zap className="text-blue-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Instant Onboarding</h3>
          <p className="text-slate-400 text-sm">Upload a JSON manifest and watch the engine generate your entire UI and logic gates automatically.</p>
        </div>
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
          <ShieldCheck className="text-emerald-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Role Guarded</h3>
          <p className="text-slate-400 text-sm">Prisma-level transactions ensure that no actor can bypass the sequence of dependencies.</p>
        </div>
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
          <Globe className="text-indigo-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Agnostic Design</h3>
          <p className="text-slate-400 text-sm">Built to handle Healthcare, Legal, or Manufacturing with zero code changes to the core engine.</p>
        </div>
      </section>
    </main>
  );
}