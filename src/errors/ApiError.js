/**
 * Универсальный класс обработки ошибок
 */

module.exports = class ApiError extends Error {
    status;
    err;

    constructor(status, message, err = []) {
        super(message);
        this.err = err;
        this.status = status;
    }

    static badRequest(message, err = []) {
        return new ApiError(403, message, err);
    }

    static notFound(message, err = []) {
        return new ApiError(404, message);
    }

    static notAuthorized(message, err = []) {
        return new ApiError(401, 'Ошибка авторизации');
    }
}