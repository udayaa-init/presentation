import { useEffect, useRef, useState } from 'react'

/**
 * Wires a <canvas> up to the deck's discrete `stage` prop: sizes itself to
 * its parent panel (via ResizeObserver, since these diagrams live inside a
 * fixed slide layout rather than the page flow), scales a fixed logical
 * coordinate space to fit, and animates a continuous "reveal position"
 * toward `stage + 1` so each new element gets a quick fade-in rather than
 * popping in abruptly.
 *
 * `drawScene(ctx, continuousStep)` does the actual drawing — it receives a
 * possibly-fractional step value and is expected to fade each element in
 * around its own integer step (see canvasKit usage in the diagram files).
 */
export function useStagedCanvas(
  stage: number,
  totalSteps: number,
  drawScene: (ctx: CanvasRenderingContext2D, continuousStep: number) => void,
  logicalWidth: number,
  logicalHeight: number,
  ff: boolean= false,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const displayStepRef = useRef(0)
  const rafRef = useRef(0)

  useEffect(() => {
    const parent = canvasRef.current?.parentElement
    if (!parent) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setDimensions({ width, height })
    })
    observer.observe(parent)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const draw = (continuousStep: number) => {
      const canvas = canvasRef.current
      if (!canvas || dimensions.width === 0 || dimensions.height === 0) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const dpr = window.devicePixelRatio || 1
      canvas.width = dimensions.width * dpr
      canvas.height = dimensions.height * dpr
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const scale = Math.min(
        (dimensions.width * 0.95) / logicalWidth,
        (dimensions.height * 0.95) / logicalHeight,
      )
      const offsetX = (dimensions.width - logicalWidth * scale) / 2
      const offsetY = (ff)?-27:(dimensions.height - logicalHeight * scale) / 2

      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.translate(offsetX, offsetY)
      ctx.scale(scale, scale)
      drawScene(ctx, continuousStep)
      ctx.restore()
    }

    const target = Math.min(stage + 1, totalSteps)
    cancelAnimationFrame(rafRef.current)

    const tick = () => {
      const current = displayStepRef.current
      const next = current + (target - current) * 0.22
      displayStepRef.current = Math.abs(target - next) < 0.004 ? target : next
      draw(displayStepRef.current)
      if (displayStepRef.current !== target) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [stage, totalSteps, dimensions, drawScene, logicalWidth, logicalHeight])

  return canvasRef
}
