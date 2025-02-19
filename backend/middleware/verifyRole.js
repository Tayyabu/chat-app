const expressAsyncHandler = require("express-async-handler");

const verifyRoles = (...roles) => {
  return expressAsyncHandler((req, res, next) => {
    const rolesArray = [...roles];
    if (!req?.user?.roles)
      return res.status(401).json({ message: "Unauthorized" });
    const result = req.user.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);
    if (!result) return res.status(401).json({ message: "Unauthorized" });
    next();
  });
};
module.exports = verifyRoles