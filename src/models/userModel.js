// src/models/userModel.js
class UserModel {
  constructor() {
    this.users = [];
  }

  createUser(username, password) {
    const user = { id: this.users.length + 1, username, password };
    this.users.push(user);
    return user;
  }

  findUserByUsername(username) {
    return this.users.find((user) => user.username === username);
  }
}

export default new UserModel();
