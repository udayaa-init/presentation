import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Small caps mono label used as a section eyebrow, e.g. "INTRODUCTION & MOTIVATION". */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="h-px w-8 bg-gold" />
      <span className="label-eyebrow">{children}</span>
    </div>
  )
}

export function SlideTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h1
      className={cn(
        'mt-5 text-[2.6rem] leading-[1.08] font-extrabold tracking-tight text-ink',
        className,
      )}
    >
      {children}
    </h1>
  )
}

export function SlideKicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('mt-4 max-w-xl text-[1.05rem] leading-relaxed text-body', className)}>
      {children}
    </p>
  )
}

/**
 * Base full-bleed page. Every slide is one of these so the deck can measure
 * a consistent 100svh unit per slide for scroll-snap navigation.
 */
export function SlidePage({
  children,
  className,
  bleed = false,
}: {
  children: ReactNode
  className?: string
  bleed?: boolean
}) {
  return (
    <section
      className={cn(
        'relative flex h-svh w-screen shrink-0 snap-start flex-col overflow-hidden bg-paper',
        !bleed && 'px-14 py-16 md:px-20 md:py-20',
        className,
      )}
    >
      {children}
    </section>
  )
}

/**
 * The signature layout: text column on the left, diagram/visual on the
 * right. Used by the majority of content slides.
 */
export function SplitLayout({
  eyebrow,
  title,
  children,
  visual,
  visualClassName,
  ratio = 'balanced',
}: {
  eyebrow?: ReactNode
  title: ReactNode
  children?: ReactNode
  visual?: ReactNode
  visualClassName?: string
  ratio?: 'balanced' | 'text-wide' | 'visual-wide'
}) {
  const gridCols =
    ratio === 'text-wide'
      ? 'lg:grid-cols-[1.15fr_0.85fr]'
      : ratio === 'visual-wide'
        ? 'lg:grid-cols-[0.8fr_1.2fr]'
        : 'lg:grid-cols-2'

  return (
    <div className={cn('grid h-full grid-cols-1 items-center gap-12', gridCols)}>
      <div className="flex max-w-xl flex-col justify-center">
        {eyebrow}
        <SlideTitle>{title}</SlideTitle>
        {children}
      </div>
      {visual && (
        <div className={cn('flex h-full min-h-0 items-center justify-center', visualClassName)}>
          {visual}
        </div>
      )}
    </div>
  )
}

export function BulletList({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={cn('mt-7 space-y-4', className)}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[1.04rem] leading-relaxed text-body">
          <span className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function DashList({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={cn('mt-7 space-y-3.5', className)}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[1.04rem] leading-relaxed text-body">
          <span className="mt-[0.15em] font-mono text-gold">–</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function SlideIndex({ index, total }: { index: number; total: number }) {
  return (
    <div className="absolute bottom-8 left-14 font-mono text-xs tracking-wide text-muted md:left-20">
      {String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}
    </div>
  )
}
