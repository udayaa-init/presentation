import { SlidePage, SplitLayout, Eyebrow } from '@/deck/Primitives'
import { DataTable } from '@/deck/DataTable'
import { SectionMark } from '@/deck/Decor'

interface ResultsResourcePrefetchProps {
  stage: number
}

export function ResultsResourcePrefetch({ stage }: ResultsResourcePrefetchProps) {
  // Sequential build stages
  const show4KBSection = stage >= 2
  const show4KBCVA6 = stage >= 1
  const show4KBFetchFlare = stage >= 4
  const show8KBBlock = stage >= 5
  const applyHighlights = stage >= 6
  const showStatCard = stage >= 7

  // Helper to cleanly wrap cells in yellow highlight spans without changing table padding/layout
  const highlightCell = (val: string, shouldHighlight: boolean) => {
    if (!shouldHighlight) return val
    return <span className="font-bold text-amber-500">{val}</span>
  }

  // Row visibility wrapper components to isolate rows without changing structural layout size
  const renderRow = (cells: any[], isVisible: boolean) => {
    return cells.map((cell) => (
      <span
        className={`transition-all duration-300 block ${
          isVisible ? 'opacity-100' : 'opacity-0 invisible'
        }`}
      >
        {cell}
      </span>
    ))
  }

  // Static arrays ensure total row height layout allocations never alter or recalculate
  const rows4KB: any[][] = [
    renderRow(['CVA6', '10281', '5959', '13'], show4KBCVA6),
    renderRow([
      highlightCell('FetchFlare', applyHighlights),
      highlightCell('1179', applyHighlights),
      highlightCell('998', applyHighlights),
      highlightCell('2', applyHighlights)
    ], show4KBFetchFlare)
  ]

  const rows8KB: any[][] = [
    renderRow(['CVA6', '10270', '5962', '13'], show8KBBlock),
    renderRow([
      highlightCell('FetchFlare', applyHighlights),
      highlightCell('1146', applyHighlights),
      highlightCell('1096', applyHighlights),
      highlightCell('2', applyHighlights)
    ], show8KBBlock)
  ]

  return (
    <SlidePage>
      <SplitLayout
        eyebrow={<Eyebrow>Results & Evaluation</Eyebrow>}
        title="Resource Utilization: Data Prefetching"
        ratio="visual-wide"
        visual={
          stage===0? (
                      <SectionMark index="06" label="Results" />
                                        ) :(<div className="flex w-full flex-col gap-6">
            
            {/* 4 KB Data Cache Section */}
            <div 
              className={`transition-all duration-500 transform flex flex-col gap-2 ${
                show4KBSection 
                  ? 'opacity-100' 
                  : 'opacity-0 invisible'
              }`}
            >
              <span className="text-[0.9rem] font-semibold text-body">
                Resource Utilization of Data Prefetch at 4 KB Data Cache
              </span>
              <DataTable
                columns={['Configs', 'LUT', 'FF', 'BRAM']}
                rows={rows4KB as unknown as (string | number)[][]}
              />
            </div>

            {/* 8 KB Data Cache Section */}
            <div 
              className={`transition-all duration-500 transform flex flex-col gap-2 ${
                show8KBBlock 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4 invisible'
              }`}
            >
              <span className="text-[0.9rem] font-semibold text-body">
                Resource Utilization of Data Prefetch at 8 KB Data Cache
              </span>
              <DataTable
                columns={['Configs', 'LUT', 'FF', 'BRAM']}
                rows={rows8KB as unknown as (string | number)[][]}
              />
            </div>
          </div>
  )}
      >
        <div className="flex flex-col gap-5">
          <ConfigLegend currentStage={stage} />
          
          {/* Final Summary Stat Card - Appears after highlights */}
          <div 
            className={`transition-all duration-500 transform border-l-2 border-amber-500 bg-amber-500/5 p-4 rounded-r-lg ${
              showStatCard 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-2 invisible pointer-events-none'
            }`}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-500 font-mono">11%</span>
              <span className="text-[0.8rem] font-bold uppercase tracking-wider text-muted">LUT Overhead</span>
            </div>
            <p className="mt-1.5 text-[0.82rem] leading-normal text-body">
              FetchFlare resource overhead remains nearly constant despite cache capacity scaling.
            </p>
          </div>
        </div>
      </SplitLayout>
    </SlidePage>
  )
}

const PARAMETERS = [
  { key: 'core', title: 'CVA6 Core Configuration', desc: 'C-extension, 8 KB I-Cache, 128-bit line width, 2-way set associative I/D caches, perf counters active.', stageRevealed: 1 },
  { key: 'pf', title: 'FetchFlare Configuration', desc: '8 Reference Prediction Table (RPT) entries and a 16-depth FIFO structure.', stageRevealed: 3 },
]

interface ConfigLegendProps {
  currentStage: number
}

export function ConfigLegend({ currentStage }: ConfigLegendProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3.5">
        {PARAMETERS.map(({ key, title, desc, stageRevealed }) => {
          const isRevealed = currentStage >= stageRevealed
          const isHighlighted = currentStage >= 6 && key === 'pf'

          return (
            <div 
              key={key} 
              className={`flex flex-col gap-1 rounded-lg border border-ink/10 bg-ink/5 p-3 transition-all duration-300 ${
                isRevealed ? 'opacity-100' : 'opacity-0 invisible pointer-events-none'
              } ${isHighlighted ? 'border-amber-500/30 bg-amber-500/5' : ''}`}
            >
              <span 
                className={`text-[0.85rem] font-bold transition-colors ${
                  isHighlighted ? 'text-amber-500' : 'text-heading'
                }`}
              >
                {title}
              </span>
              <span className="text-[0.8rem] leading-normal text-body">
                {desc}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}