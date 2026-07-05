import { SlidePage, SplitLayout, Eyebrow } from '@/deck/Primitives'
import { ControllerFsmCanvas, CONTROLLER_FSM_STEPS } from '@/deck/diagrams/ControllerFsmCanvas'
import { SectionMark } from '@/deck/Decor'
export const CONTROLLER_FSM_STAGE_COUNT = CONTROLLER_FSM_STEPS

export function ControllerFsm({ stage }: { stage: number }) {
  return (
    <SlidePage>
      <SplitLayout
        eyebrow={<Eyebrow>Proposed Optimizations</Eyebrow>}
        title="Microarchitecture Optimization: Controller FSM"
        ratio="visual-wide"
        visual={
          stage === 0 ? (
            <SectionMark index="04" label="Optimization" />
          ) : (
            <div className="h-full max-h-[32rem] w-full rounded-2xl border border-line bg-white p-2 shadow-sm">
              <ControllerFsmCanvas stage={stage} />
            </div>
          )
        }
      >
        <div className={`relative mt-6 font-mono text-[0.92rem] text-ink-soft transition-all duration-700 ease-out ${
          stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-0 pointer-events-none'
        }`}>
          <p className="mt-7 text-[1.04rem] leading-relaxed text-body">
            – Controller as Moore FSM
          </p>
          <p className={`absolute left-0 top-full mt-2 w-full transition-all duration-700 ease-out ${
            stage >= 12 
              ? 'opacity-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 translate-y-2 pointer-events-none'
          }`}>
            – state dependent outputs -&gt; breaking long paths
          </p>
        </div>

      </SplitLayout>
    </SlidePage>
  )
}
