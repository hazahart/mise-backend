import { userDAO } from '../dao/user.dao';
import { UpdateUsuarioInput, UpdateRoleInput, CompleteOnboardingInput } from '../schemas/user.schema';

export class UserService {

    async getMe(userId: string) {
        const user = await userDAO.findById(userId);
        if (!user) throw { statusCode: 404, code: 'not_found', message: 'Usuario no encontrado' };
        return user;
    }

    async updateMe(userId: string, data: UpdateUsuarioInput) {
        const user = await userDAO.update(userId, data);
        if (!user) throw { statusCode: 404, code: 'not_found', message: 'Usuario no encontrado' };
        return user;
    }

    async completeOnboarding(userId: string, data: CompleteOnboardingInput) {
        const user = await userDAO.completeOnboarding(userId, data);
        if (!user) throw { statusCode: 404, code: 'not_found', message: 'Usuario no encontrado' };
        return user;
    }

    async updateRole(data: UpdateRoleInput) {
        const user = await userDAO.findById(data.userId);
        if (!user) throw { statusCode: 404, code: 'not_found', message: 'Usuario no encontrado' };
        return userDAO.updateRole(data.userId, data);
    }
}

export const userService = new UserService();