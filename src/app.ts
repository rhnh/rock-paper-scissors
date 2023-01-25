import { Move, MoveName, Player } from "types";
import {
  callWinner,
  changeMoveToName,
  changeNameToMove,
  getWinner,
  removeArenaAllItems,
} from "./tools";
import { move, setPreviousMove } from "./markov";

const TOTAL_ROUNDS = 5;
let round = 1;
let wins = 0;
let draws = 0;

const attachEventListeners = () => {
  document.addEventListener("click", async (event) => {
    const eventTarget = event.target as unknown as EventTarget;
    const arena = document.getElementById("arena");

    if (eventTarget instanceof HTMLElement) {
      //getting specific button
      const button = eventTarget.className.includes(
        "player-buttons"
      ) as unknown as HTMLButtonElement;

      if (button) {
        //disable buttons
        const animatedObject = {
          selector: ".arena-images",
          className: "arena-images-animation",
        };
        const allButtons = document.querySelectorAll(".player-buttons");
        //remove all buttons after click
        removeButtons(allButtons);
        removeArenaAllItems();

        const playerMoveName = eventTarget.getAttribute(
          "name"
        ) as unknown as MoveName;
        const playerMove = changeNameToMove(playerMoveName);
        const opponentMove = move();
        setPreviousMove(playerMove);
        const sections = document.createElement("section");
        showAnimation(sections, "./images/rock-moving.svg");

        arena.appendChild(
          showAnimation(sections, "./images/rock-moving-bot.svg")
        );
        showResult({ arena, playerMove, opponentMove, buttons: allButtons });
      }
    }
  });
};

const removeButtons = (buttons: NodeListOf<Element>) => {
  buttons.forEach((btn) => btn.classList.add("hidden"));
};
const showButtons = (buttons: NodeListOf<Element>) => {
  buttons.forEach((btn) => btn.classList.remove("hidden"));
};

const showAnimation = (
  sections: HTMLElement,
  file: string,
  className?: string
) => {
  const playerAnimation = document.createElement("img");
  playerAnimation.setAttribute("src", file);
  playerAnimation.classList.add(`arena-images-animation`);
  playerAnimation.classList.add(className);
  sections.appendChild(playerAnimation);
  return sections;
};

const showResult = ({
  arena,
  playerMove,
  opponentMove,
  buttons,
}: {
  arena: HTMLElement;
  playerMove: Move;
  opponentMove: Move;
  buttons: NodeListOf<Element>;
}) => {
  if (round === TOTAL_ROUNDS) {
    removeArenaAllItems();
    const overall = document.createElement("h3");
    const losses = TOTAL_ROUNDS - (draws + wins);
    overall.innerHTML = `You won ${wins} <br/> lost ${losses} <br/>  and drew ${draws} out of ${TOTAL_ROUNDS}`;
    arena.appendChild(overall);
    return;
  }
  setTimeout(() => {
    removeArenaAllItems();
    const winner = getWinner(playerMove, opponentMove);
    if (winner === 0) {
      draws++;
    } else if (winner === 1) {
      wins++;
    }
    const winnerName = callWinner(winner);
    const boardMessage = document.createElement("p");
    boardMessage.innerHTML = `Round: ${round}/${TOTAL_ROUNDS} <br/> ${winnerName}`;

    const playerMoveImage = changeMoveToName(playerMove);
    const opponentMoveImage = changeMoveToName(opponentMove);

    const playerImage = document.createElement("img");
    playerImage.setAttribute("src", `./images/${playerMoveImage}`);

    const opponentImage = document.createElement("img");
    opponentImage.setAttribute("src", `./images/${opponentMoveImage}`);
    opponentImage.classList.add("opponentImage");
    const sections = document.createElement("section");
    sections.appendChild(playerImage);
    sections.appendChild(opponentImage);
    arena.appendChild(boardMessage);
    arena.appendChild(sections);
    showButtons(buttons);
    round++;
  }, 2000);
};

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
attachEventListeners();
