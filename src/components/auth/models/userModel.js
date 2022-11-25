const {model, Schema} = require('mongoose');

/**
 * Создаем модель элемента для пользователя в базе дынных
 */

const User = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    role: {type: String, default: 'USER'}
});

module.exports = model('User', User);