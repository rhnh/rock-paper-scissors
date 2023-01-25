import { MoveName, Player } from "types";
import {
  addAnimation,
  callWinner,
  changeMoveToName,
  changeNameToMove,
  getWinner,
  removeAnimation,
  removeArenaAllItems,
} from "./tools";
import { move, setPreviousMove } from "./markov";
const TOTAL_ROUNDS = 3;
const GAMES_PER_ROUND = 3;

let game = 0;
let round = 0;

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
        //getting move name;
        const moveName = eventTarget.getAttribute(
          "name"
        ) as unknown as MoveName;
        const playerMove = changeNameToMove(moveName);

        const result = new Promise((resolve) => {
          resolve(allButtons);
        });
        result
          .then((value: NodeListOf<Element>) => {
            // value.forEach((r) => r.classList.add("hidden"));
            addAnimation(animatedObject);
            removeArenaAllItems();
            const playerAnimatedHand = document.createElement("img");
            const opponentAnimatedHand = document.createElement("img");

            opponentAnimatedHand.setAttribute(
              "src",
              `./images/rock-moving-bot.svg`
            );
            playerAnimatedHand.setAttribute("src", `./images/rock-moving.svg`);

            opponentAnimatedHand.classList.add("arena-images-animation");
            playerAnimatedHand.classList.add("arena-images-animation");
            arena.appendChild(playerAnimatedHand);
            arena.appendChild(opponentAnimatedHand);
            return value;
          })

          .then((value) => {
            const playerMoveImage = changeNameToMove(moveName);

            if (TOTAL_ROUNDS === round && game === GAMES_PER_ROUND) {
              removeArenaAllItems();
              return false;
            }
            setTimeout(() => {
              removeArenaAllItems();
              const playerImage = document.createElement("img");

              playerImage.setAttribute("src", `./images/${moveName}.svg`);

              const opponentImage = document.createElement("img");

              setPreviousMove(playerMoveImage);
              const opponentImageMove = changeMoveToName(opponentMove);
              opponentImage.setAttribute(
                "src",
                `./images/${opponentImageMove}`
              );
              opponentImage.classList.add("opponentImage");
              playerImage.classList.add("playerImage");
              arena.appendChild(playerImage);
              arena.appendChild(opponentImage);

              // value.forEach((r) => r.classList.remove("hidden"));
              if (game === GAMES_PER_ROUND) {
                game = 0;
              }
              round += game % GAMES_PER_ROUND === 0 ? 1 : 0;
              game++;
            }, 1000);
            const opponentMove = move();
            let winner = getWinner(playerMove, opponentMove);
            if (winner === 1) {
              wins++;
            }
            if (winner === 0) {
              draws++;
            }

            const par = document.createElement("p");
            let winnerMessage = callWinner(winner);
            par.innerHTML = winnerMessage;
            arena.appendChild(par);
            const messageBoard = document.createElement("p");
            messageBoard.innerHTML = `Round ${round} <br/> Game ${game}`;
            const board = document.getElementById("board");
            const announceWinner = document.createElement("p");
            announceWinner.innerHTML = `You have win ${wins} of 9 games. And there were ${draws} draws!`;
            while (board.firstChild) {
              board.removeChild(board.firstChild);
            }
            board.appendChild(messageBoard);
            board.appendChild(announceWinner);
            console.log(game, round, wins, draws, 9);
            return { playerMoveImage, winner };
          });
      }
    }
  });
};

attachEventListeners();
