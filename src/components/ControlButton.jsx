export function ControlButton({
  icon: Icon,
  label,
  helper,
  active = false,
  danger = false,
  compact = false,
  onClick,
}) {
  const activeClasses = active
    ? 'border-cyan-200/80 bg-cyan-300/20 text-white shadow-[0_0_28px_rgba(103,232,249,0.35)]'
    : 'border-white/15 bg-white/[0.06] text-slate-100 hover:border-pink-200/70 hover:bg-pink-300/15 hover:shadow-[0_0_28px_rgba(244,114,182,0.24)]'

  const dangerClasses = danger
    ? 'hover:border-rose-300/80 hover:bg-rose-400/15 hover:text-rose-50 hover:shadow-[0_0_26px_rgba(251,113,133,0.24)]'
    : ''

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group rounded-[1.4rem] border transition duration-300 ${activeClasses} ${dangerClasses} ${
        compact ? 'px-3 py-2' : 'px-4 py-3 text-left'
      }`}
    >
      <span className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full border border-white/20 bg-gradient-to-br from-white/25 to-white/5 text-cyan-100 shadow-inner shadow-white/20 transition group-hover:scale-105">
          <Icon size={compact ? 16 : 18} />
        </span>
        <span>
          <span className="block text-sm font-bold uppercase tracking-[0.16em]">{label}</span>
          {helper ? <span className="mt-1 block text-xs text-slate-300">{helper}</span> : null}
        </span>
      </span>
    </button>
  )
}
