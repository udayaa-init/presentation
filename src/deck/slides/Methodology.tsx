import { SlidePage, SplitLayout, Eyebrow, BulletList } from '@/deck/Primitives'
import { DataTable } from '@/deck/DataTable'
import { SectionMark } from '@/deck/Decor'
export function Methodology({stage}: { stage: number }) {
  return (
    <SlidePage>
      <SplitLayout
        eyebrow={<Eyebrow>Hardware Implementation, Evaluation & Future Work</Eyebrow>}
        title="Experimental Setup & Methodology"
        ratio="balanced"
        visual={
          stage === 0 ? (
                                    // Shows initially (stage 0)
                                    <SectionMark index="05" label="Goals" />
                                  ) :<DataTable
            caption="Configuration Parameters"
            columns={['Parameters', 'FPGA Cfg', 'Small Cfg']}
            rows={[
              ['Data Cache Size', '8 KB', '4 KB'],
              ['Instruction Cache Size (B)', '8 KB', '8 KB'],
              ['ICache and DCache Line Width', '128', '64'],
              ['MMU present', '1', '0'],
              ['A Extension', '1', '0'],
              ['RVS and RVU', '1', '0'],
              ['Store and Commit buffer depth', '4', '2'],
              ['Debug Enabled', '0', '0'],
            ]}
          />
        }
      >
        <BulletList
          items={[
            <>
              <span className="font-semibold text-ink">Hardware Platform</span>: Digilent
              Genesys-2 development board with a Xilinx Kintex-7 FPGA.
            </>,
            <>
              <span className="font-semibold text-ink">Configurations Tested</span>: Master FPGA
              configuration and a minimized Small configuration.
            </>,
            <>
              <span className="font-semibold text-ink">Simulation</span>: Verilator was used for
              cycle-accurate open-source verification.
            </>,
            <>
              <span className="font-semibold text-ink">Benchmarks</span>: Evaluated using
              CoreMark, Dhrystone, and kernels adapted from PolyBench and STREAM.
            </>,
          ]}
        />
      </SplitLayout>
    </SlidePage>
  )
}
