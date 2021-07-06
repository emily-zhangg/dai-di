const createGameButton = document.getElementById("create-game");
const refreshInvitesButton = document.getElementById("refresh-invites");
const sendInvitesButton = document.getElementById("start-game");
const setPlayersDiv = document.getElementById("create");
const acceptInvitesDiv = document.getElementById("invitation");
const gameDiv = document.getElementById("game");
const gameStatus = document.getElementById("gameStatus");
const cardCombination = document.getElementById("combination");
const cardStyle = (card) => {
  if (card.getAttribute("class") === "cards clicked") {
    card.setAttribute("style", "border:0mm ");
    card.setAttribute("class", "cards");
  } else {
    card.setAttribute("style", "border:4mm ridge rgba(170, 50, 220, .6) ");
    card.setAttribute("class", "cards clicked");
  }
};
const card1 = document.getElementById("card1");
const card2 = document.getElementById("card2");
const card3 = document.getElementById("card3");
const card4 = document.getElementById("card4");
const card5 = document.getElementById("card5");
const card6 = document.getElementById("card6");
const card7 = document.getElementById("card7");
const card8 = document.getElementById("card8");
const card9 = document.getElementById("card9");
const card10 = document.getElementById("card10");
const card11 = document.getElementById("card11");
const card12 = document.getElementById("card12");
const card13 = document.getElementById("card13");
card1.addEventListener("click", () => {
  cardStyle(card1);
});
card2.addEventListener("click", () => {
  cardStyle(card2);
});
card3.addEventListener("click", () => {
  cardStyle(card3);
});
card4.addEventListener("click", () => {
  cardStyle(card4);
});
card5.addEventListener("click", () => {
  cardStyle(card5);
});
card6.addEventListener("click", () => {
  cardStyle(card6);
});
card7.addEventListener("click", () => {
  cardStyle(card7);
});
card8.addEventListener("click", () => {
  cardStyle(card8);
});
card9.addEventListener("click", () => {
  cardStyle(card9);
});
card10.addEventListener("click", () => {
  cardStyle(card10);
});
card11.addEventListener("click", () => {
  cardStyle(card11);
});
card12.addEventListener("click", () => {
  cardStyle(card12);
});
card13.addEventListener("click", () => {
  cardStyle(card13);
});
const showCards = document.getElementById("showCards");
const refreshButton = document.getElementById("refresh");
const playCardsButton = document.getElementById("submit");
createGameButton.addEventListener("click", async () => {
  createGameButton.setAttribute("style", "display:none");
  sendInvitesButton.setAttribute("style", "display:block");
  const users = await axios.get("/create");
  console.log(users, "hi");
  const player1Element = document.createElement("p");
  player1Element.innerHTML = "You are Player 1";
  setPlayersDiv.appendChild(player1Element);
  for (i = 0; i < 3; i++) {
    const selectElement = document.createElement("select");
    setPlayersDiv.appendChild(selectElement);
    selectElement.setAttribute("id", `player${i + 2}`);
    const optionDefault = document.createElement("option");
    optionDefault.setAttribute("value", "");
    optionDefault.setAttribute("disabled", "");
    optionDefault.setAttribute("id", `Player${i + 2}`);
    optionDefault.setAttribute("selected", "");
    optionDefault.innerHTML = `Player${i + 2}`;
    selectElement.appendChild(optionDefault);
    users.data.forEach((user) => {
      const option = document.createElement("option");
      option.setAttribute("value", user.id);
      option.innerHTML = user.name;
      selectElement.appendChild(option);
    });
  }

  //on click will get all players name from db and create 4 drop downs
});
const selectedOption = (sel) => {
  console.log(sel);
  for (i = 0; i < sel.length; i++) {
    if (sel.option[i] === true) {
      console.log(sel.option[i].value);
      return sel.option[i].value;
    }
  }
  sel.forEach((option) => {
    if (option.selected) {
      console.log(option.value);
      return option.value;
    }
  });
};
sendInvitesButton.addEventListener("click", async () => {
  const player2 = document.getElementById("player2");
  const player2Id = player2.value;
  const player3 = document.getElementById("player3");
  const player3Id = player3.value;
  const player4 = document.getElementById("player4");
  const player4Id = player4.value;
  console.log(document.cookie.split("=")[1]);
  console.log(player2Id, player3Id, player4Id);
  const data = {
    player2Id,
    player3Id,
    player4Id,
  };
  console.log(data);
  const sendInvites = await axios.post("/invite", data);
  setPlayersDiv.setAttribute("style", "display:none");
});

