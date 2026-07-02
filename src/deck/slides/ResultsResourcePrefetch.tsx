import { SlidePage, SplitLayout, Eyebrow } from '@/deck/Primitives'
import { DataTable } from '@/deck/DataTable'
import { ConfigLegend } from '@/deck/ConfigLegend'

export function ResultsResourcePrefetch({ stage }: { stage: number }) {
  return (
    <SlidePage>
      <SplitLayout
        eyebrow={<Eyebrow>Results & Evaluation</Eyebrow>}
        title="Results: Resource Utilization"
        ratio="visual-wide"
        visual={
          <div className="flex w-full flex-col gap-8">
            <DataTable
              columns={['Cfg', 'LUT', 'FF', 'BRAM']}
              rows={[
                ['A', '9692', '5410', '13'],
                ['B', '7726', '3809', '7'],
                ['C', '9823', '5569', '13'],
                ['D', '7894', '3961', '7'],
                ['E', '10555', '6099', '13'],
                ['F', '8085', '4119', '7'],
              ]}
            />
            {stage >= 1 && (
              <div className="animate-fade-up">
                <DataTable
                  caption="Table 4.5 — Resource Comparison"
                  columns={['vs.', 'LUT', 'FF']}
                  dense
                  rows={[
                    ['A vs. C', '1.35%', '2.94%'],
                    ['B vs. D', '2.1%', '3.99%'],
                    ['A vs. E', '8.90%', '12.74%'],
                    ['B vs. F', '4.65%', '8.14%'],
                  ]}
                />
              </div>
            )}
          </div>
        }
      >
        <ConfigLegend />
      </SplitLayout>
    </SlidePage>
  )
}
