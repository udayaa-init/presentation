const CONFIGS: [string, string][] = [
  ['A', 'Master FPGA config'],
  ['B', 'Master Small config'],
  ['C', 'SB + ROB FPGA config'],
  ['D', 'SB + ROB Small config'],
  ['E', 'SB+ROB and COR FPGA config'],
  ['F', 'SB+ROB and COR Small config'],
]

export function ConfigLegend() {
  return (
    <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-2.5">
      {CONFIGS.map(([letter, name]) => (
        <div key={letter} className="flex items-baseline gap-2.5">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-[0.65rem] font-semibold text-white">
            {letter}
          </span>
          <span className="text-[0.86rem] text-body">{name}</span>
        </div>
      ))}
    </div>
  )
}
