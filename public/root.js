const createGameButton = document.getElementById("create-game");
const refreshInvitesButton = document.getElementById("refresh-invites");
const sendInvitesButton = document.getElementById("start-game");
const setPlayersDiv = document.getElementById("create");
const acceptInvitesDiv = document.getElementById("invitation");
const gameDiv = document.getElementById("game");

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
  const player1Id = Number(document.cookie.split("=")[1]);
  console.log(document.cookie.split("=")[1]);
  const data = {
    player1Id,
    player2Id,
    player3Id,
    player4Id,
  };
  console.log(data);
  const sendInvites = await axios.post("/invite", data);
  setPlayersDiv.setAttribute("style", "display:none");
});

const joinGame = async();
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
    acceptInvite.addEventListener("click", joinGame(invite.id));
  });
});
