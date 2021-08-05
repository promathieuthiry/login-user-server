const express = require("express");
const router = express.Router()
const users = require("../controllers/user.controller.js");
const { validateToken } = require("../utilities/JWT")
const upload = require("../utilities/upload")


// Register a new user
router.post("/api/users/register", users.create);

// Login an user
router.post("/api/users/login", users.login);

// Upload profile picture
// router.post("/api/users/image", validateToken, upload.single("file"), users.uploadImage);
router.post("/api/users/image", validateToken, users.uploadImage);

// Check if an user is logged
router.get("/api/users/login", validateToken, users.checkLogin);

// Retrieve all users
router.get("/api/users", validateToken, users.findAll);

// Retrieve a single user with userId
router.get("/api/users/:userId", validateToken, users.findOne);

// Update a user with userId
router.put("/api/users/update/:userId", validateToken, users.update);

// Delete a user with userId
router.delete("/api/users/delete/:userId", validateToken, users.delete);

// Delete a new user
router.delete("/api/users", validateToken, users.deleteAll);

// Get profile picture
router.get("/api/users/img/:userId", validateToken, users.getUserImage);



module.exports = router