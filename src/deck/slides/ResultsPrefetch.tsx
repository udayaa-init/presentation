import { SlidePage, SplitLayout, Eyebrow } from '@/deck/Primitives'
import { StatCard, StatStack } from '@/deck/StatCard'

export function ResultsPrefetch(_props: { stage: number }) {
  return (
    <SlidePage>
      <SplitLayout
        eyebrow={<Eyebrow>Results & Evaluation</Eyebrow>}
        title="Results: Data Prefetching Performance"
        visual={
          <StatStack>
            <StatCard
              value="18.3%"
              label="Average cache miss improvement from the data prefetcher across various benchmarks"
            />
          </StatStack>
        }
      >
        <p className="mt-7 max-w-md text-[1.02rem] leading-relaxed text-body">
          data prefetcher improved the cache miss by an average of 18.3% across various
          benchmarks.
        </p>
      </SplitLayout>
    </SlidePage>
  )
}
