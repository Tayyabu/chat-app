const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");

const verifyJWT = expressAsyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  try {
    const user = await verify(token);

    req.user = user;

    next();
  } catch {
    return res.sendStatus(403);
  }
});

const verify = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
      if (err) return reject({ err }); //invalid token
      resolve(decoded);
    });
  });
};

module.exports = verifyJWT;
