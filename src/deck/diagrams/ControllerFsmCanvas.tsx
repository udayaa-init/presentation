import { INK, INK_DEEP } from './canvasKit'
import { useStagedCanvas } from './useStagedCanvas'

/**
 * Canvas recreation of the Controller FSM graph: IDLE is the hub every
 * state returns to, MISBRANCH sweeps back into most of them from below,
 * and FENCE/FENCE_I both route through WAIT_ON_ACK before returning to
 * IDLE. Nodes appear one at a time in `sequence` order; an edge only
 * fades in once both of the states it connects have appeared, so the
 * graph reads as "one state unlocks its transitions" rather than
 * everything snapping in at once.
 */
export const CONTROLLER_FSM_STEPS = 13

const LOGICAL_WIDTH = 1200
const LOGICAL_HEIGHT = 700

interface FsmNode {
  x: number
  y: number
  rx: number
  ry: number
  label: string
}

const nodes: Record<string, FsmNode> = {
  INIT: { x: 600, y: 60, rx: 35, ry: 20, label: 'INIT' },
  IDLE: { x: 600, y: 200, rx: 45, ry: 25, label: 'IDLE' },
  FLUSHCSR: { x: 130, y: 350, rx: 65, ry: 35, label: 'FLUSHCSR-\n-orCommit' },
  EXCEPTION: { x: 300, y: 350, rx: 60, ry: 25, label: 'EXCEPTION' },
  SFENCE_VMA: { x: 450, y: 350, rx: 65, ry: 25, label: 'SFENCE_VMA' },
  WFI_FLUSH: { x: 600, y: 350, rx: 55, ry: 25, label: 'WFI_FLUSH' },
  ERET: { x: 730, y: 350, rx: 40, ry: 25, label: 'ERET' },
  DEBUG: { x: 830, y: 350, rx: 45, ry: 25, label: 'DEBUG' },
  FENCE_I: { x: 940, y: 350, rx: 50, ry: 25, label: 'FENCE_I' },
  FENCE: { x: 1060, y: 350, rx: 45, ry: 25, label: 'FENCE' },
  WAIT_ON_ACK: { x: 1000, y: 180, rx: 70, ry: 25, label: 'WAIT_ON_ACK' },
  MISBRANCH: { x: 600, y: 600, rx: 65, ry: 25, label: 'MISBRANCH' },
}

const sequence = [
  'INIT',
  'IDLE',
  'FLUSHCSR',
  'EXCEPTION',
  'SFENCE_VMA',
  'WFI_FLUSH',
  'ERET',
  'DEBUG',
  'FENCE_I',
  'FENCE',
  'WAIT_ON_ACK',
  'MISBRANCH',
]

type PathCmd = string | number

const edges: { from: string; to: string; path: PathCmd[] }[] = [
  { from: 'INIT', to: 'IDLE', path: ['M', 600, 80, 'L', 600, 175] },

  { from: 'IDLE', to: 'FLUSHCSR', path: ['M', 560, 210, 'Q', 150, 150, 130, 315] },
  { from: 'FLUSHCSR', to: 'IDLE', path: ['M', 170, 325, 'Q', 350, 250, 565, 215] },
  { from: 'IDLE', to: 'EXCEPTION', path: ['M', 570, 218, 'Q', 320, 180, 300, 325] },
  { from: 'EXCEPTION', to: 'IDLE', path: ['M', 330, 330, 'Q', 420, 270, 575, 221] },
  { from: 'IDLE', to: 'SFENCE_VMA', path: ['M', 580, 223, 'Q', 460, 250, 450, 325] },
  { from: 'SFENCE_VMA', to: 'IDLE', path: ['M', 470, 330, 'Q', 510, 280, 585, 224] },
  { from: 'IDLE', to: 'WFI_FLUSH', path: ['M', 590, 225, 'Q', 550, 280, 590, 325] },
  { from: 'WFI_FLUSH', to: 'IDLE', path: ['M', 610, 325, 'Q', 650, 280, 610, 225] },
  { from: 'IDLE', to: 'ERET', path: ['M', 615, 224, 'Q', 710, 250, 730, 325] },
  { from: 'ERET', to: 'IDLE', path: ['M', 710, 330, 'Q', 670, 280, 620, 223] },
  { from: 'IDLE', to: 'DEBUG', path: ['M', 625, 221, 'Q', 810, 180, 830, 325] },
  { from: 'DEBUG', to: 'IDLE', path: ['M', 810, 330, 'Q', 750, 270, 630, 218] },
  { from: 'IDLE', to: 'FENCE_I', path: ['M', 635, 215, 'Q', 920, 180, 940, 325] },
  { from: 'FENCE_I', to: 'IDLE', path: ['M', 920, 330, 'Q', 820, 250, 640, 210] },
  { from: 'IDLE', to: 'FENCE', path: ['M', 645, 205, 'Q', 1040, 150, 1060, 325] },
  { from: 'FENCE', to: 'IDLE', path: ['M', 1040, 330, 'Q', 880, 240, 650, 200] },

  { from: 'FENCE_I', to: 'WAIT_ON_ACK', path: ['M', 950, 325, 'Q', 950, 260, 960, 205] },
  { from: 'FENCE', to: 'WAIT_ON_ACK', path: ['M', 1050, 325, 'Q', 1050, 260, 1040, 205] },
  { from: 'WAIT_ON_ACK', to: 'IDLE', path: ['M', 950, 160, 'Q', 750, 100, 620, 175] },

  { from: 'MISBRANCH', to: 'FLUSHCSR', path: ['M', 545, 585, 'Q', 130, 650, 130, 385] },
  { from: 'MISBRANCH', to: 'EXCEPTION', path: ['M', 555, 580, 'Q', 300, 600, 300, 375] },
  { from: 'MISBRANCH', to: 'SFENCE_VMA', path: ['M', 570, 577, 'Q', 450, 520, 450, 375] },
  { from: 'MISBRANCH', to: 'IDLE', path: ['M', 585, 575, 'Q', 450, 450, 575, 220] },
  { from: 'MISBRANCH', to: 'WFI_FLUSH', path: ['M', 600, 575, 'L', 600, 375] },
  { from: 'MISBRANCH', to: 'ERET', path: ['M', 615, 575, 'Q', 730, 520, 730, 375] },
  { from: 'MISBRANCH', to: 'DEBUG', path: ['M', 630, 577, 'Q', 830, 550, 830, 375] },
  { from: 'MISBRANCH', to: 'FENCE_I', path: ['M', 645, 580, 'Q', 940, 600, 940, 375] },
  { from: 'MISBRANCH', to: 'FENCE', path: ['M', 655, 585, 'Q', 1100, 650, 1060, 375] },
]

