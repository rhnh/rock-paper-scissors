(() => {
  // src/tools.tsx
  var changeMoveToName = (move2) => {
    if (move2 === 0) {
      return "rock.svg";
    } else if (move2 == 1) {
      return "paper.svg";
    } else if (move2 === 2) {
      return "scissors.svg";
    }
    return "failed.svg";
  };
  var changeNameToMove = (name) => {
    if (name === "rock")
      return 0;
    if (name === "paper")
      return 1;
    if (name === "scissors")
      return 2;
  };
  var getWinner = (m1, m2) => (3 + m1 - m2) % 3;
  var removeArenaAllItems = () => {
    const arena = document.getElementById("arena");
    while (arena.firstChild) {
      arena.removeChild(arena.firstChild);
    }
  };
  var callWinner = (move2) => {
    if (move2 === 1) {
      return "You won!";
    }
    if (move2 === 2) {
      return "You lost";
    }
    if (move2 === 0) {
      return "It is a draw";
    }
  };
  var addAnimation = ({
    selector,
    className
  }) => {
    const arenaImages = document.querySelectorAll(selector);
    arenaImages.forEach((image) => image.classList.add(className));
  };

  // src/types.ts
  var ROCK = 0;
  var PAPER = 1;
  var SCISSORS = 2;

  // src/markov.ts
  var markovChain = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  var lastIndex = 0;
  function move() {
    if (lastIndex === void 0 || lastIndex < 0)
      return Math.floor(Math.random() * 3);
    const moves = markovChain[lastIndex];
    if (moves === void 0)
      return;
    if (moves[1] >= moves[2] && moves[1] >= moves[0])
      return SCISSORS;
    if (moves[0] >= moves[1] && moves[0] > moves[2])
      return PAPER;
    return ROCK;
  }
  function setPreviousMove(oppositionMove) {
    markovChain[lastIndex][oppositionMove] += 1;
    lastIndex = oppositionMove;
  }

  // src/app.ts
  var TOTAL_ROUNDS = 3;
  var GAMES_PER_ROUND = 3;
  var game = 0;
  var round = 0;
  var wins = 0;
  var draws = 0;
  var attachEventListeners = () => {
    document.addEventListener("click", async (event) => {
      const eventTarget = event.target;
      const arena = document.getElementById("arena");
      if (eventTarget instanceof HTMLElement) {
        const button = eventTarget.className.includes(
          "player-buttons"
        );
        if (button) {
          const animatedObject = {
            selector: ".arena-images",
            className: "arena-images-animation"
          };
          const allButtons = document.querySelectorAll(".player-buttons");
          const moveName = eventTarget.getAttribute(
            "name"
          );
          const playerMove = changeNameToMove(moveName);
          const result = new Promise((resolve) => {
            resolve(allButtons);
          });
          result.then((value) => {
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
          }).then((value) => {
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
              if (game === GAMES_PER_ROUND) {
                game = 0;
              }
              round += game % GAMES_PER_ROUND === 0 ? 1 : 0;
              game++;
            }, 1e3);
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
})();
