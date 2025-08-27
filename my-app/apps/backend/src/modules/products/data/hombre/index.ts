import { remerasHombre } from './remeras';          // ← SIN .ts
import { pantalonesHombre } from './pantalones';    // ← SIN .ts  
import { shortsHombre } from './shorts';            // ← SIN .ts
import { buzosHombre } from './buzos';              // ← SIN .ts
import { camperasHombre } from './camperas';        // ← SIN .ts
import { camperasLivianasHombre } from './camperaslivianas'; // ← SIN .ts

export const productosHombre = [
  ...remerasHombre,
  ...pantalonesHombre,
  ...shortsHombre,
  ...buzosHombre,
  ...camperasHombre,
  ...camperasLivianasHombre
];

export { 
  remerasHombre, 
  pantalonesHombre, 
  shortsHombre, 
  buzosHombre, 
  camperasHombre, 
  camperasLivianasHombre 
};