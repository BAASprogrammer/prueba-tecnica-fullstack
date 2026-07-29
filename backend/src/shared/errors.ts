// Error general de la aplicación
export class AppError extends Error {
    constructor(public message: string, public statusCode: number = 400) {
        super(message);
        this.name = 'AppError';
    }
}

// Error de no encontrado
export class NotFoundError extends AppError {
    constructor(message: string = 'Recurso no encontrado') {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

// Error de validación
export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 422);
        this.name = 'ValidationError';
    }
}