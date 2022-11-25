const Router = require('express');
const router = new Router();
const AuthController = require('./authController');
const {check} = require('express-validator');

/**
 * Роутинги для аутентификации и их контроллеры
 *
 * Для некоторых путей передаем middlewares
 * для проверки корректности ввода данных
 *
 */

router.post('/registration', [
    check('email', 'Почта не может быть пустой').notEmpty(),
    check('password', 'Минимальная длина должна быть 4 символа').isLength({min: 4})
], AuthController.registration);
router.post('/login', [
    check('email', 'Почта не может быть пустой').notEmpty(),
], AuthController.login);
router.get('/check', AuthController.check)
router.get('/logout', AuthController.logout)

module.exports = router;