import { SlidePage, SplitLayout, Eyebrow } from '@/deck/Primitives'
import { ControllerFsmCanvas, CONTROLLER_FSM_STEPS } from '@/deck/diagrams/ControllerFsmCanvas'

export const CONTROLLER_FSM_STAGE_COUNT = CONTROLLER_FSM_STEPS

export function ControllerFsm({ stage }: { stage: number }) {
  return (
    <SlidePage>
      <SplitLayout
        eyebrow={<Eyebrow>Proposed Optimizations</Eyebrow>}
        title="Microarchitecture Optimization: Controller FSM"
        ratio="visual-wide"
        visual={
          <div className="h-full max-h-[32rem] w-full rounded-2xl border border-line bg-white p-2 shadow-sm">
            <ControllerFsmCanvas stage={stage} />
          </div>
        }
      >
        <p className="mt-7 text-[1.04rem] leading-relaxed text-body">
          – Controller as FSM, state dependent outputs (Moore FSM) -&gt; breaking long paths
        </p>
      </SplitLayout>
    </SlidePage>
  )
}