const joinGame = async (gameId) => {
  gameDiv.setAttribute("style", "display:block");
  acceptInvitesDiv.setAttribute("style", "display:none");
  const initGame = await axios.post("/init", { gameId });
  console.log(initGame);
  console.log(initGame.data.gameData.gameState);
  if (initGame.data.gameData.gameState === "pending") {
    gameStatus.innerHTML = `Waiting for ${initGame.data.waitingForNumOfPlayers} players`;
  }
  if (initGame.data.gameData.gameState === "In Progress") {
    gameStatus.innerHTML = `Sequence to play: Player1 -> Player2 -> Player3 -> Player4, starting with Player ${
      initGame.data.startingIndex + 1
    } who has 3 of diamonds.<br>You are Player ${
      initGame.data.playerNumber + 1
    }`;
    const playerCardsHTML = document.querySelectorAll(".cards");
    playerCardsHTML.forEach((card, index) => {
      card.setAttribute("src", `${initGame.data.playerCards[index].link}`);
    });
  }
};

refreshInvitesButton.addEventListener("click", async () => {
  acceptInvitesDiv.setAttribute("styles", "display:block");
  const invites = await axios.get("/invites");
  console.log(invites);
  const invitations = invites.data;
  invitations.forEach((invite) => {
    const inviteCard = document.createElement("div");
    const acceptInvite = document.createElement("button");
    acceptInvite.innerHTML = "Join Game";
    inviteCard.innerHTML = `You got a game invite. for game ${invite.id}`;
    acceptInvite.setAttribute("id", invite.id);
    acceptInvite.setAttribute("class", "game-invite-button");
    acceptInvitesDiv.appendChild(inviteCard);
    inviteCard.appendChild(acceptInvite);
    acceptInvite.addEventListener("click", () => {
      joinGame(invite.id);
    });
  });
});
const showPlayerCards = async () => {
  const cards = await axios.get("/cards");
  console.log(cards);
  const playerCardsHTML = document.querySelectorAll(".cards");
  playerCardsHTML.forEach((card, index) => {
    if (index < cards.data.length) {
      card.setAttribute("src", `${cards.data[index].link}`);
    } else {
      card.setAttribute("style", "display:none");
    }
  });
};
showCards.addEventListener("click", showPlayerCards);
const refreshGame = async () => {
  const previousRound = await axios.get("/refresh");
  console.log(previousRound);
  const startingIndex = document.cookie
    .split("; ")
    .find((row) => row.startsWith("startingPlayer="))
    .split("=")[1];
  const playerNumber = document.cookie
    .split("; ")
    .find((row) => row.startsWith("playerNumber="))
    .split("=")[1];
  let gameMessage = `Sequence to play: Player1 -> Player2 -> Player3 -> Player4, starting with Player ${
    Number(startingIndex) + 1
  } who has 3 of diamonds.<br>You are Player ${playerNumber}`;
  if (
    previousRound.data[0].playerId === null &&
    previousRound.data[0].skipCounter === null
  ) {
    gameMessage += `<br>It is Player ${Number(startingIndex) + 1}'s turn`;
  } else if (previousRound.data[0].skipCounter === 3) {
    gameMessage += `<br>It is your turn. As all previous players have skipped, you can put down a new combination`;
  } else if (previousRound.data.length === 1) {
    gameMessage += `The combination is ${previousRound.data[0].cardsPlayed.length} cards, ${previousRound.data[0].player} has played his turn, it is the next player's turn<br>Last Combination played is: ${previousRound.data[0].cardsPlayed} `;
  } else {
    gameMessage += `The combination is ${previousRound.data[1].cardsPlayed.length} cards, ${previousRound.data[0].player} has played his turn, it is the next player's turn<br>Last Combination played is: ${previousRound.data[1].cardsPlayed} `;
  }
  gameStatus.innerHTML = gameMessage;
};
refreshButton.addEventListener("click", refreshGame);
playCardsButton.addEventListener("click", async () => {
  console.log("clicked");
  const cardsHTML = document.querySelectorAll(".cards");
  const cardsPlayed = [];
  const cardsRemaining = [];
  console.log(cardsHTML);
  cardsHTML.forEach((card) => {
    if (card.getAttribute("src")) {
      console.log(card.getAttribute("src"));
      const cardDescription = card
        .getAttribute("src")
        .split("cards/")[1]
        .split(".png")[0];
      const cardSuit = cardDescription.split("_")[2];
      const cardName = cardDescription.split("_")[0];
      let cardRank;
      switch (cardName) {
        case "ace":
          cardRank = 1;
          break;
        case "king":
          cardRank = 13;
          break;
        case "queen":
          cardRank = 12;
          break;
        case "jack":
          cardRank = 11;
          break;
        default:
          cardRank = cardName;
      }
      if (card.getAttribute("class") === "cards clicked") {
        cardsPlayed.push({
          name: cardName,
          rank: cardRank,
          suit: cardSuit,
          link: card.getAttribute("src"),
        });
      } else if (
        card.getAttribute("class") === "cards" &&
        card.getAttribute("src")
      ) {
        cardsRemaining.push({
          name: cardName,
          rank: cardRank,
          suit: cardSuit,
          link: card.getAttribute("src"),
        });
      }
    }
  });
  //potential validation for if combination is valid
  const createRound = await axios.post("/playRound", {
    cardsPlayed,
    cardsRemaining,
  });
  showPlayerCards();
});
