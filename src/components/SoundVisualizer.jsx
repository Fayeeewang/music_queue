const barHeights = [28, 46, 34, 58, 40, 66, 36, 52, 30, 60, 44, 54]

export function SoundVisualizer({ isPlaying }) {
  return (
    <div className="flex h-20 items-end justify-center gap-1.5 rounded-[1.4rem] border border-white/10 bg-black/25 px-4 py-3">
      {barHeights.map((height, index) => (
        <span
          key={`${height}-${index}`}
          className={`visualizer-bar ${isPlaying ? 'animate-equalize' : ''}`}
          style={{
            height: `${height}%`,
            animationDelay: `${index * 90}ms`,
          }}
        />
      ))}
    </div>
  )
}
