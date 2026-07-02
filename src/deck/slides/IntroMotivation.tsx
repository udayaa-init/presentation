import { SlidePage, SplitLayout, Eyebrow, BulletList } from '@/deck/Primitives'
import { SectionMark } from '@/deck/Decor'

export function IntroMotivation(_props: { stage: number }) {
  return (
    <SlidePage>
      <SplitLayout
        eyebrow={<Eyebrow>Introduction</Eyebrow>}
        title="Introduction & Motivation"
        visual={<SectionMark index="00" label="Motivation" />}
      >
        <BulletList
          items={[
            'Modern System-on-Chips (SoCs) require constant optimization across multiple layers to achieve high efficiency.',
            'Hardware vendors continuously innovate to keep up with the demand pace with proprietary cross platform optimization techniques and commercial protection.',
            'the open-source platforms seems comparatively limited. To have the comparative open-source solution, this research leverages the open-source CVA6 CPU core.',
          ]}
        />
      </SplitLayout>
    </SlidePage>
  )
}
