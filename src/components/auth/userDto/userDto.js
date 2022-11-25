/**
 * Класс для выделения данных для их дальнейшей записи в jwt токен
 */

module.exports = class UserDto {
    id;
    email;
    role;

    constructor(model) {
        this.id = model._id;
        this.email = model.email;
        this.role = model.role;
    }
};