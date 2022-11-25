const AuthService = require('./services/authService');
const {validationResult, cookie} = require('express-validator');
const ApiError = require('../../errors/ApiError');
const jwt = require("jsonwebtoken");

/**
 * Класс в котором хранятеся все CRUD методы для аутентификации
 */

class AuthController {

    /**
     * Метод для регистрации пользователя
     */

    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }
            const {email, password, role} = req.body;
            const user = await AuthService.registration(email, password, role);
            res.cookie('refreshToken', user.refreshToken, {
                maxAge: 60 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "none",
                secure: true
            })
            return res.status(200).json(user);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Метод для логина пользователя
     */

    async login(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }
            const {email, password} = req.body;
            const user = await AuthService.login(email, password);
            res.cookie('refreshToken', user.refreshToken, {
                maxAge: 60 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "none",
                secure: true
            })
            return res.status(200).json(user);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Метод для проверки зарегестрирован ли пользователь
     */

    async check(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const user = await AuthService.check(refreshToken);
            res.cookie('refreshToken', user.refreshToken, {
                maxAge: 60 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "none",
                secure: true
            })
            return res.status(200).json(user);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = AuthService.logout(refreshToken);
            res.clearCookie('refreshToken');
            res.status(200).json(token);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new AuthController();