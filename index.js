const inquirer = require("inquirer");
const main = require("./lib/questions");
const cTable = require("console.table");
// const Database = require("./src/queries");
const dbConnection = require("./config/connection");

const displayMenu = () => {
  inquirer.prompt(main).then((data) => {
    switch (data.main) {
      case "View all departments":
        viewAllDepartments();
        break;
      case "View all roles":
        viewAllRoles();
        break;
      case "View all employees":
        viewAllEmployees();
        break;
      case "Add a department":
        addADepartment();
        break;
      case "Add a role":
        addARole();
        break;
      case "Add an employee":
        addAnEmployee();
        break;
      case "Update an employee role":
        updateAnEmployee();
        break;
      default:
        process.exit(0);
    }
  });
};

displayMenu();

function viewAllDepartments() {
  dbConnection
    .promise()
    .query("SELECT * FROM department")
    .then((data) => {
      console.table(data[0]);
      displayMenu();
    });
}
function viewAllRoles() {
  dbConnection
    .promise()
    .query("SELECT * FROM role")
    .then((data) => {
      console.table(data[0]);
      displayMenu();
    });
}
function viewAllEmployees() {
  dbConnection
    .promise()
    .query("SELECT * FROM employee")
    .then((data) => {
      console.table(data[0]);
      displayMenu();
    });
}
async function addADepartment() {
  const name = await inquirer.prompt([
    {
      type: "input",
      message: "What is the department name?",
      name: "department",
    },
  ]);
  dbConnection
    .promise()
    .query(`INSERT INTO department (name) VALUES ("${name.department}")`)
    .then(() => {
      console.log("Department added successfully");
      displayMenu();
    });
}
function addARole() {
  dbConnection.query(
    "SELECT name FROM department",
    async (err, departments) => {
      const role = await inquirer.prompt([
        {
          type: "input",
          message: "What is the role title?",
          name: "title",
        },
        {
          type: "input",
          message: "What is the salary for this role?",
          name: "salary",
        },
        {
          type: "list",
          message: "What department does the role belong to?",
          choices: departments,
          name: "department_id",
        },
      ]);
      const newRole = {};
      newRole.title = role.title;
      newRole.salary = role.salary;
      dbConnection.query(
        "SELECT id FROM department WHERE name = ?",
        role.department_id,
        (err, response) => {
          newRole.department_id = response[0].id;
          const sqlQuery = "INSERT INTO role SET ?";
          dbConnection.query(sqlQuery, newRole, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Role Added");
              displayMenu();
            }
          });
        }
      );
    }
  );
}
async function addAnEmployee() {
  const roleQuery = "SELECT title AS name FROM role";
  dbConnection.query(roleQuery, async (err, roles) => {
    //select managers from the db to pass into question choices
    const mgrQuery =
      'SELECT CONCAT (first_name," ", last_name) as name FROM employee WHERE manager_id IS NULL';
    dbConnection.query(mgrQuery, async (err, managers) => {
      const answers = await inquirer.prompt([
        {
          type: "input",
          message: "What is the employee's first name?",
          name: "first_name",
        },
        {
          type: "input",
          message: "What is the employee's last name?",
          name: "last_name",
        },
        {
          type: "list",
          message: "What is the employee's role?",
          name: "role",
          choices: roles,
        },
        {
          type: "list",
          message: "Who is the employee's manager?",
          name: "manager",
          choices: managers,
        },
      ]);
      const newEmployee = {};
      newEmployee.first_name = answers.first_name;
      newEmployee.last_name = answers.last_name;
      dbConnection.query(
        "SELECT id FROM role WHERE title = ?",
        answers.role,
        (err, response) => {
          newEmployee.role_id = response[0].id;

          dbConnection.query(
            'SELECT id FROM employee WHERE CONCAT (first_name," ", last_name) = ?',
            answers.manager,
            (err, response) => {
              newEmployee.manager_id = response[0].id;

              dbConnection.query(
                "INSERT INTO employee SET ?",
                newEmployee,
                (err) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("Employee Added");
                    displayMenu();
                  }
                }
              );
            }
          );
        }
      );
    });
  });
}
async function updateAnEmployee() {
  // query database for all employees to pass into questions
  const empQuery =
    'SELECT CONCAT (first_name," ", last_name) as name FROM employee';
  dbConnection.query(empQuery, async (err, employees) => {
    const roleQuery = "SELECT title AS name FROM role";
    dbConnection.query(roleQuery, async (err, roles) => {
      const answers = await inquirer.prompt([
        {
          type: "list",
          message: "Which employee's role do you want to update?",
          name: "employee",
          choices: employees,
        },
        {
          type: "list",
          message: "Which role do you want to assign the selected employee?",
          name: "role",
          choices: roles,
        },
      ]);
      dbConnection.query(
        "SELECT id FROM role WHERE title = ?",
        answers.role,
        (err, response) => {
          console.log(answers);
          const newRole = {};
          newRole.role_id = response[0].id;
          console.log(newRole);
          if (err) {
            console.log(err);
          } else {
            console.log("Role Updated");
            displayMenu();
          }
          //TODO: take output of new role assignment and tie it to the employee --- have to look up employee by splitting their name back into first_name & last_name
        }
      );
    });
  });
}

// const AllDepartments = () => {
//   Database.viewAllDepartments().then((data) => {
//     console.table(data[0]);
//     displayMenu();
//   });
// };

// const AllRoles = () => {
//   Database.viewAllRoles().then((data) => {
//     console.table(data[0]);
//     displayMenu();
//   });
// };
// const AllEmployees = () => {
//   Database.viewAllEmployees().then((data) => {
//     console.table(data[0]);
//     displayMenu();
//   });
// };
// const addDepartment = () => {
//   Database.addADepartment().then(() => {
//     console.log("Department added successfully");
//     displayMenu();
//   });
// };
// const addRole = () => {
//   Database.addARole();
// };
// const addEmployee = () => {
//   Database.addAnEmployee().then(() => {
//     console.log("Employee added successfully");
//     displayMenu();
//   });
// };
// const updateEmployee = () => {
//   Database.updateAnEmployee().then(() => {
//     console.log("Employee updated successfully");
//     displayMenu();
//   });
// };
