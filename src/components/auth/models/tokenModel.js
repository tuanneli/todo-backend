const {model, Schema} = require('mongoose')

/**
 * Создаем модель элемента для токена в базе данных
 */

const Token = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    refreshToken: {type: String, required: true},
});

module.exports = model('Token', Token);