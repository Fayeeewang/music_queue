import { ArrowRightToLine, ListMusic, RotateCcw, X } from 'lucide-react'

export function QueueItem({ song, index, isCurrent, onJump, onMoveToEnd, onRemove }) {
  return (
    <article
      className={`group relative overflow-hidden rounded-[1.35rem] border p-3 transition duration-300 ${
        isCurrent
          ? 'border-cyan-200/70 bg-cyan-300/15 shadow-[0_0_32px_rgba(34,211,238,0.22)]'
          : 'border-white/10 bg-white/[0.045] hover:border-pink-200/50 hover:bg-white/[0.075]'
      }`}
    >
      {isCurrent ? (
        <div className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-gradient-to-b from-pink-300 via-cyan-300 to-purple-300 shadow-[0_0_16px_rgba(34,211,238,0.8)]" />
      ) : null}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onJump}
          className={`grid size-11 shrink-0 place-items-center rounded-full border transition ${
            isCurrent
              ? 'border-white/50 bg-white/20 text-cyan-50'
              : 'border-white/15 bg-black/20 text-slate-300 hover:text-pink-100'
          }`}
          aria-label={`Jump to ${song.title}`}
        >
          {isCurrent ? <ListMusic size={18} /> : <span className="text-sm font-black">{index + 1}</span>}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-black text-white">{song.title}</h3>
            {isCurrent ? (
              <span className="rounded-full border border-cyan-200/40 bg-cyan-300/15 px-2 py-0.5 text-[0.58rem] font-black uppercase tracking-[0.18em] text-cyan-100">
                Current
              </span>
            ) : null}
          </div>
          <p className="truncate text-xs text-slate-300">{song.artist}</p>
        </div>

        <span className="hidden rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-bold text-slate-200 sm:inline-flex">
          {song.durationLabel}
        </span>

        <div className="flex items-center gap-1 opacity-90 transition group-hover:opacity-100">
          <button
            type="button"
            onClick={onJump}
            className="queue-icon-button"
            aria-label={`Jump to ${song.title}`}
            title="Jump to song"
          >
            <ArrowRightToLine size={15} />
          </button>
          <button
            type="button"
            onClick={onMoveToEnd}
            className="queue-icon-button"
            aria-label={`Move ${song.title} to end`}
            title="Move to end"
          >
            <RotateCcw size={15} />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="queue-icon-button hover:border-rose-200/70 hover:bg-rose-400/15 hover:text-rose-100"
            aria-label={`Remove ${song.title}`}
            title="Remove"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </article>
  )
}
