const {model, Schema} = require('mongoose');

/**
 * Создаем модель элемента для todo листа в базе дыннх
 */

const Todo = new Schema({
    header: {type: String, required: true},
    description: {type: String, required: true},
    date: {type: String},
    done: {type: Boolean, default: false},
    file: {type: String},
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
});

module.exports = model('Todo', Todo);