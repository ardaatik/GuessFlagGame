import seedrandom from "random-seed";

let seed: string;
let rng: seedrandom.RandomSeed;

export function generateRandomNumber(newSeed: string) {
  if (newSeed !== seed) {
    seed = newSeed;
    rng = seedrandom.create(seed);
  }
  const randomNumber = rng.random();
  return randomNumber;
}
