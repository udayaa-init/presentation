import { SlidePage, SplitLayout, Eyebrow, DashList } from '@/deck/Primitives'
import { SectionMark } from '@/deck/Decor'

export function Outline({stage}: { stage: number }) {
  const agendaItems = [
    'Background: The CVA6 Core',
    'Analysis',
    'Proposed Optimizations',
    'Methodology & Implementation',
    'Results & Evaluation',
    'Conclusion & Future Work',
  ]
  return (
    <SlidePage>
      {/* Dynamic runtime CSS block to target the DashList containers directly */}
      <style>{`
        .agenda-list > * {
          transition: all 500ms ease-out;
        }
        .agenda-list > *:nth-child(n+${stage + 1}) {
          opacity: 0 !important;
          transform: translateY(6px) !important;
          pointer-events: none !important;
        }
      `}</style>
      <SplitLayout
        eyebrow={<Eyebrow>Agenda</Eyebrow>}
        title="Outline"
        visual={<SectionMark index="01" label="Agenda" />}
      >
        <DashList
          className="agenda-list max-w-3xl"
          items={agendaItems}
        />
      </SplitLayout>
    </SlidePage>
  )
}
