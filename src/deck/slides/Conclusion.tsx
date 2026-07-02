import { SlidePage, SplitLayout, Eyebrow } from '@/deck/Primitives'
import { StatCard, StatStack } from '@/deck/StatCard'

export function Conclusion(_props: { stage: number }) {
  return (
    <SlidePage>
      <SplitLayout
        eyebrow={<Eyebrow>Conclusion</Eyebrow>}
        title="Conclusion & Future Prospects"
        ratio="balanced"
        visual={
          <StatStack>
            <StatCard value="+14%" label="Increase in max frequency from SB and Controller optimization" />
            <StatCard value="+13%" label="Increase in CoreMark performance" />
            <StatCard value="18.3%" label="Average cache miss improvement from the data prefetcher" />
          </StatStack>
        }
      >
        <ul className="mt-7 space-y-3.5 text-[1.02rem] leading-relaxed text-body">
          <li className="flex gap-3">
            <span className="mt-[0.15em] font-mono text-gold">–</span>
            <span>
              Contribution: SB and Controller Opt brought 14% increase in the max frequency and a
              13% increase in Coremark performance.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-[0.15em] font-mono text-gold">–</span>
            <span>
              Data prefetcher improved the cache miss by an average of 18.3% across various
              benchmarks.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-[0.15em] font-mono text-gold">–</span>
            <span>
              Future: the full advantage of the optimization needs to be evaluated on an ASIC
              design.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-[0.15em] font-mono text-gold">–</span>
            <span>Some optimizations, but not complete, can be listed as</span>
          </li>
          <ul className="ml-6 space-y-2.5 border-l border-line pl-4">
            <li className="flex gap-2.5 text-[0.95rem] text-body">
              <span className="mt-[0.2em] font-mono text-muted">–</span>
              <span>Out-of-order issue of the instruction.</span>
            </li>
            <li className="flex gap-2.5 text-[0.95rem] text-body">
              <span className="mt-[0.2em] font-mono text-muted">–</span>
              <span>
                Extending with more parallel functional units on the execution stage with an
                available write-back port arbitrating with FIFO.
              </span>
            </li>
            <li className="flex gap-2.5 text-[0.95rem] text-body">
              <span className="mt-[0.2em] font-mono text-muted">–</span>
              <span>Load-store forwarding</span>
            </li>
            <li className="flex gap-2.5 text-[0.95rem] text-body">
              <span className="mt-[0.2em] font-mono text-muted">–</span>
              <span>Multi-level cache</span>
            </li>
          </ul>
        </ul>
      </SplitLayout>
    </SlidePage>
  )
}
