export default function initRoundModel(sequelize, DataTypes) {
  return sequelize.define(
    "round",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      gameId: {
        type: DataTypes.INTEGER,
        references: {
          model: "games",
          key: "id",
        },
      },
      cardsPlayed: {
        type: DataTypes.JSON,
      },
      skipCounter: {
        type: DataTypes.INTEGER,
      },
      player: {
        type: DataTypes.STRING,
      },
      playerId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      player1Cards: {
        type: DataTypes.JSON,
      },
      player2Cards: {
        type: DataTypes.JSON,
      },
      player3Cards: {
        type: DataTypes.JSON,
      },
      player4Cards: {
        type: DataTypes.JSON,
      },
      // ... [<OTHER_COLUMNS>]
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      // The underscored option makes Sequelize reference snake_case names in the DB.
      underscored: true,
    }
  );
}
