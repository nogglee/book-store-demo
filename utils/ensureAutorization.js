const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { StatusCodes } = require('http-status-codes');

dotenv.config();

module.exports = (req, res) =>
{
    try
    {
        const receivedJwt = req.headers["authorization"];
        const decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);

        console.log("decoded jwt : ", decodedJwt);

        return decodedJwt;
    }
    catch (err) 
    { 
        console.log(`name : ${err.name}`); console.log(`message : ${err.message}`) 
        return err
    }
};