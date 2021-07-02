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
    const { player1Id, player2Id, player3Id, player4Id } = req.body;
    console.log(req, req.body);
    console.log(player1Id);
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
  return { index, create, inviteUsers, getInvites };
}
