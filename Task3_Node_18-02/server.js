import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import ejs from "ejs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

let loggedInUser = null; // In-memory store for the logged-in user

// Database connection
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Smit@0212",
  database: "employee_management_node_18_02",
  port: 3307,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}, console.log("Database connected"));


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(join(__dirname, "public")));

app.set("view engine", "ejs");
app.engine('html', ejs.renderFile);

// Routes
app.get("/", (req, res) => {
  res.render("login");
});

app.get("/dashboard", async (req, res) => {
  if (!loggedInUser) {
    return res.redirect("/");
  }

  try {
    let employees;
    if (loggedInUser.position === "CEO") {
      [employees] = await db.query(`
        SELECT e.*, m.first_name AS manager_first_name, m.last_name AS manager_last_name
        FROM employees e
        LEFT JOIN employees m ON e.manager_id = m.id
      `);
    } else {
      [employees] = await db.query("SELECT * FROM employees WHERE manager_id = ?", [loggedInUser.id]);
    }
    res.render("dashboard", { employees });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.route("/add")
  .get((req, res) => {
    res.render("add");
  })
  .post(async (req, res) => {
    const { first_name, last_name, email, phone, position, department, hire_date, salary, manager_id, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query("INSERT INTO employees SET ?", {
        first_name,
        last_name,
        email,
        phone,
        position,
        department,
        hire_date,
        salary,
        manager_id,
        password: hashedPassword,
      });
      res.redirect("/dashboard");
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  });

app.route("/edit/:id")
  .get(async (req, res) => {
    try {
      const [employee] = await db.query("SELECT * FROM employees WHERE id = ?", [req.params.id]);
      res.render("edit", { employee: employee[0] });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  })
  .post(async (req, res) => {
    const { first_name, last_name, email, phone, position, department, hire_date, salary, manager_id } = req.body;

    try {
      await db.query("UPDATE employees SET ? WHERE id = ?", [
        { first_name, last_name, email, phone, position, department, hire_date, salary, manager_id },
        req.params.id,
      ]);
      res.redirect("/dashboard");
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  });

app.post("/delete/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM employees WHERE id = ?", [req.params.id]);
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [user] = await db.query("SELECT * FROM employees WHERE email = ?", [email]);
    if (user.length > 0 && (await bcrypt.compare(password, user[0].password))) {
      loggedInUser = user[0];
      res.redirect("/dashboard");
    } else {
      res.redirect("/?error=1");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.get("/logout", (req, res) => {
  loggedInUser = null;
  res.redirect("/");
});

app.get("/employee/:id", async (req, res) => {
  try {
    const [employee] = await db.query("SELECT * FROM employees WHERE id = ?", [req.params.id]);
    if (employee.length > 0) {
      res.render("employee", { employee: employee[0] });
    } else {
      res.status(404).send("Employee not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});