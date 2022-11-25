const Todo = require('./models/todoModel');
const ApiError = require('../../errors/ApiError')

/**
 * Класс в который выносится часть логики из контроллера
 */

class TodoService {
    async create(header, description, date = "", file, userId) {
        if (!header || !description) {
            throw ApiError.badRequest('Заголовок и описание не могут быть пустыми');
        }
        if (!userId) {
            throw ApiError.notAuthorized();
        }
        return Todo.create({header, description, date, file, userId})
    }

    async getAll(limit, offset, find = "", userId) {
        return Todo.find({text: {$regex: find, $options: 'i'}, userId})
            .limit(Number(limit))
            .skip(Number(offset))
    }

    async change(id, header, description, date = "", file) {
        await Todo.findByIdAndUpdate(id, {header, description, date, file});
        return Todo.findById(id);
    }

    async checkTodoIsDone(id, done) {
        await Todo.findByIdAndUpdate(id, {done});
        return Todo.findById(id);
    }

    async delete(id) {
        const todo = await Todo.findById(id);
        return Todo.findByIdAndDelete(id);
    }
}

module.exports = new TodoService();
