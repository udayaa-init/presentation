import { SlidePage, SplitLayout, Eyebrow, BulletList } from '@/deck/Primitives'
import { AnalysisArchitectureCanvas, ANALYSIS_DIAGRAM_STEPS } from '@/deck/diagrams/AnalysisArchitectureCanvas'
import { SectionMark } from '@/deck/Decor'

export const ANALYSIS_STAGE_COUNT = ANALYSIS_DIAGRAM_STEPS

export function Analysis({ stage }: { stage: number }) {
  return (
    <SlidePage>
      <SplitLayout
        eyebrow={<Eyebrow>Analysis</Eyebrow>}
        title="Analysis"
        ratio="visual-wide"
        visual={
          stage === 0 ? (
                      // Shows initially (stage 0)
                      <SectionMark index="03" label="Analysis" />
                    ) : (
          <div className="h-full max-h-[32rem] w-full rounded-2xl border border-line bg-white p-2 shadow-sm">
            <AnalysisArchitectureCanvas stage={stage} />
          </div>
          )}
      >
        {/* We use a flex column to stack the two lists neatly */}
        <div className="flex flex-col">
          
          {/* --- FIRST TWO BULLETS: Fades in at Stage 1 --- */}
          <div 
            className={`transition-all duration-700 ease-out ${
              stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <BulletList
              items={[
                'The Scoreboard (SB) and the Controller are the largest combinational modules on the critical timing path.',
                'A centralized scoreboard thus high routing complexity.',
              ]}
            />
          </div>
          
          {/* --- LAST BULLET: Fades in at Stage 2 --- */}
          <div 
            className={`transition-all duration-700 ease-out ${
              stage ===10 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <BulletList
              items={[
                'Additionally, huge penalty for cache miss penalties (the "Memory Wall") lower core utilization during data-intensive tasks.',
              ]}
            />
          </div>
          
        </div>
      </SplitLayout>
    </SlidePage>
  )
}
