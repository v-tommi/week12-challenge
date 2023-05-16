const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");
const db = mysql.createConnection({
  host: "localhost",
  user: "mconanan",
  password: "root",
  database: "employee_db",
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

const start = [
  {
    type: "list",
    message: "Select an option",
    choices: [
      "view all departments",
      "view all roles",
      "view all employees",
      "add a department",
      "add a role",
      "add an employee",
      
    ],
    name: "action",
  },
];

const addDeptRow = {
  type: "input",
  message: "Enter department name",
  name: "new_department",
  default: "New Department",
};

function init() {
  return inquirer.prompt(start).then((answer) => {
    switch (answer.action) {
      case "view all departments":
        db.query("SELECT * FROM all_departments", function (err, results) {
          console.table(results);

          init();
        });

        break;

      case "view all roles":
        db.query("SELECT * FROM all_roles", function (err, results) {
          console.table(results);
          init();
        });

        break;

      case "view all employees":
        db.query("SELECT * FROM all_employees", function (err, results) {
          console.table(results);
          init();
        });
        break;

      case "add a department":
        addDepartment();
        break;

      case "add a role":
        addRole();
        break;

      case "add an employee":
        addEmployee();
        break;

      default:
    }
  });
}

const addDepartment = () => {
  return inquirer.prompt(addDeptRow).then((answer) => {
    const deptSql =
      "INSERT INTO all_departments (department_name) VALUES('" +
      answer.new_department +
      "')";
    
    db.query(deptSql, function (err, results) {
      if (err) {
        console.log(err);
      }
      console.table(results);

      init();
    });
  });
};

const getAllDepts = () => {
  return new Promise((resolve, reject) => {
    var departmentChoices;
    db.query("SELECT * FROM all_departments", function (err, results) {
      if (err) {
        console.error(err);
        return reject(err);
      }
      console.table(results);

      departmentChoices = results.map((department) => {
        return { name: department.department_name, value: department.id };
      });

      resolve(departmentChoices);
    });
  });
};

const addRole = () => {
  getAllDepts().then((departmentChoices) => {
    return inquirer
      .prompt([
        {
          type: "input",
          message: "Enter role",
          name: "new_role",
          default: "New Role",
        },
        {
          type: "list",
          message: "Enter role's department",
          choices: departmentChoices,
          name: "role_department",
          default: "New Role Department",
        },
        {
          type: "input",
          message: "Enter role salary",
          name: "role_salary",
          default: "New Role Salary",
        },
      ])
      .then((answers) => {
        const role = [
          `'${answers.new_role}'`,
          answers.role_department,
          parseFloat(answers.role_salary),
        ].join(",");


        const roleSql =
          "INSERT INTO all_roles (job_title, department_id, salary) VALUES(" +
          role +
          ")";

        db.query(roleSql, function (err, results) {
          if (err) {
            console.log(err);
          }

          console.table(results);

          init();
        });
      });
  });
};

const getAllManagers = () => {
  return new Promise((resolve, reject) => {
    var managerChoices;
    db.query(
      "SELECT first_name, id FROM all_employees",
      function (err, results) {
        if (err) {
          console.error(err);
          return reject(err);
        }
        console.table(results);

        managerChoices = results.map((manager) => {
    
          return { name: manager.first_name, value: manager.id };
        });

        resolve(managerChoices);
      }
    );
  });
};

const getAllRoles = () => {
  return new Promise((resolve, reject) => {
    var roleChoices;
    db.query("SELECT job_title, id FROM all_roles", function (err, results) {
      if (err) {
        console.error(err);
        return reject(err);
      }
      console.table(results);

      roleChoices = results.map((role) => {
        return { name: role.job_title, value: role.id };
      });

      resolve(roleChoices);
    });
  });
};

const addEmployee = () => {
  var addEmployeeAnswers = {};
  getAllRoles().then((roleChoices) => {
    return inquirer
      .prompt([
        {
          type: "input",
          message: "Employee's first name",
          name: "first_name",
          default: "First Name",
        },
        {
          type: "input",
          message: "Employee's last name",
          name: "last_name",
          default: "Last Name",
        },
        {
          type: "list",
          message: "Employee role",
          choices: roleChoices,
          name: "employee_role",
          default: "Employee Role",
        },
      ])
      .then((answers) => {

        addEmployeeAnswers.first_name = answers.first_name;
        addEmployeeAnswers.last_name = answers.last_name;
        addEmployeeAnswers.employee_role = answers.employee_role;

        getAllManagers()
          .then((managerChoices) => {
            return inquirer
              .prompt([
                {
                  type: "list",
                  message: "Employee's manager",
                  choices: managerChoices,
                  name: "manager",
                  default: "Manager",
                },
              ])
              .then((answers) => {
                return answers;
              });
          })
          .then((answers) => {
            const employee = [
              `'${addEmployeeAnswers.first_name}',
            '${addEmployeeAnswers.last_name}',
            '${addEmployeeAnswers.employee_role}',
            '${answers.manager}',`,
            ];

            const employeeSql = `INSERT INTO all_employees (first_name, last_name, role_id, manager_id) VALUES("${addEmployeeAnswers.first_name}","${addEmployeeAnswers.last_name}", "${addEmployeeAnswers.employee_role}", "${answers.manager}");`;

            db.query(employeeSql, function (err, results) {
              if (err) {
                console.log(err);
              }

              console.table(results);

              init();
            });
          });
      });
  });
};

init();

