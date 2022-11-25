const ApiError = require('../errors/ApiError');

/**
 *
 * Middleware для универсальной обработки ошибок
 *
 * @param error
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */

const errorMiddleware = (error, req, res, next) => {
    if (error instanceof ApiError) {
        return res.status(error.status).json({message: error.message});
    }
    console.log(error)
    return res.status(500).json({message: 'Внутренняя ошибка сервера'});
}

module.exports = errorMiddleware;