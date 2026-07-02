import { SlidePage, SplitLayout, Eyebrow } from '@/deck/Primitives'
import { DataTable } from '@/deck/DataTable'
import { ConfigLegend } from '@/deck/ConfigLegend'

export function ResultsTiming(_props: { stage: number }) {
  return (
    <SlidePage>
      <SplitLayout
        eyebrow={<Eyebrow>Results & Evaluation</Eyebrow>}
        title="Results: Timing & Frequency Analysis"
        ratio="visual-wide"
        visual={
          <DataTable
            columns={['Cfg', 'Synth. Freq (MHz)', 'WNS (ns)', 'Max Freq (MHz)', 'Failing Endpoints']}
            highlightCols={[3]}
            rows={[
              ['A', '130', '-1.215', '112.267', '3880'],
              ['B', '140', '-0.242', '135.412', '113'],
              ['C', '130', '-0.5958', '120.666', '1205'],
              ['D', '140', '-0.461', '131.512', '170'],
              ['E', '130', '-0.092', '128.763', '29'],
              ['F', '140', '-0.203', '136.131', '7'],
            ]}
          />
        }
      >
        <ConfigLegend />
      </SplitLayout>
    </SlidePage>
  )
}
