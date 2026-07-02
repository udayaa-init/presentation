/** Shared drawing primitives for the deck's canvas-recreated diagrams. */

export const INK = '#243352'
export const INK_DEEP = '#101a33'
export const GOLD = '#d6a13c'
export const CLOUD_NAVY = '#414c76'
export const CLOUD_GOLD = '#f2d98a'

export function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

export function fillTextMultiLine(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  lineHeight: number,
  align: CanvasTextAlign = 'center',
  vAlign: 'top' | 'middle' | 'bottom' = 'middle',
) {
  const lines = text.split('\n')
  const totalHeight = lines.length * lineHeight
  let startY = y
  if (vAlign === 'middle') startY = y - totalHeight / 2 + lineHeight / 2 + 2
  if (vAlign === 'bottom') startY = y - totalHeight + lineHeight

  ctx.textAlign = align
  ctx.textBaseline = 'middle'
  lines.forEach((line, i) => {
    ctx.fillText(line, x, startY + i * lineHeight)
  })
}

export function drawBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  text: string,
  textPos: 'center' | 'top' = 'center',
) {
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = INK
  ctx.lineWidth = 2
  drawRoundRect(ctx, x, y, w, h, 10)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = INK_DEEP
  ctx.font = '22px "Inter", Arial, sans-serif'

  if (textPos === 'top') {
    fillTextMultiLine(ctx, text, x + w / 2, y + 30, 26, 'center', 'middle')
  } else {
    fillTextMultiLine(ctx, text, x + w / 2, y + h / 2, 28, 'center', 'middle')
  }
}

/** A plain sharp-cornered box — matches the square (non-rounded) function
 * blocks (Decode, Execute, Commit, Reg File) in the source diagrams. */
export function drawRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  text?: string,
  fillStyle = '#ffffff',
  textColor = INK_DEEP,
) {
  ctx.fillStyle = fillStyle
  ctx.fillRect(x, y, w, h)
  ctx.strokeStyle = INK
  ctx.lineWidth = 2
  ctx.strokeRect(x, y, w, h)

  if (text) {
    ctx.fillStyle = textColor
    ctx.font = '600 15px "Inter", Arial, sans-serif'
    fillTextMultiLine(ctx, text, x + w / 2, y + h / 2, 20, 'center', 'middle')
  }
}

/** A hardware register: a sharp box with a clock-edge triangle on its
 * bottom-left corner, optionally labelled inside (`text`) and/or above
 * (`labelTop`) — used for the Reg File and for pipeline latch registers. */
export function drawReg(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  opts: {
    text?: string
    labelTop?: string
    strokeStyle?: string
    fillStyle?: string
    textColor?: string
    labelTopColor?: string
  } = {},
) {
  const {
    text,
    labelTop,
    strokeStyle = INK,
    fillStyle = '#ffffff',
    textColor = INK_DEEP,
    labelTopColor = INK,
  } = opts

  ctx.fillStyle = fillStyle
  ctx.fillRect(x, y, w, h)
  ctx.strokeStyle = strokeStyle
  ctx.lineWidth = 2
  ctx.strokeRect(x, y, w, h)

  ctx.beginPath()
  ctx.moveTo(x, y + h - 26)
  ctx.lineTo(x + 16, y + h - 13)
  ctx.lineTo(x, y + h)
  ctx.strokeStyle = strokeStyle
  ctx.lineWidth = 1.5
  ctx.stroke()

  if (labelTop) {
    ctx.fillStyle = labelTopColor
    ctx.font = '11px "Inter", Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText(labelTop, x + w / 2, y - 10)
  }
  if (text) {
    ctx.fillStyle = textColor
    ctx.font = '600 15px "Inter", Arial, sans-serif'
    fillTextMultiLine(ctx, text, x + w / 2, y + h / 2, 20, 'center', 'middle')
  }
}

export type Pt = [number, number]

/**
 * A straight-segment polyline (elbow connector) with an optional arrowhead
 * at its last point and an optional text label — the general-purpose
 * connector used by the datapath diagrams' declarative `items` lists.
 */
export function drawPolyline(
  ctx: CanvasRenderingContext2D,
  pts: Pt[],
  opts: {
    arrow?: boolean
    thick?: boolean
    color?: string
    label?: string
    labelPos?: Pt
    labelColor?: string
    labelFont?: string
  } = {},
) {
  const { arrow, thick, color = INK, label, labelPos, labelColor = INK, labelFont } = opts

  ctx.beginPath()
  ctx.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
  ctx.strokeStyle = color
  ctx.lineWidth = thick ? 4 : 2
  ctx.stroke()

  if (arrow) {
    const [p1, p2] = [pts[pts.length - 2], pts[pts.length - 1]]
    const angle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0])
    ctx.beginPath()
    ctx.moveTo(p2[0], p2[1])
    ctx.lineTo(p2[0] - 12 * Math.cos(angle - Math.PI / 7), p2[1] - 12 * Math.sin(angle - Math.PI / 7))
    ctx.lineTo(p2[0] - 12 * Math.cos(angle + Math.PI / 7), p2[1] - 12 * Math.sin(angle + Math.PI / 7))
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
  }

  if (label) {
    ctx.fillStyle = labelColor
    ctx.font = labelFont || '13px "Inter", Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    if (labelPos) {
      ctx.fillText(label, labelPos[0], labelPos[1])
    } else {
      const xs = pts.map((p) => p[0])
      ctx.fillText(label, (Math.min(...xs) + Math.max(...xs)) / 2, pts[1][1] - 10)
    }
  }
}

