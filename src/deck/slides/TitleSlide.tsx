import { SlidePage } from '@/deck/Primitives'
import { RptuLogo, PlanVLogo, EisLogo } from '@/deck/Logos'

export function TitleSlide(_props: { stage: number }) {
  return (
    <SlidePage className="justify-between">
      <div className="flex items-start justify-between">
        <RptuLogo />
        <PlanVLogo />
      </div>

      <div className="max-w-3xl animate-fade-up">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-gold" />
          <span className="label-eyebrow">Master's Thesis Defence</span>
        </div>
        <h1 className="mt-6 text-[4.2rem] leading-[1.04] font-extrabold tracking-tight text-ink">
          CVA6 Optimization
        </h1>
        <p className="mt-6 max-w-2xl text-[1.2rem] leading-relaxed text-body">
          Microarchitectural optimization of the open-source RISC-V CVA6 core for higher
          frequency and hiding memory latency
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-2.5">
          <div>
            <div className="text-[2.05rem] font-bold text-ink">Udaya Raj Subedi</div>
            <div className="font-mono text-[1.78rem] text-muted">PlanV GmbH </div>
          </div>
          <div className="text-[1.55rem] text-body">
            <span className="text-muted">Examiner</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Prof. Dr.-Ing. Wolfgang Kunz
          </div>
          <div className="text-[1.55rem] text-body">
            <span className="text-muted">Supervisor</span>&nbsp;&nbsp; Dr.-Ing. Ángela González Mariño &nbsp;·&nbsp;  Massimiliano Giacometti
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <EisLogo />
          <div className="font-mono text-[1.0rem] text-ink-soft">July 9th, 2026</div>
        </div>
      </div>
    </SlidePage>
  )
}
