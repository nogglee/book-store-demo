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
    
        const { items, delivery, totalQuantity, totalPrice, firstBookTitle } = req.body;
        const userId = req.user.id;
    
        let delivery_id;
        let order_id;
        let results;
        
        let sql = 'INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)';
        let values = [ delivery.address, delivery.receiver, delivery.contact ];
    
        [results] = await conn.execute(sql, values);
        delivery_id = results.insertId;
    
        sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)`;
        values = [ firstBookTitle, totalQuantity, totalPrice, userId, delivery_id ];
        
        [results] = await conn.execute(sql, values);
        order_id = results.insertId;
    
        // req.body.item를 활용하여 장바구니에서 book_id, quantity 조회
        sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
        let [orderItems, fields] = await conn.query(sql, [items]);

        // orderedBook 삽입
        sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;
        values = [];

        orderItems.forEach((item) => { values.push([ order_id, item.book_id, item.quantity ]) })
        results = await conn.query(sql, [values]);

        deleteCartItems(conn, items);
        return res.status(StatusCodes.OK).json(results[0])
    }
    catch (err) { console.error(err); res.status(StatusCodes.BAD_REQUEST).json({ message: 'DB 오류 발생' }) }
}

const deleteCartItems = async (conn, items) =>
{
    let sql = 'DELETE FROM cartItems WHERE id IN (?)';

    let result = await conn.query(sql, [items]);
    return result;
}

const getOrders = async (req, res) => 
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
        
        let sql = `SELECT orders.id, created_at, address, receiver, contact, book_title, total_quantity, total_price
                    FROM orders LEFT JOIN delivery
                    ON orders.delivery_id = delivery.id`;

        let [rows, fields] = await conn.execute(sql);
        return res.status(StatusCodes.OK).json(rows);
    }
    catch (err) { console.error(err); res.status(StatusCodes.BAD_REQUEST).json({ message: 'DB 오류 발생' }) }
}

const getOrderDetail = async (req, res) => 
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
        
        const order_id = req.params.id;

        let sql = `SELECT book_id, title, author, price, quantity
                    FROM orderedBook LEFT JOIN books
                    ON orderedBook.book_id = books.id
                    WHERE order_id = ?`;

        let [rows, fields] = await conn.execute(sql, [order_id]);
        return res.status(StatusCodes.OK).json(rows);
    }
    catch (err) { console.error(err); res.status(StatusCodes.BAD_REQUEST).json({ message: 'DB 오류 발생' }) }
}

module.exports = { order, getOrders, getOrderDetail };