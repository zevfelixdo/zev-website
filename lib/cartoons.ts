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
  "treating-person": { file: "treating-person.png", width: 1000, height: 831, alt: "Illustration of Zev examining a patient at the bedside" },
  "laying-with-maisy": { file: "laying-with-maisy.png", width: 1000, height: 626, alt: "Illustration of Zev sitting in the grass with a coffee and his dog Maisy" },
  "petting-maisy": { file: "petting-maisy.png", width: 1000, height: 641, alt: "Illustration of Zev crouching to greet his dog Maisy" },
  "bike-w-maisy": { file: "bike-w-maisy.png", width: 1000, height: 843, alt: "Illustration of Zev cycling with Maisy" },
  "hiking-walking": { file: "hiking-walking.png", width: 684, height: 1050, alt: "Illustration of Zev hiking with a backpack and first-aid kit" },
  "hiking-standing": { file: "hiking-standing.png", width: 308, height: 891, alt: "Illustration of Zev standing with hiking gear" },
  "drinking-coffee": { file: "drinking-coffee.png", width: 458, height: 1000, alt: "Illustration of Zev standing with a coffee mug" },
  "walking": { file: "walking.png", width: 735, height: 1000, alt: "Illustration of Zev walking with a first-aid kit" },
  "standing": { file: "standing.png", width: 417, height: 1000, alt: "Illustration of Zev standing in scrubs with a clipboard" },
  "laptop": { file: "laptop.png", width: 1000, height: 570, alt: "Illustration of Zev working at a standing laptop station" },
  "sitting-w-laptop": { file: "sitting-w-laptop.png", width: 640, height: 454, alt: "Illustration of Zev sitting with a laptop" },
  "sitting": { file: "sitting.png", width: 822, height: 852, alt: "Illustration of Zev sitting" },
  "teaching": { file: "teaching.png", width: 1000, height: 912, alt: "Illustration of Zev teaching at a board" },
  "high-five": { file: "high-five.png", width: 548, height: 510, alt: "Illustration of Zev high-fiving a young patient" },
  "talking-to-kid": { file: "talking-to-kid.png", width: 1000, height: 863, alt: "Illustration of Zev talking with a child" },
  "talking-to-nurse": { file: "talking-to-nurse.png", width: 986, height: 930, alt: "Illustration of Zev talking with a nurse" },
  "ultrasound": { file: "ultrasound.png", width: 770, height: 564, alt: "Illustration of Zev performing an ultrasound" },
  "xray": { file: "xray.png", width: 418, height: 550, alt: "Illustration of Zev reviewing an x-ray" },
  "scrubbing": { file: "scrubbing.png", width: 548, height: 786, alt: "Illustration of Zev scrubbing in" },
  "iv-pole": { file: "iv-pole.png", width: 526, height: 1000, alt: "Illustration of Zev with an IV pole" },
  "wrapping-ace": { file: "wrapping-ace.png", width: 658, height: 506, alt: "Illustration of Zev wrapping an ace bandage" },
  "brace": { file: "brace.png", width: 1000, height: 699, alt: "Illustration of Zev fitting a brace" },
  "lunging": { file: "lunging.png", width: 794, height: 564, alt: "Illustration of Zev guiding a stretch" },
  "sports": { file: "sports.png", width: 1000, height: 850, alt: "Illustration of Zev being active" },
  "plant": { file: "plant.png", width: 1000, height: 841, alt: "Illustration of Zev tending a plant" },
  "older-gentleman": { file: "older-gentleman.png", width: 1000, height: 633, alt: "Illustration of Zev with an older patient" },
  "whole-family": { file: "whole-family.png", width: 1000, height: 946, alt: "Illustration of Zev with a family" },
  // Hi-res additions (2026): solo Maisy poses + alternate Zev standing angles
  "maisy-trotting": { file: "maisy-trotting.png", width: 431, height: 336, alt: "Illustration of Maisy the dog trotting" },
  "maisy-sniffing": { file: "maisy-sniffing.png", width: 336, height: 346, alt: "Illustration of Maisy the dog sniffing" },
  "maisy-walking": { file: "maisy-walking.png", width: 462, height: 313, alt: "Illustration of Maisy the dog walking" },
  "maisy-lying": { file: "maisy-lying.png", width: 431, height: 249, alt: "Illustration of Maisy the dog lying down" },
  "maisy-standing": { file: "maisy-standing.png", width: 423, height: 334, alt: "Illustration of Maisy the dog standing" },
  "maisy-running": { file: "maisy-running.png", width: 465, height: 286, alt: "Illustration of Maisy the dog running" },
  "scrubs-front": { file: "scrubs-front.png", width: 293, height: 903, alt: "Illustration of Zev standing in scrubs" },
  "scrubs-front-alt": { file: "scrubs-front-alt.png", width: 281, height: 903, alt: "Illustration of Zev standing in scrubs" },
  "scrubs-side": { file: "scrubs-side.png", width: 161, height: 903, alt: "Illustration of Zev in scrubs, side view" },
  "scrubs-back": { file: "scrubs-back.png", width: 270, height: 902, alt: "Illustration of Zev in scrubs, back view" },
  "outdoor-left": { file: "outdoor-left.png", width: 220, height: 886, alt: "Illustration of Zev in outdoor gear with a backpack" },
  "outdoor-right": { file: "outdoor-right.png", width: 311, height: 890, alt: "Illustration of Zev in outdoor gear with a backpack" },
  "outdoor-back": { file: "outdoor-back.png", width: 264, height: 884, alt: "Illustration of Zev in outdoor gear, back view" },
  "family-visit": { file: "family-visit.png", width: 1000, height: 946, alt: "Illustration of Zev meeting a family with a young girl and a baby" },
} as const;

export type CartoonKey = keyof typeof cartoons;
