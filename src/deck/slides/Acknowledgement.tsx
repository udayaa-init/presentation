import { SlidePage, SplitLayout, Eyebrow } from '@/deck/Primitives'
import { SectionMark } from '@/deck/Decor'

export function Acknowledgement(_props: { stage: number }) {
  return (
    <SlidePage>
      <SplitLayout
        eyebrow={<Eyebrow>Thank You</Eyebrow>}
        title="Acknowledgement"
        visual={<SectionMark index="✶" label="Thank You" />}
      >
        <div className="mt-7 space-y-2 text-[1.1rem] text-body">
          <p>Angela</p>
          <p>MAX</p>
          <p>Mustafa</p>
        </div>
      </SplitLayout>
    </SlidePage>
  )
}
