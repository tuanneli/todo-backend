const {validationResult} = require('express-validator');
const ApiError = require('../../errors/ApiError');
const TodoService = require('./todoService');
const TokenService = require('../auth/services/tokenService');

/**
 * Класс в котором хранятеся все CRUD методы для todo листа
 */

class TodoController {
    async create(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                next(ApiError.badRequest('Это поле не может быть пустым'), errors.array())
            }
            const {text} = req.body;
            const {refreshToken} = req.cookies;
            const user = await TokenService.validateRefreshToken(refreshToken);
            const todo = await TodoService.create(text, user.userDto.id);
            return res.status(200).json(todo);
        } catch (e) {
            next(e);
        }
    }

    async getAll(req, res, next) {
        try {
            let {limit, page, find} = req.query;
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;
            const todos = await TodoService.getAll(limit, offset, find);
            return res.status(200).json(todos);
        } catch (e) {
            next(e);
        }
    }

    async change(req, res, next) {
        try {
            const {id, text} = req.body;
            if (!id) {
                next(ApiError.badRequest('Такого поля не существует'))
            }
            const todo = await TodoService.change(id, text);
            return res.status(200).json(todo);
        } catch (e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.body;
            if (!id) {
                next(ApiError.badRequest('Такого поля не существует'))
            }
            await TodoService.delete(id);
            return res.status(200).json({message: "Успешно удалён"});
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new TodoController();