const Router = require('express');
const router = new Router();
const authRouter = require('../components/auth/authRouer');
const todoRouter = require('../components/todo/todoRouter');
const checkAuthMiddleware = require('../middlewares/checkAuthMiddleware');

/**
 * Создаем удобный роутинг с основными маршрутами
 *
 * Для пути /todo передаем middleware проверающий авторизован ли пользователь
 *
 */

router.use('/auth', authRouter);
router.use('/todo', checkAuthMiddleware, todoRouter);

module.exports = router;