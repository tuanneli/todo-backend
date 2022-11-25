const User = require('../models/userModel');
const ApiError = require('../../../errors/ApiError');
const bcrypt = require('bcrypt');
const UserDto = require('../userDto/userDto');
const TokenService = require('./tokenService');

/**
 * Класс в который выносится часть логики из контроллера
 */

class AuthService {

    /**
     * Данные для регистрации
     * @param email
     * @param password
     * @param role
     *
     * Возвращаемый объект с данными о пользователями, а так же jwt токенами
     * @returns {Promise<{accessToken: *|undefined, user: UserDto, refreshToken: *|undefined}>}
     */

    async registration(email, password, role) {
        const candidate = await User.findOne({email});
        if (candidate) {
            throw ApiError.badRequest('Такой пользователь уже зарегестрирован');
        }
        const hashPassword = bcrypt.hashSync(password, 5);
        const user = await User.create({email, password: hashPassword, role});
        const userDto = new UserDto(user);
        const tokens = await TokenService.generateTokens({userDto});
        await TokenService.saveTokens(userDto.id, tokens.refreshToken);
        return {
            user: userDto,
            ...tokens
        };
    }

    /**
     * Данные для логина
     * @param email
     * @param password
     *
     * Возвращаемый объект с данными о пользователями, а так же новыми jwt токенами
     * @returns {Promise<{accessToken: *|undefined, user: UserDto, refreshToken: *|undefined}>}
     */

    async login(email, password) {
        const candidate = await User.findOne({email});
        if (!candidate) {
            throw ApiError.badRequest('Неверный логин или пароль');
        }
        const isValid = bcrypt.compareSync(password, candidate.password);
        if (!isValid) {
            throw ApiError.badRequest('Неверный логин или пароль');
        }
        const userDto = new UserDto(candidate);
        const tokens = await TokenService.generateTokens({userDto});
        await TokenService.saveTokens(userDto.id, tokens.refreshToken);
        return {
            user: userDto,
            ...tokens
        }
    }

    /**
     * Получаем refreshToken в параметрах который достали из cookie в middleware
     * @param refreshToken
     *
     * Возвращаемый объект с данными о пользователями, а так же новыми jwt токенами
     * @returns {Promise<{accessToken: *|undefined, user: UserDto, refreshToken: *|undefined}>}
     */

    async check(refreshToken) {
        if (!refreshToken) {
            throw ApiError.notAuthorized();
        }
        const token = await TokenService.findToken(refreshToken);
        const data = await TokenService.validateRefreshToken(refreshToken);
        if (!token && !data) {
            throw ApiError.notAuthorized();
        }
        const user = await User.findById(data.userDto.id);
        const userDto = new UserDto(user);
        const tokens = await TokenService.generateTokens({userDto});
        await TokenService.saveTokens(userDto.id, tokens.refreshToken);
        return {
            user: userDto,
            ...tokens
        }
    }

    async logout(refreshToken) {
        return TokenService.removeToken(refreshToken);
    }
}

module.exports = new AuthService();
