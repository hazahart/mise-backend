import {Request, Response, NextFunction} from 'express';

export function verifyRole(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const role = req.userRole ?? 'free';

        if (!roles.includes(role)) {
            res.status(403).json({
                code: 'forbidden_role',
                message: `Acceso restringido a: ${roles.join(', ')}`,
            });
            return;
        }

        next();
    };
}