export function drawBlockArrow(ctx: CanvasRenderingContext2D, x1: number, y: number, x2: number) {
  const height = 30
  const headWidth = 16
  const shaftHeight = 12

  ctx.beginPath()
  ctx.moveTo(x1, y - shaftHeight / 2)
  ctx.lineTo(x2 - headWidth, y - shaftHeight / 2)
  ctx.lineTo(x2 - headWidth, y - height / 2)
  ctx.lineTo(x2, y)
  ctx.lineTo(x2 - headWidth, y + height / 2)
  ctx.lineTo(x2 - headWidth, y + shaftHeight / 2)
  ctx.lineTo(x1, y + shaftHeight / 2)
  ctx.closePath()
  ctx.fillStyle = GOLD
  ctx.fill()
  ctx.strokeStyle = INK
  ctx.lineWidth = 2
  ctx.stroke()
}

function arrowHead(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, color: string) {
  const headLen = 12
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x - headLen * Math.cos(angle - Math.PI / 7), y - headLen * Math.sin(angle - Math.PI / 7))
  ctx.lineTo(x - headLen * Math.cos(angle + Math.PI / 7), y - headLen * Math.sin(angle + Math.PI / 7))
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
}

export function drawLineArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  double = true,
) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.strokeStyle = INK
  ctx.lineWidth = 2
  ctx.stroke()

  const angle = Math.atan2(y2 - y1, x2 - x1)
  arrowHead(ctx, x2, y2, angle, INK)
  if (double) arrowHead(ctx, x1, y1, angle + Math.PI, INK)
}

/**
 * A rounded-corner orthogonal connector through an arbitrary list of
 * points — the "elbow" routing style used throughout the CVA6 diagrams
 * (signals turn at right angles with a small rounded joint, not diagonals).
 */
export function drawElbow(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  opts: { start?: boolean; end?: boolean; radius?: number; color?: string } = {},
) {
  const { start = false, end = true, radius = 10, color = INK } = opts
  if (points.length < 2) return

  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length - 1; i++) {
    const p0 = points[i - 1]
    const p1 = points[i]
    const p2 = points[i + 1]
    const d1 = Math.hypot(p1.x - p0.x, p1.y - p0.y)
    const d2 = Math.hypot(p2.x - p1.x, p2.y - p1.y)
    const r = Math.min(radius, d1 / 2, d2 / 2)
    const t1x = p1.x + ((p0.x - p1.x) / d1) * r
    const t1y = p1.y + ((p0.y - p1.y) / d1) * r
    const t2x = p1.x + ((p2.x - p1.x) / d2) * r
    const t2y = p1.y + ((p2.y - p1.y) / d2) * r
    ctx.lineTo(t1x, t1y)
    ctx.quadraticCurveTo(p1.x, p1.y, t2x, t2y)
  }
  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y)
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.stroke()

  const last = points[points.length - 1]
  const beforeLast = points[points.length - 2]
  if (end) {
    arrowHead(ctx, last.x, last.y, Math.atan2(last.y - beforeLast.y, last.x - beforeLast.x), color)
  }
  const first = points[0]
  const afterFirst = points[1]
  if (start) {
    arrowHead(ctx, first.x, first.y, Math.atan2(first.y - afterFirst.y, first.x - afterFirst.x), color)
  }
}

/** An asymmetric "thought bubble" cloud (bezier bumps, top-left + size box),
 * matching the bubble-shaped functional blocks (Issue logic, Forwarding,
 * Writeback logic, Commit Request) in the source diagrams. */
export function drawCloud(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  text: string,
  fill: string,
  textColor = '#ffffff',
) {
  ctx.beginPath()
  ctx.moveTo(x + w * 0.1, y + h * 0.4)
  ctx.bezierCurveTo(x - w * 0.05, y + h * 0.1, x + w * 0.3, y - h * 0.05, x + w * 0.35, y + h * 0.2)
  ctx.bezierCurveTo(x + w * 0.4, y - h * 0.1, x + w * 0.75, y - h * 0.05, x + w * 0.75, y + h * 0.15)
  ctx.bezierCurveTo(x + w * 1.0, y + h * 0.05, x + w * 1.05, y + h * 0.35, x + w * 0.85, y + h * 0.45)
  ctx.bezierCurveTo(x + w * 1.05, y + h * 0.6, x + w * 1.0, y + h * 0.9, x + w * 0.8, y + h * 0.85)
  ctx.bezierCurveTo(x + w * 0.8, y + h * 1.05, x + w * 0.55, y + h * 1.05, x + w * 0.5, y + h * 0.9)
  ctx.bezierCurveTo(x + w * 0.4, y + h * 1.1, x + w * 0.1, y + h * 1.05, x + w * 0.15, y + h * 0.8)
  ctx.bezierCurveTo(x - w * 0.05, y + h * 0.75, x - w * 0.05, y + h * 0.45, x + w * 0.1, y + h * 0.4)
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
  ctx.strokeStyle = INK
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillStyle = textColor
  ctx.font = '600 15px "Inter", Arial, sans-serif'
  fillTextMultiLine(ctx, text, x + w / 2, y + h / 2, 20, 'center', 'middle')
}
