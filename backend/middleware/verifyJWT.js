const jwt = require('jsonwebtoken');
const expressAsyncHandler = require("express-async-handler")


const verifyJWT = expressAsyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    const user = verify(token)
    if ("err" in user) return res.sendStatus(403)

console.log(user);

    req.user = user


    next()





})


const verify = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            process.env.ACCESS_SECRET,
            (err, decoded) => {
                if (err) return reject({ err }) //invalid token
                resolve(decoded)



            }
        );
    })
}


module.exports = verifyJWT