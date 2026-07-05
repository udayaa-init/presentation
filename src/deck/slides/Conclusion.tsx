import { SlidePage, SplitLayout, Eyebrow } from '@/deck/Primitives'
import { StatCard, StatStack } from '@/deck/StatCard'
import { SectionMark } from '@/deck/Decor'

export function Conclusion({ stage }: { stage: number }) {
  return (
    <SlidePage>
      <SplitLayout
        eyebrow={<Eyebrow>Conclusion</Eyebrow>}
        title="Conclusion & Future Prospects"
        ratio="balanced"
        visual={
          <div className="relative w-full">
            {/* 1. SectionMark - Fades out and slides up when stage hits 3 */}
            <div 
              className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out transform ${
                stage < 3 
                  ? 'opacity-100 scale-100 pointer-events-auto' 
                  : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
              }`}
            >
              <SectionMark index="07" label="Conclusion" />
            </div>

            {/* 2. StatStack - Fades and slides in from below at stage 3 */}
            <div 
              className={`w-full transition-all duration-700 ease-out transform ${
                stage >= 3 
                  ? 'opacity-100 translate-y-0 pointer-events-auto' 
                  : 'opacity-0 translate-y-4 pointer-events-none absolute inset-0 invisible'
              }`}
            >
              <StatStack>
                {[
                  { value: "+14%", label: "Increase in max frequency from SB and Controller optimization", targetStage: 3 },
                  { value: "+13%", label: "Increase in CoreMark performance", targetStage: 4 },
                  { value: "18.3%", label: "Average cache miss improvement from the data prefetcher", targetStage: 6 },
                ].map(({ value, label, targetStage }, index) => (
                  <div
                    key={index}
                    className={`w-full transition-all duration-700 ease-out transform ${
                      stage >= targetStage
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 -translate-y-4 invisible pointer-events-none'
                    }`}
                  >
                    <StatCard value={value} label={label} />
                  </div>
                ))}
              </StatStack>
            </div>
          </div>
        }
      >
        <ul className="mt-7 space-y-3.5 text-[1.02rem] leading-relaxed text-body relative">
          {[
            {
              targetStage: 1,
              content: (
                <li className="flex gap-3">
                  <span className="mt-[0.15em] font-mono text-gold">–</span>
                  <span className="w-full">
                    <strong>Contribution</strong>:
                    <span 
                      className={`transition-[opacity,filter] duration-700 ease-out inline pl-1 ${
                        stage >= 2 
                          ? 'opacity-100' 
                          : 'opacity-0 pointer-events-none select-none'
                      }`}
                    >
                      Reorder buffer and Controller as FSM implementation
                    </span>
                  </span>
                </li>
              )
            },
            {
              targetStage: 5,
              content: (
                <li className="flex gap-3">
                  <span className="mt-[0.15em] font-mono text-gold">–</span>
                  <span>Data prefetcher integration to the core.</span>
                </li>
              )
            },
            {
              targetStage: 7,
              content: (
                <li className="flex gap-3">
                  <span className="mt-[0.15em] font-mono text-gold">–</span>
                  <span className="w-full">
                    <strong>Future</strong>:
                    <span 
                      className={`transition-[opacity,filter] duration-700 ease-out inline pl-1 ${
                        stage >= 8
                          ? 'opacity-100' 
                          : 'opacity-0 pointer-events-none select-none'
                      }`}
                    >
                      the full advantage of the optimization needs to be evaluated on an ASIC design.
                    </span>
                  </span>
                </li>
              )
            },
            {
              targetStage: 9,
              content: (
                <li className="flex gap-3">
                  <span className="mt-[0.15em] font-mono text-gold">–</span>
                  <span>Some optimizations, but not complete, can be listed as</span>
                </li>
              )
            }
          ].map(({ targetStage, content }, index) => (
            <div
              key={`main-${index}`}
              className={`transition-all duration-700 ease-out transform ${
                stage >= targetStage
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-2 invisible pointer-events-none'
              }`}
            >
              {content}
            </div>
          ))}

          {/* Nested Sub-list Container - Mounts at Stage 10 */}
          <div
            className={`transition-all duration-700 ease-out transform mt-3.5 ${
              stage >= 10
                ? 'opacity-100'
                : 'opacity-0 invisible pointer-events-none'
            }`}
          >
            <ul className="ml-6 space-y-2.5 border-l border-line pl-4">
              {[
                { text: 'Out-of-order issue of the instruction.', target: 11 },
                { text: 'Extending with more parallel functional units on the execution stage with an available write-back port arbitrating with FIFO.', target: 12 },
                { text: 'Load-store forwarding', target: 13 },
                { text: 'Multi-level cache', target: 14 }
              ].map(({ text, target }, subIndex) => (
                <div
                  key={`sub-${subIndex}`}
                  className={`transition-all duration-500 ease-out transform ${
                    stage >= target
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-2 invisible pointer-events-none'
                  }`}
                >
                  <li className="flex gap-2.5 text-[0.95rem] text-body py-0.5">
                    <span className="mt-[0.2em] font-mono text-muted">–</span>
                    <span>{text}</span>
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </ul>
      </SplitLayout>
    </SlidePage>
  )
}