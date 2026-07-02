import { SlidePage, SplitLayout, Eyebrow, DashList } from '@/deck/Primitives'
import { SectionMark } from '@/deck/Decor'

export function Outline(_props: { stage: number }) {
  return (
    <SlidePage>
      <SplitLayout
        eyebrow={<Eyebrow>Agenda</Eyebrow>}
        title="Outline"
        visual={<SectionMark index="01" label="Agenda" />}
      >
        <DashList
          items={[
            'Background: The CVA6 Core',
            'Analysis',
            'Proposed Optimizations',
            'Methodology & Implementation',
            'Results & Evaluation',
            'Conclusion & Future Work',
          ]}
        />
      </SplitLayout>
    </SlidePage>
  )
}
