const { findBy } = require("../users/users-model");

function requireCredentials(req, res, next) {
  let { username, password } = req.body;
  if (!username || !username.trim() || !password || !password.trim()) {
    res.json({ message: "username and password required" });
  } else {
    next();
  }
}

async function checkUsernameExists(req, res, next) {
  try {
    const [user] = await findBy({ username: req.body.username });
    if (user) {
      next({ message: "username already exists" });
    } else {
      //   req.user = user;
      next();
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { requireCredentials, checkUsernameExists };
