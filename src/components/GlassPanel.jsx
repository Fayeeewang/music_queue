export function GlassPanel({ children, className = '', as: Component = 'section' }) {
  return (
    <Component
      className={`relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.07] shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,112,210,0.18),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(75,220,255,0.18),transparent_32%)]" />
      <div className="relative z-10">{children}</div>
    </Component>
  )
}
