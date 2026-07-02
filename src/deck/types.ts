import type { ComponentType } from 'react'

/**
 * Every slide can optionally own a sequence of "stages" — e.g. a diagram
 * that builds up step by step. Pressing the forward key/scroll advances the
 * stage first; only once the last stage is reached does navigation move to
 * the next slide. `stageCount` is read once per slide; reorder or extend
 * a diagram's reveal sequence by editing the stage array inside that
 * slide's diagram component — the deck doesn't need to know the content,
 * only how many steps it has.
 */
export interface SlideDefinition {
  id: string
  /** Section this slide belongs to, shown in the progress rail. */
  section: string
  Component: ComponentType<{ stage: number }>
  stageCount?: number
}
