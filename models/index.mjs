import sequelizePackage from "sequelize";
import allConfig from "../config/config.js";

import initUserModel from "./user.mjs";
import initGameModel from "./game.mjs";
import initRoundModel from "./round.mjs";

const { Sequelize } = sequelizePackage;
const env = process.env.NODE_ENV || "development";
const config = allConfig[env];
const db = {};

let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.User = initUserModel(sequelize, Sequelize.DataTypes);
db.Game = initGameModel(sequelize, Sequelize.DataTypes);
db.Round = initRoundModel(sequelize, Sequelize.DataTypes);

db.User.hasMany(db.Game, {
  foreignKey: "player1_id",
});
db.User.hasMany(db.Game, {
  foreignKey: "player2_id",
});
db.User.hasMany(db.Game, {
  foreignKey: "player3_id",
});
db.User.hasMany(db.Game, {
  foreignKey: "player4_id",
});
//look at sequelize self referencing module for alias
// game.getPlayer1()
db.Game.belongsTo(db.User, {
  as: "player1",
  foreignKey: "player1_id",
});
db.Game.belongsTo(db.User, {
  as: "player2",
  foreignKey: "player2_id",
});
db.Game.belongsTo(db.User, {
  as: "player3",
  foreignKey: "player3_id",
});
db.Game.belongsTo(db.User, {
  as: "player4",
  foreignKey: "player4_id",
});

// const player4 = gameDiv.getPlayer4();

// db.Game.create({
//   player1Id: 1,
//   player2Id: 2
// })

db.Game.hasMany(db.Round);
db.User.hasMany(db.Round, {
  foreignKey: "player_id",
});

db.Round.belongsTo(db.Game);
db.Round.belongsTo(db.User, {
  foreignKey: "player_id",
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
