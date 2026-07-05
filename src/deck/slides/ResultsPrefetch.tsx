import { SlidePage, SplitLayout, Eyebrow } from '@/deck/Primitives'
import { DataTable } from '@/deck/DataTable'
import { StatCard } from '@/deck/StatCard'
import { SectionMark } from '@/deck/Decor'

interface ResultsPrefetchProps {
  stage: number
}

export function ResultsPrefetch({ stage }: ResultsPrefetchProps) {
  const showCacheMiss = stage >= 1
  const showCycles = stage >= 2
  const showTable412 = stage >= 3
  const highlightTable412 = stage >= 4
  const showKeyFinding = stage >= 5
  const showStat183 = stage >= 6

  const hl = (val: string, active: boolean) => {
    if (!active) return val
    return <span className="font-bold text-amber-500">{val}</span>
  }

  // Table 4.12 — Cross Capacity Comparison
  const crossCompRows: any[][] = [
    ['Copy and Scale', '2533', '1911', hl('-24.55%', highlightTable412)],
    ['Vector', '281382', '295900', '+5.18 %'],
    ['Matrix Multiplication', '124948', '114484', hl('-8.37%', highlightTable412)]
  ]

  return (
    <SlidePage>
      <SplitLayout
        eyebrow={<Eyebrow>Results & Evaluation</Eyebrow>}
        title="Results: Data Prefetching Performance"
        ratio="visual-wide"
        visual={
          stage===0? (
                      <SectionMark index="06" label="Results" />
                                        ) :(<div className="flex w-full flex-col gap-6 text-[0.8rem]">
            
            {/* ROW 1: CACHE MISSES */}
            <div className={`transition-all duration-300 ${showCacheMiss ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              <div className="border-b border-ink/10 pb-1 mb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-wider text-muted">
                  Cache Misses Comparison
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                {/* Copy & Scale */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[0.75rem] font-bold text-heading">Copy & Scale</span>
                  <div className="space-y-1.5 text-[0.65rem]">
                    <div>
                      <div className="flex justify-between text-muted mb-0.5"><span>4KB (Base vs  <b className="text-amber-500">FF</b>)</span><span>2563 → <b className="text-amber-500">1911</b> (-25.44%)</span></div>
                      <div className="space-y-0.5"><div className="bg-ink/30 h-1 rounded" style={{ width: '100%' }}></div><div className="bg-amber-500 h-1 rounded" style={{ width: '74.56%' }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-muted mb-0.5"><span>8KB (Base vs <b className="text-amber-500">FF</b>)</span><span>2533 → <b className="text-amber-500">1891</b> (-25.35%)</span></div>
                      <div className="space-y-0.5"><div className="bg-ink/30 h-1 rounded" style={{ width: '98.8%' }}></div><div className="bg-amber-500 h-1 rounded" style={{ width: '74.65%' }}></div></div>
                    </div>
                  </div>
                </div>

                {/* Vector */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[0.75rem] font-bold text-heading">Vector</span>
                  <div className="space-y-1.5 text-[0.65rem]">
                    <div>
                      <div className="flex justify-between text-muted mb-0.5"><span>4KB (Base vs <b className="text-amber-500">FF</b>)</span><span>316k → <b className="text-amber-500">295k</b> (-6.64%)</span></div>
                      <div className="space-y-0.5"><div className="bg-ink/30 h-1 rounded" style={{ width: '100%' }}></div><div className="bg-amber-500 h-1 rounded" style={{ width: '93.36%' }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-muted mb-0.5"><span>8KB (Base vs <b className="text-amber-500">FF</b>)</span><span>281k → <b className="text-amber-500">264k</b> (-6.0%)</span></div>
                      <div className="space-y-0.5"><div className="bg-ink/30 h-1 rounded" style={{ width: '100%' }}></div><div className="bg-amber-500 h-1 rounded" style={{ width: '94%' }}></div></div>
                    </div>
                  </div>
                </div>

                {/* Matrix Mult */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[0.75rem] font-bold text-heading">Matrix Mult</span>
                  <div className="space-y-1.5 text-[0.65rem]">
                    <div>
                      <div className="flex justify-between text-muted mb-0.5"><span>4KB (Base vs <b className="text-amber-500">FF</b>)</span><span>148k → <b className="text-amber-500">114k</b> (-22.82%)</span></div>
                      <div className="space-y-0.5"><div className="bg-ink/30 h-1 rounded" style={{ width: '100%' }}></div><div className="bg-amber-500 h-1 rounded" style={{ width: '77.04%' }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-muted mb-0.5"><span>8KB (Base vs <b className="text-amber-500">FF</b>)</span><span>124k → <b className="text-amber-500">96k</b> (-22.96%)</span></div>
                      <div className="space-y-0.5"><div className="bg-ink/30 h-1 rounded" style={{ width: '100%' }}></div><div className="bg-amber-500 h-1 rounded" style={{ width: '77.18%' }}></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2: EXECUTION CYCLES */}
            <div className={`transition-all duration-300 ${showCycles ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              <div className="border-b border-ink/10 pb-1 mb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-wider text-muted">
                  Execution Cycles Overhead Comparison
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                {/* Copy & Scale Cycles */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[0.75rem] font-bold text-heading">Copy & Scale</span>
                  <div className="space-y-1.5 text-[0.65rem]">
                    <div>
                      <div className="flex justify-between text-muted mb-0.5"><span>4KB (-0.07%)</span><span>1.13M → <b className="text-ink/60">1.13M</b></span></div>
                      <div className="space-y-0.5"><div className="bg-ink/30 h-1 rounded" style={{ width: '100%' }}></div><div className="bg-ink/60 h-1 rounded" style={{ width: '99.93%' }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-muted mb-0.5"><span>8KB (-0.10%)</span><span>1.13M → <b className="text-ink/60">1.13M</b></span></div>
                      <div className="space-y-0.5"><div className="bg-ink/30 h-1 rounded" style={{ width: '100%' }}></div><div className="bg-ink/60 h-1 rounded" style={{ width: '99.90%' }}></div></div>
                    </div>
                  </div>
                </div>

                {/* Vector Cycles */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[0.75rem] font-bold text-heading">Vector</span>
                  <div className="space-y-1.5 text-[0.65rem]">
                    <div>
                      <div className="flex justify-between text-muted mb-0.5"><span>4KB (-0.93%)</span><span>7.39M → <b className="text-ink/60">7.32M</b></span></div>
                      <div className="space-y-0.5"><div className="bg-ink/30 h-1 rounded" style={{ width: '100%' }}></div><div className="bg-ink/60 h-1 rounded" style={{ width: '99.07%' }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-muted mb-0.5"><span>8KB (-0.93%)</span><span>7.12M → <b className="text-ink/60">7.06M</b></span></div>
                      <div className="space-y-0.5"><div className="bg-ink/30 h-1 rounded" style={{ width: '100%' }}></div><div className="bg-ink/60 h-1 rounded" style={{ width: '99.07%' }}></div></div>
                    </div>
                  </div>
                </div>

                {/* Matrix Mult Cycles */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[0.75rem] font-bold text-heading">Matrix Mult</span>
                  <div className="space-y-1.5 text-[0.65rem]">
                    <div>
                      <div className="flex justify-between text-muted mb-0.5"><span>4KB (-2.94%)</span><span>5.90M → <b className="text-ink/60">5.73M</b></span></div>
                      <div className="space-y-0.5"><div className="bg-ink/30 h-1 rounded" style={{ width: '100%' }}></div><div className="bg-ink/60 h-1 rounded" style={{ width: '97.40%' }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-muted mb-0.5"><span>8KB (-2.60%)</span><span>5.72M → <b className="text-ink/60">5.57M</b></span></div>
                      <div className="space-y-0.5"><div className="bg-ink/30 h-1 rounded" style={{ width: '100%' }}></div><div className="bg-ink/60 h-1 rounded" style={{ width: '97.06%' }}></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table 4.12 — Cross Capacity Comparison */}
            <div className={`transition-all duration-500 transform border-t border-ink/10 pt-4 ${showTable412 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
              <div className="flex flex-col gap-0.5">
                <span className="text-[0.7rem] font-bold uppercase tracking-wider text-muted">
                  Baseline 8 KB vs FetchFlare 4 KB Cache Misses
                </span>
                <DataTable
                  columns={['Benchmarks', 'Baseline 8 Kb', 'FetchFlare 4 KB', 'Variation']}
                  dense
                  rows={crossCompRows as unknown as (string | number)[][]}
                />
              </div>
            </div>
          </div>
        )}
      >
        {/* Normal document flow layout box with vertical gaps */}
        <div className="flex flex-col gap-4 mt-6 w-full">
          
          {/* Card 1: Key Finding */}
          <div
            className={`w-full transition-all duration-500 transform ${
              showKeyFinding ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 invisible'
            }`}
          >
            <StatCard
              value=""
              label="Smaller cache sizes with prefetching has smaller cache misses compared to bigger cache and no prefetch"
            />
          </div>

          {/* Card 2: 18.3% Average Improvement */}
          <div
            className={`w-full transition-all duration-500 transform ${
              showStat183 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 invisible'
            }`}
          >
            <StatCard
              value="18.3%"
              label="Average cache miss improvement across all benchmarks"
            />
          </div>
          
        </div>
      </SplitLayout>
    </SlidePage>
  )
}