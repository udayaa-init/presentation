import { SlidePage, SplitLayout, Eyebrow } from '@/deck/Primitives'
import { DataTable } from '@/deck/DataTable'
import { ConfigLegend } from '@/deck/ConfigLegend'

export function ResultsPerformance(_props: { stage: number }) {
  return (
    <SlidePage>
      <SplitLayout
        eyebrow={<Eyebrow>Results & Evaluation</Eyebrow>}
        title="Results: Core Performance"
        ratio="visual-wide"
        visual={
          <DataTable
            columns={['Cfg', 'Max Freq (MHz)', 'CoreMark/MHz', 'CoreMark', 'Dhrystone/MHz']}
            rows={[
              ['A', '112.267', '2.64', '296.385', '1747.03'],
              ['B', '135.412', '2.64', '357.488', '1735.20'],
              ['C', '120.666', '2.64', '318.559', '1747.03'],
              ['D', '131.512', '2.64', '347.192', '1735.20'],
              ['E', '128.763', '2.61', '335.289', '1740.03'],
              ['F', '136.131', '2.61', '355.302', '1724.61'],
            ]}
          />
        }
      >
        <ConfigLegend />
      </SplitLayout>
    </SlidePage>
  )
}
