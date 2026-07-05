import { SlidePage, SplitLayout, Eyebrow } from '@/deck/Primitives'
import { DataTable } from '@/deck/DataTable'
import { SectionMark } from '@/deck/Decor'

interface ResultsPerformanceProps {
  stage: number
}

export function ResultsPerformance({ stage }: ResultsPerformanceProps) {
  // Sequential build stages
  const showAB = stage >= 1
  const showCD = stage >= 2
  const showEF = stage >= 3
  const showCompTable = stage >= 4
  const applyHighlights = stage >= 5

  // Helper to cleanly wrap cells in yellow highlight spans without changing table padding/layout
  const highlightCell = (val: string, shouldHighlight: boolean) => {
    if (!shouldHighlight) return val
    return <span className="font-bold text-amber-500">{val}</span>
  }

  // Build main performance rows progressively
  const mainRows: any[][] = []

  if (showAB) {
    mainRows.push(['A', '112.267', '2.64', '296.385', '1747.03'])
    mainRows.push(['B', '135.412', '2.64', '357.488', '1735.20'])
  }
  if (showCD) {
    mainRows.push(['C', '120.666', '2.64', '318.559', '1747.03'])
    mainRows.push(['D', '131.512', '2.64', '347.192', '1735.20'])
  }
  if (showEF) {
    mainRows.push([
      highlightCell('E', applyHighlights),
      highlightCell('128.763', applyHighlights),
      highlightCell('2.61', applyHighlights),
      highlightCell('335.289', applyHighlights),
      highlightCell('1740.03', applyHighlights)
    ])
    mainRows.push(['F', '136.131', '2.61', '355.302', '1724.61'])
  }

  // Comparison rows derived from image_3a0a3c.png (Dhrystone column omitted)
  const compRows: any[][] = [
    ['A vs. C', '7.48 %', '7.48 %'],
    ['B vs. D', '-2.88 %',  '-2.88 %'],
    [
      highlightCell('A vs. E', applyHighlights),
      highlightCell('14.43 %', applyHighlights),
      highlightCell('13.13 %', applyHighlights)
    ],
    ['B vs. F', '0.53 %',  '-0.61 %'],
  ]

  return (
    <SlidePage>
      <SplitLayout
        eyebrow={<Eyebrow>Results & Evaluation</Eyebrow>}
        title="Results: Core Performance"
        ratio="visual-wide"
        visual={
          stage===0? (
                      <SectionMark index="06" label="Results" />
                                        ) :(<div className="flex w-full flex-col gap-6">
            {/* Main Performance Table Section */}
            <div className="min-h-[260px] transition-all duration-200">
              {mainRows.length > 0 && (
                <DataTable
                  columns={['Cfg', 'Max Freq (MHz)', 'CoreMark/MHz', 'CoreMark', 'Dhrystone/MHz']}
                  rows={mainRows as unknown as (string | number)[][]}
                />
              )}
            </div>

            {/* Performance Comparison Table (from image_3a0a3c.png) */}
            <div 
              className={`transition-all duration-500 transform ${
                showCompTable 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              <DataTable
                caption="Performance Comparison"
                columns={['vs.', 'Max Freq', 'CoreMark']}
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