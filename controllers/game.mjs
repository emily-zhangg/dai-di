export default function initGameController(db) {
  const { Op } = db.Sequelize;
  const index = (req, res) => {
    res.render("root");
  };
  const create = async (req, res) => {
    const users = await db.User.findAll();
    console.log(users);
    res.send(users);
  };
  const inviteUsers = async (req, res) => {
    const { player2Id, player3Id, player4Id } = req.body;
    console.log(req, req.body);
    const player1Id = req.cookies.userId;
    const createGame = await db.Game.create({
      player1Id,
      player2Id,
      player3Id,
      player4Id,
      gameState: "pending",
    });
    res.send(createGame);
  };
  const getInvites = async (req, res) => {
    const gameInvites = await db.Game.findAll({
      where: {
        [Op.or]: [
          { player1Id: req.cookies.userId },
          { player2Id: req.cookies.userId },
          { player3Id: req.cookies.userId },
          { player4Id: req.cookies.userId },
        ],
      },
    });
    res.send(gameInvites);
  };
  const makeDeck = function () {
    // Initialise an empty deck array
    var cardDeck = [];
    // Initialise an array of the 4 suits in our deck. We will loop over this array.
    var suits = ["hearts", "diamonds", "clubs", "spades"];

    // Loop over the suits array
    var suitIndex = 0;
    while (suitIndex < suits.length) {
      // Store the current suit in a variable
      var currentSuit = suits[suitIndex];

      // Loop from 1 to 13 to create all cards for a given suit
      // Notice rankCounter starts at 1 and not 0, and ends at 13 and not 12.
      // This is an example of a loop without an array.
      var rankCounter = 1;
      while (rankCounter <= 13) {
        // By default, the card name is the same as rankCounter
        var cardName = rankCounter;

        // If rank is 1, 11, 12, or 13, set cardName to the ace or face card's name
        if (cardName == 1) {
          cardName = "ace";
        } else if (cardName == 11) {
          cardName = "jack";
        } else if (cardName == 12) {
          cardName = "queen";
        } else if (cardName == 13) {
          cardName = "king";
        }

        // Create a new card with the current name, suit, and rank
        var card = {
          name: cardName,
          suit: currentSuit,
          rank: rankCounter,
          link: `cards/${cardName}_of_${currentSuit}.png`,
        };

        // Add the new card to the deck
        cardDeck.push(card);

        // Increment rankCounter to iterate over the next rank
        rankCounter += 1;
      }

      // Increment the suit index to iterate over the next suit
      suitIndex += 1;
    }

    // Return the completed card deck
    return cardDeck;
  };
  const getRandomIndex = function (max) {
    return Math.floor(Math.random() * max);
  };

  /**
   * Shuffle elements in the cardDeck array. Return the shuffled deck.
   */
  const shuffleCards = function (cardDeck) {
    // Loop over the card deck array once
    var currentIndex = 0;
    while (currentIndex < cardDeck.length) {
      // Select a random index in the deck
      var randomIndex = getRandomIndex(cardDeck.length);
      // Select the card that corresponds to randomIndex
      var randomCard = cardDeck[randomIndex];
      // Select the card that corresponds to currentIndex
      var currentCard = cardDeck[currentIndex];
      // Swap positions of randomCard and currentCard in the deck
      cardDeck[currentIndex] = randomCard;
      cardDeck[randomIndex] = currentCard;
      // Increment currentIndex to shuffle the next pair of cards
      currentIndex += 1;
    }
    // Return the shuffled deck
    return cardDeck;
  };
  const initGame = async (req, res) => {
    const gameData = await db.Game.findAll({
      where: {
        id: req.body.gameId,
      },
    });
    const gameId = gameData[0].dataValues.id;
    const playerIds = [
      gameData[0].dataValues.player1Id,
      gameData[0].dataValues.player2Id,
      gameData[0].dataValues.player3Id,
      gameData[0].dataValues.player4Id,
    ];
    console.log(playerIds);
    const playerNumber = playerIds.indexOf(Number(req.cookies.userId));
    console.log("gameeeid", playerNumber);
    const currentPlayers = gameData[0].dataValues.numPlayersJoined;
    if (currentPlayers === 3) {
      const updateGame = await db.Game.update(
        {
          gameState: "In Progress",
          numPlayersJoined: 4,
        },
        {
          where: { id: gameId },
        }
      );
      const updatedGameData = await db.Game.findAll({
        where: { id: req.body.gameId },
      });
      const cardDeck = makeDeck();
      const cards = shuffleCards(cardDeck);
      const player1Cards = cards.splice(0, 13);
      const player2Cards = cards.splice(0, 13);
      const player3Cards = cards.splice(0, 13);
      const player4Cards = cards.splice(0, 13);
      const firstRound = await db.Round.create({
        gameId,
        player1Cards,
        player2Cards,
        player3Cards,
        player4Cards,
      });
      console.log(firstRound);
      const playerCardsArr = [
        player1Cards,
        player2Cards,
        player3Cards,
        player4Cards,
      ];
      let startingIndex;
      playerCardsArr.forEach((player, index) => {
        console.log(player);
        player.forEach((card) => {
          if (card.rank === 3 && card.suit === "diamonds") {
            console.log("yessss");
            startingIndex = index;
          }
        });
      });
      console.log(startingIndex);
      res.cookie("gameId", gameId);
      res.cookie("playerNumber", playerNumber + 1);
      res.cookie("startingPlayer", startingIndex);
      res.send({
        playerCards: playerCardsArr[playerNumber],
        playerNumber,
        startingIndex,
        gameData: updatedGameData[0].dataValues,
      });
    } else {
      const gameData = await db.Game.findAll({ where: { id: gameId } });
      const numPlayersJoined = gameData[0].dataValues.numPlayersJoined + 1;
      console.log(numPlayersJoined);
      const waitingForNumOfPlayers = 4 - numPlayersJoined;
      const updateGame = await db.Game.update(
        {
          numPlayersJoined,
        },
        {
          where: { id: gameId },
        }
      );
      res.send({ waitingForNumOfPlayers, gameData: gameData[0].dataValues });
    }
  };
  const getCards = async (req, res) => {
    const roundsData = await db.Round.findAll({
      where: {
        gameId: Number(req.cookies.gameId),
      },
    });
    const currentRound = roundsData.pop();
    const playerCards =
      currentRound.dataValues[`player${req.cookies.playerNumber}Cards`];
    console.log(playerCards);
    res.send(playerCards);
  };
  const refresh = async (req, res) => {
    const roundsData = await db.Round.findAll({
      where: {
        gameId: Number(req.cookies.gameId),
      },
    });
    const previousRound = roundsData.pop();
    let currentSkipCounter = previousRound.dataValues.skipCounter;
    if (currentSkipCounter != null) {
      let lastRoundPlayed;
      while (currentSkipCounter >= 0) {
        lastRoundPlayed = roundsData.pop();
        currentSkipCounter -= 1;
      }
      res.send([previousRound.dataValues, lastRoundPlayed.dataValues]);
    } else {
      res.send([previousRound.dataValues]);
    }
  };
  const playRound = async (req, res) => {
    const roundsData = await db.Round.findAll({
      where: {
        gameId: Number(req.cookies.gameId),
      },
    });
    const previousRound = roundsData.pop().dataValues;
    const player1Cards = previousRound.player1Cards;
    const player2Cards = previousRound.player2Cards;
    const player3Cards = previousRound.player3Cards;
    const player4Cards = previousRound.player4Cards;
    const playerCards = [
      player1Cards,
      player2Cards,
      player3Cards,
      player4Cards,
    ];
    playerCards[Number(req.cookies.playerNumber - 1)] = req.body.cardsRemaining;
    const createRound = await db.Round.create({
      gameId: Number(req.cookies.gameId),
      cardsPlayed: req.body.cardsPlayed,
      player: `Player${req.cookies.playerNumber}`,
      playerId: req.cookies.userId,
      player1Cards: playerCards[0],
      player2Cards: playerCards[1],
      player3Cards: playerCards[2],
      player4Cards: playerCards[3],
    });
    res.send("done");
  };
  return {
    index,
    create,
    inviteUsers,
    getInvites,
    initGame,
    getCards,
    refresh,
    playRound,
  };
}
