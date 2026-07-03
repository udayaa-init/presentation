import { CLOUD_GOLD, CLOUD_NAVY, drawCloud, drawPolyline, drawReg, drawRect, GOLD, INK, INK_DEEP, type Pt } from './canvasKit'
import { useStagedCanvas } from './useStagedCanvas'

/**
 * Canvas recreation of the proposed Scoreboard/ROB datapath: SB and ROB are
 * now separate blocks (ROB lives inside its own highlighted subsystem, gold
 * outline, alongside Writeback logic and Commit Request), Issue logic
 * dispatches straight to Execute, and the decoded instruction also latches
 * into an "Optional" register feeding the ROB directly — the distributed
 * responsibility described on this slide, versus the single combined
 * SB+ROB block on the Analysis slide.
 *
 * One flat, ordered `items` list tagged with the stage each element appears
 * on — reorder or retime the build-up by editing the `step` numbers below.
 */
export const SCOREBOARD_ROB_DIAGRAM_STEPS = 11

const LOGICAL_WIDTH = 1000
const LOGICAL_HEIGHT = 850

type DiagramItem =
  | { type: 'box'; x: number; y: number; w: number; h: number; color?: string; step: number }
  | { type: 'rect'; x: number; y: number; w: number; h: number; text?: string; fillStyle?: string; textColor?: string; step: number }
  | { type: 'reg'; x: number; y: number; w: number; h: number; text?: string; labelTop?: string; strokeStyle?: string; step: number }
  | { type: 'cloud'; x: number; y: number; w: number; h: number; text: string; tone: 'navy' | 'gold'; step: number }
  | {
      type: 'line'
      pts: Pt[]
      arrow?: boolean
      thick?: boolean
      label?: string
      labelPos?: Pt
      labelColor?: string
      labelFont?: string
      step: number
    }

const items: DiagramItem[] = [
  // Step 1 — datapath boundary + the highlighted "new" subsystem (ROB, Writeback, Commit Request)
  { type: 'box', x: 170, y: 130, w: 410, h: 660, step: 1 },
  { type: 'box', x: 740, y: 240, w: 220, h: 540, color: GOLD, step: 1 },

  // Step 2 — Decode -> latch -> Issue logic, and the decoded-instruction path toward ROB
  { type: 'rect', x: 20, y: 310, w: 90, h: 50, text: 'Decode', step: 2 },
  { type: 'line', pts: [[110, 335], [150, 335]], step: 2 },
  { type: 'rect', x: 150, y: 250, w: 10, h: 170, fillStyle: '#ffffff', step: 2 },
  { type: 'line', pts: [[160, 335], [220, 335]], arrow: true, step: 2 },
  { type: 'cloud', x: 220, y: 290, w: 110, h: 80, text: 'Issue\nlogic', tone: 'navy', step: 2 },
  { type: 'line', pts: [[180, 335], [180, 150], [680, 150]], arrow: true, step: 2 },
  { type: 'reg', x: 680, y: 110, w: 30, h: 80, strokeStyle: GOLD, labelTop: 'Optional', step: 2 },

  // Step 3 — Issue logic -> SB (now separate from ROB)
  { type: 'line', pts: [[325, 335], [370, 335]], arrow: true, step: 3 },
  { type: 'rect', x: 370, y: 280, w: 80, h: 100, text: 'SB', fillStyle: CLOUD_NAVY, textColor: '#ffffff', step: 3 },

  // Step 4 — Issue logic -> Execute, and the latched decoded instruction -> ROB
  {
    type: 'line',
    pts: [[275, 295], [275, 190], [595, 190], [595, 350], [610, 350]],
    arrow: true,
    step: 4,
  },
  { type: 'rect', x: 610, y: 320, w: 90, h: 60, text: 'Execute', step: 4 },
  {
    type: 'line',
    pts: [[710, 150], [900, 150], [900, 370]],
    arrow: true,
    label: 'Decoded Instr',
    labelPos: [800, 140],
    step: 4,
  },
  { type: 'rect', x: 860, y: 370, w: 80, h: 110, text: 'ROB', fillStyle: CLOUD_GOLD, textColor: INK_DEEP, step: 4 },

  // Step 5 — Execute -> FU Ready -> Issue logic
  {
    type: 'line',
    pts: [[655, 320], [655, 100], [240, 100], [240, 295]],
    arrow: true,
    thick: true,
    label: 'FU Ready',
    labelPos: [450, 90],
    step: 5,
  },

  // Step 6 — SB -> Forwarding, Issue logic <-> Forwarding
  {
    type: 'line',
    pts: [[410, 380], [410, 440], [350, 440], [350, 495]],
    arrow: true,
    label: 'Forwarding',
    labelColor: GOLD,
    labelPos: [450, 420],
    labelFont: '600 11px "Inter", Arial, sans-serif',
    step: 6,
  },
  { type: 'cloud', x: 210, y: 490, w: 190, h: 90, text: 'Forwarding\nOperand\nselection', tone: 'navy', step: 6 },
  { type: 'line', pts: [[250, 365], [250, 495]], arrow: true, step: 6 },
  { type: 'line', pts: [[300, 495], [300, 365]], arrow: true, step: 6 },

  // Step 7 — Execute -> Writeback logic -> ROB, and SB -> Execute
  { type: 'line', pts: [[700, 350], [730, 350], [730, 300], [780, 300]], arrow: true, step: 7 },
  { type: 'cloud', x: 780, y: 260, w: 130, h: 80, text: 'Writeback\nlogic', tone: 'gold', step: 7 },
  { type: 'line', pts: [[845, 340], [845, 410], [860, 410]], arrow: true, step: 7 },
  { type: 'line', pts: [[450, 350], [520, 350], [520, 400], [655, 400], [655, 380]], arrow: true, step: 7 },

  // Step 8 — ROB -> Commit Request
  { type: 'line', pts: [[900, 480], [900, 520], [860, 520], [860, 550]], arrow: true, step: 8 },
  { type: 'cloud', x: 790, y: 550, w: 140, h: 90, text: 'Commit\nRequest', tone: 'gold', step: 8 },

  // Step 9 — Commit Request -> Commit
  { type: 'line', pts: [[860, 640], [860, 715], [700, 715]], arrow: true, step: 9 },
  { type: 'rect', x: 610, y: 690, w: 90, h: 50, text: 'Commit', step: 9 },

  // Step 10 — Commit -> Reg File -> Forwarding
  { type: 'line', pts: [[610, 715], [280, 715]], arrow: true, step: 10 },
  { type: 'reg', x: 210, y: 630, w: 70, h: 110, text: 'Reg\nFile', step: 10 },
  { type: 'line', pts: [[245, 630], [245, 610], [310, 610], [310, 575]], arrow: true, step: 10 },
]

