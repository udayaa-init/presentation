import { SlidePage, SplitLayout, Eyebrow } from '@/deck/Primitives'
import { DataTable } from '@/deck/DataTable'
import { SectionMark } from '@/deck/Decor'


interface ResultsResourceCoreProps {
  stage: number
}

export function ResultsResourceCore({ stage }: ResultsResourceCoreProps) {
  // Exact Sequential Builds
  const showAB = stage >= 1
  const showCD = stage >= 2
  const showEF = stage >= 3
  const showCompTable = stage >= 4
  const applyHighlights = stage >= 5

  // Helper to safely wrap the text string in a colored span without layout shifts
  const highlightCell = (val: string, shouldHighlight: boolean) => {
    if (!shouldHighlight) return val
    // Using explicit span tags with standard Tailwind color for an exact match
    return <span className="font-bold text-amber-500">{val}</span>
  }

  // Main table rows with strict type casting to pass JSX elements safely into DataTable
  const mainRows: any[][] = []
  
  if (showAB) {
    mainRows.push(['A', '9692', '5410', '13'])
    mainRows.push(['B', '7726', '3809', '7'])
  }
  if (showCD) {
    mainRows.push(['C', '9823', '5569', '13'])
    mainRows.push(['D', '7894', '3961', '7'])
  }
  if (showEF) {
    mainRows.push([
      highlightCell('E', applyHighlights),
      highlightCell('10555', applyHighlights),
      highlightCell('6099', applyHighlights),
      highlightCell('13', applyHighlights)
    ])
    mainRows.push(['F', '8085', '4119', '7'])
  }

  // Comparison table matrix
  const compRows: any[][] = [
    ['A vs. C', '1.35%', '2.94%'],
    ['B vs. D', '2.1%', '3.99%'],
    [
      highlightCell('A vs. E', applyHighlights), 
      highlightCell('8.90%', applyHighlights), 
      highlightCell('12.74%', applyHighlights)
    ],
    ['B vs. F', '4.65%', '8.14%'],
  ]

  return (
    <SlidePage>
      <SplitLayout
        eyebrow={<Eyebrow>Results & Evaluation</Eyebrow>}
        title="Results: Resource Utilization"
        ratio="visual-wide"
        visual={
          stage===0? (
                      <SectionMark index="06" label="Results" />
                                        ) :(<div className="flex w-full flex-col gap-8">
            {/* Height locked container prevents component jumps */}
            <div className="min-h-[260px] transition-all duration-200">
              {mainRows.length > 0 && (
                <DataTable
                  columns={['Cfg', 'LUT', 'FF', 'BRAM']}
                  rows={mainRows as unknown as (string | number)[][]}
                />
              )}
            </div>

            {/* Comparison table structural reveal */}
            <div 
              className={`transition-all duration-500 transform ${
                showCompTable 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              <DataTable
                caption="Resource Comparison"
                columns={['vs.', 'LUT', 'FF']}
                dense
                rows={compRows as unknown as (string | number)[][]}
              />
            </div>
          </div>
      )}
      >
        <ConfigLegend currentStage={stage} />
      </SplitLayout>
    </SlidePage>
  )
}

const CONFIGS = [
  { letter: 'A', name: 'Master FPGA config', stageRevealed: 1 },
  { letter: 'B', name: 'Master Small config', stageRevealed: 1 },
  { letter: 'C', name: 'SB + ROB FPGA config', stageRevealed: 2 },
  { letter: 'D', name: 'SB + ROB Small config', stageRevealed: 2 },
  { letter: 'E', name: 'SB+ROB and COR FPGA config', stageRevealed: 3 },
  { letter: 'F', name: 'SB+ROB and COR Small config', stageRevealed: 3 },
]

interface ConfigLegendProps {
  currentStage: number
}

export function ConfigLegend({ currentStage }: ConfigLegendProps) {
  return (
    <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-2.5">
      {CONFIGS.map(({ letter, name, stageRevealed }) => {
        const isRevealed = currentStage >= stageRevealed
        const isHighlighted = currentStage >= 5 && letter === 'E'

        return (
          <div 
            key={letter} 
            className={`flex items-baseline gap-2.5 transition-all duration-300 ${
              isRevealed ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <span 
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[0.65rem] font-semibold text-white transition-colors ${
                isHighlighted ? 'bg-amber-500 text-black font-bold' : 'bg-ink'
              }`}
            >
              {letter}
            </span>
            <span 
              className={`text-[0.86rem] transition-colors ${
                isHighlighted ? 'text-amber-500 font-bold' : 'text-body'
              }`}
            >
              {name}
            </span>
          </div>
        )
      })}
    </div>
  )
}