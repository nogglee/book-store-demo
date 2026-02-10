const express = require("express");
const router = express.Router();
const validate = require('../middleware/validate');
const { body } = require('express-validator');

const { signup, signin, requestPasswordReset, passwordReset } = require('../controllers/user.controller')


router.use(express.json());

router.route('/signup')
    .post
    (
        [
            body('email').trim().notEmpty().withMessage('이메일을 입력해 주세요.').isEmail().withMessage('이메일 형식이 올바르지 않습니다.'),
            body('name').trim().notEmpty().withMessage('이름을 입력해 주세요.'),
            body('password').trim().notEmpty().withMessage('비밀번호를 입력해 주세요.'),
        ],
        validate,
        signup
    );

router.route('/signin')
    .post
    ( 
        [
            body('email').trim().notEmpty().withMessage('이메일을 입력해 주세요.').isEmail().withMessage('이메일 형식이 올바르지 않습니다.'),
            body('password').trim().notEmpty().withMessage('비밀번호를 입력해 주세요.'),
        ],
        validate,
        signin 
    );

router.route('/reset')
    .post(requestPasswordReset)
    .put(passwordReset)

module.exports = router;