module.exports = (res, err) =>
{
  if (!err) return false;

  console.error(err);
  res.status(500).json({ message: 'DB 오류 발생' });
  return true;
};