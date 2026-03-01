export function PositionPane({ label, active, completed }: { label: string, active: boolean, completed: boolean }) {
  return (
    <div className={`relative overflow-hidden h-10 rounded-xl flex items-center px-4 text-xs font-bold transition-all duration-500 ${
      completed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
      active ? 'bg-white text-blue-900 shadow-lg scale-[1.02]' : 'bg-white/5 text-white/20'
    }`}>
      {/* The "Loading" Progress Bar for Active Tasks */}
      {active && (
        <div className="absolute bottom-0 left-0 h-1 bg-blue-600 animate-[progress_3s_ease-in-out_infinite]" 
             style={{ width: '100%' }} />
      )}
      
      <span className="relative z-10 flex items-center gap-2">
        {completed ? '✓' : active ? '●' : '○'} {label}
      </span>
    </div>
  );
}