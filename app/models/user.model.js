const sql = require("./db.js");


// constructor
const User = function (user) {
  this.email = user.email;
  this.password = user.password;
};

User.create = (newUser, result) => {
  sql.query("SELECT email FROM users WHERE email = ?", newUser.email, (err, res) => {

    if (res.length) {
      result({ message: "User already exist" }, null);
      return;
    }

    sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      result(null, { id: res.insertId, ...newUser });
    });
  })
};

User.login = (user, result) => {

  sql.query("SELECT * FROM users WHERE email = ?", user.email, (err, res) => {

    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    } else {
      // not found User with the id
      return result({ kind: "not_found" }, null);
    }
  });
};


User.findById = (UserId, result) => {
  sql.query("SELECT * FROM users WHERE id = ?", UserId, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {
      result(null, res[0]);
      return;
    }

    // not found User with the id
    result({ kind: "not_found" }, null);
  });
};

User.getAll = result => {
  sql.query("SELECT * FROM users", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

User.updateById = (id, user, result) => {
  sql.query(
    "UPDATE users SET firstName = ?, lastName = ?, occupation = ?, email = ?, phone = ?, address = ?, city = ?, state = ?, zipcode = ?, country = ? WHERE id = ?",
    // firstName: "", lastName: "", email: "", phone: "", address: "", city: "", state: "", zipCode: "", country: "", password:
    [user.firstName, user.lastName, user.occupation, user.email, user.phone ? user.phone : null, user.address, user.city, user.state, user.zipcode ? user.zipcode : null, user.country, +id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found User with the id
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, { id: id, ...user });
    }
  );
};

User.updateByIdWithPassword = (id, user, result) => {
  sql.query(
    "UPDATE users SET firstName = ?, lastName = ?, occupation = ?, email = ?, phone = ?, address = ?, city = ?, state = ?, zipcode = ?, country = ?, password = ? WHERE id = ?",
    // firstName: "", lastName: "", email: "", phone: "", address: "", city: "", state: "", zipCode: "", country: "", password:
    [user.firstName, user.lastName, user.email, user.occupation, user.phone ? user.phone : null, user.address, user.city, user.state, user.zipcode ? user.zipcode : null, user.country, user.password, +id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found User with the id
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, { id: id, ...user });
    }
  );
};

User.remove = (id, result) => {
  sql.query("DELETE FROM users WHERE id = ?", +id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found User with the id
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, res);
  });
};

User.removeAll = result => {
  sql.query("DELETE FROM users", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

User.uploadImage = (image, result) => {
  sql.query("INSERT INTO files SET ?", image, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    console.log(res, "res");
    result(null, res[0]);
  });
};


User.getImage = (idfiles, result) => {
  sql.query("SELECT * FROM files WHERE idfiles = ?", idfiles, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {
      result(null, res[0]);
      return;
    }

    // not found User with the id
    result({ kind: "not_found" }, null);
  });
};

User.hasImageProfile = (UserId, result) => {
  sql.query("SELECT * FROM files WHERE users_id = ? ORDER BY idfiles DESC LIMIT 1", UserId, (err, res) => {
    if (res.length) {
      result(null, res[0]);
      return;
    } else {
      result(null, false);
    }
  });
};


module.exports = User;
