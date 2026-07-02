import { CLOUD_GOLD, CLOUD_NAVY, drawCloud, drawPolyline, drawReg, drawRect, INK, INK_DEEP, type Pt } from './canvasKit'
import { useStagedCanvas } from './useStagedCanvas'

/**
 * Canvas recreation of the Issue / Scoreboard+ROB / Commit datapath diagram
 * (Analysis slide): Decode -> a pipeline latch -> Issue logic, which feeds
 * both the combined SB+ROB block and Execute directly; Execute closes two
 * loops back in — "FU Ready" into Issue logic, and through Writeback logic
 * into SB+ROB — plus a straight line into Forwarding/Operand selection.
 * SB+ROB and Forwarding also exchange operands, Forwarding reads/writes the
 * Reg File, and SB+ROB drives Commit Request -> Commit, which writes back
 * into the Reg File along the bottom.
 *
 * The diagram is one flat, ordered list of draw calls (`items`) tagged with
 * the stage they appear on — reorder or retime the build-up by editing the
 * `step` numbers below; nothing else needs to change.
 */
export const ANALYSIS_DIAGRAM_STEPS = 11

const LOGICAL_WIDTH = 1000
const LOGICAL_HEIGHT = 850

type DiagramItem =
  | { type: 'rect'; x: number; y: number; w: number; h: number; text?: string; fillStyle?: string; step: number }
  | { type: 'reg'; x: number; y: number; w: number; h: number; text: string; step: number }
  | { type: 'sbrob'; x: number; y: number; w: number; h: number; step: number }
  | { type: 'cloud'; x: number; y: number; w: number; h: number; text: string; tone: 'navy' | 'gold'; step: number }
  | { type: 'line'; pts: Pt[]; arrow?: boolean; thick?: boolean; label?: string; step: number }

const items: DiagramItem[] = [
  // Step 1 — outer datapath boundary
  { type: 'rect', x: 260, y: 120, w: 490, h: 660, step: 1 },

  // Step 2 — Decode -> latch -> Issue logic
  { type: 'rect', x: 40, y: 300, w: 100, h: 60, text: 'Decode', step: 2 },
  { type: 'line', pts: [[140, 330], [180, 330]], step: 2 },
  { type: 'rect', x: 180, y: 240, w: 10, h: 180, fillStyle: '#ffffff', step: 2 },
  { type: 'line', pts: [[190, 330], [280, 330]], arrow: true, step: 2 },
  { type: 'cloud', x: 280, y: 300, w: 110, h: 80, text: 'Issue\nlogic', tone: 'navy', step: 2 },

  // Step 3 — Issue logic -> SB+ROB
  { type: 'line', pts: [[390, 330], [440, 330]], arrow: true, step: 3 },
  { type: 'sbrob', x: 440, y: 280, w: 110, h: 120, step: 3 },

  // Step 4 — Issue logic -> Execute
  {
    type: 'line',
    pts: [[340, 300], [340, 180], [730, 180], [730, 360], [810, 360]],
    arrow: true,
    step: 4,
  },
  { type: 'rect', x: 810, y: 330, w: 100, h: 60, text: 'Execute', step: 4 },

  // Step 5 — Execute -> FU Ready -> Issue logic
  {
    type: 'line',
    pts: [[865, 330], [865, 95], [305, 95], [305, 300]],
    arrow: true,
    thick: true,
    label: 'FU Ready',
    step: 5,
  },

  // Step 6 — SB+ROB -> Forwarding -> Issue logic
  { type: 'line', pts: [[495, 400], [495, 430], [460, 430], [460, 458]], arrow: true, step: 6 },
  { type: 'cloud', x: 295, y: 450, w: 210, h: 110, text: 'Forwarding\nOperand\nselection', tone: 'navy', step: 6 },
  { type: 'line', pts: [[380, 452], [380, 380]], arrow: true, step: 6 },

  // Step 7 — Execute -> Writeback logic -> SB+ROB
  { type: 'line', pts: [[860, 390], [860, 505], [740, 505], [740, 365], [700, 365]], arrow: true, step: 7 },
  { type: 'cloud', x: 580, y: 330, w: 120, h: 70, text: 'Writeback\nlogic', tone: 'gold', step: 7 },
  { type: 'line', pts: [[580, 365], [550, 365]], arrow: true, step: 7 },

  // Step 8 — Execute -> Forwarding
  { type: 'line', pts: [[740, 505], [490, 505]], arrow: true, step: 8 },

  // Step 9 — SB+ROB -> Commit Request -> Commit
  { type: 'line', pts: [[495, 430], [640, 430], [640, 550]], arrow: true, step: 9 },
  { type: 'cloud', x: 580, y: 550, w: 120, h: 70, text: 'Commit\nRequest', tone: 'gold', step: 9 },
  { type: 'line', pts: [[700, 585], [810, 585]], arrow: true, step: 9 },
  { type: 'rect', x: 810, y: 555, w: 100, h: 60, text: 'Commit', step: 9 },

  // Step 10 — Commit -> Reg File -> Forwarding
  { type: 'line', pts: [[860, 615], [860, 750], [325, 750], [325, 720]], arrow: true, step: 10 },
  { type: 'reg', x: 290, y: 600, w: 70, h: 120, text: 'Reg\nFile', step: 10 },
  { type: 'line', pts: [[325, 600], [325, 543]], arrow: true, step: 10 },
]

