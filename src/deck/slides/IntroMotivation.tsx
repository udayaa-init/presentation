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
            'Modern System-on-Chips (SoCs) optimized across multiple layers with proprietary cross platform optimization techniques and commercial protection',
            'Optimized Open-source platforms seems comparatively limited',
            'Members from OpenHW are seeking to improve Open-source RISC-V CVA6 core and bring it to industrial grade '
          ]}
        />
      </SplitLayout>
    </SlidePage>
  )
}
