import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDeck } from './useDeck'
import type { SlideDefinition } from './types'
import planvLogo from '@/assets/logos/planV_logo.png'
export function DeckShell({ slides }: { slides: SlideDefinition[] }) {
  const { slideIndex, stage, stageCount, goTo } = useDeck(slides)

  return (
    <div className="fixed inset-0 overflow-hidden bg-paper">
      
      {/* --- ADDED WATERMARK HERE --- */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-10">
        {/* Replace the src with the actual path to your logo/watermark */}
        <img 
          src={planvLogo}
          alt="Watermark" 
          className="h-auto w-1/2 object-contain grayscale" 
        />
      </div>
      {/* ---------------------------- */}

      {/* Added 'relative z-10' here so the slides sit on top of the watermark */}
      <div
        className="relative z-10 flex h-full w-full flex-col transition-transform duration-[650ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{ transform: `translateY(-${slideIndex * 100}svh)` }}
      >
        {slides.map(({ id, Component }, i) => (
          <div key={id} className="h-svh w-full shrink-0">
            {i === slideIndex ? <Component stage={stage} /> : <Component stage={0} />}
          </div>
        ))}
      </div>

      {/* progress rail */}
      <div className="pointer-events-none fixed inset-y-0 right-5 z-30 hidden flex-col items-center justify-center gap-[7px] md:flex">
        {slides.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Go to slide ${i + 1}: ${s.section}`}
            onClick={() => goTo(i)}
            className="group pointer-events-auto flex items-center py-0.5"
          >
            <span
              className={cn(
                'block rounded-full transition-all duration-300',
                i === slideIndex ? 'h-5 w-1.5 bg-gold' : 'h-1.5 w-1.5 bg-line group-hover:bg-muted',
              )}
            />
          </button>
        ))}
      </div>

      {/* stage dots, only when current slide has multiple stages */}
      {stageCount > 1 && (
        <div className="fixed bottom-9 left-1/2 z-30 flex -translate-x-1/2 gap-2">
          {Array.from({ length: stageCount }).map((_, i) => (
            <span
              key={i}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === stage ? 'w-6 bg-gold' : 'w-1.5 bg-line',
              )}
            />
          ))}
        </div>
      )}

      {/* nav arrows */}
      {/* <div className="fixed right-5 bottom-7 z-30 flex flex-col gap-2 md:right-auto md:bottom-9 md:left-20">
        <button
          aria-label="Previous"
          onClick={goPrev}
          disabled={slideIndex === 0 && stage === 0}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink-soft shadow-sm transition hover:border-gold hover:text-gold disabled:opacity-30"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
        <button
          aria-label="Next"
          onClick={goNext}
          disabled={slideIndex === slides.length - 1 && stage === stageCount - 1}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink-soft shadow-sm transition hover:border-gold hover:text-gold disabled:opacity-30"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div> */}
      {slideIndex > 0 && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center opacity-4">
        <img 
          src={planvLogo} 
          alt="Watermark" 
          className="h-auto w-1/2 object-contain grayscale" 
        />
      </div>)}
      
    </div>
  )
}
