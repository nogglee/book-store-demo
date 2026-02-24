const conn = require('../db/mariadb');
const { StatusCodes } = require('http-status-codes');
const handleDbError = require('../utils/handleDbError');

// TODO: 비동기 처리
const order = (req, res) => 
{
    const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } = req.body;

    var delivery_id;
    var order_id;
    let sql = 'INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)';
    let values = [ delivery.address, delivery.receiver, delivery.contact ];

    conn.query
    (
        sql, values,    
        (err, results) => 
        {
            if(handleDbError(res, err)) return;
            delivery_id = results.insertId;
        }
    )

    console.log(delivery_id)

    sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)`;
    values = [ firstBookTitle, totalQuantity, totalPrice, userId, delivery_id ];
    conn.query
    (
        sql, values,    
        (err, results) => 
        {
            if(handleDbError(res, err)) return;
            order_id = results.insertId;
        }
    )

    sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;
    
    values = [];
    items.forEach((item) => { values.push([ order_id, item.bookId, item.quantity ]) })

    conn.query
    (
        sql, [values],    
        (err, results) => 
        {
            if(handleDbError(res, err)) return;
            return res.status(StatusCodes.OK).json(results)
        }
    )
}

const getOrders = (req, res) => 
{
    res.json('주문 목록 조회')
}

const getOrderDetail = (req, res) => 
{
    res.json('주문 상세 조회')
}

module.exports = { order, getOrders, getOrderDetail };