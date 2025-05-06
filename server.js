import cors from "cors";
import express from "express";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database("data/db.sqlite");
const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// create db on startup if it doesn't exist
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS food (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    description TEXT,
    calories REAL,
    carbohydrates REAL,
    protein REAL,
    fat REAL,
    fibre REAL,
    sugar REAL,
    vitamins TEXT,
    is_vegan BOOLEAN,
    is_gluten_free BOOLEAN,
    countries TEXT
    )`
  );

  db.get(`SELECT COUNT(*) AS x FROM food`, (err, row) => {
    if (err) {
      console.error(err);
      return;
    }

    if (row.x === 0) {
      db.run(
        `INSERT INTO food (
          name, type, description, calories, carbohydrates, protein, fat,
          fibre, sugar, vitamins, is_vegan, is_gluten_free, countries
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Apple",
          "Fruit",
          "An apple is a round and sweet fruit with smooth skin. Typically red, green, or yellow. It has a crisp flesh and a core containing small brown seeds.",
          52.0,
          14,
          0.3,
          0.2,
          2.4,
          10.0,
          "potassium, vitamin C, vitamin K",
          true,
          true,
          "China, Turkey, United States, Poland, India",
        ]
      );

      db.run(
        `INSERT INTO food (
          name, type, description, calories, carbohydrates, protein, fat,
          fibre, sugar, vitamins, is_vegan, is_gluten_free, countries
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Banana",
          "Fruit",
          "A banana is a long, curved fruit with a soft interior and a smooth yellow peel. It grows in clusters.",
          89.0,
          23,
          1.1,
          0.3,
          2.6,
          12.0,
          "fibre, potassium, vitamin B6, vitamin C",
          true,
          true,
          "India, China, Indonesia, Brazil, Ecuador",
        ]
      );

      db.run(
        `INSERT INTO food (
          name, type, description, calories, carbohydrates, protein, fat,
          fibre, sugar, vitamins, is_vegan, is_gluten_free, countries
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Milk",
          "Dairy",
          "Milk is a nutrient-rich liquid produced by cows to nourish their young. It contains essential nutrients that support growth and bone health.",
          42.0,
          5,
          3.4,
          1.0,
          0.0,
          5.0,
          "calcium, phosphorous, potassium",
          false,
          true,
          "India, United States, Pakistan, China, Brazil",
        ]
      );
    }
  });
});

// gets information about all stored foods
app.get("/", (req, res) => {
  const output = [];

  db.all("SELECT id, name FROM food", (err, rows) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }

    rows.forEach((row) => {
      output.push([row.id, row.name]);
    });

    res.send(output);
  });
});

// gets information about a specific food
app.get("/food/:name", (req, res) => {
  const name = req.params.name;

  db.get(
    "SELECT * FROM food WHERE name = ? COLLATE NOCASE;",
    [name],
    (err, rows) => {
      if (err) {
        res.status(500).send("Database error");
        return;
      }

      res.send(rows);
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// graceful shutdown
process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed.");
    }
    process.exit(0);
  });
});
