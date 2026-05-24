export type EstadoSesion = 'pendiente' | 'confirmada' | 'cancelada' | 'completada';

export interface Sesion {
    id: string;
    usuarioId: string;
    usuarioNombre: string;
    chefId: string;
    chefNombre: string;
    fecha: string;
    hora: string;
    duracionMin: number;
    estado: EstadoSesion;
    notas?: string;
    creadoEn: string;
    actualizadoEn: string;
}