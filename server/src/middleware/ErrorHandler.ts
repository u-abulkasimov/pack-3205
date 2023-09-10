import { Request, Response, NextFunction } from 'express';
import ApiException from '../exception/ApiException';

export default (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiException) {
        return res.status(err.status).json({
            success: false,
            message: err.message,
            errors: err.errors
            
        });
    }

    return res.status(500).json({
        success: false,
        error: 'Internal server error'
   });
};