import Attractors from "./canvas/attractors";
import Circle from "./canvas/circle";
import Dots from "./canvas/dots";
import FractalTree from "./canvas/fractalTree";

export const init = () => {
  new Dots().start();

  // const rng = Math.floor(Math.random() * 3) + 1;
  // switch(rng) {
  //   case 3: return new FractalTree().start();
  //   case 2: return new Circle().start();
  //   case 1:
  //   default: return new Attractors().start();
  // }
};
