import { SlidePage, SplitLayout, Eyebrow, BulletList } from '@/deck/Primitives'
import { AnalysisArchitectureCanvas, ANALYSIS_DIAGRAM_STEPS } from '@/deck/diagrams/AnalysisArchitectureCanvas'

export const ANALYSIS_STAGE_COUNT = ANALYSIS_DIAGRAM_STEPS

export function Analysis({ stage }: { stage: number }) {
  return (
    <SlidePage>
      <SplitLayout
        eyebrow={<Eyebrow>Analysis</Eyebrow>}
        title="Analysis"
        ratio="visual-wide"
        visual={
          <div className="h-full max-h-[32rem] w-full rounded-2xl border border-line bg-white p-2 shadow-sm">
            <AnalysisArchitectureCanvas stage={stage} />
          </div>
        }
      >
        <BulletList
          items={[
            'The Scoreboard (SB) and the Controller are the largest combinational modules on the critical timing path.',
            'A centralized scoreboard thus high routing complexity.',
            'Additionally, huge penalty for cache miss penalties (the "Memory Wall") lower core utilization during data-intensive tasks.',
          ]}
        />
      </SplitLayout>
    </SlidePage>
  )
}
