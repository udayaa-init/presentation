import { cn } from '@/lib/utils'

export interface DataTableProps {
  columns: string[]
  rows: (string | number)[][]
  highlightCols?: number[]
  caption?: string
  className?: string
  dense?: boolean
  /** Columns rendered as left-aligned prose instead of right-aligned mono numerals. */
  textCols?: number[]
}

export function DataTable({
  columns,
  rows,
  highlightCols = [],
  caption,
  className,
  dense,
  textCols = [],
}: DataTableProps) {
  return (
    <div className={cn('w-full', className)}>
      {caption && <div className="label-eyebrow mb-3">{caption}</div>}
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-ink/15">
            {columns.map((c, i) => (
              <th
                key={i}
                className={cn(
                  'pb-2.5 pr-4 font-mono text-[0.72rem] font-semibold tracking-wide text-ink-soft uppercase',
                  i > 0 && !textCols.includes(i) && 'text-right',
                )}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-line last:border-0">
              {row.map((cell, ci) => {
                const isText = textCols.includes(ci)
                return (
                  <td
                    key={ci}
                    className={cn(
                      dense ? 'py-1.5' : 'py-2.5',
                      'pr-4 text-[0.86rem] text-body',
                      ci === 0 && 'text-ink-soft font-medium',
                      ci > 0 && !isText && 'text-right font-mono tabular-nums',
                      highlightCols.includes(ci) && 'font-semibold text-ink',
                    )}
                  >
                    {cell}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
