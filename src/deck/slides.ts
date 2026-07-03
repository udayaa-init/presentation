import type { SlideDefinition } from './types'
import { TitleSlide } from './slides/TitleSlide'
import { IntroMotivation } from './slides/IntroMotivation'
import { Outline } from './slides/Outline'
import { Background, BACKGROUND_STAGE_COUNT } from './slides/Background'
import { Analysis, ANALYSIS_STAGE_COUNT } from './slides/Analysis'
import { ProposedOverview } from './slides/ProposedOverview'
import { ScoreboardRob, SCOREBOARD_ROB_STAGE_COUNT } from './slides/ScoreboardRob'
import { ControllerFsm, CONTROLLER_FSM_STAGE_COUNT } from './slides/ControllerFsm'
import { Fetchflare } from './slides/Fetchflare'
import { Methodology } from './slides/Methodology'
import { ResultsTiming } from './slides/ResultsTiming'
import { ResultsResourceCore } from './slides/ResultsResourceCore'
import { ResultsResourcePrefetch } from './slides/ResultsResourcePrefetch'
import { ResultsPerformance } from './slides/ResultsPerformance'
import { ResultsPrefetch } from './slides/ResultsPrefetch'
import { Conclusion } from './slides/Conclusion'
import { Acknowledgement } from './slides/Acknowledgement'

/**
 * The deck, in presentation order — this list IS the slide order.
 * Reorder the deck by reordering this array. A slide that builds up over
 * several keypresses sets `stageCount`; the diagram component it renders
 * owns the actual stage content (see e.g. deck/diagrams/CVA6ArchitectureCanvas.tsx).
 */
export const slides: SlideDefinition[] = [
  { id: 'title', section: 'Cover', Component: TitleSlide },
  { id: 'intro-motivation', section: 'Introduction & Motivation', Component: IntroMotivation,stageCount:4 },
  { id: 'outline', section: 'Outline', Component: Outline, stageCount:7 },
  {
    id: 'background',
    section: 'Background: The CVA6 Core',
    Component: Background,
    stageCount: BACKGROUND_STAGE_COUNT,
  },
  { id: 'analysis', section: 'Analysis', Component: Analysis, stageCount: ANALYSIS_STAGE_COUNT },
  {
    id: 'proposed-overview',
    section: 'Proposed Optimization Overview',
    Component: ProposedOverview,
    stageCount: 3,
  },
  {
    id: 'scoreboard-rob',
    section: 'Optimization: Scoreboard & ROB',
    Component: ScoreboardRob,
    stageCount: SCOREBOARD_ROB_STAGE_COUNT,
  },
  {
    id: 'controller-fsm',
    section: 'Optimization: Controller FSM',
    Component: ControllerFsm,
    stageCount: CONTROLLER_FSM_STAGE_COUNT,
  },
  { id: 'fetchflare', section: 'Data Prefetching: Fetchflare', Component: Fetchflare, stageCount: 2 },
  { id: 'methodology', section: 'Experimental Setup & Methodology', Component: Methodology, stageCount: 2  },
  { id: 'results-timing', section: 'Results: Timing & Frequency', Component: ResultsTiming },
  { id: 'results-resource', section: 'Results: Resource Utilization', Component: ResultsResourceCore, stageCount: 2 },
  { id: 'results-resource-prefetch', section: 'Results: Resource Utilization', Component: ResultsResourcePrefetch, stageCount: 2 },
  { id: 'results-performance', section: 'Results: Core Performance', Component: ResultsPerformance },
  { id: 'results-prefetch', section: 'Results: Data Prefetching', Component: ResultsPrefetch },
  { id: 'conclusion', section: 'Conclusion & Future Prospects', Component: Conclusion },
  { id: 'acknowledgement', section: 'Acknowledgement', Component: Acknowledgement },
]
