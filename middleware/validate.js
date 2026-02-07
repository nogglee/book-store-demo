const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

module.exports = (req, res, next) =>
{
  const err = validationResult(req);
  if (err.isEmpty()) return next();
  return res.status(StatusCodes.BAD_REQUEST).json({ err: err.array() });
};