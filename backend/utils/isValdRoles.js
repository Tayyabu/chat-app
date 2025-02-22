const ROLES = {
  0: ["User"],
  1: ["User", "Staff"],
  2: ["Admin", "User", "Staff"],
};

const isValidRoles = (roles) => {
  if (!Array.isArray(roles)) return false;
  if (!(roles.length - 1 in ROLES)) return false;
  const rolesToCheck = ROLES[roles.length - 1];
  return roles.every((val) => rolesToCheck.includes(val));
};
module.exports = {isValidRoles}