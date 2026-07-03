import { SlidePage, Eyebrow, SlideTitle, DashList } from '@/deck/Primitives'
import { FetchflareStateCanvas } from '@/deck/diagrams/FetchflareStateCanvas'

export function Fetchflare(_props: { stage: number }) {
  return (
    <SlidePage className="flex flex-col">
      <Eyebrow>Proposed Optimizations</Eyebrow>
      <SlideTitle>Data Prefetching: Fetchflare Integration</SlideTitle>
      <DashList
        className="mt-4 max-w-3xl"
        items={[
          'Hiding memory latency by overlapping computation with memory access by speculatively accessing the data',
          'Integration of the FF — Modification of the FF FSM',
        ]}
      />

      <div className="mt-0 grid min-h-0 flex-1 grid-cols-2 gap-6">
        <div className="flex min-h-0 flex-col rounded-2xl border border-line bg-white p-3 shadow-sm">
          <span className="mb-1 inline-block w-fit rounded-full bg-paper-dim px-2.5 py-0.5 font-mono text-[0.65rem] font-semibold text-muted">
            Integration of the FF
          </span>
          <div className="min-h-0 flex-1">
            <FetchflareStateCanvas variant="original" />
          </div>
        </div>
        <div className="flex min-h-0 flex-col rounded-2xl border border-line bg-white p-3 shadow-sm">
          <span className="mb-1 inline-block w-fit rounded-full bg-gold/15 px-2.5 py-0.5 font-mono text-[0.65rem] font-semibold text-ink">
            Modification of the FF FSM
          </span>
          <div className="min-h-0 flex-1">
            <FetchflareStateCanvas variant="modified" />
          </div>
        </div>
      </div>
    </SlidePage>
  )
}