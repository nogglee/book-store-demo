const conn = require('../db/mariadb');
const handleDbError = require('../utils/handleDbError');
const { StatusCodes } = require('http-status-codes');

const addLike = (req, res) => 
{
    const liked_book_id = parseInt(req.params.id);
    const user_id = req.user.id;

    conn.query
    (
        'INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)', [user_id, liked_book_id],
        (err, results) => 
        {
            if(handleDbError(res, err)) return;

            return res.status(StatusCodes.OK).json({ message : '좋아요가 등록되었습니다.' })
        }
    )
}

const removeLike = (req, res) => 
{
    const liked_book_id = parseInt(req.params.id);
    const user_id = req.user.id;

    conn.query
    (
        'DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?', [user_id, liked_book_id],
        (err, results) => 
        {
            if(handleDbError(res, err)) return;

            return res.status(StatusCodes.OK).json({ message : '좋아요가 삭제되었습니다.' })
        }
    )
}

module.exports = { addLike, removeLike };