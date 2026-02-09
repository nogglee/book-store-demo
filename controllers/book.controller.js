const conn = require('../db/mariadb');
const handleDbError = require('../utils/handleDbError');
const { StatusCodes } = require('http-status-codes');

const allBooks = (req, res) =>
{
    const {category_id} = req.query;

    if(category_id)
    {
        conn.query
        (
            'SELECT * FROM books WHERE category_id = ?', [category_id],
            (err, results) =>
            {
                if(handleDbError(res, err)) return;
                
                if(results.length) { return res.status(StatusCodes.OK).json(results) }
                else { return res.status(StatusCodes.NOT_FOUND).json({ message : '해당 카테고리에 등록된 도서가 없습니다.' }) }
            }
        )
    }
    else
    {
        conn.query
        (
            'SELECT * FROM books',
            (err, results) =>
            {
                if(handleDbError(res, err)) return;
                
                if(results.length) { return res.status(StatusCodes.OK).json(results) }
                else { return res.status(StatusCodes.NOT_FOUND).json({ message : '등록된 도서가 없습니다.' }) }
            }
        )
    }
}

const bookDetail = (req, res) =>
{
    const id = parseInt(req.params.id);

    conn.query
    (
        'SELECT * FROM books LEFT JOIN category ON books.category_id = category.id WHERE books.id = ?', [id],
        (err, results) =>
        {
            if(handleDbError(res, err)) return;
            
            if(results.length) { return res.status(StatusCodes.OK).json(results) }
            else { return res.status(StatusCodes.NOT_FOUND).json({ message : '등록된 도서가 없습니다.' }) }
        }
    )
}

module.exports = { allBooks, bookDetail };