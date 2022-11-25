const {validationResult} = require('express-validator');
const ApiError = require('../../errors/ApiError');
const TodoService = require('./todoService');
const TokenService = require('../auth/services/tokenService');
const path = require('path');
const uuid = require('uuid');
const fs = require('fs');
const {debugLog} = require("express-fileupload/lib/utilities");
const Todo = require('../todo/models/todoModel');

/**
 * Класс в котором хранятеся все CRUD методы для todo листа
 */

class TodoController {
    async create(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                next(ApiError.badRequest('Заголовок и описание не могут быть пустыми'), errors.array())
            }
            const {header, description, date} = req.body;
            let fileName = "";
            try {
                let {file} = req.files;
                fileName = await uuid.v4() + file.name;
                await file.mv(path.resolve(__dirname, '../../../public', fileName));
            } catch (e) {
                console.log(e)
            }
            const {refreshToken} = req.cookies;
            const user = await TokenService.validateRefreshToken(refreshToken);
            const todo = await TodoService.create(header, description, date, fileName, user.userDto.id);
            return res.status(200).json(todo);
        } catch (e) {
            next(e);
        }
    }

    async getAll(req, res, next) {
        try {
            let {limit, page, find} = req.query;
            page = page || 1;
            limit = limit || 100;
            let offset = page * limit - limit;
            const {refreshToken} = req.cookies;
            const user = await TokenService.validateRefreshToken(refreshToken);
            const todos = await TodoService.getAll(limit, offset, find, user.userDto.id);
            return res.status(200).json(todos);
        } catch (e) {
            next(e);
        }
    }

    async change(req, res, next) {
        try {
            const {id, header, description, date} = req.body;
            let fileName = "";
            try {
                let {file} = req.files;
                fileName = await uuid.v4() + file.name;
                await file.mv(path.resolve(__dirname, '../../../public', fileName));
            } catch (e) {
                console.log(e)
            }
            if (!id) {
                next(ApiError.badRequest('Такого поля не существует'))
            }
            const todo = await TodoService.change(id, header, description, date, fileName);
            return res.status(200).json(todo);
        } catch (e) {
            next(e)
        }
    }

    async checkTodoIsDone(req, res, next) {
        try {
            const {id, done} = req.body;
            if (!id) {
                next(ApiError.badRequest('Такого поля не существует'))
            }
            const todo = await TodoService.checkTodoIsDone(id, done);
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
            const todo = await Todo.findById(id);
            if (todo.file) {
                fs.rmSync(path.resolve(__dirname, '../../../public', todo.file), {
                    force: true,
                });
            }
            await TodoService.delete(id);
            return res.status(200).json({message: "Успешно удалён"});
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new TodoController();