function drawSbRob(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = INK_DEEP
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + w, y)
  ctx.lineTo(x, y + h)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = CLOUD_GOLD
  ctx.beginPath()
  ctx.moveTo(x + w, y)
  ctx.lineTo(x + w, y + h)
  ctx.lineTo(x, y + h)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = INK
  ctx.lineWidth = 2
  ctx.strokeRect(x, y, w, h)
  ctx.beginPath()
  ctx.moveTo(x, y + h)
  ctx.lineTo(x + w, y)
  ctx.stroke()

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '600 16px "Inter", Arial, sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText('SB', x + w / 3 - 5, y + h / 3 - 5)
  ctx.fillStyle = INK_DEEP
  ctx.font = '15px "Inter", Arial, sans-serif'
  ctx.fillText('+', x + w / 2, y + h / 2)
  ctx.font = '600 16px "Inter", Arial, sans-serif'
  ctx.fillText('ROB', x + (2 * w) / 3 + 5, y + (2 * h) / 3 + 5)
}

function drawScene(ctx: CanvasRenderingContext2D, continuousStep: number) {
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  items.forEach((item) => {
    const opacity = Math.min(1, Math.max(0, continuousStep - item.step + 1))
    if (opacity <= 0) return
    ctx.save()
    ctx.globalAlpha = opacity

    if (item.type === 'rect') {
      drawRect(ctx, item.x, item.y, item.w, item.h, item.text, item.fillStyle)
    } else if (item.type === 'reg') {
      drawReg(ctx, item.x, item.y, item.w, item.h, { text: item.text })
    } else if (item.type === 'sbrob') {
      drawSbRob(ctx, item.x, item.y, item.w, item.h)
    } else if (item.type === 'cloud') {
      const fill = item.tone === 'gold' ? CLOUD_GOLD : CLOUD_NAVY
      const textColor = item.tone === 'gold' ? INK_DEEP : '#ffffff'
      drawCloud(ctx, item.x, item.y, item.w, item.h, item.text, fill, textColor)
    } else if (item.type === 'line') {
      drawPolyline(ctx, item.pts, { arrow: item.arrow, thick: item.thick, label: item.label })
    }

    ctx.restore()
  })
}

export function AnalysisArchitectureCanvas({ stage }: { stage: number }) {
  const canvasRef = useStagedCanvas(stage, ANALYSIS_DIAGRAM_STEPS, drawScene, LOGICAL_WIDTH, LOGICAL_HEIGHT)

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full"
      style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
    />
  )
}
