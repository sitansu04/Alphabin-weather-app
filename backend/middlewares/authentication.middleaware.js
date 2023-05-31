const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  let token = req.headers.authorization;
  if (token) {
    try {
      const decoded = jwt.verify(token, "sitansu");
      if (decoded) {
        const userID = decoded.userID;
        req.body.userID = userID;
        next();
      } else {
        res.status(400).send({ msg: "Please login first" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ err: error.message });
    }
  } else {
    res.status(500).send({ msg: "Please Login First" });
  }
};

module.exports = { authenticate };