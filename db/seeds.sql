INSERT INTO all_departments (department_name)
VALUES ("English"),
       ("Math"),
       ("History"),
       ("Science");

INSERT INTO all_roles (job_title, department_id, salary)
VALUES ("Teacher", 1, 50000.00),
       ("Teacher", 2, 60000.00),
       ("Principle", 3, 90000.00),
       ("Vice Principle", 4, 80000.00),
       ("Teacher", 1, 450000.00),
       ("Student Teacher", 2, 35000.00),
       ("Student Teacher", 3, 40000.00);

INSERT INTO all_employees (first_name, last_name, role_id, manager_id)
VALUES ("Tom", "Cruise", 1, null),
       ("Pearl", "Jam", 2, 1),
       ("Freddy", "Kruger", 3, 2),
       ("Betty", "Bop", 4, null),
       ("Jesse", "James", 5, 3),
       ("Cheryl", "Crow", 1, 4),
       ("Shania", "Twain", 2, 1),
       ("Mariah", "Carey", 3, 2);
