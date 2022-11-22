const ApiError = require('../errors/ApiError');
const TokenService = require('../components/auth/services/tokenService');

/**
 *
 * Middleware для проверки зарегестрирован ли пользователь
 *
 */

module.exports = checkAuthMiddleware = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header) {
            return next(ApiError.notAuthorized());
        }
        const token = header.split(' ')[1];
        if (!token) {
            return next(ApiError.notAuthorized());
        }
        const user = await TokenService.validateAccessToken(token);
        if (!user) {
            return next(ApiError.notAuthorized());
        }
        next()
    } catch (e) {
        next(ApiError.notAuthorized());
    }
}