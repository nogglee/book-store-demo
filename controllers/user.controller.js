const conn = require('../mariadb');
const handleDbError = require('../utils/handleDbError');
const { StatusCodes } = require('http-status-codes');

const signup = (req, res) =>
{
    const {email, name, password} = req.body;

    conn.query
    (
        'SELECT * FROM users WHERE email = ?', [email],
        (err, results) => 
        {
            if (handleDbError(res, err)) return;
            if(results.length){ return res.status(StatusCodes.CONFLICT).json({ message : '이미 가입된 이메일입니다.' }) }

            conn.query
            (
                'INSERT INTO users (email, name, password) VALUES (?, ?, ?)', [email, name, password],
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
    const {email, password} = req.body;

    conn.query
    (

    )
};

const requestPasswordReset = (req, res) =>
{
    res.json('비밀번호 초기화 요청')
};

const passwordReset = (req, res) =>
{
    res.json('비밀번호 초기화')
};

module.exports = { signup, signin, requestPasswordReset, passwordReset };