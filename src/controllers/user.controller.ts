import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { UpdateUsuarioInput, UpdateRoleInput, CompleteOnboardingInput } from '../schemas/user.schema';

export async function getMe(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user!.uid;
        const user = await userService.getMe(userId);
        res.json(user);
    } catch (error) {
        next(error);
    }
}

export async function updateMe(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user!.uid;
        const data = req.body as UpdateUsuarioInput;
        const user = await userService.updateMe(userId, data);
        res.json(user);
    } catch (error) {
        next(error);
    }
}

export async function completeOnboarding(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user!.uid;
        const data = req.body as CompleteOnboardingInput;
        const user = await userService.completeOnboarding(userId, data);
        res.json(user);
    } catch (error) {
        next(error);
    }
}

export async function updateUserRole(req: Request, res: Response, next: NextFunction) {
    try {
        const data = req.body as UpdateRoleInput;
        await userService.updateRole(data);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await userService.getMe(req.params['id'] as string);
        res.json(user);
    } catch (error) {
        next(error);
    }
}