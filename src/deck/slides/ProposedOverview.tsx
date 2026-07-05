import { SlidePage, SplitLayout, Eyebrow, BulletList } from '@/deck/Primitives'
import { SectionMark } from '@/deck/Decor'

export function ProposedOverview({stage}: { stage: number }) {
  return (
    <SlidePage>
      <SplitLayout
        eyebrow={<Eyebrow>Proposed Optimizations</Eyebrow>}
        title="Proposed Optimization Overview"
        visual={<SectionMark index="04" label="Optimization" />}
      >
        {/* <BulletList
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
        /> */}

        <div className="flex flex-col">
          
          {/* --- FIRST TWO BULLETS: Fades in at Stage 1 --- */}
          <div 
            className={`transition-all duration-700 ease-out ${
              stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <BulletList
              items={[
                <>
                <span className="font-semibold text-ink">Goal 1</span>: Significantly improve the
              processor's capability to operate at higher frequencies.
              </>
              ]}
            />
          </div>
          
          {/* --- LAST BULLET: Fades in at Stage 2 --- */}
          <div 
            className={`transition-all duration-700 ease-out ${
              stage ===2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <BulletList
              items={[
                <>
              <span className="font-semibold text-ink">Goal 2</span>: Enhance per-cycle
              performance by hiding the memory latency.
            </>
              ]}
            />
          </div>
          
        </div>

      </SplitLayout>
    </SlidePage>
  )
}
