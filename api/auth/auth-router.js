const router = require("express").Router();
const bcryptjs = require("bcryptjs");

const { buildToken } = require("./auth-helpers");
const Users = require("../users/users-model");
const { requireCredentials, checkUsernameExists } = require("./auth-middleware");

router.post(
  "/register",
  requireCredentials,
  checkUsernameExists,
  (req, res, next) => {
    /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */

    const { username, password } = req.body;
    const hash = bcryptjs.hashSync(password, 8);
    Users.add({ username, password: hash })
      .then((newUser) => {
        res.status(201).json({
          id: newUser.id,
          username: newUser.username,
          password: newUser.password,
        });
      })
      .catch(next);
  }
);

router.post("/login", requireCredentials, (req, res, next) => {
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
  */
  let { username, password } = req.body;
 

  Users.findBy({ username })
    .then(([user]) => {
      if (user && bcryptjs.compareSync(password, user.password)) {
        const token = buildToken(user);
        res.status(200).json({
          message: `welcome, ${user.username}`,
          token,
        });
      } else {
        next({ status: 401, message: "invalid credentials" });
      }
    })
    .catch(next);
});

module.exports = router;
