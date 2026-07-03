import { useCallback } from 'react'
import { INK, INK_DEEP } from './canvasKit'
import { useStagedCanvas } from './useStagedCanvas'

/**
 * Canvas recreation of the Fetchflare stride-prefetch state machine.
 * `variant="original"` is the FSM as integrated (6 states, INITIAL through
 * PREFETCHING via HIT-1 -> HIT-2 -> HIT-3). `variant="modified"` is the
 * proposed simplification: HIT-2 is removed, HIT-1 matches straight to
 * HIT-3, and HIT-1's mismatch return to INITIAL is dropped along with it —
 * only HIT-3 still falls back to INITIAL on a stride mismatch.
 *
 * Both diagrams render fully (no staged reveal) since this slide shows them
 * side by side as a direct before/after comparison rather than building
 * either one up incrementally.
 */
const LOGICAL_WIDTH = 1060
const LOGICAL_HEIGHT = 640

interface Pt {
  x: number
  y: number
}

const A = 145 // ellipse x radius
const B = 85 // ellipse y radius

const N_INIT: Pt = { x: 300, y: 400 }
const N_STRIDE: Pt = { x: 300, y: 150 }
const N_HIT1: Pt = { x: 800, y: 150 }
const N_HIT2: Pt = { x: 800, y: 400 }
const N_HIT3: Pt = { x: 800, y: 650 }
const N_PREFETCH: Pt = { x: 300, y: 650 }

function getPointOnEllipse(cx: number, cy: number, a: number, b: number, angle: number) {
  const r = (a * b) / Math.sqrt((b * Math.cos(angle)) ** 2 + (a * Math.sin(angle)) ** 2)
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
}

function drawNode(ctx: CanvasRenderingContext2D, x: number, y: number, text: string) {
  ctx.beginPath()
  ctx.ellipse(x, y, A, B, 0, 0, 2 * Math.PI)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.strokeStyle = INK
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillStyle = INK_DEEP
  ctx.font = '600 35px "Inter", Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const lines = text.split('\n')
  const lineHeight = 40
  const startY = y - ((lines.length - 1) * lineHeight) / 2
  lines.forEach((line, i) => ctx.fillText(line, x, startY + i * lineHeight))
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  text: string | undefined,
  dx: number,
  dy: number,
  align: CanvasTextAlign = 'center',
) {
  ctx.strokeStyle = INK
  ctx.fillStyle = INK
  ctx.lineWidth = 1.5

  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()

  const angle = Math.atan2(y2 - y1, x2 - x1)
  const headlen = 12
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 7), y2 - headlen * Math.sin(angle - Math.PI / 7))
  ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 7), y2 - headlen * Math.sin(angle + Math.PI / 7))
  ctx.closePath()
  ctx.fill()

  if (!text) return

  ctx.font = '25px "Inter", Arial, sans-serif'
  ctx.textAlign = align
  ctx.textBaseline = 'middle'

  const midX = (x1 + x2) / 2 + dx
  const midY = (y1 + y2) / 2 + dy
  const lines = text.split('\n')
  const lineHeight = 20
  const startY = midY - ((lines.length - 1) * lineHeight) / 2

  lines.forEach((line, i) => {
    const metrics = ctx.measureText(line)
    let bgX = midX
    if (align === 'center') bgX -= metrics.width / 2
    else if (align === 'right') bgX -= metrics.width

    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.fillRect(bgX - 4, startY + i * lineHeight - 11, metrics.width + 8, 22)
    ctx.fillStyle = INK
    ctx.fillText(line, midX, startY + i * lineHeight)
  })
}

function drawEdge(
  ctx: CanvasRenderingContext2D,
  c1: Pt,
  c2: Pt,
  text: string | undefined,
  dx: number,
  dy: number,
) {
  const angle = Math.atan2(c2.y - c1.y, c2.x - c1.x)
  const p1 = getPointOnEllipse(c1.x, c1.y, A, B, angle)
  const p2 = getPointOnEllipse(c2.x, c2.y, A, B, angle + Math.PI)
  drawArrow(ctx, p1.x, p1.y, p2.x, p2.y, text, dx, dy)
}

function drawScene(ctx: CanvasRenderingContext2D, variant: 'original' | 'modified') {
  drawNode(ctx, N_INIT.x, N_INIT.y, 'INITIAL')
  const pInitLeft = getPointOnEllipse(N_INIT.x, N_INIT.y, A, B, Math.PI)
  drawArrow(ctx, 40, N_INIT.y, pInitLeft.x, N_INIT.y, 'New entry', 0, -15)

  drawNode(ctx, N_STRIDE.x, N_STRIDE.y, 'STRIDE\nDETECTED')
  drawArrow(ctx, N_INIT.x - 20, N_INIT.y - B, N_STRIDE.x - 20, N_STRIDE.y + B, 'Stride\ndetected', -45, 0)
  drawArrow(ctx, N_STRIDE.x + 20, N_STRIDE.y + B, N_INIT.x + 20, N_INIT.y - B, 'Stride\nmissmatch', 50, 0)

  drawNode(ctx, N_HIT1.x, N_HIT1.y, 'HIT-1')
  drawEdge(ctx, N_STRIDE, N_HIT1, 'Stride match', 0, -15)

  if (variant === 'original') {
    drawEdge(ctx, N_HIT1, N_INIT, 'Stride missmatch', 0, -25)

    drawNode(ctx, N_HIT2.x, N_HIT2.y, 'HIT-2')
    drawEdge(ctx, N_HIT1, N_HIT2, 'Stride\nmatch', 40, 0)
    drawEdge(ctx, N_HIT2, N_INIT, 'Stride missmatch', 0, -15)

    drawNode(ctx, N_HIT3.x, N_HIT3.y, 'HIT-3')
    drawEdge(ctx, N_HIT2, N_HIT3, 'Stride\nmatch', 40, 0)
    drawEdge(ctx, N_HIT3, N_INIT, 'Stride missmatch', 15, 25)
  } else {
    drawEdge(ctx, N_HIT1, N_INIT, 'Stride missmatch', 0, -25)
    drawNode(ctx, N_HIT3.x, N_HIT3.y, 'HIT-3')
    drawEdge(ctx, N_HIT1, N_HIT3, 'Stride\nmatch', 40, 0)
    drawEdge(ctx, N_HIT3, N_INIT, 'Stride missmatch', 15, 25)
  }

  drawNode(ctx, N_PREFETCH.x, N_PREFETCH.y, 'PREFETCHING')
  drawEdge(ctx, N_HIT3, N_PREFETCH, 'Stride match', 0, -15)
}

export function FetchflareStateCanvas({ variant }: { variant: 'original' | 'modified' }) {
  const draw = useCallback((ctx: CanvasRenderingContext2D) => drawScene(ctx, variant), [variant])
  const canvasRef = useStagedCanvas(0, 1, draw, LOGICAL_WIDTH, LOGICAL_HEIGHT, true)

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full"
      style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
    />
  )
}
