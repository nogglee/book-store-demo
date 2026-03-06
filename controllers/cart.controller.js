const conn = require('../db/mariadb');
const { StatusCodes } = require('http-status-codes');
const handleDbError = require('../utils/handleDbError');

const addToCart = (req, res) => 
{
    const { book_id, quantity } = req.body;
    const user_id = req.user.id;

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
    const { selected } = req.body ?? {};
    const user_id = req.user.id;

    let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
                FROM cartItems 
                    LEFT JOIN books ON cartItems.book_id = books.id`;
    
    const conditions = ['user_id = ?'];
    const values = [user_id];
    
    if(selected) 
    { 
        conditions.push('cartItems.id IN (?)');
        values.push(selected); 
        console.log("selected length : ", selected.length);
    };
    

    sql += ` WHERE ${conditions.join(' AND ')}`;

    conn.query
    (
        sql, values, (err, results) =>
        {
            if(handleDbError(res, err)) return;

            results.map
            (
                (result) => 
                {
                    result.bookId = result.book_id;
                    delete result.book_id;
                }
            );

            return res.status(StatusCodes.OK).json(results);
        }
    )
}

const removeCartItems = (req, res) => 
{
    const cartItemId = req.params.id;

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