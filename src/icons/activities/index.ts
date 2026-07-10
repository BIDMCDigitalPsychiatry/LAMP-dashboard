// Activity icons for the cognitive-task batch added in the auth-upgrade Release 1.
// Keyed by ActivitySpec id. Each value is a URL string (default SVG import) usable
// directly in `url(${...})` backgrounds and as an ActivityImage preset.
import WCST from "./WCST.svg"
import MentalRotation from "./MentalRotation.svg"
import MemoryMatch from "./MemoryMatch.svg"
import SlidingPuzzle from "./SlidingPuzzle.svg"
import LetterLogic from "./LetterLogic.svg"
import Nonogram from "./Nonogram.svg"
import LexicalDecision from "./LexicalDecision.svg"
import Stroop from "./Stroop.svg"
import Flanker from "./Flanker.svg"
import NBack from "./NBack.svg"
import WaterSort from "./WaterSort.svg"
import DelayDiscounting from "./DelayDiscounting.svg"
import TowerOfLondon from "./TowerOfLondon.svg"
import SimpleRT from "./SimpleRT.svg"

export const activityIcons: { [spec: string]: string } = {
  "lamp.wcst": WCST,
  "lamp.mental_rotation": MentalRotation,
  "lamp.memory_match": MemoryMatch,
  "lamp.sliding_puzzle": SlidingPuzzle,
  "lamp.letter_logic": LetterLogic,
  "lamp.nonogram": Nonogram,
  "lamp.lexical_decision": LexicalDecision,
  "lamp.stroop": Stroop,
  "lamp.flanker": Flanker,
  "lamp.nback": NBack,
  "lamp.water_sort": WaterSort,
  "lamp.delay_discounting": DelayDiscounting,
  "lamp.tower_of_london": TowerOfLondon,
  "lamp.simple_rt": SimpleRT,
  // Legacy alias for early lamp.n_back registrations.
  "lamp.n_back": NBack,
}
