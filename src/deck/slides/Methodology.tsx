import { SlidePage, SplitLayout, Eyebrow } from '@/deck/Primitives'
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
          <div className="relative w-full h-full flex items-center justify-center">
  {/* 1. SectionMark - Fades out smoothly when stage hits 4 */}
  <div 
    className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
      stage < 4 
        ? 'opacity-100 scale-100 pointer-events-auto' 
        : 'opacity-0 scale-95 pointer-events-none'
    }`}
  >
    <SectionMark index="05" label="Environment" />
  </div>

  {/* 2. DataTable - Always mounted, transitions cleanly into view at stage 4 */}
  <div 
    className={`w-full transition-all duration-700 ease-out transform ${
      stage === 4 
        ? 'opacity-100 translate-y-0 pointer-events-auto visible' 
        : 'opacity-0 translate-y-4 pointer-events-none absolute inset-0 invisible'
    }`}
  >
    <DataTable
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
  </div>
</div>
        }
      >
        {/* <BulletList
  items={[
    { text: <><strong>Hardware Platform</strong>: Digilent Genesys-2 development board with a Xilinx Kintex-7 FPGA.</>, targetStage: 1 },
    { text: <><strong>Simulation</strong>: Verilator was used for cycle-accurate open-source verification.</>, targetStage: 2 },
    { text: <><strong>Benchmarks</strong>: Evaluated using CoreMark, Dhrystone, and kernels adapted from PolyBench and STREAM.</>, targetStage: 3 },
    { text: <><strong>Configurations Tested</strong>: Master FPGA configuration and a minimized Small configuration.</>, targetStage: 4 },
  ].map(({ text, targetStage }, index) => (
    <div
      key={index}
      className={`transition-all duration-700 ease-out ${
      stage >= targetStage
        ? 'opacity-100 translate-y-0 max-h-[100px] visible'
        : 'opacity-0 translate-y-2 max-h-0 overflow-hidden pointer-events-none !p-0 !m-0 list-none'
    }`}
    >
      {text}
    </div>
  ))}
/>  */}
<ul className="space-y-4 list-none p-0 m-0">
  {[
    { text: <><strong>Hardware Platform</strong>: Digilent Genesys-2 development board with a Xilinx Kintex-7 FPGA.</>, targetStage: 1 },
    { text: <><strong>Simulation</strong>: Verilator was used for cycle-accurate open-source verification.</>, targetStage: 2 },
    { text: <><strong>Benchmarks</strong>: Evaluated using CoreMark, Dhrystone, and kernels adapted from PolyBench and STREAM.</>, targetStage: 3 },
    { text: <><strong>Configurations Tested</strong>: Master FPGA configuration and a minimized Small configuration.</>, targetStage: 4 },
  ].map(({ text, targetStage }, index) => (
    <li
      key={index}
      className={`transition-all duration-700 ease-out flex items-start gap-4 text-[1.04rem] leading-relaxed text-ink-soft ${
        stage >= targetStage
          ? 'opacity-100 translate-y-0 max-h-[100px]'
          : 'opacity-0 translate-y-2 max-h-0 overflow-hidden pointer-events-none !mt-0'
      }`}
    >
      {/* Matches the exact gold bullet color and alignment from image_0587ec.png */}
      <span className="inline-block min-w-[7px] h-[7px] rounded-full bg-gold mt-[0.65rem] flex-shrink-0" />
      
      <div>
        {text}
      </div>
    </li>
  ))}
</ul>
      </SplitLayout>
    </SlidePage>
  )
}
