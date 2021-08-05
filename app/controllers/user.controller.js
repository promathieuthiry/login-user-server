const User = require("../models/user.model.js");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { createToken } = require("../utilities/JWT")
const { validateUser, updateUser } = require("../utilities/joi")
const { validateImage } = require("../utilities/image")

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  const { error, value } = validateUser({ email: req.body.email, password: req.body.password, password_confirmation: req.body.passwordConfirmation });
  if (error) {
    return res.status(400).send({
      isRegistered: false,
      message: error.details
    });
  }

  const hash = bcrypt.hashSync(req.body.password, saltRounds);

  // Create a User
  const user = new User({
    email: req.body.email,
    password: hash,
  });

  // Save User in the database
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        isRegistered: false,
        message: [{ message: err.message }] || ["Some error occurred while creating the User."]
      });
    else res.send({
      isRegistered: true,
      message: "User created with success"
    });
  });
};

// Login an user
exports.login = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const user = {
    email: req.body.email,
    password: req.body.password,
  }

  User.login(user, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Email unknown`
        });
      } else {
        res.status(500).send({
          message: "Some error occurred while logging the user"
        });
      }
    } else {
      const isPasswordValid = bcrypt.compareSync(user.password, data.password)
      if (isPasswordValid) {
        const credentials = data
        delete credentials.password;
        credentials.token = createToken(user)
        res.header("x-auth-token", credentials.token).send({
          message: "Logged with success",
          credentials
        });
      } else {
        res.send({
          message: "Wrong password"
        });
      }
    }
  });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  User.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Users."
      });
    else res.send(data);
  });
};

// Find a single User with a UserId
exports.findOne = (req, res) => {
  User.findById(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.userId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving User with id " + req.params.userId
        });
      }
    } else {
      const userInfo = data
      delete userInfo.password;
      res.send(userInfo);
    }
  });
};

// Update a User identified by the UserId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Different Route if upload password
  if (req.body.password) {
    const { error, value } = validateUser({ email: req.body.email, password: req.body.password, password_confirmation: req.body.password_confirmation });
    if (error) {
      return res.status(400).send({
        isRegistered: false,
        message: error.details
      });
    }
    req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
    User.updateByIdWithPassword(
      req.params.userId, req.body,
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: [`Not found User with id ${req.params.userId}.`]
            });
          } else {
            res.status(500).send({
              message: ["Error updating User with id " + req.params.userId]
            });
          }
        } else res.send({
          message: ["Updated with success"],
          data
        });
      }
    );
  } else {
    // Validate request
    const { error, value } = updateUser({ email: req.body.email });
    console.log(error, "error")
    if (error) {
      return res.status(400).send({
        // message: "Some error occurred while creating the User".
        message: error.details
      });
    }
    User.updateById(
      req.params.userId, req.body,
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: [`Not found User with id ${req.params.userId}.`]
            });
          } else {
            res.status(500).send({
              message: ["Error updating User with id " + req.params.userId]
            });
          }
        } else res.send({
          message: ["Updated with success"],
          data
        });
      }
    );
  }
};

// Delete a User with the specified userId in the request
exports.delete = (req, res) => {
  User.remove(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.userId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete User with id " + req.params.userId
        });
      }
    } else res.send({ message: `User was deleted successfully!` });
  });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  User.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Users."
      });
    else res.send({ message: `All Users were deleted successfully!` });
  });
};

exports.checkLogin = (req, res) => {
  console.log(req.session.user, 'credentials')
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.user.session })
  } else {
    res.send({ loggedIn: false })
  }
};

// Save profile picture from the database.
exports.uploadImage = (req, res) => {
  console.log(req.files, "file")
  const { name, data } = req.files.file;
  // Create a file object
  if (!req.files) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  const image = {
    name: name,
    data: data,
    users_id: req.body.users_id
  }
  User.uploadImage(image, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while uploading the image."
      });
    else res.send({ message: `Sent with success` });
  });
};


exports.getUserImage = (req, res) => {
  const userId = req.params.userId;
  User.getImage(userId, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while uploading the image."
      });
    else {
      // const contentType = await FileType.fromBuffer(img.img); // get the mimetype of the buffer (in this case its gonna be jpg but can be png or w/e)
      // res.type(contentType.mime); // not always needed most modern browsers including chrome will understand it is an img without this
      // res.end(img.img);

      FileType.fromBuffer(img.img, (contentType) => {
        res.type(contentType.mime); // not always needed most modern browsers including chrome will understand it is an img without this
        res.end(img.img);
      })
    };
  });
};