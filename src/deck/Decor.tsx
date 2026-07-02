/** Quiet right-column companion for text-only slides — keeps the left-text /
 * right-visual rhythm of the deck without inventing chart content. */
export function SectionMark({ index, label }: { index: string; label: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="absolute h-[22rem] w-[22rem] rounded-full border border-line" />
      <div className="absolute h-[16rem] w-[16rem] rounded-full border border-line" />
      <div className="flex flex-col items-center">
        <span className="font-mono text-[6.5rem] leading-none font-semibold text-paper-dim [-webkit-text-stroke:1.5px_#e7eaf2]">
          {index}
        </span>
        <span className="label-eyebrow mt-4 text-center">{label}</span>
      </div>
    </div>
  )
}
