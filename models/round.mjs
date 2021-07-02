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
      game_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "games",
          key: "id",
        },
      },
      cards_played: {
        type: DataTypes.JSON,
      },
      skip_counter: {
        type: DataTypes.INTEGER,
      },
      player: {
        type: DataTypes.STRING,
      },
      player_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
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
