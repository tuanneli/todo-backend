const Todo = require('./models/todoModel');
const ApiError = require('../../errors/ApiError')

/**
 * Класс в который выносится часть логики из контроллера
 */

class TodoService {
    async create(text, userId) {
        if (!text) {
            throw ApiError.badRequest('Это поле не может быть пустым');
        }
        if (!userId) {
            throw ApiError.notAuthorized();
        }
        return Todo.create({text, userId})
    }

    async getAll(limit, offset, find = "") {
        return Todo.find({text: {$regex: find, $options: 'i'}})
            .limit(Number(limit))
            .skip(Number(offset))
    }

    async change(id, text) {
        await Todo.findByIdAndUpdate(id, {text});
        return Todo.findById(id);
    }

    async delete(id) {
        return Todo.findByIdAndDelete(id);
    }
}

module.exports = new TodoService();
