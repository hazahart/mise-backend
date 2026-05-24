import {Request, Response, NextFunction} from 'express';
import {auth} from '../lib/firebase';

export async function verifySession(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const authHeader = req.headers['authorization'] as string;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            code: 'unauthorized',
            message: 'Token de autenticación requerido',
        });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = await auth.verifyIdToken(token);
        req.user = decoded;
        req.userRole = (decoded.rol as string) ?? 'free';
        next();
    } catch {
        res.status(401).json({
            code: 'unauthorized',
            message: 'Token inválido o expirado',
        });
    }
}