import { useCallback, useEffect, useRef, useState } from 'react'
import type { SlideDefinition } from './types'

interface DeckState {
  slideIndex: number
  stage: number
}

const WHEEL_COOLDOWN_MS = 650
const WHEEL_THRESHOLD = 28
const TOUCH_THRESHOLD = 60

export function useDeck(slides: SlideDefinition[]) {
  const [state, setState] = useState<DeckState>({ slideIndex: 0, stage: 0 })
  const lastWheelAt = useRef(0)
  const touchStartY = useRef<number | null>(null)

  const stageCountOf = useCallback(
    (slideIndex: number) => slides[slideIndex]?.stageCount ?? 1,
    [slides],
  )

  const goNext = useCallback(() => {
    setState((s) => {
      const stages = stageCountOf(s.slideIndex)
      if (s.stage < stages - 1) return { ...s, stage: s.stage + 1 }
      if (s.slideIndex < slides.length - 1) return { slideIndex: s.slideIndex + 1, stage: 0 }
      return s
    })
  }, [slides.length, stageCountOf])

  const goPrev = useCallback(() => {
    setState((s) => {
      if (s.stage > 0) return { ...s, stage: s.stage - 1 }
      if (s.slideIndex > 0) {
        const prevStages = stageCountOf(s.slideIndex - 1)
        return { slideIndex: s.slideIndex - 1, stage: prevStages - 1 }
      }
      return s
    })
  }, [stageCountOf])

  const goTo = useCallback((slideIndex: number) => {
    setState({ slideIndex, stage: 0 })
  }, [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          e.preventDefault()
          goNext()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault()
          goPrev()
          break
        case 'Home':
          e.preventDefault()
          goTo(0)
          break
        case 'End':
          e.preventDefault()
          goTo(slides.length - 1)
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goNext, goPrev, goTo, slides.length])

  useEffect(() => {
    function onWheel(e: WheelEvent) {
      const now = Date.now()
      if (now - lastWheelAt.current < WHEEL_COOLDOWN_MS) return
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return
      lastWheelAt.current = now
      if (e.deltaY > 0) goNext()
      else goPrev()
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [goNext, goPrev])

  useEffect(() => {
    function onTouchStart(e: TouchEvent) {
      touchStartY.current = e.touches[0]?.clientY ?? null
    }
    function onTouchEnd(e: TouchEvent) {
      if (touchStartY.current === null) return
      const endY = e.changedTouches[0]?.clientY ?? touchStartY.current
      const delta = touchStartY.current - endY
      if (Math.abs(delta) > TOUCH_THRESHOLD) {
        if (delta > 0) goNext()
        else goPrev()
      }
      touchStartY.current = null
    }
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [goNext, goPrev])

  return {
    slideIndex: state.slideIndex,
    stage: state.stage,
    stageCount: stageCountOf(state.slideIndex),
    goNext,
    goPrev,
    goTo,
  }
}
