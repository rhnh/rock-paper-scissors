import { PAPER, ROCK, SCISSORS } from "types";
import type { Chain, Move } from "types";

const markovChain: Chain = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
let lastIndex: number = 0;

export function move(): Move {
  if (lastIndex === undefined || lastIndex < 0)
    return Math.floor(Math.random() * 3) as unknown as Move;
  const moves = markovChain[lastIndex];
  if (moves === undefined) return;
  if (moves[1] >= moves[2] && moves[1] >= moves[0]) return SCISSORS;
  if (moves[0] >= moves[1] && moves[0] > moves[2]) return PAPER;
  return ROCK;
}

export function setPreviousMove(oppositionMove: Move) {
  markovChain[lastIndex][oppositionMove] += 1;
  lastIndex = oppositionMove;
}
