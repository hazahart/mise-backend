const required = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
    'INTERNAL_SECRET',
    'FRONTEND_URL',
];

export function validateEnv(): void {
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        console.error('Faltan variables de entorno:');
        missing.forEach(key => console.error(`   - ${key}`));
        process.exit(1);
    }

    console.log('Variables de entorno OK');
}