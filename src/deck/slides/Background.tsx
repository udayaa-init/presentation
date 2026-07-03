import { SlidePage, SplitLayout, Eyebrow } from '@/deck/Primitives'
import { CVA6ArchitectureCanvas, CVA6_DIAGRAM_STEPS } from '@/deck/diagrams/CVA6ArchitectureCanvas'
import { SectionMark } from '@/deck/Decor'
export const BACKGROUND_STAGE_COUNT = CVA6_DIAGRAM_STEPS

export function Background({ stage }: { stage: number }) {
  return (
    <SlidePage>
      <style>{`
        .cva6-features-list > * {
          transition: all 500ms ease-out;
        }
        .cva6-features-list > *:nth-child(n+${stage + 1}) {
          opacity: 0 !important;
          transform: translateY(6px) !important;
          pointer-events: none !important;
        }
      `}</style>
      <style>{`
        .slide-reveal-item {
          transition: all 500ms ease-out;
        }
      `}</style>
      <SplitLayout
        eyebrow={<Eyebrow>Background</Eyebrow>}
        title="Background: The CVA6 Core"
        ratio="visual-wide"
        visual={
          stage <4 ? (
            // Shows initially (stage 0)
            <SectionMark index="02" label="Background" />
          ) : (
          <div className="h-full max-h-[30rem] w-full rounded-2xl border border-line bg-white p-2 shadow-sm">
            <CVA6ArchitectureCanvas stage={stage-4} />
          </div>
          )}
      >
        <ul className="cva6-features-list mt-6 space-y-3 text-[0.96rem] leading-relaxed text-body">
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
          <ul className={`grid grid-cols-2 gap-x-4 gap-y-1.5 border-l border-line pl-4 text-[0.88rem] text-muted ${
            stage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}>
            <li className={`slide-reveal-item ${stage >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>○ PC generation</li>
            <li className={`slide-reveal-item ${stage >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>○ Frontend</li>
            <li className={`slide-reveal-item ${stage >= 7 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>○ Decode (various extension decoders)</li>
            <li className={`slide-reveal-item ${stage >= 8 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>○ Issue stage (SB and IRO)</li>
            <li className={`slide-reveal-item ${stage >= 9 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>○ Ex stage (ALU, LSU, FPU, …)</li>
            <li className={`slide-reveal-item ${stage >= 10 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>○ Commit</li>
          </ul>
          <li className={`slide-reveal-item flex gap-3 pt-1 ${
            stage >= 14 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}>
            <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
            <span>HPD cache in the CVA6, is a non-blocking cache (hit under miss)</span>
          </li>
        </ul>
      </SplitLayout>
    </SlidePage>
  )
}
