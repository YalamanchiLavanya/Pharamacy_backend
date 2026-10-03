const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "db.json");

function readDatabase() {
  return JSON.parse(
    fs.readFileSync(dbPath, "utf-8")
  );
}

function writeDatabase(data) {
  fs.writeFileSync(
    dbPath,
    JSON.stringify(data, null, 2)
  );
}

app.get("/", (req, res) => {
  res.json({
    message: "MediCare Pharmacy Backend is running"
  });
});

app.get("/medicines", (req, res) => {
  const db = readDatabase();

  res.json(db.medicines || []);
});

app.get("/medicines/:id", (req, res) => {
  const db = readDatabase();

  const medicine = (db.medicines || []).find(
    (item) =>
      String(item.id) === String(req.params.id)
  );

  if (!medicine) {
    return res.status(404).json({
      message: "Medicine not found"
    });
  }

  res.json(medicine);
});

app.post("/medicines", (req, res) => {
  const db = readDatabase();

  if (!db.medicines) {
    db.medicines = [];
  }

  const ids = db.medicines
    .map((item) => Number(item.id))
    .filter((id) => Number.isFinite(id));

  const nextId =
    ids.length > 0
      ? Math.max(...ids) + 1
      : 1;

  const medicine = {
    id: nextId,
    ...req.body
  };

  db.medicines.push(medicine);

  writeDatabase(db);

  res.status(201).json(medicine);
});

app.put("/medicines/:id", (req, res) => {
  const db = readDatabase();

  const index = (db.medicines || []).findIndex(
    (item) =>
      String(item.id) === String(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Medicine not found"
    });
  }

  db.medicines[index] = {
    ...db.medicines[index],
    ...req.body,
    id: db.medicines[index].id
  };

  writeDatabase(db);

  res.json(db.medicines[index]);
});

app.delete("/medicines/:id", (req, res) => {
  const db = readDatabase();

  const index = (db.medicines || []).findIndex(
    (item) =>
      String(item.id) === String(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Medicine not found"
    });
  }

  const deletedMedicine =
    db.medicines.splice(index, 1)[0];

  writeDatabase(db);

  res.json(deletedMedicine);
});

app.get("/users", (req, res) => {
  const db = readDatabase();

  let users = db.users || [];

  if (req.query.email) {
    users = users.filter(
      (user) =>
        user.email.toLowerCase() ===
        req.query.email.toLowerCase()
    );
  }

  if (req.query.password) {
    users = users.filter(
      (user) =>
        user.password === req.query.password
    );
  }

  if (req.query.role) {
    users = users.filter(
      (user) =>
        user.role === req.query.role
    );
  }

  res.json(users);
});

app.post("/users", (req, res) => {
  const db = readDatabase();

  if (!db.users) {
    db.users = [];
  }

  const existingUser = db.users.find(
    (user) =>
      user.email.toLowerCase() ===
      req.body.email.toLowerCase()
  );

  if (existingUser) {
    return res.status(400).json({
      message: "Email already registered"
    });
  }

  const ids = db.users
    .map((user) => Number(user.id))
    .filter((id) => Number.isFinite(id));

  const nextId =
    ids.length > 0
      ? Math.max(...ids) + 1
      : 1;

  const newUser = {
    id: nextId,
    ...req.body
  };

  db.users.push(newUser);

  writeDatabase(db);

  res.status(201).json(newUser);
});

app.get("/orders", (req, res) => {
  const db = readDatabase();

  res.json(db.orders || []);
});

app.get("/orders/:id", (req, res) => {
  const db = readDatabase();

  const order = (db.orders || []).find(
    (item) =>
      String(item.id) === String(req.params.id)
  );

  if (!order) {
    return res.status(404).json({
      message: "Order not found"
    });
  }

  res.json(order);
});

app.post("/orders", (req, res) => {
  const db = readDatabase();

  if (!db.orders) {
    db.orders = [];
  }

  const ids = db.orders
    .map((order) => Number(order.id))
    .filter((id) => Number.isFinite(id));

  const nextId =
    ids.length > 0
      ? Math.max(...ids) + 1
      : 1;

  const order = {
    id: nextId,
    ...req.body
  };

  db.orders.push(order);

  writeDatabase(db);

  res.status(201).json(order);
});

app.put("/orders/:id", (req, res) => {
  const db = readDatabase();

  const index = (db.orders || []).findIndex(
    (item) =>
      String(item.id) === String(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Order not found"
    });
  }

  db.orders[index] = {
    ...db.orders[index],
    ...req.body,
    id: db.orders[index].id
  };

  writeDatabase(db);

  res.json(db.orders[index]);
});

app.delete("/orders/:id", (req, res) => {
  const db = readDatabase();

  const index = (db.orders || []).findIndex(
    (item) =>
      String(item.id) === String(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Order not found"
    });
  }

  const deletedOrder =
    db.orders.splice(index, 1)[0];

  writeDatabase(db);

  res.json(deletedOrder);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(
    `MediCare Pharmacy Backend running on port ${PORT}`
  );
});