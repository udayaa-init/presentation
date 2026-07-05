import { SlidePage, SplitLayout, Eyebrow } from '@/deck/Primitives'
import { DataTable } from '@/deck/DataTable'
import { SectionMark } from '@/deck/Decor'

interface ResultsTimingProps {
  stage: number
}

export function ResultsTiming({ stage }: ResultsTimingProps) {
  // Exact Sequential Builds
  const showAB = stage >= 1
  const showCD = stage >= 2
  const showEF = stage >= 3
  const showCompTable = stage >= 4
  const applyHighlights = stage >= 5

  // Helper to safely wrap text inside cells in a clean color span without layout shifting
  const highlightCell = (val: string, shouldHighlight: boolean) => {
    if (!shouldHighlight) return val
    return <span className="font-bold text-amber-500">{val}</span>
  }

  // Build main timing rows progressively
  const mainRows: any[][] = []

  if (showAB) {
    mainRows.push(['A', '130', '-1.215', '112.267', '3880'])
    mainRows.push(['B', '140', '-0.242', '135.412', '113'])
  }
  if (showCD) {
    mainRows.push(['C', '130', '-0.5958', '120.666', '1205'])
    mainRows.push(['D', '140', '-0.461', '131.512', '170'])
  }
  if (showEF) {
    mainRows.push([
      highlightCell('E', applyHighlights),
      highlightCell('130', applyHighlights),
      highlightCell('-0.092', applyHighlights),
      highlightCell('128.763', applyHighlights),
      highlightCell('29', applyHighlights)
    ])
    mainRows.push(['F', '140', '-0.203', '136.131', '7'])
  }

  // Progressive comparison rows (matching provided visual data)
  const compRows: any[][] = [
    ['A vs. C', '7.48%', '-68.94%'],
    ['B vs. D', '-2.88%', '50.44%'],
    [
      highlightCell('A vs. E', applyHighlights),
      highlightCell('14.43%', applyHighlights),
      highlightCell('-97.59%', applyHighlights)
    ],
    ['B vs. F', '0.53%', '-95.88%'],
  ]

  return (
    <SlidePage>
      <SplitLayout
        eyebrow={<Eyebrow>Results & Evaluation</Eyebrow>}
        title="Results: Timing & Frequency Analysis"
        ratio="visual-wide"
        visual={
          stage===0? (
                     <SectionMark index="06" label="Results" />
                              ) :(<div className="flex w-full flex-col gap-8">
            {/* Height locked container prevents layout components from leaping during builds */}
            <div className="min-h-[260px] transition-all duration-200">
              {mainRows.length > 0 && (
                <DataTable
                  columns={['Cfg', 'Synth. Freq (MHz)', 'WNS (ns)', 'Max Freq (MHz)', 'Failing Endpoints']}
                  highlightCols={[3]}
                  rows={mainRows as unknown as (string | number)[][]}
                />
              )}
            </div>

            {/* Timing comparison table slide-in transition */}
            <div 
              className={`transition-all duration-500 transform ${
                showCompTable 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              <DataTable
                caption="Timing Comparison"
                columns={['vs.', 'Max Freq', 'Failing End Points']}
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
