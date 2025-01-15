const AppError = require('../utils/errors/AppError');
const ErrorCodes = require('../utils/errors/errorCodes');

const handleSupabaseError = (err) => {
    // Handle specific Supabase errors -> generated by AI
    switch (err.code) {
        case '23505': // unique_violation
            return new AppError(
                'This record already exists.',
                409,
                ErrorCodes.RESOURCE_EXISTS
            );
        case '23503': // foreign_key_violation
            return new AppError(
                'Related record not found.',
                404,
                ErrorCodes.RESOURCE_NOT_FOUND
            );
        case '42703': // undefined_column
            return new AppError(
                'Invalid field specified.',
                400,
                ErrorCodes.INVALID_INPUT
            );
        case 'PGRST116': // nonexistent_table
            return new AppError(
                'Requested resource does not exist.',
                404,
                ErrorCodes.RESOURCE_NOT_FOUND
            );
        default:
            return new AppError(
                'Database operation failed.',
                500,
                ErrorCodes.DATABASE_ERROR
            );
    }
};

const handleJWTError = () =>
    new AppError('Invalid token. Please log in again!', 401, ErrorCodes.TOKEN_INVALID);

const handleJWTExpiredError = () =>
    new AppError('Your token has expired! Please log in again.', 401, ErrorCodes.TOKEN_EXPIRED);

const handleValidationError = (err) => {
    const messages = Object.values(err.errors || {})
        .map(error => error.message)
        .join('. ');
    return new AppError(
        `Validation failed. ${messages}`,
        400,
        ErrorCodes.VALIDATION_ERROR
    );
};

const isOperationalError = (err) => {
    if (err instanceof AppError) return true;
    if (err.name === 'JsonWebTokenError') return true;
    if (err.name === 'TokenExpiredError') return true;
    if (err.code === '23505') return true;
    if (err.type === 'entity.parse.failed') return true;
    return false;
};

const normalizeError = (err) => {
    if (err instanceof AppError) {
        return err;
    }

    let error = { ...err };
    error.message = err.message;
    error.name = err.name;
    error.code = err.code;

    // Error spesifik
    if (err.code && typeof err.code === 'string' && err.code.match(/^[0-9]{5}$/)) {
        error = handleSupabaseError(error);
    } else if (error.name === 'JsonWebTokenError') {
        error = handleJWTError();
    } else if (error.name === 'TokenExpiredError') {
        error = handleJWTExpiredError();
    } else if (error.name === 'ValidationError') {
        error = handleValidationError(error);
    }

    return error;
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        success: false,
        error: {
            code: err.errorCode,
            status: err.status,
            message: err.message,
            isOperational: err.isOperational,
            // stack: err.stack,
            details: err
        }
    });
};

const sendErrorProd = (err, res) => {
    if (isOperationalError(err)) {
        // Operational error: kirim ke user
        res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.errorCode,
                message: err.message
            }
        });
    } else {
        // Programming atau unknown error: jangan ungkapkan pesan error secara gamblang
        console.error('ERROR 💥', {
            timestamp: new Date().toISOString(),
            error: err,
            // // stack: err.stack
        });
        
        res.status(500).json({
            success: false,
            error: {
                code: ErrorCodes.INTERNAL_SERVER_ERROR,
                message: 'Something went wrong! Please try again later.'
            }
        });
    }
};

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    const normalizedError = normalizeError(err);
    
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(normalizedError, res);
    } else {
        sendErrorProd(normalizedError, res);
    }

    if (err.statusCode === 500) {
        console.error('Internal Server Error:', {
            timestamp: new Date().toISOString(),
            path: req.path,
            method: req.method,
            error: err,
            // // stack: err.stack
        });
    }
};

module.exports = errorHandler;