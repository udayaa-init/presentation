import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function StatCard({
  value,
  label,
  className,
}: {
  value: string
  label: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-line bg-paper-dim/60 px-7 py-6 shadow-[0_1px_0_0_rgba(16,26,51,0.04)]',
        className,
      )}
    >
      <div className="font-mono text-[2.1rem] font-semibold tracking-tight text-ink">{value}</div>
      <div className="mt-1.5 text-[0.92rem] text-body">{label}</div>
    </div>
  )
}

export function StatStack({ children }: { children: ReactNode }) {
  return <div className="flex w-full max-w-sm flex-col gap-4">{children}</div>
}