function drawScene(ctx: CanvasRenderingContext2D, continuousStep: number) {
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  items.forEach((item) => {
    const opacity = Math.min(1, Math.max(0, continuousStep - item.step + 1))
    if (opacity <= 0) return
    ctx.save()
    ctx.globalAlpha = opacity

    if (item.type === 'box') {
      ctx.strokeStyle = item.color ?? '#c7cfdf'
      ctx.lineWidth = 2
      ctx.strokeRect(item.x, item.y, item.w, item.h)
    } else if (item.type === 'rect') {
      drawRect(ctx, item.x, item.y, item.w, item.h, item.text, item.fillStyle, item.textColor)
    } else if (item.type === 'reg') {
      drawReg(ctx, item.x, item.y, item.w, item.h, {
        text: item.text,
        labelTop: item.labelTop,
        strokeStyle: item.strokeStyle,
      })
    } else if (item.type === 'cloud') {
      const fill = item.tone === 'gold' ? CLOUD_GOLD : CLOUD_NAVY
      const textColor = item.tone === 'gold' ? INK_DEEP : '#ffffff'
      drawCloud(ctx, item.x, item.y, item.w, item.h, item.text, fill, textColor)
    } else if (item.type === 'line') {
      drawPolyline(ctx, item.pts, {
        arrow: item.arrow,
        thick: item.thick,
        label: item.label,
        labelPos: item.labelPos,
        labelColor: item.labelColor ?? INK,
        labelFont: item.labelFont,
      })
    }

    ctx.restore()
  })
}

export function ScoreboardRobArchitectureCanvas({ stage }: { stage: number }) {
  const canvasRef = useStagedCanvas(stage, SCOREBOARD_ROB_DIAGRAM_STEPS, drawScene, LOGICAL_WIDTH, LOGICAL_HEIGHT)

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full"
      style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
    />
  )
}
