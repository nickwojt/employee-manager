const inquirer = require("inquirer");

const main = [
  {
    type: "list",
    name: "main",
    message: "What would you like to do?",
    choices: [
      "View all departments", //get
      "View all roles", //get
      "View all employees", //get
      "Add a department", //post
      "Add a role", //post
      "Add an employee", //post
      "Update an employee role", //put
      "Quit",
    ],
  },
];

module.exports = main;
