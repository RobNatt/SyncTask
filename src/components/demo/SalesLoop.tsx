"use client";

import { useState, useEffect, useRef } from 'react';
import { AlertCircle, ShieldAlert, CheckCircle2, Zap, RefreshCcw, Terminal, Activity, ChevronRight, Layers } from "lucide-react";

export function SalesLoop() {
  const [t, setT] = useState(0);
  const [logs, setLogs] = useState<string[]>(["[00s] KERNEL_INIT", "[00s] AUTH_TENANT_SUCCESS"]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setT(prev => (prev >= 120 ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const addLog = (msg: string) => setLogs(prev => [...prev.slice(-5), `[${t.toString().padStart(2, '0')}s] ${msg}`]);
    
    if (t === 1) addLog("P01_ENGAGED: SCHEMA_LOAD");
    if (t === 10) addLog("P01_VALIDATING: DATA_TYPES");
    if (t === 22) addLog("HANDOFF: P01 -> P02_GATEWAY");
    if (t === 40) addLog("!!! CRITICAL_FAIL: P04_INTEGRITY_CHECK");
    if (t === 43) addLog("RE-ROUTING: ACTIVATING_REMEDIATION_PROTOCOL");
    if (t === 46) addLog("P01_RECOVERY_NODE_GENERATED");
    if (t === 78) addLog("P01_FIX_APPLIED: SYNC_RESUMED");
    if (t === 105) addLog("FINALIZING: ENCRYPTION_FLUSH");
    
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [t]);

  return (
    <div className="bg-[#020617] p-10 rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden relative min-h-[750px] flex flex-col font-sans">
      
      {/* 1. CRITICAL ALERT OVERLAY (40-46s) */}
      {t >= 40 && t < 46 && (
        <div className="absolute inset-0 z-50 bg-red-950/30 backdrop-blur-md flex items-center justify-center pointer-events-none animate-in fade-in duration-500">
          <div className="bg-black border-2 border-red-600 p-10 rounded-[2rem] shadow-[0_0_100px_rgba(220,38,38,0.3)] text-center">
            <RefreshCcw size={60} className="text-red-500 animate-spin mb-6 mx-auto" />
            <h2 className="text-red-500 text-4xl font-black italic tracking-tighter mb-2">SYSTEM_CONFLICT</h2>
            <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">Generating Dynamic Remediation Tree...</p>
          </div>
        </div>
      )}

      {/* 2. TOP NAV / METRICS */}
      <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-8">
        <div className="flex gap-8 items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Layers size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-white text-2xl font-black tracking-tighter uppercase leading-none">Syncronicity</h2>
              <p className="text-[10px] font-mono text-blue-500 font-bold uppercase tracking-[0.3em] mt-1.5">Agnostic Core v4.0</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Cycle Pulse</p>
            <p className="text-white text-2xl font-mono font-black">{Math.floor(t / 60)}:{(t % 60).toString().padStart(2, '0')}</p>
          </div>
          <div className="w-1 bg-white/5 h-12 rounded-full" />
          <div className="w-16 h-16 rounded-full border-[3px] border-slate-800 flex items-center justify-center relative">
             <span className="text-[11px] font-black text-blue-400">{Math.round((t/120)*100)}%</span>
             <svg className="absolute inset-0 -rotate-90" width="64" height="64">
                <circle cx="32" cy="32" r="30" fill="transparent" stroke="#2563eb" strokeWidth="4" strokeDasharray={188.5} strokeDashoffset={188.5 - (188.5 * t) / 120} strokeLinecap="round" className="transition-all duration-1000" />
             </svg>
          </div>
        </div>
      </div>

      {/* 3. THE 4-POSITION DYNAMIC GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 flex-grow">
        
        {/* POSITION 01: ARCHITECT */}
        <PositionCard title="01" role="Project Architect" isActive={t < 25 || (t >= 46 && t < 80)}>
          <TaskItem label="Global Schema Mapping" status={t < 10 ? 'ACTIVE' : 'COMPLETED'} />
          <TaskItem label="Relational Keys Init" status={t >= 10 && t < 18 ? 'ACTIVE' : t >= 18 ? 'COMPLETED' : 'LOCKED'} />
          <TaskItem label="Auth Node Definitions" status={t >= 18 && t < 25 ? 'ACTIVE' : t >= 25 ? 'COMPLETED' : 'LOCKED'} />
          {t >= 46 && (
            <>
              <TaskItem label="REMEDIATION: Delta Patch" status={t < 65 ? 'ACTIVE' : 'COMPLETED'} priority="HIGH" isDynamic />
              <TaskItem label="RE-CHECK: Logic Gates" status={t >= 65 && t < 80 ? 'ACTIVE' : t >= 80 ? 'COMPLETED' : 'LOCKED'} priority="HIGH" isDynamic />
            </>
          )}
        </PositionCard>

        {/* POSITION 02: ENGINEER */}
        <PositionCard title="02" role="Lead Engineer" isActive={(t >= 25 && t < 40) || (t >= 80 && t < 110)}>
          <TaskItem label="API Gateway Wrapper" status={t >= 25 && t < 32 ? 'ACTIVE' : t >= 32 ? 'COMPLETED' : 'LOCKED'} />
          <TaskItem label="WebSocket Handshake" status={t >= 32 && t < 40 ? 'ACTIVE' : t >= 40 ? 'COMPLETED' : 'LOCKED'} />
          {t >= 80 && (
            <>
              <TaskItem label="SYNC: Adjusted Nodes" status={t >= 80 && t < 95 ? 'ACTIVE' : t >= 95 ? 'COMPLETED' : 'LOCKED'} isDynamic />
              <TaskItem label="Load Balance Check" status={t >= 95 && t < 110 ? 'ACTIVE' : t >= 110 ? 'COMPLETED' : 'LOCKED'} isDynamic />
            </>
          )}
        </PositionCard>

        {/* POSITION 03: TECH */}
        <PositionCard title="03" role="Systems Tech" isActive={(t >= 30 && t < 40) || t >= 105}>
          <TaskItem label="Cluster Health Check" status={t >= 30 && t < 35 ? 'ACTIVE' : t >= 35 ? 'COMPLETED' : 'LOCKED'} />
          <TaskItem label="ENV: Variable Inject" status={t >= 35 && t < 40 ? 'ACTIVE' : t >= 40 ? 'COMPLETED' : 'LOCKED'} />
          <TaskItem label="GLOBAL_HARDENING" status={t >= 105 ? 'ACTIVE' : 'LOCKED'} priority="CRITICAL" />
          <TaskItem label="DB_VACUUM_FINAL" status={t >= 115 ? 'ACTIVE' : 'LOCKED'} />
        </PositionCard>

        {/* POSITION 04: QUALITY CONTROL */}
        <div className={`p-7 rounded-[2.5rem] border-2 transition-all duration-700 h-full ${
          t >= 40 && t < 46 ? 'border-red-500 bg-red-500/10' : 'border-white/5 bg-white/[0.02]'
        }`}>
          <div className="flex items-center gap-3 mb-8">
            <Terminal size={16} className="text-purple-400" />
            <h3 className="text-white text-xs font-black uppercase tracking-widest">QC_TERMINAL</h3>
          </div>
          <div className="space-y-6">
             <StageRow label="SCHEMA_VAL" status={t < 40 ? 'WAITING' : t < 46 ? 'FAILED' : 'SUCCESS'} />
             <StageRow label="GATEWAY_VAL" status={t < 80 ? 'WAITING' : t < 90 ? 'RE-CHECK' : 'SUCCESS'} />
             
             {t >= 46 && (
               <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl animate-in slide-in-from-bottom-2">
                 <p className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-2 italic">
                   <CheckCircle2 size={12}/> Recovery Thread Active
                 </p>
                 <div className="mt-3 space-y-1">
                   <div className="h-1 w-full bg-emerald-950 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 animate-[loading_10s_linear_infinite]" style={{width: '60%'}} />
                   </div>
                 </div>
               </div>
             )}
          </div>
        </div>

      </div>

      {/* 4. FOOTER LOG TERMINAL */}
      <div className="mt-10 bg-black/60 rounded-[1.5rem] p-5 border border-white/5 font-mono text-[11px] flex items-center justify-between shadow-inner">
        <div className="flex gap-6 items-center overflow-hidden" ref={scrollRef}>
          <Activity size={16} className="text-blue-500 shrink-0" />
          {logs.map((log, i) => (
            <span key={i} className={`${log.includes('!!!') ? 'text-red-500 font-bold' : 'text-slate-400'} whitespace-nowrap animate-in slide-in-from-right-4 duration-500`}>
              {log}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-8 border-l border-white/10 pl-8">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
          <span className="text-emerald-500 font-black tracking-tighter uppercase">Live_Relay</span>
        </div>
      </div>
    </div>
  );
}

// --- REFINED UTILS ---

function StageRow({ label, status }: any) {
  const colors: any = { WAITING: 'text-slate-700', FAILED: 'text-red-500 animate-pulse', SUCCESS: 'text-emerald-500', 'RE-CHECK': 'text-orange-400' };
  return (
    <div className="flex justify-between items-center border-b border-white/5 pb-2">
      <span className="text-[9px] font-bold text-slate-500 tracking-widest">{label}</span>
      <span className={`text-[9px] font-black uppercase ${colors[status]}`}>{status}</span>
    </div>
  );
}

export function PositionCard({ title, role, children, isActive }: any) {
  return (
    <div className={`p-7 rounded-[2.5rem] border-2 transition-all duration-700 h-full flex flex-col ${
      isActive ? 'border-blue-500/40 bg-blue-600/[0.04] shadow-[0_0_50px_rgba(37,99,235,0.08)]' : 'border-white/5 bg-white/[0.01]'
    }`}>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h4 className="text-white font-black text-sm tracking-tight">POSITION_{title}</h4>
          <p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest mt-1 opacity-70">{role}</p>
        </div>
        {isActive && <Zap size={16} className="text-blue-500 fill-blue-500/20 animate-pulse" />}
      </div>
      <div className="space-y-3 flex-grow">{children}</div>
    </div>
  );
}

function TaskItem({ label, status, priority, isDynamic }: any) {
  const styles: any = {
    LOCKED: "opacity-5 grayscale blur-[0.5px]",
    ACTIVE: "opacity-100 border-white/10 bg-white/5 shadow-lg",
    COMPLETED: "opacity-40 border-emerald-500/20 bg-emerald-500/10"
  };

  return (
    <div className={`p-3.5 rounded-2xl border transition-all duration-500 ${styles[status]} ${isDynamic ? 'border-dashed border-blue-400/40' : ''}`}>
      <div className="flex justify-between items-center mb-1.5">
        <span className={`text-[10px] font-bold tracking-tight ${status === 'COMPLETED' ? 'line-through text-slate-600' : 'text-slate-100'}`}>
          {isDynamic && <span className="text-blue-400 mr-1.5 font-black">✦</span>}
          {label}
        </span>
        {status === 'COMPLETED' ? <CheckCircle2 size={12} className="text-emerald-500" /> : status === 'ACTIVE' && <ChevronRight size={12} className="text-blue-500 animate-bounce" />}
      </div>
      {status === 'ACTIVE' && (
        <div className="w-full h-0.5 bg-white/5 mt-2 overflow-hidden rounded-full">
          <div className="h-full bg-blue-500 animate-[loading_4s_linear_infinite]" />
        </div>
      )}
    </div>
  );
}