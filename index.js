const inquirer = require("inquirer");
const main = require("./lib/questions");
const cTable = require("console.table");
const Database = require("./src/queries");

const displayMenu = () => {
  inquirer.prompt(main).then((data) => {
    switch (data.main) {
      case "View all departments":
        AllDepartments();
        break;
      case "View all roles":
        viewAllRoles();
        break;
      case "View all employees":
        AllEmployees();
        break;
      case "View all departments":
        viewAllDepartments();
        break;
      case "View all departments":
        viewAllDepartments();
        break;
      case "View all departments":
        viewAllDepartments();
        break;
    }
  });
};

displayMenu();

const AllDepartments = () => {
  Database.viewAllDepartments().then((data) => {
    console.log(data);
    // console.table(data);
  });
};

const AllEmployees = () => {
  Database.viewAllEmployees().then((data) => {
    console.table(data[0]);
    // console.table(data);
  });
};
