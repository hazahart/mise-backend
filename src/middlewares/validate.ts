import {Request, Response, NextFunction} from 'express';
import {ZodSchema, ZodError} from 'zod';

export function validate(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    code: 'validation_error',
                    message: 'Datos de la petición inválidos',
                    details: error.issues.map((issue) => ({
                        field: issue.path.join('.'),
                        message: issue.message,
                    })),
                });
                return;
            }
            next(error);
        }
    };
}