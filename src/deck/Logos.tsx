import planvLogo from '@/assets/logos/planV_logo.png'
import rptuLogo from '@/assets/logos/rptu.png'
import eisLogo from '@/assets/logos/eis.png'

export function RptuLogo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <img src={rptuLogo} alt="RPTU — Rheinland-Pfälzische Technische Universität Kaiserslautern · Landau" className="h-30 w-auto" />
    </div>
  )
}

export function PlanVLogo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <img src={planvLogo} alt="PlanV" className="h-34 w-auto" />
    </div>
  )
}

export function EisLogo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <img src={eisLogo} alt="EIS — Entwurf informationstechnischer Systeme" className="h-30 w-auto" />
    </div>
  )
}
