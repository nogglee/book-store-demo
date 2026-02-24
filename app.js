const express = require('express');
const app = express();
const dotenv = require('dotenv')

dotenv.config();

app.listen(process.env.PORT, console.log(`🚀 ${process.env.PORT} 포트에서 서버 구동 중!`));

const userRouter = require('./routes/users');
const bookRouter = require('./routes/books');
const categoryRouter = require('./routes/category');
const likeRouter = require('./routes/likes');
const cartRouter = require('./routes/carts');
const orderRouter = require('./routes/orders');

app.use
(
    (req, res, next) => 
    {
        console.log('⚡️ 요청이 들어왔어요! :', req.method, JSON.stringify(req.originalUrl));
        next();
    }
);

app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/category', categoryRouter);
app.use('/like', likeRouter);
app.use('/carts', cartRouter);
app.use('/orders', orderRouter);