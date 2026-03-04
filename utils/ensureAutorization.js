const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = (req) =>
{
    const receivedJwt = req.headers["authorization"];
    const decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
    console.log("decoded jwt : ", decodedJwt);

    return decodedJwt;
};