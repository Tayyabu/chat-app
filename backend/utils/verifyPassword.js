const hashPassword = require("./hashPassword");




async function verifyPassword(password,hashedPassword) {


    return (await hashPassword(password)) === hashedPassword
    
}


module.exports = verifyPassword