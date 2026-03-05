const conn = require('../db/mariadb');
const handleDbError = require('../utils/handleDbError');
const { StatusCodes } = require('http-status-codes');

const allBooks = (req, res) =>
{
    let allBooksRes = {};
    const { category_id, newest } = req.query;
    
    // page number 기반 pagination 구현을 위해 limit과 current_page를 query string으로 입력 받으면
    // user가 url로 직접 접근하여 limit으로 지나치게 높은 수를 입력하거나 값을 지울 수 있다.
    // 만약 그런 상황이 발생한다면 아래와 같은 문제가 발생한다.
    // 1. 높은 수 입력 시, UI가 깨질 수 있다.
    // 2. limit 값을 지우면 error가 발생한다.
    // 위 문제를 해결하기 위해 limit 값에 min/max 제한을 두거나 default 값을 지정하려고 했으나,
    // 가변적인 limit 설정은 프론트에서 의도한 UI에서 벗어난 형태를 가질 수 있기 때문에
    // 백엔드에서 명시적으로 입력하는 것으로 변경했다.
    // 추후 무한 스크롤 구현 시에는 가변적인 limit 값을 사용해도 될 것 같다.
    const limit = 8;
    
    // 입력받은 current_page 값이 없거나 정수가 아니라면, 기본값으로 1을 적용한다.
    const rawPage = parseInt(req.query.current_page);
    const pageNumber = Number.isInteger(rawPage) ? rawPage : 1;

    let conditions = [];
    let values = [];

    if(category_id) { conditions.push('category_id = ?'); values.push(category_id) }
    if(newest) { conditions.push('pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()') }

    // COUNT(*) 먼저 조회해서 totalPage를 계산한 뒤, current_page를 최대값까지 보정한다.
    let countSql = 'SELECT COUNT(*) AS totalQuantity FROM books';
    if(conditions.length > 0) { countSql += ' WHERE ' + conditions.join(' AND ') };

    conn.query
    (
        countSql, values, (err, countResults) =>
        {
            if(handleDbError(res, err)) return;

            const totalQuantity = countResults[0]?.totalQuantity ?? 0;
            if(totalQuantity === 0) { return res.status(StatusCodes.NOT_FOUND).json({ message : '등록된 도서가 없습니다.' }) }

            const totalPage = Math.ceil(totalQuantity / limit);
            
            // pageNumber는 1부터 시작하므로, 최솟값 1을 보장하고 최댓값은 totalPage로 제한한다.
            const safePage = Math.max(1, Math.min(pageNumber, totalPage));
            const offset = limit * (safePage - 1);

            let dataSql = 'SELECT *, (SELECT count(*) AS liked_book FROM likes WHERE liked_book_id = books.id) AS likes FROM books';
            if(conditions.length > 0) { dataSql += ' WHERE ' + conditions.join(' AND ') };

            dataSql += ' LIMIT ? OFFSET ?';

            // WHERE 조건 (필터)의 확장성을 위해 category_id를 ...values로 사용
            const dataValues = [...values, limit, offset];

            conn.query
            (
                dataSql, dataValues, (err, results) =>
                {
                    if(handleDbError(res, err)) return;

                    allBooksRes.books = results;

                    allBooksRes.pagination =
                    {
                        totalQuantity: totalQuantity,
                        totalPage: totalPage,
                    };

                    return res.status(StatusCodes.OK).json(allBooksRes);
                }
            )
        }
    )
}

const bookDetail = (req, res) =>
{
    const book_id = parseInt(req.params.id);
    
    let sql = `SELECT *, 
                (SELECT count(*) AS liked_book FROM likes WHERE liked_book_id = books.id) AS likes,
                (SELECT category_name FROM category WHERE books.category_id = category.id) AS category`;
    let values = [];
    
    if(req.user)
    {
        const user_id = req.user.id;

        sql += `, (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = books.id)) AS isLiked`;
        values.push(user_id);
    }

    sql += ` FROM books WHERE books.id = ?`;
    values.push(book_id);

    conn.query
    (
        sql, values,
        (err, results) =>
        {
            if(handleDbError(res, err)) return;
            
            if(results.length) { return res.status(StatusCodes.OK).json(results) }
            else { return res.status(StatusCodes.NOT_FOUND).json({ message : '등록된 도서가 없습니다.' }) }
        }
    )
}

module.exports = { allBooks, bookDetail };