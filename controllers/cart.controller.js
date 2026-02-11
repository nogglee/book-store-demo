const conn = require('../db/mariadb');
const { StatusCodes } = require('http-status-codes');
const handleDbError = require('../utils/handleDbError');

const addToCart = (req, res) => 
{
    const { user_id, book_id, quantity } = req.body;

    conn.query
    (
        'INSERT INTO cartItems (user_id, book_id, quantity) VALUES (?, ?, ?)', [user_id, book_id, quantity],
        (err, results) => 
        {
            if(handleDbError(res, err)) return;

            return res.status(StatusCodes.OK).json({ message : '장바구니에 등록되었습니다.' });
        }
    )
}

const getCartItems = (req, res) =>
{
    const user_id = parseInt(req.body.user_id);

    conn.query
    (
        'SELECT cartItems.id, book_id, title, summary, quantity, price FROM cartItems LEFT JOIN books ON cartItems.book_id = books.id WHERE user_id = ?', [user_id],
        (err, results) =>
        {
            if(handleDbError(res, err)) return;

            return res.status(StatusCodes.OK).json(results);
        }
    )

}

const removeCartItems = (req, res) => 
{
    const book_id = req.params.id
    const { user_id } = req.body

    conn.query
    (
        'DELETE FROM cartItems WHERE user_id = ? AND book_id = ?', [user_id, book_id],
        (err, results) => 
        {
            if(handleDbError(res, err)) return;

            return res.status(StatusCodes.OK).json({ message : '삭제가 완료되었습니다.' });
        }
    )
}

module.exports = { addToCart, getCartItems, removeCartItems };