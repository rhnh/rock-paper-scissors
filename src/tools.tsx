import { Move, MoveName, Player } from "types";


export const changeMoveToName = (move: Move): string => {
  if (move === 0) {
    return "rock.svg";
  } else if (move == 1) {
    return "paper.svg";
  } else if (move === 2) {
    return "scissors.svg";
  }
  return "failed.svg";
};
export const changeNameToMove = (name: MoveName) => {
  if (name === "rock") return 0;
  if (name === "paper") return 1;
  if (name === "scissors") return 2;
};

export const getResult = (player: Player | 0) => {
  if (player === 1) {
    return "You won";
  } else if (player === 2) {
    return "You lost";
  }
  return "It is a draw!";
};

export const getWinner = (m1: Move, m2: Move): Player | 0 =>
  ((3 + m1 - m2) % 3) as unknown as Player | 0;




export const removeArenaAllItems = () => {
  const arena = document.getElementById("arena");
  while (arena.firstChild) {
    arena.removeChild(arena.firstChild)
  }
}


export const addArenaChild = (el: HTMLElement) => {
  const arena = document.getElementById('arena');
  arena.appendChild(el);
}



export const callWinner = (player: Player | 0) => {
  if (player === 1) {
    return "You won!"
  }
  if (player === 2) {
    return "You lost"
  }
  if (player === 0) {
    return "It is a draw"
  }
}

export const addAnimation = ({
  selector,
  className,
}: {
  selector: string;
  className: string;
}) => {
  const arenaImages = document.querySelectorAll(selector);
  arenaImages.forEach((image) => image.classList.add(className));
};
export const removeAnimation = ({
  selector,
  className,
}: {
  selector: string;
  className: string;
}) => {
  const arenaImages = document.querySelectorAll(selector);
  arenaImages.forEach((image) => image.classList.remove(className));
};