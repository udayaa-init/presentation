import { drawBlockArrow, drawBox, drawLineArrow, drawRoundRect, fillTextMultiLine, INK, INK_DEEP } from './canvasKit'
import { useStagedCanvas } from './useStagedCanvas'

/**
 * Canvas recreation of the CVA6 block diagram (pipeline + perf counter /
 * CSR / controller / cache row). Reveals progressively — one element per
 * `stage` — instead of the scroll-driven version this was adapted from,
 * since the deck owns navigation (wheel/keys), not native page scroll.
 *
 * `CVA6_DIAGRAM_STEPS` is the number of discrete stages this diagram has;
 * the slide that renders it uses that as its `stageCount`. Reorder or add
 * reveal steps by editing the numbered `renderElement` calls below — the
 * step number is what the deck's stage index maps to.
 */
export const CVA6_DIAGRAM_STEPS = 13

const LOGICAL_WIDTH = 1450
const LOGICAL_HEIGHT = 800

function drawScene(ctx: CanvasRenderingContext2D, continuousStep: number) {
  const renderElement = (stepTarget: number, renderFn: (ctx: CanvasRenderingContext2D) => void) => {
    const opacity = Math.min(1, Math.max(0, continuousStep - stepTarget + 1))
    if (opacity > 0) {
      ctx.save()
      ctx.globalAlpha = opacity
      renderFn(ctx)
      ctx.restore()
    }
  }

  renderElement(1, (ctx) => {
    ctx.strokeStyle = INK
    ctx.lineWidth = 2
    drawRoundRect(ctx, 20, 20, 1160, 750, 16)
    ctx.stroke()
    ctx.fillStyle = INK_DEEP
    ctx.font = '600 24px "Inter", Arial, sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText('CVA6', 40, 50)
  })

  renderElement(2, (ctx) => {
    ctx.fillStyle = '#f7f8fb'
    ctx.strokeStyle = '#e7eaf2'
    ctx.lineWidth = 2
    drawRoundRect(ctx, 40, 100, 1120, 380, 20)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#7b87a3'
    ctx.font = 'italic 20px "Inter", Arial, sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText('6-stage pipeline', 60, 455)
  })

  renderElement(3, (ctx) => {
    drawBox(ctx, 60, 120, 180, 310, 'PC gen &\nInstr fetch\nstages')
  })

  renderElement(4, (ctx) => {
    drawBlockArrow(ctx, 245, 275, 285)
    drawBox(ctx, 290, 120, 170, 310, 'Instr Decode\nStage')
  })

  renderElement(5, (ctx) => {
    drawBlockArrow(ctx, 465, 275, 505)
    drawBox(ctx, 510, 120, 160, 310, 'Issue\nstage')
  })

  renderElement(6, (ctx) => {
    drawBlockArrow(ctx, 675, 275, 715)
    drawBox(ctx, 720, 120, 180, 310, 'Exec stage', 'top')
    drawBox(ctx, 735, 175, 150, 60, 'MMU')
    drawBox(ctx, 735, 250, 150, 60, 'PMP')
    drawBox(ctx, 735, 325, 150, 60, 'FPU')
  })

  renderElement(7, (ctx) => {
    drawBlockArrow(ctx, 905, 275, 945)
    drawBox(ctx, 950, 120, 190, 310, 'Commit\nstage')
  })

  renderElement(8, (ctx) => {
    drawBox(ctx, 60, 550, 180, 170, 'Perf counter')
  })

  renderElement(9, (ctx) => {
    drawBox(ctx, 290, 550, 180, 170, 'CSR register')
  })

  renderElement(10, (ctx) => {
    drawBox(ctx, 510, 550, 180, 170, 'Controller')
  })

  renderElement(11, (ctx) => {
    drawBox(ctx, 720, 550, 420, 170, 'Cache', 'top')
    drawBox(ctx, 740, 620, 170, 70, 'DCache')
    drawBox(ctx, 940, 620, 170, 70, 'ICache')
  })

  renderElement(12, (ctx) => {
    drawLineArrow(ctx, 810, 480, 810, 550, true)
    ctx.fillStyle = INK
    ctx.font = '22px "Inter", Arial, sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText('Internal bus', 825, 515)
  })

  renderElement(13, (ctx) => {
    drawLineArrow(ctx, 1140, 635, 1280, 635, true)
    ctx.fillStyle = INK
    ctx.font = '22px "Inter", Arial, sans-serif'
    fillTextMultiLine(ctx, 'External bus\n(AXI or P-Mesh)', 1290, 635, 28, 'left', 'middle')
  })
}

export function CVA6ArchitectureCanvas({ stage }: { stage: number }) {
  const canvasRef = useStagedCanvas(stage, CVA6_DIAGRAM_STEPS, drawScene, LOGICAL_WIDTH, LOGICAL_HEIGHT)

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full"
      style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
    />
  )
}
