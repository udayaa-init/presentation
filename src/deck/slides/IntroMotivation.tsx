import { SlidePage, SplitLayout, Eyebrow, BulletList } from '@/deck/Primitives'
import { SectionMark } from '@/deck/Decor'

export function IntroMotivation({stage}: { stage: number }) {
  return (
    <SlidePage>
      <style>{`
  .bullet-reveal-list > * {
    transition: all 500ms ease-out;
  }
  .bullet-reveal-list > *:nth-child(n+${stage + 1}) {
    opacity: 0 !important;
    transform: translateY(6px) !important;
    pointer-events: none !important;
  }
`}</style>
      <SplitLayout
        eyebrow={<Eyebrow>Introduction</Eyebrow>}
        title="Introduction & Motivation"
        visual={<SectionMark index="00" label="Motivation" />}
      >
        <BulletList
        className="bullet-reveal-list max-w-3xl"
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
