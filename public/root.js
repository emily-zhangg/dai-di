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

sendInvitesButton.addEventListener("click", async () => {
  const player2 = document.getElementById("player2");
  const player2Id = player2.getAttribute("value");
  const player3 = document.getElementById("player3");
  const player3Id = player3.getAttribute("value");
  const player4 = document.getElementById("player4");
  const player4Id = player4.getAttribute("value");
  const player1Id = Number(document.cookie.split("=")[1]);
  console.log(document.cookie.split("=")[1]);
  const sendInvites = await axios.post("/invite", {
    player1Id: player1Id,
    player2Id: player2Id,
    player3Id: player3Id,
    player4Id: player4Id,
  });
  setPlayersDiv.setAttribute("style", "display:none");
});

refreshInvitesButton.addEventListener("click", async () => {
  acceptInvitesDiv.setAttribute("styles", "display:block");
  const invites = await axios.get("/invites");
  console.log(invites);
});
