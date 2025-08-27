import { remerasHombre } from './remeras';
import { pantalonesHombre } from './pantalones';
import { shortsHombre } from './shorts';
import { buzosHombre } from './buzos';
import { camperasHombre } from './camperas';
import { camperasLivianasHombre} from './camperaslivianas' // ← Nueva importación

export const productosHombre = [
  ...remerasHombre,
  ...pantalonesHombre,
  ...shortsHombre,
  ...buzosHombre,
  ...camperasHombre,
  ...camperasLivianasHombre // ← Agregar al array
];

// Exportar individualmente también
export { remerasHombre, pantalonesHombre, shortsHombre, buzosHombre, camperasHombre };