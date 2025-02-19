const { logEvent } = require("./logger");

const errorHandler = (err, req, res, next) => {
  logEvent(`${err.name}: ${err.message}\n`, "errLog.txt");
  console.error(err.stack);
  res.status(500).send(err.message);
  next()
};

module.exports = errorHandler;
