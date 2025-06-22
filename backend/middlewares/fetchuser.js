const jwt = require("jsonwebtoken");

const fetchuser = (req, res, next) => {
  const token = req.header("authtoken");

  if (!token) {
    return res.status(401).send({ error: "Token not provided" });
  }

  try {
    const data = jwt.verify(token, process.env.signature);
    req.user = data.user; // expects { user: { id: ... } } in token
    next();
  } catch (err) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = fetchuser;
