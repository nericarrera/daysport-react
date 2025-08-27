import { remerasHombre } from './remeras';          
import { pantalonesHombre } from './pantalones';      
import { shortsHombre } from './shorts';            
import { buzosHombre } from './buzos';            
import { camperasHombre } from './camperas';       
import { camperasLivianasHombre } from './camperas-livianas';
import { conjuntosHombre } from './conjuntos';
import { sweatersHombre } from './sweaters';


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