const express = require('express');
const app = express();
const dotenv = require('dotenv')

dotenv.config();

app.listen(process.env.PORT, console.log(`🚀 ${process.env.PORT} 포트에서 서버 구동 중!`));
