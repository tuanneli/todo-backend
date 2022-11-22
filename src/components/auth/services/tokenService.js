const jwt = require("jsonwebtoken");
const Token = require('../models/tokenModel')

/**
 * Класс в котором реализованы методы работы с токенами
 */

class TokenService {

    /**
     *
     * @param model данные пользователя которые будут записаны в токен
     *
     * @returns {Promise<{accessToken: (*), refreshToken: (*)}>}
     */

    async generateTokens(model) {
        const accessToken = jwt.sign(model, process.env.JWT_ACCESS_KEY, {expiresIn: '15m'});
        const refreshToken = jwt.sign(model, process.env.JWT_REFRESH_KEY, {expiresIn: '30d'});
        return {
            accessToken,
            refreshToken
        }
    }

    /**
     *
     * @param userId id пользователя к которому будет привязан данный токен
     * @param refreshToken токен который будет сохранен в базу данных
     * для проверки регистрации пользователя
     *
     * @returns {Promise<HydratedDocument<InferSchemaType<module:mongoose.Schema<any, Model<EnforcedDocType, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, ObtainDocumentType<any, EnforcedDocType, TPathTypeKey>>>, ObtainSchemaGeneric<module:mongoose.Schema<any, Model<EnforcedDocType, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, ObtainDocumentType<any, EnforcedDocType, TPathTypeKey>>, "TInstanceMethods">, {}>|*>}
     */

    async saveTokens(userId, refreshToken) {
        const token = await Token.findOne({userId});
        if (token) {
            token.refreshToken = refreshToken;
            return token.save();
        }
        return Token.create({userId, refreshToken});
    }

    async findToken(refreshToken) {
        const token = await Token.findOne({refreshToken});
        if (!token) {
            return null;
        }
        return token;
    }

    /**
     *
     * Валидация для refreshToken
     *
     * @param refreshToken
     * @returns {Promise<*|null>}
     */

    async validateRefreshToken(refreshToken) {
        const data = await jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
        if (!data) {
            return null;
        }
        return data;
    }

    /**
     *
     * Валидация для accessToken
     *
     * @param accessToken
     * @returns {Promise<*|null>}
     */

    async validateAccessToken(accessToken) {
        const data = await jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
        if (!data) {
            return null;
        }
        return data;
    }
}

module.exports = new TokenService();