const stepOf = (id: string) => sequence.indexOf(id) + 1

function drawPathArrow(ctx: CanvasRenderingContext2D, path: PathCmd[], color: string) {
  ctx.beginPath()
  let lastX = 0
  let lastY = 0
  let endX = 0
  let endY = 0
  let tangentAngle = 0

  for (let i = 0; i < path.length; ) {
    const cmd = path[i]
    if (cmd === 'M') {
      ctx.moveTo(path[i + 1] as number, path[i + 2] as number)
      lastX = path[i + 1] as number
      lastY = path[i + 2] as number
      i += 3
    } else if (cmd === 'L') {
      const x = path[i + 1] as number
      const y = path[i + 2] as number
      ctx.lineTo(x, y)
      endX = x
      endY = y
      tangentAngle = Math.atan2(endY - lastY, endX - lastX)
      lastX = endX
      lastY = endY
      i += 3
    } else if (cmd === 'Q') {
      const cx = path[i + 1] as number
      const cy = path[i + 2] as number
      const x = path[i + 3] as number
      const y = path[i + 4] as number
      ctx.quadraticCurveTo(cx, cy, x, y)
      endX = x
      endY = y
      tangentAngle = Math.atan2(endY - cy, endX - cx)
      lastX = endX
      lastY = endY
      i += 5
    } else {
      i += 1
    }
  }

  ctx.strokeStyle = color
  ctx.lineWidth = 1.4
  ctx.stroke()

  const arrowLen = 11
  ctx.beginPath()
  ctx.moveTo(endX, endY)
  ctx.lineTo(endX - arrowLen * Math.cos(tangentAngle - Math.PI / 7), endY - arrowLen * Math.sin(tangentAngle - Math.PI / 7))
  ctx.lineTo(endX - arrowLen * Math.cos(tangentAngle + Math.PI / 7), endY - arrowLen * Math.sin(tangentAngle + Math.PI / 7))
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
}

function drawNode(ctx: CanvasRenderingContext2D, node: FsmNode) {
  ctx.beginPath()
  ctx.ellipse(node.x, node.y, node.rx, node.ry, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.strokeStyle = INK
  ctx.lineWidth = 1.4
  ctx.stroke()

  ctx.fillStyle = INK_DEEP
  ctx.font = '600 13px "Inter", Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const lines = node.label.split('\n')
  lines.forEach((line, i) => {
    const yOffset = (i - (lines.length - 1) / 2) * 15
    ctx.fillText(line, node.x, node.y + yOffset)
  })
}

function drawScene(ctx: CanvasRenderingContext2D, continuousStep: number) {
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  edges.forEach((edge) => {
    const step = Math.max(stepOf(edge.from), stepOf(edge.to))
    const opacity = Math.min(1, Math.max(0, continuousStep - step + 1))
    if (opacity <= 0) return
    ctx.save()
    ctx.globalAlpha = opacity
    drawPathArrow(ctx, edge.path, INK)
    ctx.restore()
  })

  sequence.forEach((id) => {
    const opacity = Math.min(1, Math.max(0, continuousStep - stepOf(id) + 1))
    if (opacity <= 0) return
    ctx.save()
    ctx.globalAlpha = opacity
    drawNode(ctx, nodes[id])
    ctx.restore()
  })
}

export function ControllerFsmCanvas({ stage }: { stage: number }) {
  const canvasRef = useStagedCanvas(stage, CONTROLLER_FSM_STEPS, drawScene, LOGICAL_WIDTH, LOGICAL_HEIGHT)

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full"
      style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
    />
  )
}
