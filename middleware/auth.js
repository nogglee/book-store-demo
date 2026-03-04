const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { StatusCodes } = require('http-status-codes');

dotenv.config();

module.exports = (req, res, next) =>
{
    try
    {
        const receivedJwt = req.headers["authorization"];
    
        if(!receivedJwt) { return res.status(StatusCodes.UNAUTHORIZED).json({ message : "로그인이 필요한 서비스입니다." }) }
    
        const decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY, { issuer : 'nogglee' });
        req.user = { id : decodedJwt.id, email : decodedJwt.email };
    
        next();
    }
    catch (err)
    {
        if(err instanceof jwt.TokenExpiredError) { return res.status(StatusCodes.UNAUTHORIZED).json({ "message" : "로그인 세션이 만료되었습니다. 다시 로그인 해주세요." }) }
        if(err instanceof jwt.JsonWebTokenError) { return res.status(StatusCodes.UNAUTHORIZED).json({ "message" : "잘못된 토큰입니다." }) }
        return res.status(StatusCodes.UNAUTHORIZED).json({ "message" : "인증 처리 중 오류가 발생했습니다. 다시 시도해 주세요." })
    }
}