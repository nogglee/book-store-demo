const express = require("express");
const router = express.Router();
const conn = require('../mariadb');
const handleDbError = require('../utils/handleDbError');
const validate = require('../middleware/validate');
const { body, param } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

router.use(express.json());

router.route('/signup')
    .post
    (
        [
            body('email').trim().notEmpty().withMessage('이메일을 입력해 주세요.').isEmail().withMessage('이메일 형식이 올바르지 않습니다.'),
            body('name').trim().notEmpty().withMessage('이름을 입력해 주세요.'),
            body('password').trim().notEmpty().withMessage('비밀번호를 입력해 주세요.'),
            validate
        ],

        (req, res) =>
        {
            const {email, name, password} = req.body

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
        }
    );

router.route('/signin')
    .post
    (
        '/signin',
        (req, res) =>
        {
            res.json('로그인')
        }
    );


router.route('/reset')
    .post // request init password
    (
        (req, res) =>
        {
            res.json('비밀번호 초기화 요청')
        }
    )
    .put // init password
    (
        (req, res) =>
        {
            res.json('비밀번호 초기화')
        }
    )

module.exports = router;