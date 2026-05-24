import {Request, Response, NextFunction} from 'express';

export function verifyInternalSecret(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const secret = req.headers['x-internal-secret'] as string;

    if (!secret || secret !== process.env.INTERNAL_SECRET) {
        res.status(401).json({
            code: 'unauthorized',
            message: 'Secret interno inválido',
        });
        return;
    }

    next();
}