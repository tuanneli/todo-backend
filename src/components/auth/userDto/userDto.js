/**
 * Класс для выделения данных для их дальнейшей записи в jwt токен
 */

module.exports = class UserDto {
    id;

    constructor(model) {
        this.id = model._id;
    }
};