import { SlidePage, SplitLayout, Eyebrow } from '@/deck/Primitives'
import { CVA6ArchitectureCanvas, CVA6_DIAGRAM_STEPS } from '@/deck/diagrams/CVA6ArchitectureCanvas'

export const BACKGROUND_STAGE_COUNT = CVA6_DIAGRAM_STEPS

export function Background({ stage }: { stage: number }) {
  return (
    <SlidePage>
      <SplitLayout
        eyebrow={<Eyebrow>Background</Eyebrow>}
        title="Background: The CVA6 Core"
        ratio="visual-wide"
        visual={
          <div className="h-full max-h-[30rem] w-full rounded-2xl border border-line bg-white p-2 shadow-sm">
            <CVA6ArchitectureCanvas stage={stage} />
          </div>
        }
      >
        <ul className="mt-6 space-y-3 text-[0.96rem] leading-relaxed text-body">
          <li className="flex gap-3">
            <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
            <span>
              Highly Configurable 32/64 bit RISC-V application core: CV32A6 and CV64A6
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
            <span>Initiated from ETH Zurich, now curated by OpenHW</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
            <span>Supports various RISCV modular extension (I, M, F, A, C)</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
            <span>6-Pipeline stage:</span>
          </li>
          <ul className="ml-6 grid grid-cols-2 gap-x-4 gap-y-1.5 border-l border-line pl-4 text-[0.88rem] text-muted">
            <li>○ PC generation</li>
            <li>○ Frontend</li>
            <li>○ Decode (various extension decoders)</li>
            <li>○ Issue stage (SB and IRO)</li>
            <li>○ Ex stage (ALU, LSU, FPU, …)</li>
            <li>○ Commit</li>
          </ul>
          <li className="flex gap-3 pt-1">
            <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
            <span>HPD cache in the CVA6, is a non-blocking cache (hit under miss)</span>
          </li>
        </ul>
      </SplitLayout>
    </SlidePage>
  )
}
