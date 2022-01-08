const jwt = require("jsonwebtoken");

//middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");

      //if evertyting is ok, assign user to the req.user
      req.user = user;

      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    // we need to check whether the token is belong to this user.
    if (req.user.id === req.params.id) next();
    else return res.status(403).json("You are not allowed to do that!");
  });
};

module.exports = { verifyToken, verifyTokenAndAuthorization };
