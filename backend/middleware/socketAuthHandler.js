const jwt = require("jsonwebtoken");
const socketAuthHandler = (socket, next) => {
  const isHandshake = socket.client.request._query.sid === undefined;
  if (!isHandshake) {
    return next();
  }

  const accessToken =
    socket.client.request.headers.authorization?.split(" ")[1];

  if (!accessToken) return next(new Error("no token"));

  jwt.verify(accessToken, process.env.ACCESS_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error("invalid token"));
    }

    socket.user = decoded;
    next();
  });
};

module.exports = {socketAuthHandler}