const dbConnection = require("../config/connection");

class Database {
  constructor(dbConnection) {
    this.dbConnection = dbConnection;
  }
  viewAllDepartments() {
    return dbConnection.promise().query("SELECT name FROM department");
  }
  viewAllEmployees() {
    return dbConnection.promise().query("SELECT first_name FROM employee");
  }
}

module.exports = new Database(dbConnection);
