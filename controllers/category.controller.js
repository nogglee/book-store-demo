const conn = require('../db/mariadb');
const handleDbError = require('../utils/handleDbError');
const { StatusCodes } = require('http-status-codes');

const allCategory = (req, res) =>
{
    conn.query
    (
        'SELECT * FROM category',
        (err, results) => 
        {
            if(handleDbError(res, err)) return;

            results.map
            (
                (result) => 
                {
                    result.categoryName = result.category_name;
                    delete result.category_name;
                }
            );

            if(results.length) { return res.status(StatusCodes.OK).json(results) }
            else { return res.status(StatusCodes.NOT_FOUND).json({ message : '등록된 카테고리가 없습니다.' })}
        }
    )
}

module.exports = { allCategory };