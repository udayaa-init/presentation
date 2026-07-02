import { SlidePage, SplitLayout, Eyebrow, BulletList } from '@/deck/Primitives'
import { SectionMark } from '@/deck/Decor'

export function ProposedOverview(_props: { stage: number }) {
  return (
    <SlidePage>
      <SplitLayout
        eyebrow={<Eyebrow>Proposed Optimizations</Eyebrow>}
        title="Proposed Optimization Overview"
        visual={<SectionMark index="02" label="Goals" />}
      >
        <BulletList
          items={[
            <>
              <span className="font-semibold text-ink">Goal 1</span>: Significantly improve the
              processor's capability to operate at higher frequencies.
            </>,
            <>
              <span className="font-semibold text-ink">Goal 2</span>: Enhance per-cycle
              performance by hiding the memory latency.
            </>,
          ]}
        />
      </SplitLayout>
    </SlidePage>
  )
}
