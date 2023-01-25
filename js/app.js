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
  var callWinner = (player) => {
    if (player === 1) {
      return "You won!";
    }
    if (player === 2) {
      return "You lost";
    }
    if (player === 0) {
      return "It is a draw";
    }
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
  var TOTAL_ROUNDS = 5;
  var round = 1;
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
          removeButtons(allButtons);
          removeArenaAllItems();
          const playerMoveName = eventTarget.getAttribute(
            "name"
          );
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
  var removeButtons = (buttons) => {
    buttons.forEach((btn) => btn.classList.add("hidden"));
  };
  var showButtons = (buttons) => {
    buttons.forEach((btn) => btn.classList.remove("hidden"));
  };
  var showAnimation = (sections, file, className) => {
    const playerAnimation = document.createElement("img");
    playerAnimation.setAttribute("src", file);
    playerAnimation.classList.add(`arena-images-animation`);
    playerAnimation.classList.add(className);
    sections.appendChild(playerAnimation);
    return sections;
  };
  var showResult = ({
    arena,
    playerMove,
    opponentMove,
    buttons
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
    }, 2e3);
  };
  attachEventListeners();
})();
