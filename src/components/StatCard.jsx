export function StatCard({ icon: Icon, label, value, detail, tone = 'cyan' }) {
  const toneClasses = {
    cyan: 'from-cyan-300/30 to-blue-400/10 text-cyan-100 shadow-cyan-500/20',
    pink: 'from-pink-300/30 to-fuchsia-500/10 text-pink-100 shadow-pink-500/20',
    purple: 'from-purple-300/30 to-indigo-500/10 text-purple-100 shadow-purple-500/20',
    chrome: 'from-white/30 to-slate-300/10 text-white shadow-white/10',
  }

  return (
    <div className="rounded-[1.4rem] border border-white/12 bg-black/20 p-4 shadow-inner shadow-white/5">
      <div className="flex items-start gap-3">
        <div
          className={`grid size-11 place-items-center rounded-full bg-gradient-to-br ${toneClasses[tone]} shadow-lg`}
        >
          <Icon size={18} />
        </div>
        <div>
          <p className="text-[0.64rem] font-black uppercase tracking-[0.22em] text-slate-400">
            {label}
          </p>
          <p className="mt-1 text-xl font-black text-white">{value}</p>
          {detail ? <p className="mt-1 text-xs text-slate-300">{detail}</p> : null}
        </div>
      </div>
    </div>
  )
}
