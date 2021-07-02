module.exports = {
  up: async (queryInterface) => {
    const usersList = [
      {
        name: "jane",
        email: "jane@gmail.com",
        password: "12345678",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "john",
        email: "john@gmail.com",
        password: "12345678",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "janice",
        email: "janice@gmail.com",
        password: "12345678",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "james",
        email: "james@gmail.com",
        password: "12345678",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await queryInterface.bulkInsert("users", usersList);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
