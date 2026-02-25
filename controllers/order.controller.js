const mariadb = require('mysql2/promise');
const { StatusCodes } = require('http-status-codes');

const order = async (req, res) => 
{
    try
    {
        const conn = await mariadb.createConnection
        ({
            host: 'localhost',
            user: 'root',
            password: process.env.DB_PASSWORD,
            database: 'Bookstore',
            dataString: true
        });
    
        const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } = req.body;
    
        let delivery_id;
        let order_id;
        let results;
        
        let sql = 'INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)';
        let values = [ delivery.address, delivery.receiver, delivery.contact ];
    
        [results] = await conn.query(sql, values);
        delivery_id = results.insertId;
    
        sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)`;
        values = [ firstBookTitle, totalQuantity, totalPrice, userId, delivery_id ];
        
        [results] = await conn.query(sql, values);
        order_id = results.insertId;
    
        sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;
        values = [];
        
        items.forEach((item) => { values.push([ order_id, item.bookId, item.quantity ]) })
        [results] = await conn.query(sql, [values]);
        
        return res.status(StatusCodes.OK).json(results)
    }
    catch (err) { console.error(err); res.status(StatusCodes.BAD_REQUEST).json({ message: 'DB 오류 발생' }); }
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