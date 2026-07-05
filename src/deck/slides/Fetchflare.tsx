import { SlidePage, Eyebrow, SlideTitle, DashList} from '@/deck/Primitives'
import { FetchflareStateCanvas } from '@/deck/diagrams/FetchflareStateCanvas'
import { SectionMark } from '@/deck/Decor'
import { cn } from '@/lib/utils'
export function Fetchflare({stage}: { stage: number }) {
  return (
    <SlidePage className="flex flex-col">
      <Eyebrow>Proposed Optimizations</Eyebrow>
      <SlideTitle>Data Prefetching: Fetchflare Integration</SlideTitle>
      <div className={`mt-6 space-y-2 font-mono text-[0.92rem] text-ink-soft transition-all duration-700 ease-out ${
      stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <p>– Hiding memory latency by overlapping computation with memory access by speculatively accessing the data</p>
        
        {/* Line for Stage 2 and 3 */}
        <p className={`transition-all duration-700 ease-out flex flex-wrap items-center ${
        stage >= 2 
          ? 'opacity-100 translate-y-0 max-h-10' 
          : 'opacity-0 -translate-y-2 max-h-0 overflow-hidden pointer-events-none !mt-0'
      }`}>
        <span>– Integration of the FF</span>
        
        {/* Only this suffix will animate in and out */}
        <span className={`transition-all duration-700 ease-out inline-block whitespace-pre ${
          stage >= 4 
            ? 'opacity-100 translate-x-0 max-w-[500px]' 
            : 'opacity-0 -translate-x-2 max-w-0 overflow-hidden pointer-events-none'
        }`}>
          {" — Modification of the FF FSM"}
        </span>
      </p>
      </div>


      {stage < 3 ? (
        /* 1. Restored the exact column layout from previous slides to match width */
        <div className={`grid h-full grid-cols-1 items-center gap-12 lg:grid-rows-[5fr_1.2fr] lg:grid-cols-[1.2fr_1.2fr] transition-all duration-700 ease-out`}>
          
          {/* 2. Used lg:col-start-2 to push it right, and ensured standard flex alignment */}
          <div className={cn('flex h-full min-h-0 items-center justify-center lg:col-start-2')}>
            <SectionMark index="04" label="Optimization" />
          </div>
        </div>
                  ): (<div className="mt-0 grid min-h-0 flex-1 grid-cols-2 gap-6">
        {<div className={`flex min-h-0 flex-col rounded-2xl border border-line bg-white p-3 shadow-sm transition-all duration-700 ease-out ${
          stage >= 3 
            ? "opacity-100 scale-100 pointer-events-auto" 
            : "opacity-0 scale-95 pointer-events-none h-0 overflow-hidden p-0 border-none"
        }`}
        >
          <span className="mb-1 inline-block w-fit rounded-full bg-paper-dim px-2.5 py-0.5 font-mono text-[0.65rem] font-semibold text-muted">
            Integration of the FF
          </span>
          <div className="min-h-0 flex-1">
            <FetchflareStateCanvas variant="original" />
          </div>
        </div>}
        {<div className={`flex min-h-0 flex-col rounded-2xl border border-line bg-white p-3 shadow-sm transition-all duration-700 ease-out ${
          stage >= 4 
            ? "opacity-100 scale-100 pointer-events-auto" 
            : "opacity-0 scale-95 pointer-events-none h-0 overflow-hidden p-0 border-none"
        }`}>
          <span className="mb-1 inline-block w-fit rounded-full bg-gold/15 px-2.5 py-0.5 font-mono text-[0.65rem] font-semibold text-ink">
            Modification of the FF FSM
          </span>
          <div className="min-h-0 flex-1">
            <FetchflareStateCanvas variant="modified" />
          </div>
        </div>}
      </div>)}
    </SlidePage>
  )
}