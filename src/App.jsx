import { useMemo, useRef, useState } from 'react'
import {
  AudioLines,
  BadgePlus,
  Clock3,
  Disc3,
  FastForward,
  Heart,
  ListMusic,
  MoveDown,
  Music2,
  Pause,
  Play,
  Plus,
  Radio,
  Repeat2,
  Rewind,
  Search,
  Shuffle,
  SkipBack,
  SkipForward,
  Sparkles,
  TimerReset,
  Trash2,
  Volume2,
  Waves,
} from 'lucide-react'
import { ControlButton } from './components/ControlButton'
import { GlassPanel } from './components/GlassPanel'
import { QueueItem } from './components/QueueItem'
import { SoundVisualizer } from './components/SoundVisualizer'
import { StatCard } from './components/StatCard'
import { addableSongs, mockSongs } from './data/mockSongs'

function formatDuration(totalSeconds = 0) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function getTotalDuration(songs) {
  return songs.reduce((total, song) => total + song.duration, 0)
}

function App() {
  const [queue, setQueue] = useState(mockSongs)
  const [currentIndex, setCurrentIndex] = useState(1)
  const [isPlaying, setIsPlaying] = useState(true)
  const [repeatAll, setRepeatAll] = useState(true)
  const [shuffleOn, setShuffleOn] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [addCounter, setAddCounter] = useState(0)
  const [utilityMessage, setUtilityMessage] = useState(
    'Mock queue loaded. Controls are ready to connect to your DLinkedList methods.',
  )
  const searchInputRef = useRef(null)

  const currentSong = queue[currentIndex] ?? null
  const totalDuration = useMemo(() => getTotalDuration(queue), [queue])
  const remainingDuration = useMemo(
    () => (queue.length ? getTotalDuration(queue.slice(currentIndex)) : 0),
    [currentIndex, queue],
  )

  const filteredQueue = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return queue
      .map((song, index) => ({
        ...song,
        durationLabel: formatDuration(song.duration),
        originalIndex: index,
      }))
      .filter((song) => {
        if (!normalizedQuery) return true
        return (
          song.title.toLowerCase().includes(normalizedQuery) ||
          song.artist.toLowerCase().includes(normalizedQuery)
        )
      })
  }, [queue, searchQuery])

  const elapsedSeconds = currentSong ? Math.floor(currentSong.duration * 0.48) : 0
  const progressPercent = currentSong ? (elapsedSeconds / currentSong.duration) * 100 : 0

  const jumpToSong = (index) => {
    if (!queue[index]) return
    setCurrentIndex(index)
    setIsPlaying(true)
    setUtilityMessage(`Jumped to position ${index + 1}: ${queue[index].title}.`)
  }

  const playNext = () => {
    if (!queue.length) return

    setCurrentIndex((index) => {
      if (index < queue.length - 1) return index + 1
      return repeatAll ? 0 : index
    })
    setIsPlaying(true)
    setUtilityMessage(repeatAll ? 'Next song selected. Repeat-all wraps at the end.' : 'Next song selected.')
  }

  const playPrevious = () => {
    if (!queue.length) return

    setCurrentIndex((index) => {
      if (index > 0) return index - 1
      return repeatAll ? queue.length - 1 : index
    })
    setIsPlaying(true)
    setUtilityMessage('Previous song selected.')
  }

  const removeAt = (indexToRemove) => {
    if (!queue[indexToRemove]) return
    const removedSong = queue[indexToRemove]
    const nextQueue = queue.filter((_, index) => index !== indexToRemove)

    setQueue(nextQueue)
    setCurrentIndex((index) => {
      if (!nextQueue.length) return 0
      if (indexToRemove < index) return index - 1
      if (indexToRemove === index) return Math.min(index, nextQueue.length - 1)
      return index
    })
    setUtilityMessage(`Removed ${removedSong.title} from the mock queue.`)
  }

  const moveToEnd = (indexToMove) => {
    if (!queue[indexToMove] || indexToMove === queue.length - 1) {
      setUtilityMessage('That song is already at the end of the queue.')
      return
    }

    const nextQueue = [...queue]
    const [movedSong] = nextQueue.splice(indexToMove, 1)
    nextQueue.push(movedSong)

    setQueue(nextQueue)
    setCurrentIndex((index) => {
      if (indexToMove === index) return nextQueue.length - 1
      if (indexToMove < index) return index - 1
      return index
    })
    setUtilityMessage(`${movedSong.title} moved to the end of the queue.`)
  }

  const addSong = () => {
    const songTemplate = addableSongs[addCounter % addableSongs.length]
    const newSong = {
      ...songTemplate,
      id: `${songTemplate.id}-${addCounter + 1}`,
    }

    setQueue((songs) => [...songs, newSong])
    setAddCounter((count) => count + 1)
    setUtilityMessage(`${newSong.title} added to the end of the queue.`)
  }

  const addNext = () => {
    const songTemplate = addableSongs[addCounter % addableSongs.length]
    const newSong = {
      ...songTemplate,
      id: `${songTemplate.id}-next-${addCounter + 1}`,
    }
    const insertIndex = queue.length ? currentIndex + 1 : 0

    setQueue((songs) => {
      const nextSongs = [...songs]
      nextSongs.splice(insertIndex, 0, newSong)
      return nextSongs
    })
    setAddCounter((count) => count + 1)
    setUtilityMessage(`${newSong.title} added next after the current song.`)
  }

  const clearQueue = () => {
    setQueue([])
    setCurrentIndex(0)
    setIsPlaying(false)
    setUtilityMessage('Queue cleared. Add Song or Add Next will rebuild the mock queue.')
  }

  const showQueue = () => {
    setSearchQuery('')
    setUtilityMessage('Showing the full queue.')
  }

  const focusSearch = () => {
    searchInputRef.current?.focus()
    setUtilityMessage('Search queue by song title or artist.')
  }

  const jumpToNextSong = () => {
    if (!queue.length) return
    jumpToSong((currentIndex + 1) % queue.length)
  }

  const moveCurrentToEnd = () => {
    if (!queue.length) return
    moveToEnd(currentIndex)
  }

  const shuffleQueue = () => {
    if (queue.length <= 1) return

    const activeSong = queue[currentIndex]
    const shuffled = [...queue].sort(() => Math.random() - 0.5)
    setQueue(shuffled)
    setCurrentIndex(shuffled.findIndex((song) => song.id === activeSong.id))
    setShuffleOn((value) => !value)
    setUtilityMessage('Mock queue shuffled while preserving the current song pointer.')
  }

  const currentGradient = currentSong?.color ?? 'from-slate-200 via-cyan-200 to-fuchsia-300'

  return (
    <main className="min-h-screen overflow-hidden bg-[#05040d] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(236,72,153,0.28),transparent_34%),radial-gradient(circle_at_88%_8%,rgba(34,211,238,0.24),transparent_30%),linear-gradient(135deg,#05040d_0%,#09051d_42%,#030712_100%)]" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px] opacity-30" />
      <div className="fixed inset-0 scanlines opacity-40" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-black/20 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-2xl lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative grid size-14 place-items-center rounded-2xl border border-white/20 bg-gradient-to-br from-white/35 via-fuchsia-300/20 to-cyan-300/20 shadow-[0_0_35px_rgba(244,114,182,0.28)]">
              <Disc3 className="animate-slow-spin text-cyan-100" size={28} />
              <span className="absolute -right-1 -top-1 size-4 rounded-full bg-pink-300 shadow-[0_0_18px_rgba(244,114,182,0.9)]" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">
                Enhanced DLinkedList Player
              </p>
              <h1 className="font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
                ChromeQueue
              </h1>
              <p className="text-sm text-slate-300">A glossy Y2K dashboard for your music queue logic.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="group flex min-w-0 items-center gap-3 rounded-full border border-white/15 bg-white/[0.07] px-4 py-3 text-sm text-slate-200 shadow-inner shadow-white/10 transition focus-within:border-cyan-200/70 focus-within:shadow-[0_0_30px_rgba(34,211,238,0.2)] sm:w-80">
              <Search size={18} className="text-cyan-200" />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search queue..."
                className="w-full bg-transparent outline-none placeholder:text-slate-500"
              />
            </label>
            <div className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-200/40 bg-cyan-300/15 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.24)]">
              <span className="size-2 rounded-full bg-cyan-200 shadow-[0_0_12px_rgba(103,232,249,1)]" />
              {currentSong ? 'Now Playing' : 'Queue Empty'}
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
          <GlassPanel className="p-5 sm:p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div className="relative mx-auto aspect-square w-full max-w-sm rounded-[2.4rem] border border-white/20 bg-black/30 p-4 shadow-[inset_0_0_38px_rgba(255,255,255,0.08),0_30px_80px_rgba(0,0,0,0.45)]">
                <div className={`h-full rounded-[2rem] bg-gradient-to-br ${currentGradient} p-1 shadow-[0_0_50px_rgba(244,114,182,0.28)]`}>
                  <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-[1.75rem] bg-black/35">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.48),transparent_18%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.28),transparent_20%)]" />
                    <div className="absolute inset-x-8 top-8 h-16 rounded-full bg-white/25 blur-2xl" />
                    <Disc3 className="relative z-10 animate-slow-spin text-white/90 drop-shadow-[0_0_18px_rgba(255,255,255,0.65)]" size={118} />
                    <p className="relative z-10 mt-5 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-white shadow-inner shadow-white/20">
                      Queue Core Ready
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-pink-200/30 bg-pink-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-pink-100">
                    <Sparkles size={14} />
                    Current Song
                  </p>
                  <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                    {currentSong?.title ?? 'No song selected'}
                  </h2>
                  <p className="mt-2 text-lg font-semibold text-cyan-100">
                    {currentSong?.artist ?? 'Use Add Song to start the mock queue'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="h-4 rounded-full border border-white/15 bg-black/35 p-1 shadow-inner shadow-black">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-pink-300 via-cyan-200 to-purple-300 shadow-[0_0_20px_rgba(103,232,249,0.65)] transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-[0.15em] text-slate-300">
                    <span>{formatDuration(elapsedSeconds)}</span>
                    <span>{formatDuration(currentSong?.duration ?? 0)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                  <button type="button" onClick={playPrevious} className="playback-button secondary" aria-label="Previous song">
                    <SkipBack size={24} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPlaying((playing) => !playing)}
                    className="playback-button primary"
                    aria-label={isPlaying ? 'Pause song' : 'Play song'}
                  >
                    {isPlaying ? <Pause size={32} /> : <Play size={32} fill="currentColor" />}
                  </button>
                  <button type="button" onClick={playNext} className="playback-button secondary" aria-label="Next song">
                    <SkipForward size={24} />
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <ControlButton
                    icon={Repeat2}
                    label="Repeat"
                    helper={repeatAll ? 'All mode on' : 'Off'}
                    active={repeatAll}
                    compact
                    onClick={() => {
                      setRepeatAll((value) => !value)
                      setUtilityMessage('Repeat all mode toggled.')
                    }}
                  />
                  <ControlButton
                    icon={Shuffle}
                    label="Shuffle"
                    helper={shuffleOn ? 'Mixed' : 'Ready'}
                    active={shuffleOn}
                    compact
                    onClick={shuffleQueue}
                  />
                  <ControlButton icon={Volume2} label="Volume" helper="78%" compact onClick={() => setUtilityMessage('Volume control placeholder for future audio integration.')} />
                </div>

                <SoundVisualizer isPlaying={isPlaying && Boolean(currentSong)} />
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="p-5 sm:p-6">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-pink-100">Doubly Linked Queue</p>
                <h2 className="mt-1 text-2xl font-black text-white">Up Next</h2>
              </div>
              <span className="rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs font-bold text-slate-200">
                {filteredQueue.length}/{queue.length} visible
              </span>
            </div>

            <div className="max-h-[560px] space-y-3 overflow-y-auto pr-1 custom-scrollbar">
              {filteredQueue.map((song) => (
                <QueueItem
                  key={song.id}
                  song={song}
                  index={song.originalIndex}
                  isCurrent={song.originalIndex === currentIndex}
                  onJump={() => jumpToSong(song.originalIndex)}
                  onMoveToEnd={() => moveToEnd(song.originalIndex)}
                  onRemove={() => removeAt(song.originalIndex)}
                />
              ))}

              {!filteredQueue.length ? (
                <div className="rounded-[1.5rem] border border-dashed border-white/20 bg-black/20 p-8 text-center text-slate-300">
                  <Music2 className="mx-auto mb-3 text-cyan-200" size={34} />
                  No songs match this search.
                </div>
              ) : null}
            </div>
          </GlassPanel>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
          <GlassPanel className="p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100">Queue Feature Controls</p>
                <h2 className="mt-1 text-2xl font-black text-white">Lab Logic Command Deck</h2>
              </div>
              <BadgePlus className="hidden text-pink-200 sm:block" size={30} />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <ControlButton icon={Plus} label="Add Song" helper="Mock add to end" onClick={addSong} />
              <ControlButton icon={FastForward} label="Add Next" helper="Insert after current" onClick={addNext} />
              <ControlButton icon={ListMusic} label="Show Queue" helper="Reset search filter" onClick={showQueue} />
              <ControlButton icon={Search} label="Search Queue" helper="Focus search input" onClick={focusSearch} />
              <ControlButton icon={Rewind} label="Jump to Song" helper="Jump to next item" onClick={jumpToNextSong} />
              <ControlButton
                icon={Clock3}
                label="Show Remaining Time"
                helper={formatDuration(remainingDuration)}
                onClick={() => setUtilityMessage(`Remaining duration from current song: ${formatDuration(remainingDuration)}.`)}
              />
              <ControlButton icon={MoveDown} label="Move Current Song to End" helper="Reorder current node" onClick={moveCurrentToEnd} />
              <ControlButton icon={Trash2} label="Clear Queue" helper="Empty mock queue" danger onClick={clearQueue} />
              <ControlButton
                icon={Repeat2}
                label="Toggle Repeat All"
                helper={repeatAll ? 'Currently on' : 'Currently off'}
                active={repeatAll}
                onClick={() => {
                  setRepeatAll((value) => !value)
                  setUtilityMessage('Repeat all mode toggled.')
                }}
              />
            </div>

            <div className="mt-5 rounded-[1.4rem] border border-white/12 bg-black/25 p-4 text-sm text-slate-200">
              <span className="mr-2 font-black uppercase tracking-[0.16em] text-pink-100">Status:</span>
              {utilityMessage}
            </div>
          </GlassPanel>

          <GlassPanel className="p-5 sm:p-6">
            <div className="mb-5">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-pink-100">Info / Stats Panel</p>
              <h2 className="mt-1 text-2xl font-black text-white">Queue Telemetry</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <StatCard icon={AudioLines} label="Total Songs" value={queue.length} detail="Tracked as queue size" tone="cyan" />
              <StatCard icon={TimerReset} label="Total Duration" value={formatDuration(totalDuration)} detail="Full queue length" tone="chrome" />
              <StatCard icon={Waves} label="Remaining" value={formatDuration(remainingDuration)} detail="Current node to tail" tone="pink" />
              <StatCard icon={Repeat2} label="Repeat All" value={repeatAll ? 'On' : 'Off'} detail="Wraps next/previous" tone="purple" />
            </div>

            <div className="mt-4 rounded-[1.8rem] border border-white/12 bg-gradient-to-br from-pink-300/15 via-purple-400/10 to-cyan-300/15 p-5">
              <div className="flex items-start gap-4">
                <div className="grid size-12 place-items-center rounded-full border border-white/20 bg-white/10 text-pink-100">
                  <Heart size={20} fill="currentColor" />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-100">Playlist Mood</p>
                  <h3 className="mt-1 text-xl font-black text-white">Glossy Cyberdream Pop</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Current position: {queue.length ? `${currentIndex + 1} of ${queue.length}` : 'none'}.
                    Built to map onto get_current(), jump_to(), remove_current(), and duration helpers.
                  </p>
                </div>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </main>
  )
}

export default App
