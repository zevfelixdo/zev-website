/**
 * Registry of Zev's spot-illustration cartoons (transparent PNGs in
 * /public/cartoons). Keep keys stable — components reference them by key so
 * we get type-safety and a single place to manage alt text + intrinsic size.
 */
export interface CartoonMeta {
  file: string;
  width: number;
  height: number;
  alt: string;
}

export const cartoons = {
  "treating-person": { file: "treating-person.png", width: 822, height: 852, alt: "Illustration of Zev examining a patient at the bedside" },
  "laying-with-maisy": { file: "laying-with-maisy.png", width: 956, height: 776, alt: "Illustration of Zev sitting in the grass with a coffee and his dog Maisy" },
  "petting-maisy": { file: "petting-maisy.png", width: 938, height: 672, alt: "Illustration of Zev crouching to greet his dog Maisy" },
  "bike-w-maisy": { file: "bike-w-maisy.png", width: 942, height: 904, alt: "Illustration of Zev cycling with Maisy" },
  "hiking-walking": { file: "hiking-walking.png", width: 684, height: 1050, alt: "Illustration of Zev hiking with a backpack and first-aid kit" },
  "hiking-standing": { file: "hiking-standing.png", width: 468, height: 1126, alt: "Illustration of Zev standing with hiking gear" },
  "drinking-coffee": { file: "drinking-coffee.png", width: 478, height: 996, alt: "Illustration of Zev standing with a coffee mug" },
  "walking": { file: "walking.png", width: 636, height: 1000, alt: "Illustration of Zev walking with a first-aid kit" },
  "standing": { file: "standing.png", width: 400, height: 1000, alt: "Illustration of Zev standing in scrubs with a clipboard" },
  "laptop": { file: "laptop.png", width: 626, height: 1014, alt: "Illustration of Zev working at a standing laptop station" },
  "sitting-w-laptop": { file: "sitting-w-laptop.png", width: 640, height: 454, alt: "Illustration of Zev sitting with a laptop" },
  "sitting": { file: "sitting.png", width: 822, height: 852, alt: "Illustration of Zev sitting" },
  "teaching": { file: "teaching.png", width: 634, height: 564, alt: "Illustration of Zev teaching at a board" },
  "high-five": { file: "high-five.png", width: 548, height: 510, alt: "Illustration of Zev high-fiving a young patient" },
  "talking-to-kid": { file: "talking-to-kid.png", width: 670, height: 748, alt: "Illustration of Zev talking with a child" },
  "talking-to-nurse": { file: "talking-to-nurse.png", width: 548, height: 786, alt: "Illustration of Zev talking with a nurse" },
  "ultrasound": { file: "ultrasound.png", width: 770, height: 564, alt: "Illustration of Zev performing an ultrasound" },
  "xray": { file: "xray.png", width: 418, height: 550, alt: "Illustration of Zev reviewing an x-ray" },
  "scrubbing": { file: "scrubbing.png", width: 548, height: 786, alt: "Illustration of Zev scrubbing in" },
  "iv-pole": { file: "iv-pole.png", width: 526, height: 1000, alt: "Illustration of Zev with an IV pole" },
  "wrapping-ace": { file: "wrapping-ace.png", width: 658, height: 506, alt: "Illustration of Zev wrapping an ace bandage" },
  "brace": { file: "brace.png", width: 680, height: 564, alt: "Illustration of Zev fitting a brace" },
  "lunging": { file: "lunging.png", width: 794, height: 564, alt: "Illustration of Zev guiding a stretch" },
  "sports": { file: "sports.png", width: 538, height: 520, alt: "Illustration of Zev being active" },
  "plant": { file: "plant.png", width: 680, height: 802, alt: "Illustration of Zev tending a plant" },
  "older-gentleman": { file: "older-gentleman.png", width: 742, height: 708, alt: "Illustration of Zev with an older patient" },
  "whole-family": { file: "whole-family.png", width: 538, height: 564, alt: "Illustration of Zev with a family" },
} as const;

export type CartoonKey = keyof typeof cartoons;
