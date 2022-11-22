const {model, Schema} = require('mongoose');

/**
 * Создаем модель элемента для todo листа в базе дыннх
 */

const Todo = new Schema({
    text: {type: String, required: true},
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
});

module.exports = model('Todo', Todo);