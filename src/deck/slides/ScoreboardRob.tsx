import { SlidePage, SplitLayout, Eyebrow } from '@/deck/Primitives'
import {
  ScoreboardRobArchitectureCanvas,
  SCOREBOARD_ROB_DIAGRAM_STEPS,
} from '@/deck/diagrams/ScoreboardRobArchitectureCanvas'
import { DataTable } from '@/deck/DataTable'
import { SectionMark } from '@/deck/Decor'

export const SCOREBOARD_ROB_STAGE_COUNT = SCOREBOARD_ROB_DIAGRAM_STEPS

export function ScoreboardRob({ stage }: { stage: number }) {
  return (
    <SlidePage>
      <SplitLayout
        eyebrow={<Eyebrow>Proposed Optimizations</Eyebrow>}
        title="Microarchitecture Optimization: Scoreboard & ROB"
        ratio="balanced"
        visual={
          stage === 0 ? (
                          // Shows initially (stage 0)
                          <SectionMark index="4.1" label="Goals" />
                        ) : (<div className="h-full max-h-[32rem] w-full rounded-2xl border border-line bg-white p-2 shadow-sm">
            <ScoreboardRobArchitectureCanvas stage={stage} />
          </div>
          )}
      >
        <div className={`mt-6 space-y-2 font-mono text-[0.92rem] text-ink-soft transition-all duration-700 ease-out ${
          (stage >= 1)  ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}>
          <p>– Distribution of responsibilities</p>
           {stage>=10 &&<p>– Introduction of new mem struct</p>}
        </div>
        <DataTable
          className={`mt-6 text-ink-soft transition-all duration-700 ease-out ${
          (stage >= 10)  ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-4 pointer-events-none -z-10'
          }`}
          dense
          textCols={[1]}
          columns={['Field', 'Meaning']}
          rows={[
            ['issued', 'instruction is issued'],
            ['canceled', 'instruction is canceled due to speculative scoreboard'],
            ['forwardable', 'result can be forwardable'],
            ['rd', 'register destination address'],
            ['result', 'result of the instruction'],
            ['result_valid', 'validity of result'],
            ['is_rd_fpr_flag', 'if rd is floating point register'],
          ]}
        />
      </SplitLayout>
    </SlidePage>
  )
}
