// module.exports = app => {
//   const customers = require("../controllers/customer.controller.js");

//   // Create a new Customer
//   app.post("/customers", customers.create);

// };

const express = require("express");
const router = express.Router()
const users = require("../controllers/user.controller.js");

// Register a new user
router.post("/api/users/register", users.create);

// Login an user
router.post("/api/users/login", users.login);

// Retrieve all users
router.get("/api/users", users.findAll);

// Retrieve a single user with userId
router.get("/api/users/:userId", users.findOne);

// Update a user with userId
router.put("/api/users/update/:userId", users.update);

// Delete a user with userId
router.delete("/api/users/delete/:userId", users.delete);

// Delete a new user
router.delete("/api/users", users.deleteAll);

module.exports = router