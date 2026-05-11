import {Request, Response, NextFunction} from 'express';
import {Client, Account} from 'node-appwrite';

export async function verifySession(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const session = req.headers['x-appwrite-session'] as string;

    if (!session) {
        res.status(401).json({
            code: 'unauthorized',
            message: 'Sesión de Appwrite requerida',
        });
        return;
    }

    try {
        const client = new Client()
            .setEndpoint(process.env.APPWRITE_ENDPOINT!)
            .setProject(process.env.APPWRITE_PROJECT_ID!)
            .setSession(session);

        const account = new Account(client);
        const user = await account.get();

        req.user = user;
        req.userRole = (user.prefs as { rol?: string }).rol ?? 'free';

        next();
    } catch {
        res.status(401).json({
            code: 'unauthorized',
            message: 'Sesión de Appwrite inválida o expirada',
        });
    }
}