const conn = require('../db/mariadb');
const handleDbError = require('../utils/handleDbError');
const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const signup = (req, res) =>
{
    const { email, name, password } = req.body;

    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword =  crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

    conn.query
    (
        'SELECT * FROM users WHERE email = ?', [ email ],
        (err, results) => 
        {
            if (handleDbError(res, err)) return;
            if(results.length){ return res.status(StatusCodes.CONFLICT).json({ message : '이미 가입된 이메일입니다.' }) }

            conn.query
            (
                'INSERT INTO users (email, name, password, salt) VALUES (?, ?, ?, ?)', [ email, name, hashPassword, salt ],
                (err, results) => 
                {
                    if (handleDbError(res, err)) return;
                    else { return res.status(StatusCodes.CREATED).json({ message : '회원가입에 성공했습니다!' }) }
                }
            )
        }
    )
};

const signin = (req, res) => 
{
    const { email, password } = req.body;

    conn.query
    (
        'SELECT * FROM users WHERE email = ?', [ email ],
        (err, results) => 
        {
            if(handleDbError(res, err)) return;
            const currentUser = results[0]

            if(!currentUser) { return res.status(StatusCodes.UNAUTHORIZED).json({ message : '아이디 또는 비밀번호를 확인해 주세요.' }) }
            
            const hashPassword =  crypto.pbkdf2Sync(password, currentUser.salt, 10000, 10, 'sha512').toString('base64');
        
            if(currentUser.password == hashPassword)
            {
                const token = jwt.sign
                (
                    { id : currentUser.id, email: currentUser.email },
                    process.env.PRIVATE_KEY,
                    { expiresIn : '60m', issuer : "nogglee"}
                );

                res.cookie("token", token, { httpOnly : true })

                return res.status(StatusCodes.OK).json(results)
            }
            else { return res.status(StatusCodes.UNAUTHORIZED).json({ message : '아이디 또는 비밀번호를 확인해 주세요.' }) }
        }
    )
};

const requestPasswordReset = (req, res) =>
{
    const { email } = req.body;

    conn.query
    (
        'SELECT * FROM users WHERE email = ?', [ email ],
        (err, results) => 
        {
            if (handleDbError(res, err)) return;

            if(results.length) { return res.status(StatusCodes.OK).json({ email : email }) }
            else { return res.status(StatusCodes.UNAUTHORIZED).json({ message : '해당 이메일로 가입된 내역이 없습니다.' }) }
        }
    )
};

const passwordReset = (req, res) =>
{
    const { email, password } = req.body;

    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword =  crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

    conn.query
    (
        'UPDATE users SET password = ?, salt = ? WHERE email = ?', [ hashPassword, salt, email ],
        (err, results) => 
        {
            if(handleDbError(res, err)) return;
            
            if(results.affectedRows == 0) { return res.status(StatusCodes.BAD_REQUEST).end(); }
            else { return res.status(StatusCodes.OK).json({ message : '비밀번호 변경에 성공했습니다.' }) }
        }
    )
};

module.exports = { signup, signin, requestPasswordReset, passwordReset };