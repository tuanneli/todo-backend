const Router = require('express');
const router = new Router();
const {check} = require('express-validator');
const TodoController = require('./todoController');

/**
 * Роутинги для CRUD todo листа
 *
 * Для некоторых путей передаем middlewares
 * для проверки корректности ввода данных
 *
 */

router.post('/create', [
    check('text', 'Это поле не может быть пустым').notEmpty()
], TodoController.create);
router.get('/find', TodoController.getAll);
router.put('/change', TodoController.change);
router.delete('/delete', TodoController.delete);

module.exports = router;