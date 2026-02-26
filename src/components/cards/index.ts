import React from 'react';
import GenericDog from './GenericDog';
import FoolDog from './FoolDog';
import MagicianDog from './MagicianDog';
import HighPriestessDog from './HighPriestessDog';
import EmpressDog from './EmpressDog';
import EmperorDog from './EmperorDog';
import HierophantDog from './HierophantDog';
import LoversDog from './LoversDog';
import ChariotDog from './ChariotDog';
import StrengthDog from './StrengthDog';
import HermitDog from './HermitDog';
import WheelDog from './WheelDog';
import JusticeDog from './JusticeDog';
import HangedDog from './HangedDog';
import DeathDog from './DeathDog';
import TemperanceDog from './TemperanceDog';
import DevilDog from './DevilDog';
import TowerDog from './TowerDog';
import StarDog from './StarDog';
import MoonDog from './MoonDog';
import SunDog from './SunDog';
import JudgementDog from './JudgementDog';
import WorldDog from './WorldDog';

export { GenericDog };

export const DogIllustrations: Record<number, React.FC<{ primaryColor?: string; secondaryColor?: string }>> = {
  0: FoolDog, 1: MagicianDog, 2: HighPriestessDog, 3: EmpressDog,
  4: EmperorDog, 5: HierophantDog, 6: LoversDog, 7: ChariotDog,
  8: StrengthDog, 9: HermitDog, 10: WheelDog, 11: JusticeDog,
  12: HangedDog, 13: DeathDog, 14: TemperanceDog, 15: DevilDog,
  16: TowerDog, 17: StarDog, 18: MoonDog, 19: SunDog,
  20: JudgementDog, 21: WorldDog,
};
