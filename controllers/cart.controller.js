const conn = require('../db/mariadb');
const ensureAuthorization = require('../utils/ensureAutorization');
const { StatusCodes } = require('http-status-codes');
const handleDbError = require('../utils/handleDbError');

const addToCart = (req, res) => 
{
    const { book_id, quantity } = req.body;

    conn.query
    (
        'INSERT INTO cartItems (user_id, book_id, quantity) VALUES (?, ?, ?)', [ensureAuthorization(req).id, book_id, quantity],
        (err, results) => 
        {
            if(handleDbError(res, err)) return;

            return res.status(StatusCodes.OK).json({ message : '장바구니에 등록되었습니다.' });
        }
    )
}

const getCartItems = (req, res) =>
{
    const { selected } = req.body;

    conn.query
    (
        `SELECT cartItems.id, book_id, title, summary, quantity, price 
        FROM cartItems 
            LEFT JOIN books ON cartItems.book_id = books.id 
        WHERE user_id = ? AND cartItems.id IN (?)`, [ensureAuthorization(req).id, selected ],
        (err, results) =>
        {
            if(handleDbError(res, err)) return;

            return res.status(StatusCodes.OK).json(results);
        }
    )

}

const removeCartItems = (req, res) => 
{
    const { cartItemId } = req.params.id;

    conn.query
    (
        'DELETE FROM cartItems WHERE id = ?', [cartItemId],
        (err, results) => 
        {
            if(handleDbError(res, err)) return;

            return res.status(StatusCodes.OK).json({ message : '삭제가 완료되었습니다.' });
        }
    )
}

module.exports = { addToCart, getCartItems, removeCartItems };