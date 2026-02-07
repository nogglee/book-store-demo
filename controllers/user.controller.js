const conn = require('../mariadb');
const handleDbError = require('../utils/handleDbError');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config();

const signup = (req, res) =>
{
    const { email, name, password } = req.body;

    conn.query
    (
        'SELECT * FROM users WHERE email = ?', [ email ],
        (err, results) => 
        {
            if (handleDbError(res, err)) return;
            if(results.length){ return res.status(StatusCodes.CONFLICT).json({ message : '이미 가입된 이메일입니다.' }) }

            conn.query
            (
                'INSERT INTO users (email, name, password) VALUES (?, ?, ?)', [ email, name, password ],
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
            
            if(currentUser && currentUser.password == password)
            {
                const token = jwt.sign
                (
                    { email: currentUser.email },
                    process.env.PRIVATE_KEY,
                    { expiresIn : '5m', issuer : "nogglee"}
                );

                res.cookie("token", token, { httpOnly : true })
                console.log("token: ", token)

                return res.status(StatusCodes.OK).json(results)
            }
            else { return res.status(StatusCodes.UNAUTHORIZED).json({ message : '아이디나 비밀번호를 확인해 주세요.' }) }
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

    conn.query
    (
        'UPDATE users SET password = ? WHERE email = ?', [ password, email ],
        (err, results) => 
        {
            if(handleDbError(res, err)) return;
            
            if(results.affectedRows == 0) { return res.status(StatusCodes.BAD_REQUEST).end(); }
            else { return res.status(StatusCodes.OK).json({ message : '비밀번호 변경에 성공했습니다.' }) }
        }
    )
};

module.exports = { signup, signin, requestPasswordReset, passwordReset };