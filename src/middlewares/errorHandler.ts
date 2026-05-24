import {Request, Response, NextFunction} from 'express';

export interface AppError extends Error {
    statusCode?: number;
    code?: string;
}

export function errorHandler(
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    console.error(`[Error] ${req.method} ${req.path}:`, err.message);

    const statusCode = err.statusCode ?? 500;
    const code = err.code ?? 'internal_error';

    res.status(statusCode).json({
        code,
        message: err.message ?? 'Ocurrió un error inesperado en el servidor',
    });
}