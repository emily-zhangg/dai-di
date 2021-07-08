import sequelizePackage from "sequelize";
import allConfig from "../config/config.js";

import initUserModel from "./user.mjs";
import initGameModel from "./game.mjs";
import initRoundModel from "./round.mjs";

const { Sequelize } = sequelizePackage;
const env = process.env.NODE_ENV || "development";
const config = allConfig[env];
const db = {};
let sequelize;
// If env is production, retrieve database auth details from the
// DATABASE_URL env var that Heroku provides us
if (env === "PRODUCTION") {
  // Break apart the Heroku database url and rebuild the configs we need
  const { DATABASE_URL } = process.env;
  const dbUrl = url.parse(DATABASE_URL);
  const username = dbUrl.auth.substr(0, dbUrl.auth.indexOf(":"));
  const password = dbUrl.auth.substr(
    dbUrl.auth.indexOf(":") + 1,
    dbUrl.auth.length
  );
  const dbName = dbUrl.path.slice(1);
  const host = dbUrl.hostname;
  const { port } = dbUrl;
  config.host = host;
  config.port = port;
  sequelize = new Sequelize(dbName, username, password, config);
}

// If env is not production, retrieve DB auth details from the config
else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

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
